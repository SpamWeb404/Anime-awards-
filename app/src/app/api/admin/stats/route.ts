import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

// GET /api/admin/stats - Get admin statistics
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is admin
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get total users
    const totalUsers = await db.user.count();

    // Get total votes
    const totalVotes = await db.vote.count();

    // Get votes by category
    const votesByCategory = await db.vote.groupBy({
      by: ['categoryId'],
      _count: { id: true },
    });

    const categoryNames = await db.category.findMany({
      select: { id: true, name: true },
    });

    const votesByCategoryFormatted = votesByCategory.map((vc) => ({
      categoryId: vc.categoryId,
      categoryName: categoryNames.find((c) => c.id === vc.categoryId)?.name || 'Unknown',
      count: vc._count.id,
    }));

    // Get top nominees
    const topNominees = await db.nominee.findMany({
      include: {
        _count: { select: { votes: true } },
        category: { select: { name: true } },
      },
      orderBy: {
        votes: { _count: 'desc' },
      },
      take: 10,
    });

    const topNomineesFormatted = topNominees.map((n) => ({
      nominee: {
        id: n.id,
        title: n.title,
        studio: n.studio,
        imageUrl: n.imageUrl,
        category: n.category,
      },
      voteCount: n._count.votes,
    }));

    // Get hidden gems (high hiddenGemScore)
    const hiddenGems = await db.nominee.findMany({
      where: { hiddenGemScore: { gt: 70 } },
      include: {
        _count: { select: { votes: true } },
        category: { select: { name: true } },
      },
      orderBy: { hiddenGemScore: 'desc' },
      take: 10,
    });

    const hiddenGemsFormatted = hiddenGems.map((n) => ({
      nominee: {
        id: n.id,
        title: n.title,
        studio: n.studio,
        imageUrl: n.imageUrl,
        category: n.category,
      },
      hiddenGemScore: n.hiddenGemScore,
      voteCount: n._count.votes,
    }));

    // Get user growth (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const userGrowth = await db.user.groupBy({
      by: ['summonDate'],
      where: {
        summonDate: { gte: thirtyDaysAgo },
      },
      _count: { id: true },
    });

    // Get vote timeline (last 30 days)
    const voteTimeline = await db.vote.groupBy({
      by: ['boundAt'],
      where: {
        boundAt: { gte: thirtyDaysAgo },
      },
      _count: { id: true },
    });

    // Format timeline data by day
    const userGrowthByDay = formatTimelineData(userGrowth, 'summonDate', '_count');
    const voteTimelineByDay = formatTimelineData(voteTimeline, 'boundAt', '_count');

    const stats = {
      totalUsers,
      totalVotes,
      votesByCategory: votesByCategoryFormatted,
      topNominees: topNomineesFormatted,
      hiddenGems: hiddenGemsFormatted,
      userGrowth: userGrowthByDay,
      voteTimeline: voteTimelineByDay,
    };

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}

// Helper function to format timeline data
function formatTimelineData(
  data: any[],
  dateField: string,
  countField: string
): Array<{ date: string; count: number }> {
  const grouped: Record<string, number> = {};

  data.forEach((item) => {
    const date = new Date(item[dateField]);
    const dateKey = date.toISOString().split('T')[0];
    grouped[dateKey] = (grouped[dateKey] || 0) + item[countField].id;
  });

  // Fill in missing days with 0
  const result: Array<{ date: string; count: number }> = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateKey = date.toISOString().split('T')[0];
    result.push({
      date: dateKey,
      count: grouped[dateKey] || 0,
    });
  }

  return result;
}
