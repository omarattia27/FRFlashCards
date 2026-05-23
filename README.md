# Expo Starter

Minimal Expo Router app with Supabase authentication and user-scoped word pairs.

## Scripts

- `npm start`
- `npm run ios`
- `npm run android`
- `npm run web`
- `npm run lint`

## Supabase Setup

1. Copy `.env.example` to `.env`.
2. Fill in `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` from your Supabase project.
3. Make sure your `word_pairs` table is exposed and RLS policies are enabled.

## Start

```bash
npm install
npm start
```
