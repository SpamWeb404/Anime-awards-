import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

// GET /api/announcements - Get active announcements
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    const { searchParams } = new URL(req.url);
    const includeExpired = searchParams.get('includeExpired') === 'true';

    const where: any = {};

    if (!includeExpired) {
      where.OR = [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } },
      ];
    }

    const announcements = await db.announcement.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    // Filter out dismissed announcements for logged-in users
    let filteredAnnouncements = announcements;
    if (userId) {
      filteredAnnouncements = announcements.filter(
        (a) => !a.dismissedBy.includes(userId)
      );
    }

    return NextResponse.json({
      success: true,
      data: filteredAnnouncements,
    });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch announcements' },
      { status: 500 }
    );
  }
}

// POST /api/announcements - Create a new announcement (admin only)
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
    const { message, type, expiresAt, isGlobal } = body;

    // Validate required fields
    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      );
    }

    const announcement = await db.announcement.create({
      data: {
        message,
        type: type || 'info',
        createdBy: session.user.id,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        isGlobal: isGlobal !== false,
        dismissedBy: [],
      },
    });

    // TODO: Broadcast via Socket.io to all connected clients

    return NextResponse.json(
      { success: true, data: announcement },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating announcement:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create announcement' },
      { status: 500 }
    );
  }
}

// PATCH /api/announcements - Dismiss an announcement
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
    const { announcementId } = body;

    if (!announcementId) {
      return NextResponse.json(
        { success: false, error: 'Announcement ID is required' },
        { status: 400 }
      );
    }

    const announcement = await db.announcement.findUnique({
      where: { id: announcementId },
    });

    if (!announcement) {
      return NextResponse.json(
        { success: false, error: 'Announcement not found' },
        { status: 404 }
      );
    }

    // Add user to dismissed list
    const dismissedBy = [...announcement.dismissedBy, session.user.id];

    await db.announcement.update({
      where: { id: announcementId },
      data: { dismissedBy },
    });

    return NextResponse.json({
      success: true,
      message: 'Announcement dismissed',
    });
  } catch (error) {
    console.error('Error dismissing announcement:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to dismiss announcement' },
      { status: 500 }
    );
  }
}

// DELETE /api/announcements - Delete an announcement (admin only)
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is admin
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Announcement ID is required' },
        { status: 400 }
      );
    }

    await db.announcement.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Announcement deleted',
    });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete announcement' },
      { status: 500 }
    );
  }
}
