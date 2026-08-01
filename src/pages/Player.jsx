import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { getMovieDetails, getTVDetails, getTVSeason, getImageUrl } from '../services/tmdb';
import { Star, Plus, Share2, PlayCircle, ChevronDown, Check } from 'lucide-react';
import { addToWatchlist, checkInWatchlist, updateUser } from '../services/db';

const SERVERS = [
  {
    id: 'vidsrc',
    name: 'VidSrc (Primary)',
    getUrl: (type, id, season, episode) => 
      `https://vidsrc.me/embed/${type}?tmdb=${id}${type === 'tv' ? `&season=${season}&episode=${episode}` : ''}`
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
    id: 'vidlink',
    name: 'VidLink (Backup 2)',
    getUrl: (type, id, season, episode) => 
      type === 'tv'
        ? `https://vidlink.pro/tv/${id}/${season}/${episode}`
        : `https://vidlink.pro/movie/${id}`
  },
  {
    id: 'autoembed',
    name: 'AutoEmbed (Backup 3)',
    getUrl: (type, id, season, episode) => 
      type === 'tv'
        ? `https://player.autoembed.cc/embed/tv/${id}/${season}/${episode}`
        : `https://player.autoembed.cc/embed/movie/${id}`
  }
];

export default function Player() {
  const { id } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const type = searchParams.get('type') || 'movie';
  const currentSeason = searchParams.get('season') || 1;
  const currentEpisode = searchParams.get('episode') || 1;
  
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInList, setIsInList] = useState(false);
  const [subtitleSetting, setSubtitleSetting] = useState('English');
  const [serverIndex, setServerIndex] = useState(0);
  const [shieldActive, setShieldActive] = useState(true);
  
  const [episodes, setEpisodes] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(parseInt(currentSeason));

  const activeServer = SERVERS[serverIndex % SERVERS.length];

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
          
          const filteredHistory = history.filter(item => item.id !== movie.id);
          const newEntry = {
            id: movie.id,
            title: movie.title || movie.name,
            poster_path: movie.poster_path,
            media_type: type,
            timestamp: new Date().toISOString()
          };
          filteredHistory.unshift(newEntry);
          
          userObj.watchHistory = filteredHistory.slice(0, 100);
          
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
      document.title = `Watching ${data.title || data.name} - Aetheric Cinema`;
    });
    checkInWatchlist(id).then(status => setIsInList(status));
  }, [id, type]);

  useEffect(() => {
    if (type === 'tv' && movie) {
      getTVSeason(id, selectedSeason).then(data => {
        setEpisodes(data.episodes || []);
      }).catch(err => console.error("Failed to fetch episodes", err));
    }
  }, [id, type, selectedSeason, movie]);

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

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: movie.title || movie.name,
          text: `Watch ${movie.title || movie.name} on Aetheric Cinema!`,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
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
            
            {/* Ad Education Banner */}
            <div className="bg-primary/10 border border-primary/30 rounded-lg p-3 md:p-4 mb-4 flex items-start gap-3">
              <span className="material-symbols-outlined text-primary shrink-0" style={{ fontSize: '20px' }}>info</span>
              <div>
                <p className="font-body-md text-sm md:text-base text-primary-fixed font-bold mb-1">
                  Tips Menonton Lancar
                </p>
                <p className="font-body-sm text-xs md:text-sm text-on-surface-variant leading-relaxed">
                  Kami menggunakan server gratis pihak ketiga. <strong>Jika muncul iklan tab baru saat video pertama kali di-klik, cukup tutup tab tersebut</strong>, lalu kembali ke halaman ini. <br/><br/>
                  <span className="text-primary-fixed">💡 <strong>Pro Tip:</strong> Sangat disarankan untuk memasang ekstensi <strong>AdBlocker (seperti uBlock Origin)</strong> di browser Anda agar pengalaman menonton 100% bebas dari iklan popup.</span>
                </p>
              </div>
            </div>

            <div className="relative w-full rounded-xl overflow-hidden bg-surface-container-lowest/40 backdrop-blur-3xl border border-white/20 shadow-[0_0_60px_rgba(212,165,255,0.2)] group" style={{ paddingBottom: '56.25%', height: 0 }}>
              
              {/* Actual iframe embedding player server */}
              <iframe
                key={`${activeServer.id}-${id}-${currentSeason}-${currentEpisode}`}
                src={activeServer.getUrl(type, id, currentSeason, currentEpisode)}
                className="absolute top-0 left-0 w-full h-full border-0 z-10"
                allowFullScreen
                allow="autoplay; encrypted-media; picture-in-picture"
                title="Movie Player"
              ></iframe>
            </div>
            
            {/* Player Utility Bar (Clean & Subtle) */}
            <div className="mt-4 flex flex-col gap-2 text-xs">
              <span className="flex items-center gap-1.5 text-on-surface-variant font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Pilih Server (Coba server lain jika Sub Indo tidak ada):
              </span>
              <div className="flex flex-wrap gap-2">
                {SERVERS.map((server, idx) => (
                  <button
                    key={server.id}
                    onClick={() => setServerIndex(idx)}
                    className={`px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                      serverIndex % SERVERS.length === idx 
                        ? 'bg-primary/20 border-primary text-primary font-bold' 
                        : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {serverIndex % SERVERS.length === idx && <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>}
                    {server.name}
                  </button>
                ))}
              </div>
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
              
              {type === 'tv' && currentSeason && currentEpisode && (
                <div className="font-label-sm text-tertiary mb-2 uppercase tracking-widest">
                  Season {currentSeason} • Episode {currentEpisode}
                </div>
              )}
              
              <div className="flex items-center gap-4 mb-4 font-label-sm text-label-sm text-on-surface-variant flex-wrap">
                <span>{(movie.release_date || movie.first_air_date)?.substring(0, 4)}</span>
                <span>•</span>
                <span>{movie.runtime || movie.episode_run_time?.[0] || 'N/A'}m</span>
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
                <button onClick={handleShare} className="p-3 rounded-full border border-white/20 bg-white/5 text-on-surface hover:bg-white/10 transition-colors" title="Share">
                  <Share2 size={18} />
                </button>
              </div>

              {type === 'tv' && movie.seasons && movie.seasons.length > 0 && (
                <div className="mt-6 border-t border-white/10 pt-4 flex-grow flex flex-col min-h-[300px]">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-white text-sm">Episodes</h3>
                    <div className="relative">
                      <select 
                        className="appearance-none bg-white/5 border border-white/20 rounded-md px-3 py-1 pr-8 text-xs text-white focus:outline-none focus:border-primary cursor-pointer"
                        value={selectedSeason}
                        onChange={(e) => setSelectedSeason(Number(e.target.value))}
                      >
                        {movie.seasons.filter(s => s.season_number > 0).map(s => (
                          <option key={s.id} value={s.season_number} className="bg-[#0a061d]">Season {s.season_number}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none" />
                    </div>
                  </div>
                  <div className="flex-grow overflow-y-auto custom-scrollbar flex flex-col gap-2 h-[300px]">
                    {episodes.map(ep => (
                      <Link 
                        key={ep.id}
                        to={`/play/${movie.id}?type=tv&season=${selectedSeason}&episode=${ep.episode_number}`}
                        className={`flex gap-3 p-2 rounded-lg transition-colors border ${
                          parseInt(currentEpisode) === ep.episode_number && parseInt(currentSeason) === selectedSeason
                            ? 'bg-primary/20 border-primary/50'
                            : 'bg-white/5 border-transparent hover:bg-white/10'
                        }`}
                      >
                        <div className="relative w-20 aspect-video rounded bg-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                          {ep.still_path ? (
                            <img src={getImageUrl(ep.still_path, 'w185')} alt={ep.name} className="w-full h-full object-cover" />
                          ) : (
                            <PlayCircle size={20} className="text-white/30" />
                          )}
                          {parseInt(currentEpisode) === ep.episode_number && parseInt(currentSeason) === selectedSeason && (
                            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                              <div className="w-6 h-6 rounded-full bg-primary/80 flex items-center justify-center">
                                <PlayCircle size={14} className="text-white fill-white" />
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col flex-1 min-w-0 justify-center">
                          <p className={`text-xs font-bold truncate ${parseInt(currentEpisode) === ep.episode_number && parseInt(currentSeason) === selectedSeason ? 'text-primary' : 'text-white'}`}>
                            {ep.episode_number}. {ep.name}
                          </p>
                          <p className="text-[10px] text-on-surface-variant mt-0.5">{ep.runtime || '?'}m</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
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
