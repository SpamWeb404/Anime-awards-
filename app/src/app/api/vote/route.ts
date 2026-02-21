import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { checkAchievementCondition } from '@/lib/utils';

// GET /api/vote - Get user's votes
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const votes = await db.vote.findMany({
      where: { userId: session.user.id },
      include: {
        nominee: {
          select: {
            id: true,
            title: true,
            imageUrl: true,
            category: {
              select: {
                id: true,
                name: true,
                element: true,
              },
            },
          },
        },
      },
      orderBy: { boundAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: votes,
    });
  } catch (error) {
    console.error('Error fetching votes:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch votes' },
      { status: 500 }
    );
  }
}

// POST /api/vote - Create or update a vote
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Please sign in to vote' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { nomineeId, categoryId } = body;

    // Validate required fields
    if (!nomineeId || !categoryId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if nominee exists and belongs to the category
    const nominee = await db.nominee.findFirst({
      where: {
        id: nomineeId,
        categoryId,
      },
    });

    if (!nominee) {
      return NextResponse.json(
        { success: false, error: 'Nominee not found in this category' },
        { status: 404 }
      );
    }

    // Check if voting is still open
    const votingPeriod = await db.votingPeriod.findFirst({
      where: {
        isActive: true,
        endsAt: { gt: new Date() },
      },
    });

    if (!votingPeriod) {
      return NextResponse.json(
        { success: false, error: 'Voting has closed' },
        { status: 403 }
      );
    }

    // Check for existing vote in this category
    const existingVote = await db.vote.findUnique({
      where: {
        userId_categoryId: {
          userId: session.user.id,
          categoryId,
        },
      },
    });

    let vote;
    let isUpdate = false;

    if (existingVote) {
      // Update existing vote
      vote = await db.vote.update({
        where: { id: existingVote.id },
        data: {
          nomineeId,
          updatedAt: new Date(),
        },
        include: {
          nominee: {
            select: {
              title: true,
              hiddenGemScore: true,
            },
          },
        },
      });
      isUpdate = true;
    } else {
      // Create new vote
      vote = await db.vote.create({
        data: {
          userId: session.user.id,
          nomineeId,
          categoryId,
        },
        include: {
          nominee: {
            select: {
              title: true,
              hiddenGemScore: true,
            },
          },
        },
      });
    }

    // Check for achievements
    await checkAndAwardAchievements(session.user.id);

    return NextResponse.json({
      success: true,
      data: {
        vote,
        isUpdate,
        isHiddenGem: nominee.hiddenGemScore > 70,
      },
    });
  } catch (error) {
    console.error('Error creating vote:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create vote' },
      { status: 500 }
    );
  }
}

// DELETE /api/vote - Remove a vote (admin only or own vote)
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const voteId = searchParams.get('id');

    if (!voteId) {
      return NextResponse.json(
        { success: false, error: 'Vote ID required' },
        { status: 400 }
      );
    }

    const vote = await db.vote.findUnique({
      where: { id: voteId },
    });

    if (!vote) {
      return NextResponse.json(
        { success: false, error: 'Vote not found' },
        { status: 404 }
      );
    }

    // Only allow deletion if user owns the vote or is admin
    const isAdmin = (session.user as any).role === 'admin';
    if (vote.userId !== session.user.id && !isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await db.vote.delete({
      where: { id: voteId },
    });

    return NextResponse.json({
      success: true,
      message: 'Vote removed successfully',
    });
  } catch (error) {
    console.error('Error deleting vote:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete vote' },
      { status: 500 }
    );
  }
}

// Helper function to check and award achievements
async function checkAndAwardAchievements(userId: string) {
  try {
    // Get user's stats
    const userVotes = await db.vote.findMany({
      where: { userId },
      include: {
        nominee: {
          select: { hiddenGemScore: true },
        },
      },
    });

    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        achievements: {
          include: { achievement: true },
        },
      },
    });

    if (!user) return;

    const existingAchievementSlugs = user.achievements.map(
      (ua) => ua.achievement.slug
    );

    const categories = await db.category.findMany({ where: { isActive: true } });

    const userData = {
      voteCount: userVotes.length,
      categoryCount: new Set(userVotes.map((v) => v.categoryId)).size,
      totalCategories: categories.length,
      daysVisited: 1, // TODO: Track daily visits
      hiddenGemVotes: userVotes.filter((v) => v.nominee.hiddenGemScore > 70).length,
      joinDate: user.summonDate,
    };

    // Check each achievement condition
    const allAchievements = await db.achievement.findMany();

    for (const achievement of allAchievements) {
      if (existingAchievementSlugs.includes(achievement.slug)) continue;

      const earned = checkAchievementCondition(achievement.condition, userData);

      if (earned) {
        await db.userAchievement.create({
          data: {
            userId,
            achievementId: achievement.id,
          },
        });
      }
    }
  } catch (error) {
    console.error('Error checking achievements:', error);
  }
}
