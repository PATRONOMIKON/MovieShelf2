import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { searchMovies } from '../services/movieService';

function Header({ onSearchResults, onSearchError }) {
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      onSearchResults(null);
      onSearchError('');
      return undefined;
    }

    const controller = new AbortController();
    let active = true;
    const timeoutId = window.setTimeout(async () => {
      setSearching(true);
      onSearchError('');
      try {
        const results = await searchMovies(trimmedQuery, { signal: controller.signal });
        if (active) onSearchResults(results);
      } catch (error) {
        if (active && error.name !== 'AbortError') {
          onSearchResults([]);
          onSearchError(error.message || 'Search failed. Please try again.');
        }
      } finally {
        if (active) setSearching(false);
      }
    }, 350);

    return () => {
      active = false;
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [query, onSearchResults, onSearchError]);

  function clearSearch() {
    setQuery('');
    onSearchResults(null);
    onSearchError('');
  }

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="app-title" onClick={clearSearch}>MovieShelf</Link>
        <div className="search-container">
          <input
            type="search"
            placeholder="Search movies..."
            className="search-input"
            aria-label="Search movies"
            value={query}
            onChange={(event) => {
              const value = event.target.value;
              setQuery(value);
              if (!value.trim()) setSearching(false);
            }}
          />
          {query && (
            <button className="clear-search-button" type="button" onClick={clearSearch} aria-label="Clear search">
              ×
            </button>
          )}
          {searching && <span className="searching-label" aria-live="polite">Searching…</span>}
        </div>
        <nav className="nav-links" aria-label="Main navigation">
          <NavLink to="/" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Home</NavLink>
          <NavLink to="/watchlist" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Watchlist</NavLink>
          <NavLink to="/favorites" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Favorites ♥</NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Header;
