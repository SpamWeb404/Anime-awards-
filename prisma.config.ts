import { defineConfig } from '@prisma/config'

export default defineConfig({
  datasource: {
      url: process.env.DATABASE_URL,  // Uses your DATABASE_URL from .env.local
        },
        })