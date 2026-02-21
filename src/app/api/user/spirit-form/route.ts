import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

// GET /api/user/spirit-form - Get user's spirit form
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const spiritForm = await db.spiritForm.findUnique({
      where: { userId: session.user.id },
    });

    if (!spiritForm) {
      // Create default spirit form if not exists
      const newSpiritForm = await db.spiritForm.create({
        data: {
          userId: session.user.id,
          glowColor: '#ff69b4',
          orbStyle: 'default',
          auraSize: 'medium',
          tailCount: 3,
        },
      });

      return NextResponse.json({
        success: true,
        data: newSpiritForm,
      });
    }

    return NextResponse.json({
      success: true,
      data: spiritForm,
    });
  } catch (error) {
    console.error('Error fetching spirit form:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch spirit form' },
      { status: 500 }
    );
  }
}

// PATCH /api/user/spirit-form - Update spirit form
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
    const { glowColor, orbStyle, auraSize, tailCount } = body;

    const updateData: any = {};

    if (glowColor !== undefined) {
      // Validate hex color
      const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
      if (!hexRegex.test(glowColor)) {
        return NextResponse.json(
          { success: false, error: 'Invalid color format' },
          { status: 400 }
        );
      }
      updateData.glowColor = glowColor;
    }

    if (orbStyle !== undefined) {
      const validStyles = ['default', 'crystal', 'flame', 'star', 'moon'];
      if (!validStyles.includes(orbStyle)) {
        return NextResponse.json(
          { success: false, error: 'Invalid orb style' },
          { status: 400 }
        );
      }
      updateData.orbStyle = orbStyle;
    }

    if (auraSize !== undefined) {
      const validSizes = ['small', 'medium', 'large'];
      if (!validSizes.includes(auraSize)) {
        return NextResponse.json(
          { success: false, error: 'Invalid aura size' },
          { status: 400 }
        );
      }
      updateData.auraSize = auraSize;
    }

    if (tailCount !== undefined) {
      const count = parseInt(tailCount);
      if (isNaN(count) || count < 1 || count > 9) {
        return NextResponse.json(
          { success: false, error: 'Tail count must be between 1 and 9' },
          { status: 400 }
        );
      }
      updateData.tailCount = count;
    }

    const spiritForm = await db.spiritForm.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        glowColor: glowColor || '#ff69b4',
        orbStyle: orbStyle || 'default',
        auraSize: auraSize || 'medium',
        tailCount: tailCount || 3,
      },
      update: updateData,
    });

    return NextResponse.json({
      success: true,
      data: spiritForm,
    });
  } catch (error) {
    console.error('Error updating spirit form:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update spirit form' },
      { status: 500 }
    );
  }
}
