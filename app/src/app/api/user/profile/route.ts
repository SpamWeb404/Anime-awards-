import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

// GET /api/user/profile - Get current user profile
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      include: {
        spiritForm: true,
        votes: {
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
        },
        achievements: {
          include: {
            achievement: true,
          },
          orderBy: { earnedAt: 'desc' },
        },
        _count: {
          select: {
            votes: true,
            achievements: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Calculate affinity stats
    const categoryVotes: Record<string, { count: number; name: string; element: string }> = {};
    user.votes.forEach((vote) => {
      const catId = vote.nominee.category.id;
      if (!categoryVotes[catId]) {
        categoryVotes[catId] = {
          count: 0,
          name: vote.nominee.category.name,
          element: vote.nominee.category.element,
        };
      }
      categoryVotes[catId].count++;
    });

    const affinityStats = Object.entries(categoryVotes)
      .map(([_, data]) => ({
        category: data.name,
        element: data.element,
        votes: data.count,
        percentage: Math.round((data.count / user.votes.length) * 100),
      }))
      .sort((a, b) => b.votes - a.votes);

    const profile = {
      id: user.id,
      username: user.username,
      email: user.email,
      authProvider: user.authProvider,
      summonDate: user.summonDate,
      lastSeen: user.lastSeen,
      role: user.role,
      privacyMode: user.privacyMode,
      preferences: user.preferences,
      spiritForm: user.spiritForm,
      stats: {
        totalVotes: user._count.votes,
        totalAchievements: user._count.achievements,
        categoriesVoted: Object.keys(categoryVotes).length,
        affinityStats,
      },
      votes: user.votes,
      achievements: user.achievements,
    };

    return NextResponse.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

// PATCH /api/user/profile - Update user profile
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { username, privacyMode, preferences } = body;

    const updateData: any = {};

    if (username !== undefined) {
      // Check if username is already taken
      const existing = await db.user.findFirst({
        where: {
          username,
          NOT: { id: session.user.id },
        },
      });

      if (existing) {
        return NextResponse.json(
          { success: false, error: 'Username already taken' },
          { status: 409 }
        );
      }

      updateData.username = username;
    }

    if (privacyMode !== undefined) {
      updateData.privacyMode = privacyMode;
    }

    if (preferences !== undefined) {
      updateData.preferences = preferences;
    }

    const user = await db.user.update({
      where: { id: session.user.id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
