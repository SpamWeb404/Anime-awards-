import { Server as NetServer } from 'http';
import { NextApiRequest } from 'next';
import { Server as ServerIO } from 'socket.io';
import { ServerToClientEvents, ClientToServerEvents } from '@/types';

export type NextApiResponseServerIO = NextApiRequest & {
  socket: {
    server: NetServer & {
      io?: ServerIO<ClientToServerEvents, ServerToClientEvents>;
    };
  };
};

export const config = {
  api: {
    bodyParser: false,
  },
};

let io: ServerIO<ClientToServerEvents, ServerToClientEvents> | null = null;

export function getIO(): ServerIO<ClientToServerEvents, ServerToClientEvents> | null {
  return io;
}

export function initIO(server: NetServer): ServerIO<ClientToServerEvents, ServerToClientEvents> {
  if (!io) {
    io = new ServerIO<ClientToServerEvents, ServerToClientEvents>(server, {
      path: '/api/socket',
      addTrailingSlash: false,
      cors: {
        origin: process.env.NEXTAUTH_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    // Track connected users
    let connectedUsers = 0;

    io.on('connection', (socket) => {
      connectedUsers++;
      console.log('Client connected:', socket.id);

      // Notify all clients of new user count
      io?.emit('user:joined', { userCount: connectedUsers });

      // Handle category subscription
      socket.on('vote:subscribe', (categoryId: string) => {
        socket.join(`category:${categoryId}`);
        console.log(`Socket ${socket.id} subscribed to category ${categoryId}`);
      });

      // Handle category unsubscription
      socket.on('vote:unsubscribe', (categoryId: string) => {
        socket.leave(`category:${categoryId}`);
        console.log(`Socket ${socket.id} unsubscribed from category ${categoryId}`);
      });

      // Handle announcement dismissal
      socket.on('announcement:dismiss', (announcementId: string) => {
        // This would update the database
        console.log(`Announcement ${announcementId} dismissed by ${socket.id}`);
      });

      // Handle disconnect
      socket.on('disconnect', () => {
        connectedUsers--;
        console.log('Client disconnected:', socket.id);
        io?.emit('user:left', { userCount: connectedUsers });
      });
    });
  }

  return io;
}

// Helper function to broadcast vote updates
export function broadcastVoteUpdate(
  nomineeId: string,
  voteCount: number,
  categoryId: string
) {
  if (io) {
    io.to(`category:${categoryId}`).emit('vote:update', {
      nomineeId,
      voteCount,
      categoryId,
    });
  }
}

// Helper function to broadcast announcements
export function broadcastAnnouncement(message: string, emotion?: string) {
  if (io) {
    io.emit('chibi:announce', { message, emotion });
  }
}
