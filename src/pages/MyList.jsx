import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getWatchlist, removeFromWatchlist } from '../services/db';
import { getImageUrl, getTrendingMovies } from '../services/tmdb';
import { PlayCircle, Trash2, Clock, Bookmark, SlidersHorizontal, LayoutGrid, PlusCircle } from 'lucide-react';

export default function MyList() {
  const [list, setList] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchList = async () => {
    try {
      const data = await getWatchlist();
      setList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setList([]);
    } finally {
      setLoading(false);
    }
    
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        setHistory(userObj.watchHistory || []);
      } catch(e) {}
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const handleRemove = async (e, id) => {
    e.preventDefault();
    await removeFromWatchlist(id);
    fetchList();
  };

  return (
    <div className="min-h-screen pt-32 px-4 md:px-gutter lg:px-container-padding pb-24 relative z-10">
      
      {/* Page Header */}
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="font-display-lg text-3xl md:text-display-lg text-on-surface mb-2 tracking-tight">My Collection</h1>
          <p className="text-on-surface-variant font-body-md md:font-body-lg md:text-body-lg opacity-80">Your sanctuary of curated stories and late-night escapes.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-2 rounded-full glass bg-white/5 border border-white/10 text-label-sm hover:bg-white/10 transition-all flex items-center gap-2">
            <SlidersHorizontal size={16} /> Filter
          </button>
          <button className="px-6 py-2 rounded-full glass bg-white/5 border border-white/10 text-label-sm hover:bg-white/10 transition-all flex items-center gap-2">
            <LayoutGrid size={16} /> Layout
          </button>
        </div>
      </header>


      {/* Watch History */}
      {history.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-headline-md text-[20px] md:text-headline-md text-primary flex items-center gap-2">
              <Clock size={24} className="text-primary" /> Recently Watched
            </h2>
          </div>
          
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 md:gap-card-gap pb-4 hide-scrollbar">
            {history.map((movie) => (
              <Link to={`/play/${movie.id}`} key={movie.id} className="group relative flex flex-col gap-3 min-w-[160px] md:min-w-[280px] snap-start shrink-0">
                <div className="relative aspect-video rounded-lg overflow-hidden glass bg-white/5 border border-white/10 bloom-hover transition-all duration-300">
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" 
                       style={{ backgroundImage: `url('${getImageUrl(movie.poster_path, 'w500')}')` }}></div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px] flex items-center justify-center">
                    <PlayCircle size={36} className="text-white drop-shadow-lg" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                    <div className="h-full bg-primary w-full opacity-70"></div>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-on-surface line-clamp-1 text-sm">{movie.title || movie.name}</h3>
                  <p className="text-on-surface-variant text-[10px] uppercase mt-1 tracking-wider">{movie.media_type || 'Movie'}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Main Watchlist Grid */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-headline-md text-[20px] md:text-headline-md text-primary flex items-center gap-2">
            <Bookmark size={24} className="text-primary fill-primary/20" /> Saved to Watch
          </h2>
          <div className="flex items-center gap-4 text-on-surface-variant font-label-sm text-label-sm">
            <span>{list.length} Items</span>
          </div>
        </div>

        {loading ? (
          <div className="text-primary animate-pulse">Loading your collection...</div>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-card-gap">
            {list.map((movie) => (
              <div key={movie.movieId} className="group relative flex flex-col gap-3">
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden glass bg-white/5 border border-white/10 bloom-hover transition-all duration-300">
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" 
                       style={{ backgroundImage: `url('${getImageUrl(movie.poster_path, 'w500')}')` }}></div>
                  
                  {/* Overlay Controls */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px] flex flex-col items-center justify-center gap-4">
                    <Link to={`/play/${movie.movieId}`} className="w-14 h-14 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
                      <PlayCircle size={36} />
                    </Link>
                    <Link to={`/${movie.media_type || 'movie'}/${movie.movieId}`} className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-xs font-bold border border-white/10 transition-colors flex items-center gap-2 text-white">
                      Details
                    </Link>
                  </div>
                  
                  {/* Top Actions */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 transition-transform">
                    <button onClick={(e) => handleRemove(e, movie.movieId)} className="w-8 h-8 rounded-full bg-error-container/80 text-on-error-container backdrop-blur-lg flex items-center justify-center hover:bg-error transition-colors" title="Remove from list">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  {/* Chips */}
                  <div className="absolute bottom-3 left-3 flex gap-1">
                    <span className="px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-bold uppercase tracking-wider text-primary">
                      {movie.media_type || 'Movie'}
                    </span>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-bold text-on-surface line-clamp-1">{movie.title || movie.name}</h3>
                  <div className="flex justify-between items-center text-on-surface-variant text-xs mt-1">
                    <span className="capitalize">{movie.media_type || 'Movie'}</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Add More Card */}
            <Link to="/" className="flex flex-col gap-3 group">
              <div className="aspect-[2/3] rounded-lg border-2 border-dashed border-white/10 glass bg-white/5 flex flex-col items-center justify-center gap-4 text-on-surface-variant hover:border-primary/40 hover:text-primary transition-all duration-300">
                <PlusCircle size={36} />
                <span className="font-label-sm text-label-sm">Explore More</span>
              </div>
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
