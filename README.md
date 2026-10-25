# MovieShelf

A React + Vite movie library using The Movie Database (TMDB) API.

## Setup

1. Install Node.js (LTS) if it is not already installed.
2. Install project dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the project root (next to `package.json`) using `.env.example` as a template:

   ```ini
   VITE_TMDB_API_KEY=your_api_key_here
   VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
   ```

   Get a TMDB API key from https://www.themoviedb.org/settings/api. Use your API Key (v3 auth), not the API Read Access Token. Never commit your real `.env` file.

4. Start the development server:

   ```bash
   npm run dev
   ```

## Features

- Fetches popular movies from TMDB.
- Searches movies with a short debounce to reduce unnecessary requests.
- Displays TMDB posters, release years, ratings, and overviews.
- Adds and removes favorites, stored in browser `localStorage`.
- Displays saved movies on `/favorites`.
- Includes loading, error, empty, and retry states.
- Responsive layout for desktop and mobile.

## Useful commands

```bash
npm run dev
npm run build
npm run lint
```

Movie data and images are provided by TMDB. This product is not endorsed or certified by TMDB.
