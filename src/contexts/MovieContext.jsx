import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'movieshelf-watchlists';
const ACTIVE_LIST_KEY = 'movieshelf-active-watchlist';
const DEFAULT_LIST = { id: 'my-watchlist', name: 'My Watchlist', movies: [] };
const MovieContext = createContext(null);

function readWatchlists() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (Array.isArray(parsed) && parsed.length) {
      return parsed.map((list) => ({
        id: String(list.id),
        name: String(list.name || 'Untitled list'),
        movies: Array.isArray(list.movies) ? list.movies : [],
      }));
    }
  } catch { /* Use a clean default when stored data is invalid. */ }
  return [DEFAULT_LIST];
}

export function MovieProvider({ children }) {
  const [watchlists, setWatchlists] = useState(readWatchlists);
  const [activeWatchlistId, setActiveWatchlistIdState] = useState(() => {
    try { return localStorage.getItem(ACTIVE_LIST_KEY) || DEFAULT_LIST.id; }
    catch { return DEFAULT_LIST.id; }
  });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlists)); } catch { /* Storage may be unavailable. */ }
  }, [watchlists]);

  useEffect(() => {
    if (!watchlists.some((list) => list.id === activeWatchlistId)) {
      setActiveWatchlistIdState(watchlists[0]?.id || DEFAULT_LIST.id);
    }
  }, [watchlists, activeWatchlistId]);

  useEffect(() => {
    try { localStorage.setItem(ACTIVE_LIST_KEY, activeWatchlistId); } catch { /* Storage may be unavailable. */ }
  }, [activeWatchlistId]);

  const setActiveWatchlistId = useCallback((id) => setActiveWatchlistIdState(id), []);
  const addMovieToWatchlist = useCallback((movie, listId = activeWatchlistId) => {
    setWatchlists((current) => current.map((list) => list.id === listId && !list.movies.some((item) => item.id === movie.id)
      ? { ...list, movies: [...list.movies, movie] } : list));
  }, [activeWatchlistId]);
  const removeMovieFromWatchlist = useCallback((movieId, listId = activeWatchlistId) => {
    setWatchlists((current) => current.map((list) => list.id === listId
      ? { ...list, movies: list.movies.filter((movie) => movie.id !== movieId) } : list));
  }, [activeWatchlistId]);
  const isMovieInWatchlist = useCallback((movieId, listId = activeWatchlistId) => {
    return Boolean(watchlists.find((list) => list.id === listId)?.movies.some((movie) => movie.id === movieId));
  }, [watchlists, activeWatchlistId]);
  const addWatchlist = useCallback((name) => {
    const cleanName = name.trim();
    if (!cleanName) return;
    const id = `watchlist-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setWatchlists((current) => [...current, { id, name: cleanName, movies: [] }]);
    setActiveWatchlistIdState(id);
  }, []);
  const deleteWatchlist = useCallback((listId) => {
    setWatchlists((current) => {
      if (current.length <= 1) return current;
      const next = current.filter((list) => list.id !== listId);
      if (activeWatchlistId === listId) setActiveWatchlistIdState(next[0].id);
      return next;
    });
  }, [activeWatchlistId]);

  const value = useMemo(() => ({
    watchlists, activeWatchlistId, setActiveWatchlistId, addMovieToWatchlist,
    removeMovieFromWatchlist, isMovieInWatchlist, addWatchlist, deleteWatchlist,
    activeWatchlist: watchlists.find((list) => list.id === activeWatchlistId) || watchlists[0] || DEFAULT_LIST,
  }), [watchlists, activeWatchlistId, setActiveWatchlistId, addMovieToWatchlist,
    removeMovieFromWatchlist, isMovieInWatchlist, addWatchlist, deleteWatchlist]);

  return <MovieContext.Provider value={value}>{children}</MovieContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useMovies() {
  const context = useContext(MovieContext);
  if (!context) throw new Error('useMovies must be used within a MovieProvider');
  return context;
}
