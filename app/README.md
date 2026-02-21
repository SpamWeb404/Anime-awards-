# Isekai Awards - The Ledger of Souls

An immersive, full-stack web application for anime awards where users journey through a mystical realm, guided by Chibi-sama (a spirit companion), to discover and vote for their favorite anime nominees.

![Isekai Awards](https://img.shields.io/badge/Isekai-Awards-8b5cf6)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Prisma](https://img.shields.io/badge/Prisma-5.0-2d3748)

## Features

### Core Experience

- **Immersive Entry Sequence**: Ancient book opening animation that transports users to the realm
- **Chibi-sama Spirit Companion**: Interactive guide with 100+ dialogues, typing effects, and emotional responses
- **3D Floating Realms**: Three.js-powered floating islands representing award categories
- **Soul Binding System**: Unique voting mechanic with ethereal animations
- **Real-time Updates**: Live vote counts and announcements via Socket.io

### User Features

- **Multiple Auth Options**: Discord, Google, and Email magic links via NextAuth.js
- **Guest Mode**: Browse and vote without account (session-only)
- **Soul Ledger**: Personal profile with voting history and achievements
- **Spirit Form Customization**: Personalize your avatar's glow, aura, and tails
- **Hidden Gem Detection**: Algorithm identifies underappreciated nominees
- **Achievement System**: Unlock badges for voting milestones

### Admin Features

- **Keeper's Realm**: Secure admin dashboard
- **Nominee Management**: Add, edit, and remove nominees
- **Category Management**: Create and organize award categories
- **Real-time Analytics**: Voting statistics and trends
- **Announcements**: Broadcast messages to all users via Chibi-sama

## Tech Stack

### Frontend

- **Next.js 14** (App Router) with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Three.js + React Three Fiber** for 3D elements
- **React Query** for data fetching

### Backend

- **Next.js API Routes**
- **PostgreSQL** database
- **Prisma ORM** for database management
- **NextAuth.js** for authentication
- **Socket.io** for real-time features

### External Services

- **Cloudinary** for image storage
- **Discord OAuth** for authentication
- **Google OAuth** for authentication
- **Nodemailer** for email magic links

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL database (local or cloud)
- Discord Developer account (for OAuth)
- Google Cloud account (for OAuth)
- Cloudinary account (for images)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/isekai-awards.git
cd isekai-awards
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/isekai_awards"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key"

# OAuth Providers
DISCORD_CLIENT_ID="your-discord-client-id"
DISCORD_CLIENT_SECRET="your-discord-client-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Email
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@isekaiawards.com"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

4. **Set up the database**

```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# (Optional) Seed the database
npm run db:seed
```

5. **Start the development server**

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Database Schema

### Core Models

- **User**: Accounts with auth provider info, preferences, and relationships
- **Category**: Award categories with elemental themes
- **Nominee**: Anime titles with images and hidden gem scores
- **Vote**: User votes (one per category)
- **Achievement**: Unlockable badges
- **UserAchievement**: User-achievement relationships
- **Announcement**: Admin broadcast messages
- **SpiritForm**: User avatar customization

### Relationships

```
User 1--* Vote *--1 Nominee *--1 Category
User 1--* UserAchievement *--1 Achievement
User 1--1 SpiritForm
```

## API Routes

### Public Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/categories` | List all active categories |
| GET | `/api/nominees` | Get nominees (filter by category) |
| GET | `/api/announcements` | Get active announcements |

### Protected Routes

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/vote` | Create or update vote |
| GET | `/api/user/profile` | Get user profile |
| PATCH | `/api/user/profile` | Update profile |
| GET | `/api/user/spirit-form` | Get spirit form |
| PATCH | `/api/user/spirit-form` | Update spirit form |

### Admin Routes

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/categories` | Create category |
| POST | `/api/nominees` | Create nominee |
| PUT | `/api/nominees/:id` | Update nominee |
| DELETE | `/api/nominees/:id` | Delete nominee |
| GET | `/api/admin/stats` | Get admin statistics |
| POST | `/api/announcements` | Create announcement |

## Chibi-sama Dialogue System

All dialogues are stored in `src/config/chibisama-dialogues.ts` for easy editing.

### Categories

- `entry`: First meeting dialogues
- `auth`: Authentication responses
- `categories`: Category entry dialogues
- `nominees`: Nominee hover/click responses
- `voting`: Voting confirmation dialogues
- `achievements`: Achievement unlock messages
- `time`: Time-based messages
- `realtime`: Live event responses
- `errors`: Error messages
- `easterEggs`: Hidden interactions

### Usage

```typescript
import { getRandomDialogue } from '@/config/chibisama-dialogues';

// Get a random dialogue
const dialogue = getRandomDialogue('categories', 'enter', {
  categoryName: 'Best Action',
});

// Trigger from component
window.dispatchEvent(
  new CustomEvent('chibisama:speak', {
    detail: {
      category: 'categories',
      subcategory: 'action',
      replacements: { categoryName: 'Best Action' },
    },
  })
);
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Database (Neon.tech)

1. Create a PostgreSQL database on Neon
2. Copy the connection string
3. Add to environment variables

### Environment Variables for Production

```env
# Database (Neon)
DATABASE_URL="postgresql://user:pass@ep-xxx.us-east-1.aws.neon.tech/isekai_awards"

# NextAuth
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="production-secret-key"

# OAuth (update callbacks)
DISCORD_CLIENT_ID="..."
DISCORD_CLIENT_SECRET="..."
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# Cloudinary
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
```

## Customization

### Adding New Categories

1. Add category to database via admin panel or API
2. Set element type for visual theme
3. Add nominees to the category

### Customizing Chibi-sama

Edit `src/config/chibisama-dialogues.ts` to:
- Add new dialogues
- Modify existing responses
- Create new dialogue categories
- Adjust typing speeds and emotions

### Element Themes

Available elements: `fire`, `water`, `shadow`, `light`, `nature`, `thunder`, `ice`, `wind`, `earth`, `cosmos`

Each element has associated colors in `src/types/index.ts`:

```typescript
export const elementColors = {
  fire: { primary: '#ef4444', secondary: '#f97316', glow: 'rgba(239, 68, 68, 0.5)' },
  // ...
};
```

## Scripts

```bash
# Development
npm run dev          # Start dev server

# Database
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run migrations
npm run db:studio    # Open Prisma Studio

# Build
npm run build        # Build for production
npm run start        # Start production server
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this project for your own awards!

## Credits

- **Design & Development**: Your Name
- **Chibi-sama Concept**: Inspired by isekai anime tropes
- **3D Elements**: Three.js and React Three Fiber
- **UI Components**: shadcn/ui

---

*"The realm awaits your judgment. Bind your soul wisely."* - Chibi-sama
