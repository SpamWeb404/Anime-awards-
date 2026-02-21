# Isekai Awards - Deployment Guide

## Overview

This guide covers deploying the Isekai Awards application to production.

## Prerequisites

- Node.js 18+
- PostgreSQL database
- Vercel account (recommended)
- Cloudinary account (for images)
- Discord/Google OAuth apps (for authentication)

## Deployment Options

### Option 1: Vercel (Recommended)

#### 1. Database Setup (Neon)

1. Create account at [neon.tech](https://neon.tech)
2. Create new PostgreSQL project
3. Copy the connection string

#### 2. Project Setup

1. Push code to GitHub
2. Import project in [Vercel Dashboard](https://vercel.com)
3. Configure environment variables (see below)
4. Deploy!

#### 3. Environment Variables

Add these in Vercel project settings:

```
DATABASE_URL=postgresql://user:pass@ep-xxx.us-east-1.aws.neon.tech/isekai_awards
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-production-secret
DISCORD_CLIENT_ID=xxx
DISCORD_CLIENT_SECRET=xxx
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
```

#### 4. Database Migration

Run migration from local machine:

```bash
npx prisma migrate deploy
```

Or use Vercel CLI:

```bash
vercel --prod
```

### Option 2: Docker Deployment

#### 1. Build Image

```bash
docker build -t isekai-awards .
```

#### 2. Run Container

```bash
docker run -p 3000:3000 \
  -e DATABASE_URL=postgresql://... \
  -e NEXTAUTH_SECRET=... \
  isekai-awards
```

#### 3. Docker Compose (Full Stack)

```bash
docker-compose up -d
```

This starts:
- PostgreSQL database
- Redis cache
- Next.js application

### Option 3: Railway

1. Create account at [railway.app](https://railway.app)
2. New project → Deploy from GitHub repo
3. Add PostgreSQL plugin
4. Configure environment variables
5. Deploy

## Environment Variables Reference

### Required

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host/db` |
| `NEXTAUTH_SECRET` | Random secret for JWT | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Your app URL | `https://example.com` |

### OAuth (Optional but recommended)

| Variable | Description |
|----------|-------------|
| `DISCORD_CLIENT_ID` | From Discord Developer Portal |
| `DISCORD_CLIENT_SECRET` | From Discord Developer Portal |
| `GOOGLE_CLIENT_ID` | From Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | From Google Cloud Console |

### Email (Optional)

| Variable | Description |
|----------|-------------|
| `EMAIL_SERVER_HOST` | SMTP host |
| `EMAIL_SERVER_PORT` | SMTP port |
| `EMAIL_SERVER_USER` | SMTP username |
| `EMAIL_SERVER_PASSWORD` | SMTP password |
| `EMAIL_FROM` | From address |

### Cloudinary (Required for images)

| Variable | Description |
|----------|-------------|
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | API key |
| `CLOUDINARY_API_SECRET` | API secret |

## Post-Deployment

### 1. Seed Database

```bash
npx prisma db seed
```

### 2. Create Admin User

1. Sign up normally
2. Update user role in database:

```sql
UPDATE "User" SET role = 'admin' WHERE email = 'your@email.com';
```

### 3. Configure OAuth Callbacks

**Discord:**
- Add redirect: `https://your-domain.com/api/auth/callback/discord`

**Google:**
- Add redirect: `https://your-domain.com/api/auth/callback/google`

### 4. Test

- Visit your deployed URL
- Test authentication
- Test voting flow
- Verify Chibi-sama appears

## Troubleshooting

### Build Errors

```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

### Database Connection

```bash
# Test connection
npx prisma db pull
```

### OAuth Issues

1. Verify callback URLs match exactly
2. Check client ID/secret
3. Ensure OAuth apps are published (not in testing mode)

## Performance Optimization

### Enable Caching

Add to `next.config.js`:

```javascript
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600',
          },
        ],
      },
    ];
  },
};
```

### Image Optimization

- Use Cloudinary for image transformations
- Enable Next.js Image Optimization
- Set appropriate image sizes

## Monitoring

### Vercel Analytics

Enable in project settings for:
- Web Vitals
- Real Experience Score
- Traffic insights

### Error Tracking

Add Sentry integration:

```bash
npx @sentry/wizard@latest -i nextjs
```

## Backup Strategy

### Database

Neon provides automatic backups. For manual backup:

```bash
pg_dump $DATABASE_URL > backup.sql
```

### Restore

```bash
psql $DATABASE_URL < backup.sql
```

## Scaling

### Vercel Pro

- Enable for production workloads
- Increases function duration limits
- Better performance

### Database

- Neon automatically scales
- Monitor connection limits
- Consider read replicas for high traffic

## Security Checklist

- [ ] Use strong NEXTAUTH_SECRET
- [ ] Enable HTTPS only
- [ ] Set secure cookies
- [ ] Configure CORS properly
- [ ] Rate limit API endpoints
- [ ] Validate all inputs
- [ ] Use parameterized queries (Prisma handles this)
- [ ] Keep dependencies updated

## Support

For issues:
1. Check logs in Vercel Dashboard
2. Review application logs
3. Test locally with production env
4. Open GitHub issue

---

**Happy deploying! May your realm be stable.** 🌟
