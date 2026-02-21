import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

// GET /api/nominees - Get nominees (optionally filtered by category)
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId');

    const where: any = {};
    if (categoryId) {
      where.categoryId = categoryId;
    }

    const nominees = await db.nominee.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            element: true,
          },
        },
        _count: {
          select: { votes: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Get user's votes if logged in
    let userVotes: string[] = [];
    if (session?.user?.id) {
      const votes = await db.vote.findMany({
        where: { userId: session.user.id },
        select: { nomineeId: true },
      });
      userVotes = votes.map((v) => v.nomineeId);
    }

    const formattedNominees = nominees.map((nominee) => ({
      id: nominee.id,
      categoryId: nominee.categoryId,
      category: nominee.category,
      title: nominee.title,
      studio: nominee.studio,
      imageUrl: nominee.imageUrl,
      mangaArtUrl: nominee.mangaArtUrl,
      description: nominee.description,
      hiddenGemScore: nominee.hiddenGemScore,
      voteCount: nominee._count.votes,
      userVoted: userVotes.includes(nominee.id),
    }));

    return NextResponse.json({
      success: true,
      data: formattedNominees,
    });
  } catch (error) {
    console.error('Error fetching nominees:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch nominees' },
      { status: 500 }
    );
  }
}

// POST /api/nominees - Create a new nominee (admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is admin
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      categoryId,
      title,
      studio,
      imageUrl,
      mangaArtUrl,
      description,
      hiddenGemScore,
    } = body;

    // Validate required fields
    if (!categoryId || !title || !imageUrl) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if category exists
    const category = await db.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    const nominee = await db.nominee.create({
      data: {
        categoryId,
        title,
        studio,
        imageUrl,
        mangaArtUrl,
        description,
        hiddenGemScore: hiddenGemScore || 0,
      },
    });

    return NextResponse.json(
      { success: true, data: nominee },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating nominee:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create nominee' },
      { status: 500 }
    );
  }
}
