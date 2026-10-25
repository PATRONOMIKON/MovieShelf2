import MovieCard from './MovieCard';

function MovieGrid({ movies = [], onFavoriteChange }) {
  if (movies.length === 0) {
    return (
      <div className="empty-state">
        <p>No movies found.</p>
        <span>Try a different search or check back later.</span>
      </div>
    );
  }

  return (
    <div className="movie-grid">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} onFavoriteChange={onFavoriteChange} />
      ))}
    </div>
  );
}

export default MovieGrid;
