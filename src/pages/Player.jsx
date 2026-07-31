import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { getMovieDetails, getTVDetails, getImageUrl } from '../services/tmdb';
import { Star, Plus, Share2, PlayCircle } from 'lucide-react';
import { addToWatchlist, checkInWatchlist, updateUser } from '../services/db';

const SERVERS = [
  {
    id: 'vidlink',
    name: 'VidLink (Primary)',
    getUrl: (type, id, season, episode) => 
      type === 'tv'
        ? `https://vidlink.pro/tv/${id}/${season}/${episode}`
        : `https://vidlink.pro/movie/${id}`
  },
  {
    id: 'embedsu',
    name: 'Embed.su (Backup 1)',
    getUrl: (type, id, season, episode) => 
      type === 'tv' 
        ? `https://embed.su/embed/tv/${id}/${season}/${episode}`
        : `https://embed.su/embed/movie/${id}`
  },
  {
    id: 'autoembed',
    name: 'AutoEmbed (Backup 2)',
    getUrl: (type, id, season, episode) => 
      type === 'tv'
        ? `https://player.autoembed.cc/embed/tv/${id}/${season}/${episode}`
        : `https://player.autoembed.cc/embed/movie/${id}`
  },
  {
    id: 'vidsrc',
    name: 'VidSrc (Backup 3)',
    getUrl: (type, id, season, episode) => 
      `https://vidsrc.me/embed/${type}?tmdb=${id}${type === 'tv' ? `&season=${season}&episode=${episode}` : ''}`
  }
];

