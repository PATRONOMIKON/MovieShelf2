import { useState } from 'react';
import MovieGrid from '../components/MovieGrid';
import { useMovies } from '../contexts/MovieContext';

function Watchlist() {
  const { watchlists, activeWatchlist, activeWatchlistId, setActiveWatchlistId, addWatchlist, deleteWatchlist } = useMovies();
  const [newListName, setNewListName] = useState('');

  function handleCreate(event) {
    event.preventDefault();
    if (!newListName.trim()) return;
    addWatchlist(newListName);
    setNewListName('');
  }

  return (
    <main className="main-content">
      <div className="content-header">
        <p className="eyebrow">YOUR PERSONAL COLLECTION</p>
        <h1>My Watchlists</h1>
        <p>Keep track of the movies you want to watch, all in one place.</p>
      </div>
      <section className="watchlist-tools" aria-label="Manage watchlists">
        <label className="watchlist-select-label" htmlFor="watchlist-select">Current list</label>
        <select id="watchlist-select" className="watchlist-select" value={activeWatchlistId} onChange={(event) => setActiveWatchlistId(event.target.value)}>
          {watchlists.map((list) => <option key={list.id} value={list.id}>{list.name} ({list.movies.length})</option>)}
        </select>
        <form className="create-watchlist-form" onSubmit={handleCreate}>
          <input aria-label="New watchlist name" value={newListName} onChange={(event) => setNewListName(event.target.value)} placeholder="Name a new watchlist" maxLength={50} />
          <button type="submit" className="primary-button" disabled={!newListName.trim()}>Create list</button>
        </form>
        {watchlists.length > 1 && <button type="button" className="secondary-button" onClick={() => {
          if (window.confirm(`Delete “${activeWatchlist.name}” and its saved movies?`)) deleteWatchlist(activeWatchlistId);
        }}>Delete current list</button>}
      </section>
      <div className="watchlist-heading">
        <h2>{activeWatchlist.name}</h2>
        <span>{activeWatchlist.movies.length} movie{activeWatchlist.movies.length === 1 ? '' : 's'}</span>
      </div>
      {activeWatchlist.movies.length === 0 ? (
        <div className="empty-state"><p>This watchlist is empty.</p><span>Browse movies and select “Add to Watchlist” to save something for later.</span></div>
      ) : <MovieGrid movies={activeWatchlist.movies} />}
    </main>
  );
}

export default Watchlist;
