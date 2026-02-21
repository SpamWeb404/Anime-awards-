# Isekai Awards API Documentation

## Base URL

```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

## Authentication

Most endpoints require authentication via NextAuth.js session cookie.

### Auth Providers

- Discord OAuth
- Google OAuth
- Email Magic Link

### Session Response

```json
{
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "image": "string",
    "username": "string",
    "role": "user" | "admin",
    "privacyMode": "public" | "private" | "anonymous"
  }
}
```

---

## Categories

### List Categories

```http
GET /api/categories
```

**Response**

```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "name": "string",
      "slug": "string",
      "element": "fire" | "water" | "shadow" | "light" | "nature" | "thunder" | "ice" | "wind" | "earth" | "cosmos",
      "description": "string",
      "order": 0,
      "isActive": true,
      "nomineeCount": 0,
      "userVoted": false,
      "userVoteNomineeId": "string" | null
    }
  ]
}
```

### Create Category (Admin)

```http
POST /api/categories
```

**Request Body**

```json
{
  "name": "Best Action",
  "slug": "best-action",
  "element": "fire",
  "description": "Heart-pounding battles",
  "order": 1
}
```

---

## Nominees

### List Nominees

```http
GET /api/nominees?categoryId={categoryId}
```

**Query Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| categoryId | string | (Optional) Filter by category |

**Response**

```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "categoryId": "string",
      "category": {
        "id": "string",
        "name": "string",
        "slug": "string",
        "element": "string"
      },
      "title": "string",
      "studio": "string",
      "imageUrl": "string",
      "mangaArtUrl": "string",
      "description": "string",
      "hiddenGemScore": 0,
      "voteCount": 0,
      "userVoted": false
    }
  ]
}
```

### Create Nominee (Admin)

```http
POST /api/nominees
```

**Request Body**

```json
{
  "categoryId": "string",
  "title": "Attack on Titan",
  "studio": "MAPPA",
  "imageUrl": "https://...",
  "mangaArtUrl": "https://...",
  "description": "Epic conclusion...",
  "hiddenGemScore": 0
}
```

---

## Voting

### Get User Votes

```http
GET /api/vote
```

**Response**

```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "userId": "string",
      "nomineeId": "string",
      "categoryId": "string",
      "boundAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z",
      "nominee": {
        "id": "string",
        "title": "string",
        "imageUrl": "string",
        "category": {
          "id": "string",
          "name": "string",
          "element": "string"
        }
      }
    }
  ]
}
```

### Cast/Update Vote

```http
POST /api/vote
```

**Request Body**

```json
{
  "nomineeId": "string",
  "categoryId": "string"
}
```

**Response**

```json
{
  "success": true,
  "data": {
    "vote": {
      "id": "string",
      "userId": "string",
      "nomineeId": "string",
      "categoryId": "string",
      "boundAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z",
      "nominee": {
        "title": "string",
        "hiddenGemScore": 0
      }
    },
    "isUpdate": false,
    "isHiddenGem": false
  }
}
```

### Delete Vote

```http
DELETE /api/vote?id={voteId}
```

---

## User Profile

### Get Profile

```http
GET /api/user/profile
```

**Response**

```json
{
  "success": true,
  "data": {
    "id": "string",
    "username": "string",
    "email": "string",
    "authProvider": "discord" | "google" | "email",
    "summonDate": "2024-01-01T00:00:00Z",
    "lastSeen": "2024-01-01T00:00:00Z",
    "role": "user" | "admin",
    "privacyMode": "public" | "private" | "anonymous",
    "preferences": {},
    "spiritForm": {
      "glowColor": "#ff69b4",
      "orbStyle": "default",
      "auraSize": "medium",
      "tailCount": 3
    },
    "stats": {
      "totalVotes": 0,
      "totalAchievements": 0,
      "categoriesVoted": 0,
      "affinityStats": [
        {
          "category": "string",
          "element": "string",
          "votes": 0,
          "percentage": 0
        }
      ]
    },
    "votes": [],
    "achievements": []
  }
}
```

### Update Profile

```http
PATCH /api/user/profile
```

**Request Body**

```json
{
  "username": "new-username",
  "privacyMode": "public",
  "preferences": {
    "theme": "dark",
    "notifications": true
  }
}
```

---

## Spirit Form

### Get Spirit Form

```http
GET /api/user/spirit-form
```

### Update Spirit Form

```http
PATCH /api/user/spirit-form
```

**Request Body**

```json
{
  "glowColor": "#ff69b4",
  "orbStyle": "default" | "crystal" | "flame" | "star" | "moon",
  "auraSize": "small" | "medium" | "large",
  "tailCount": 3
}
```

---

## Announcements

### List Announcements

```http
GET /api/announcements
```

**Query Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| includeExpired | boolean | Include expired announcements |

**Response**

```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "message": "string",
      "type": "info" | "warning" | "celebration" | "urgent",
      "createdAt": "2024-01-01T00:00:00Z",
      "expiresAt": "2024-01-01T00:00:00Z",
      "isGlobal": true,
      "dismissedBy": []
    }
  ]
}
```

### Create Announcement (Admin)

```http
POST /api/announcements
```

**Request Body**

```json
{
  "message": "The veil thins! 24 hours remain!",
  "type": "urgent",
  "expiresAt": "2024-01-02T00:00:00Z",
  "isGlobal": true
}
```

### Dismiss Announcement

```http
PATCH /api/announcements
```

**Request Body**

```json
{
  "announcementId": "string"
}
```

---

## Admin Statistics

### Get Admin Stats

```http
GET /api/admin/stats
```

**Response**

```json
{
  "success": true,
  "data": {
    "totalUsers": 0,
    "totalVotes": 0,
    "votesByCategory": [
      {
        "categoryId": "string",
        "categoryName": "string",
        "count": 0
      }
    ],
    "topNominees": [
      {
        "nominee": {
          "id": "string",
          "title": "string",
          "studio": "string",
          "imageUrl": "string",
          "category": {
            "name": "string"
          }
        },
        "voteCount": 0
      }
    ],
    "hiddenGems": [
      {
        "nominee": {},
        "hiddenGemScore": 0,
        "voteCount": 0
      }
    ],
    "userGrowth": [
      {
        "date": "2024-01-01",
        "count": 0
      }
    ],
    "voteTimeline": [
      {
        "date": "2024-01-01",
        "count": 0
      }
    ]
  }
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": "Error message"
}
```

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 500 | Internal Server Error |

---

## WebSocket Events (Socket.io)

### Client to Server

```javascript
// Subscribe to category updates
socket.emit('vote:subscribe', categoryId);

