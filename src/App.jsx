import { useCallback, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MovieProvider } from './contexts/MovieContext';
import Header from './components/Header';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import Watchlist from './pages/Watchlist';
import MovieDetails from './pages/MovieDetails';
import './App.css';

function App() {
  const [searchResults, setSearchResults] = useState(null);
  const [searchError, setSearchError] = useState('');
  const handleSearchResults = useCallback((results) => setSearchResults(results), []);
  const handleSearchError = useCallback((message) => setSearchError(message), []);

  return (
    <Router>
      <MovieProvider>
        <div className="app">
          <Header onSearchResults={handleSearchResults} onSearchError={handleSearchError} />
          <Routes>
            <Route path="/" element={<Home searchResults={searchResults} searchError={searchError} />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="*" element={<main className="main-content"><div className="empty-state"><h1>Page not found</h1><p>Use the navigation above to return to MovieShelf.</p></div></main>} />
          </Routes>
          <footer className="app-footer">
            <p>MovieShelf · Discover your next favorite movie.</p>
            <p>Movie data provided by TMDB. This product is not endorsed or certified by TMDB.</p>
          </footer>
        </div>
      </MovieProvider>
    </Router>
  );
}

export default App;
