import { useCallback, useEffect, useState } from 'react';
import MovieGrid from '../components/MovieGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { getPopularMovies } from '../services/movieService';

function Home({ searchResults, searchError }) {
  const [popularMovies, setPopularMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadPopularMovies = useCallback(async (signal) => {
    setLoading(true);
    setError('');
    try {
      const movies = await getPopularMovies({ signal });
      setPopularMovies(movies);
    } catch (requestError) {
      if (requestError.name !== 'AbortError') {
        setError(requestError.message || 'Unable to load popular movies.');
      }
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadPopularMovies(controller.signal);
    return () => controller.abort();
  }, [loadPopularMovies]);

  const isSearching = searchResults !== null;
  const displayedMovies = isSearching ? (searchResults || []) : popularMovies;

  return (
    <main className="main-content">
      <div className="content-header">
        <p className="eyebrow">{isSearching ? 'FIND YOUR NEXT WATCH' : 'WELCOME TO MOVIESHELF'}</p>
        <h1>{isSearching ? 'Search Results' : 'Popular Movies'}</h1>
        <p>
          {isSearching
            ? `${displayedMovies.length} result${displayedMovies.length === 1 ? '' : 's'} found`
            : 'Discover and save your favorite films.'}
        </p>
      </div>

      {searchError ? (
        <ErrorMessage message={searchError} />
      ) : !isSearching && loading ? (
        <LoadingSpinner message="Loading popular movies..." />
      ) : !isSearching && error ? (
        <ErrorMessage message={error} onRetry={() => loadPopularMovies()} />
      ) : (
        <MovieGrid movies={displayedMovies} />
      )}
    </main>
  );
}

export default Home;
