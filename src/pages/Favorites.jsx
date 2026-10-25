import { useCallback, useEffect, useState } from 'react';
import MovieGrid from '../components/MovieGrid';

const FAVORITES_KEY = 'movieshelf-favorites';

function readFavorites() {
  try {
    const saved = JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function Favorites() {
  const [favoriteMovies, setFavoriteMovies] = useState(readFavorites);

  const refreshFavorites = useCallback(() => {
    setFavoriteMovies(readFavorites());
  }, []);

  useEffect(() => {
    window.addEventListener('movieshelf-favorites-updated', refreshFavorites);
    window.addEventListener('storage', refreshFavorites);
    return () => {
      window.removeEventListener('movieshelf-favorites-updated', refreshFavorites);
      window.removeEventListener('storage', refreshFavorites);
    };
  }, [refreshFavorites]);

  return (
    <main className="main-content">
      <div className="content-header">
        <p className="eyebrow">YOUR PERSONAL COLLECTION</p>
        <h1>My Favorites</h1>
        <p>
          {favoriteMovies.length === 0
            ? 'Save movies from the home page to build your collection.'
            : `${favoriteMovies.length} saved movie${favoriteMovies.length === 1 ? '' : 's'}`}
        </p>
      </div>
      <MovieGrid movies={favoriteMovies} onFavoriteChange={refreshFavorites} />
    </main>
  );
}

export default Favorites;
