import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../services/tmdb';
import { PlayCircle, Clock, Trash2, ArrowLeft } from 'lucide-react';
import { updateUser } from '../services/db';

export default function History() {
  const [history, setHistory] = useState([]);
  
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        setHistory(userObj.watchHistory || []);
      } catch(e) {}
    }
  }, []);

  const handleClearHistory = async () => {
    if (window.confirm("Are you sure you want to clear your entire watch history?")) {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const userObj = JSON.parse(userStr);
          userObj.watchHistory = [];
          localStorage.setItem('user', JSON.stringify(userObj));
          if (userObj.id) {
            await updateUser(userObj.id, { watchHistory: [] });
          }
          setHistory([]);
        } catch(e) {
          console.error(e);
        }
      }
    }
  };

  return (
    <div className="min-h-screen pt-32 px-4 md:px-gutter lg:px-container-padding pb-24 relative z-10">
      
      {/* Page Header */}
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <Link to="/mylist" className="text-primary flex items-center gap-2 mb-4 hover:underline font-label-sm">
            <ArrowLeft size={16} /> Back to My List
          </Link>
          <h1 className="font-display-lg text-3xl md:text-display-lg text-on-surface mb-2 tracking-tight flex items-center gap-3">
            <Clock size={36} className="text-primary" /> Watch History
          </h1>
          <p className="text-on-surface-variant font-body-md md:font-body-lg md:text-body-lg opacity-80">
            A complete record of your cinematic journey.
          </p>
        </div>
        {history.length > 0 && (
          <div className="flex gap-3">
            <button 
              onClick={handleClearHistory}
              className="px-6 py-2 rounded-full glass bg-error-container/20 border border-error/30 text-error hover:bg-error-container/40 transition-all flex items-center gap-2 font-label-sm text-sm"
            >
              <Trash2 size={16} /> Clear History
            </button>
          </div>
        )}
      </header>

      {/* History Grid */}
      {history.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-card-gap">
          {history.map((movie, index) => (
            <Link to={`/play/${movie.id}`} key={`${movie.id}-${index}`} className="group relative flex flex-col gap-3">
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
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant">
          <Clock size={48} className="opacity-20 mb-4" />
          <p>Your watch history is empty.</p>
        </div>
      )}
    </div>
  );
}
