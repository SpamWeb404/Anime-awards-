import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

// GET /api/categories - List all active categories with nominee counts
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    const categories = await db.category.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { nominees: true },
        },
      },
    });

    // If user is logged in, get their votes for each category
    let userVotes: Record<string, string> = {};
    if (session?.user?.id) {
      const votes = await db.vote.findMany({
        where: { userId: session.user.id },
        select: { categoryId: true, nomineeId: true },
      });
      userVotes = votes.reduce((acc, vote) => {
        acc[vote.categoryId] = vote.nomineeId;
        return acc;
      }, {} as Record<string, string>);
    }

    const formattedCategories = categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      element: category.element,
      description: category.description,
      order: category.order,
      isActive: category.isActive,
      nomineeCount: category._count.nominees,
      userVoted: !!userVotes[category.id],
      userVoteNomineeId: userVotes[category.id] || null,
    }));

    return NextResponse.json({
      success: true,
      data: formattedCategories,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST /api/categories - Create a new category (admin only)
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
    const { name, slug, element, description, order } = body;

    // Validate required fields
    if (!name || !slug || !element) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existing = await db.category.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Category with this slug already exists' },
        { status: 409 }
      );
    }

    const category = await db.category.create({
      data: {
        name,
        slug,
        element,
        description,
        order: order || 0,
      },
    });

    return NextResponse.json(
      { success: true, data: category },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