export default function Player() {
  const { id } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const type = searchParams.get('type') || 'movie';
  const season = searchParams.get('season') || 1;
  const episode = searchParams.get('episode') || 1;
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInList, setIsInList] = useState(false);
  const [subtitleSetting, setSubtitleSetting] = useState('English');
  const [serverIndex, setServerIndex] = useState(0);
  const [shieldActive, setShieldActive] = useState(true);

  const activeServer = SERVERS[serverIndex % SERVERS.length];

  // Window Focus Lock (Removed because it freezes the browser for legit users)

  // Track watch time
  useEffect(() => {
    const timer = setInterval(() => {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const userObj = JSON.parse(userStr);
          userObj.watchTime = (userObj.watchTime || 0) + 1; // Increment by 1 'unit'
          localStorage.setItem('user', JSON.stringify(userObj));
          
          if (userObj.id) {
            updateUser(userObj.id, { watchTime: userObj.watchTime }).catch(e => console.error("Failed to sync watch time", e));
          }
        } catch (e) {}
      }
    }, 60000); // every minute
    return () => clearInterval(timer);
  }, []);

  // Update Watch History
  useEffect(() => {
    if (movie) {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const userObj = JSON.parse(userStr);
          const history = userObj.watchHistory || [];
          
          // Remove if it exists to move it to the front
          const filteredHistory = history.filter(item => item.id !== movie.id);
          const newEntry = {
            id: movie.id,
            title: movie.title || movie.name,
            poster_path: movie.poster_path,
            media_type: type,
            timestamp: new Date().toISOString()
          };
          filteredHistory.unshift(newEntry);
          
          // Keep only top 10
          userObj.watchHistory = filteredHistory.slice(0, 10);
          
          localStorage.setItem('user', JSON.stringify(userObj));
          if (userObj.id) {
            updateUser(userObj.id, { watchHistory: userObj.watchHistory }).catch(e => console.error("Failed to sync watch history", e));
          }
        } catch(e) {
          console.error(e);
        }
      }
    }
  }, [movie, type]);

  // Load subtitle setting
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        if (userObj.subtitle) {
          setSubtitleSetting(userObj.subtitle);
        }
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    const fetchMedia = type === 'tv' ? getTVDetails(id) : getMovieDetails(id);
    fetchMedia.then(data => {
      setMovie(data);
      setLoading(false);
    });
    checkInWatchlist(id).then(status => setIsInList(status));
  }, [id, type]);

  const handleAddToList = async () => {
    if (!isInList && movie) {
      await addToWatchlist({
        id: movie.id,
        title: movie.title || movie.name,
        poster_path: movie.poster_path,
        media_type: 'movie'
      });
      setIsInList(true);
    }
  };

  const handleSilentFailover = () => {
    setServerIndex((prev) => prev + 1);
  };

  const handleShieldClick = (e) => {
    e.stopPropagation();
    // Intercept first ad click and deactivate shield
    setShieldActive(false);
    window.focus();
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-primary text-xl bg-[#101415]">Loading Player...</div>;
  }

  if (!movie) {
    return <div className="min-h-screen flex items-center justify-center text-error bg-[#101415]">Movie not found.</div>;
  }

  const similar = movie.similar?.results?.slice(0, 5) || [];

  return (
    <div className="min-h-screen pt-[120px] pb-section-margin bg-gradient-to-b from-[#100563] via-[#3e3c8f] to-[#754b9d] text-on-surface">
      <main className="px-4 md:px-container-padding max-w-7xl mx-auto">
        
        {/* Video Player Section */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-card-gap mb-8 lg:mb-section-margin items-start">
          
          {/* Player Frame */}
          <div className="w-full lg:w-3/4">
            
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-surface-container-lowest/40 backdrop-blur-3xl border border-white/20 shadow-[0_0_60px_rgba(212,165,255,0.2)] group">
              
              {/* Actual iframe embedding player server */}
              <iframe
                key={`${activeServer.id}-${id}-${season}-${episode}`}
                src={activeServer.getUrl(type, id, season, episode)}
                className="absolute inset-0 w-full h-full border-0 z-10"
                allowFullScreen
                allow="autoplay; encrypted-media; picture-in-picture"
                title="Movie Player"
              ></iframe>
            </div>
            
            {/* Player Utility Bar (Clean & Subtle) */}
            <div className="mt-3 flex items-center justify-between text-xs text-white/70">
              <span className="flex items-center gap-1.5 text-on-surface-variant">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Streaming HD Clean Server
              </span>
              <button 
                onClick={handleSilentFailover}
                className="hover:text-primary transition-colors flex items-center gap-1 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/10"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>refresh</span>
                Video tidak bisa diputar? Reload Server
              </button>
            </div>
          </div>

          {/* Metadata Sidebar */}
          <div className="w-full lg:w-1/4 flex flex-col gap-4 h-full">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-6 h-full flex flex-col">
              <div className="flex gap-2 mb-4 flex-wrap">
                {movie.genres?.slice(0, 2).map(g => (
                  <span key={g.id} className="px-3 py-1 rounded-full border border-white/20 bg-white/5 font-label-sm text-label-sm text-primary">
                    {g.name}
                  </span>
                ))}
              </div>
              
              <h1 className="font-headline-md text-headline-md text-primary-fixed mb-2">
                {movie.title || movie.name}
              </h1>
              
              {type === 'tv' && season && episode && (
                <div className="font-label-sm text-tertiary mb-2 uppercase tracking-widest">
                  Season {season} • Episode {episode}
                </div>
              )}
              
              <div className="flex items-center gap-4 mb-4 font-label-sm text-label-sm text-on-surface-variant flex-wrap">
                <span>{movie.release_date?.substring(0, 4)}</span>
                <span>•</span>
                <span>{movie.runtime}m</span>
                <span>•</span>
                <div className="flex items-center text-tertiary-fixed">
                  <Star size={14} className="fill-tertiary-fixed" />
                  <span className="ml-1">{movie.vote_average?.toFixed(1)}</span>
                </div>
              </div>
              
              <p className="font-body-md text-body-md text-on-surface/80 leading-relaxed flex-grow text-sm">
                {movie.overview}
              </p>
              
              <div className="mt-6 flex gap-3">
                <button 
                  onClick={handleAddToList}
                  className={`flex-1 py-3 px-4 rounded-full font-label-sm text-label-sm transition-all flex items-center justify-center gap-2 ${isInList ? 'bg-white/10 text-tertiary' : 'bg-gradient-to-r from-primary-container to-inverse-primary text-on-primary hover:shadow-[0_0_20px_rgba(212,165,255,0.4)]'}`}
                >
                  <Plus size={18} />
                  {isInList ? 'Added' : 'My List'}
                </button>
                <button className="p-3 rounded-full border border-white/20 bg-white/5 text-on-surface hover:bg-white/10 transition-colors">
                  <Share2 size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Next Up Carousel */}
        {similar.length > 0 && (
          <section className="mb-section-margin">
            <h2 className="font-headline-md text-xl md:text-headline-md text-primary-fixed mb-6">More to Explore</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-card-gap">
              {similar.map(sim => (
                <Link to={`/${type === 'tv' ? 'tv' : 'movie'}/${sim.id}`} key={sim.id} className="group cursor-pointer">
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden border border-white/10 mb-3">
                    <img 
                      alt={sim.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      src={getImageUrl(sim.poster_path, 'w300')} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <PlayCircle size={40} className="text-white" />
                    </div>
                  </div>
                  <h3 className="font-body-md text-body-md text-on-surface group-hover:text-primary transition-colors truncate">
                    {sim.title}
                  </h3>
                  <p className="text-[12px] text-on-surface-variant">
                    {sim.release_date?.substring(0, 4)}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
