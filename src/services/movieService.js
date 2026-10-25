const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL || "https://api.themoviedb.org/3";

async function request(endpoint, params = {}, signal) {
  if (!API_KEY) {
    throw new Error("TMDB API key is missing. Add VITE_TMDB_API_KEY to your .env file and restart the dev server.");
  }

  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set("api_key", API_KEY);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) url.searchParams.set(key, String(value));
  });

  const response = await fetch(url, { signal });
  if (!response.ok) {
    if (response.status === 401) throw new Error("TMDB rejected the API key. Check your key in the .env file.");
    if (response.status === 429) throw new Error("Too many requests to TMDB. Please wait a moment and try again.");
    throw new Error(`TMDB request failed (${response.status}). Please try again.`);
  }
  return response.json();
}

export async function getPopularMovies({ signal } = {}) {
  const data = await request("/movie/popular", {}, signal);
  return data.results || [];
}

export async function searchMovies(query, { signal } = {}) {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) return [];
  const data = await request("/search/movie", { query: trimmedQuery, include_adult: false }, signal);
  return data.results || [];
}

export async function getMovieDetails(movieId, { signal } = {}) {
  return request(`/movie/${encodeURIComponent(movieId)}`, {}, signal);
}
