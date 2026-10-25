import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { getMovieDetails } from '../services/movieService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { useMovies } from '../contexts/MovieContext';

const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/w1280';

function MovieDetails() {
  const { id } = useParams();
  const location = useLocation();
  const [movie, setMovie] = useState(location.state?.movie || null);
  const [loading, setLoading] = useState(!location.state?.movie);
  const [error, setError] = useState('');
  const { activeWatchlist, addMovieToWatchlist, removeMovieFromWatchlist, isMovieInWatchlist } = useMovies();

  useEffect(() => {
    if (location.state?.movie) {
      setMovie(location.state.movie);
      setLoading(false);
      return undefined;
    }
    const controller = new AbortController();
    setLoading(true);
    getMovieDetails(id, { signal: controller.signal })
      .then(setMovie)
      .catch((requestError) => { if (requestError.name !== 'AbortError') setError(requestError.message || 'Could not load movie details.'); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [id, location.state]);

  if (loading) return <main className="main-content"><LoadingSpinner message="Loading movie details..." /></main>;
  if (error || !movie) return <main className="main-content"><ErrorMessage message={error || 'Movie not found.'} /><Link className="back-link" to="/">← Back to movies</Link></main>;

  const title = movie.title || movie.name || 'Untitled movie';
  const releaseDate = movie.release_date || movie.first_air_date || '';
  const saved = isMovieInWatchlist(movie.id);

  return (
    <main className="movie-detail-page">
      {movie.backdrop_path && <div className="movie-detail-backdrop" style={{ backgroundImage: `linear-gradient(90deg, #111017 4%, rgba(17,16,23,.86) 48%, rgba(17,16,23,.45)), linear-gradient(0deg, #111017, transparent 70%), url(${BACKDROP_BASE_URL}${movie.backdrop_path})` }} />}
      <div className="movie-detail-content">
        <Link className="back-link" to="/">← Back to movies</Link>
        <div className="movie-detail-layout">
          <div className="movie-detail-poster">{movie.poster_path ? <img src={`${POSTER_BASE_URL}${movie.poster_path}`} alt={`${title} poster`} /> : <div className="poster-placeholder">🎬<span>No poster available</span></div>}</div>
          <section className="movie-detail-copy">
            <p className="eyebrow">MOVIE DETAILS</p>
            <h1>{title}</h1>
            <div className="movie-detail-meta">
              {releaseDate && <span>{releaseDate.slice(0, 4)}</span>}
              {movie.runtime && <span>{movie.runtime} min</span>}
              <span>⭐ {typeof movie.vote_average === 'number' ? movie.vote_average.toFixed(1) : 'N/A'}</span>
              {movie.genres?.length > 0 && <span>{movie.genres.map((genre) => genre.name).join(' · ')}</span>}
            </div>
            <h2>Overview</h2>
            <p className="movie-detail-overview">{movie.overview || 'No description available.'}</p>
            <button type="button" className={`primary-button detail-watchlist-button${saved ? ' saved' : ''}`} onClick={() => saved ? removeMovieFromWatchlist(movie.id) : addMovieToWatchlist(movie)}>
              {saved ? `✓ In ${activeWatchlist.name} — Remove` : `＋ Add to ${activeWatchlist.name}`}
            </button>
            {movie.tagline && <p className="movie-tagline">“{movie.tagline}”</p>}
          </section>
        </div>
      </div>
    </main>
  );
}

export default MovieDetails;
