import { NextRequest } from 'next/server';
import { initIO } from '@/lib/socket';

// This route initializes the Socket.io server
export async function GET(req: NextRequest) {
  if ((req as any).socket?.server?.io) {
    console.log('Socket.io server already initialized');
    return new Response('Socket.io server already running', { status: 200 });
  }

  const io = initIO((req as any).socket.server);
  (req as any).socket.server.io = io;

  console.log('Socket.io server initialized');
  return new Response('Socket.io server initialized', { status: 200 });
}
