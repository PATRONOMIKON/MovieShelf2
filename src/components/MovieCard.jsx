import { useEffect, useState } from 'react';

const FAVORITES_KEY = 'movieshelf-favorites';
const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w500';

function readFavorites() {
  try {
    const parsed = JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function MovieCard({ movie, onFavoriteChange }) {
  const [favorites, setFavorites] = useState(readFavorites);
  const title = movie.title || movie.name || 'Untitled movie';
  const releaseDate = movie.release_date || movie.first_air_date || '';
  const year = releaseDate ? releaseDate.slice(0, 4) : 'Year unknown';
  const isFavorite = favorites.some((favorite) => favorite.id === movie.id);

  useEffect(() => {
    const refreshFavorites = () => setFavorites(readFavorites());
    window.addEventListener('movieshelf-favorites-updated', refreshFavorites);
    window.addEventListener('storage', refreshFavorites);
    return () => {
      window.removeEventListener('movieshelf-favorites-updated', refreshFavorites);
      window.removeEventListener('storage', refreshFavorites);
    };
  }, []);

  function toggleFavorite() {
    const current = readFavorites();
    const exists = current.some((favorite) => favorite.id === movie.id);
    const updated = exists
      ? current.filter((favorite) => favorite.id !== movie.id)
      : [...current, movie];

    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
      setFavorites(updated);
      window.dispatchEvent(new Event('movieshelf-favorites-updated'));
      onFavoriteChange?.();
    } catch {
      window.alert('Your browser could not save favorites. Check your browser storage settings.');
    }
  }

  return (
    <article className="movie-card">
      <div className="movie-poster">
        {movie.poster_path ? (
          <img
            src={`${POSTER_BASE_URL}${movie.poster_path}`}
            alt={`${title} poster`}
            loading="lazy"
          />
        ) : (
          <div className="poster-placeholder" role="img" aria-label={`No poster available for ${title}`}>
            <span>🎬</span>
            <span>No poster available</span>
          </div>
        )}
        <button
          type="button"
          className={`favorite-button${isFavorite ? ' favorited' : ''}`}
          onClick={toggleFavorite}
          aria-pressed={isFavorite}
          aria-label={isFavorite ? `Remove ${title} from favorites` : `Add ${title} to favorites`}
        >
          {isFavorite ? '♥ Saved' : '♡ Add to Favorites'}
        </button>
      </div>
      <div className="movie-info">
        <h3 className="movie-title">{title}</h3>
        <div className="movie-details">
          <span className="movie-rating">
            ⭐ {typeof movie.vote_average === 'number' ? movie.vote_average.toFixed(1) : 'N/A'}
          </span>
          <span className="movie-year">{year}</span>
        </div>
        <p className="movie-overview">{movie.overview || 'No description available.'}</p>
      </div>
    </article>
  );
}

export default MovieCard;