// Unsubscribe from category
socket.emit('vote:unsubscribe', categoryId);

// Dismiss announcement
socket.emit('announcement:dismiss', announcementId);
```

### Server to Client

```javascript
// Vote update
socket.on('vote:update', ({ nomineeId, voteCount, categoryId }) => {
  // Update UI
});

// New announcement
socket.on('announcement:new', (announcement) => {
  // Show notification
});

// User count update
socket.on('user:joined', ({ userCount }) => {
  // Update online count
});

// Chibi-sama announcement
socket.on('chibi:announce', ({ message, emotion }) => {
  // Show Chibi-sama dialogue
});
```

---

## Rate Limits

- **Public endpoints**: 100 requests per minute
- **Authenticated endpoints**: 1000 requests per minute
- **Vote endpoint**: 10 requests per minute (per user)

---

## Chibi-sama Integration

Trigger Chibi-sama dialogues from the client:

```javascript
// Trigger a dialogue
window.dispatchEvent(
  new CustomEvent('chibisama:speak', {
    detail: {
      category: 'categories',
      subcategory: 'fire',
      replacements: { categoryName: 'Best Action' }
    }
  })
);
```

Available categories: `entry`, `auth`, `categories`, `nominees`, `voting`, `achievements`, `time`, `realtime`, `errors`, `easterEggs`
