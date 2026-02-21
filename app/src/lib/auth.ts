import { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import DiscordProvider from 'next-auth/providers/discord';
import GoogleProvider from 'next-auth/providers/google';
import EmailProvider from 'next-auth/providers/email';
import { db } from './db';
import { generateGuestUsername } from './utils';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db) as any,
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.id,
          name: profile.username,
          email: profile.email,
          image: profile.avatar
            ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
            : null,
          username: profile.username,
          authProvider: 'discord',
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          username: profile.email?.split('@')[0] || generateGuestUsername(),
          authProvider: 'google',
        };
      },
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.username = (user as any).username;
        session.user.role = (user as any).role;
        session.user.privacyMode = (user as any).privacyMode;

        // Update last seen
        await db.user.update({
          where: { id: user.id },
          data: { lastSeen: new Date() },
        });
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      // Generate username if not provided
      if (!(user as any).username) {
        (user as any).username = generateGuestUsername();
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.username = (user as any).username;
        token.role = (user as any).role;
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
  },
  session: {
    strategy: 'database',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  events: {
    async createUser({ user }) {
      // Create default spirit form for new users
      await db.spiritForm.create({
        data: {
          userId: user.id,
          glowColor: '#ff69b4',
          orbStyle: 'default',
          auraSize: 'medium',
          tailCount: 3,
        },
      });

      // Check for early soul achievement if within 24h of voting period start
      const votingPeriod = await db.votingPeriod.findFirst({
        where: { isActive: true },
        orderBy: { startsAt: 'desc' },
      });

      if (votingPeriod) {
        const hoursSinceStart =
          (new Date().getTime() - votingPeriod.startsAt.getTime()) / (1000 * 60 * 60);

        if (hoursSinceStart <= 24) {
          const earlySoulAchievement = await db.achievement.findUnique({
            where: { slug: 'early-soul' },
          });

          if (earlySoulAchievement) {
            await db.userAchievement.create({
              data: {
                userId: user.id,
                achievementId: earlySoulAchievement.id,
              },
            });
          }
        }
      }
    },
  },
};

// Extend NextAuth types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      username: string;
      role: 'user' | 'admin';
      privacyMode: 'public' | 'private' | 'anonymous';
    };
  }

  interface User {
    username?: string;
    role?: 'user' | 'admin';
    privacyMode?: 'public' | 'private' | 'anonymous';
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    username?: string;
    role?: 'user' | 'admin';
  }
}
