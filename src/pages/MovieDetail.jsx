import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { getMovieDetails, getTVDetails, getTVSeason, getImageUrl } from '../services/tmdb';
import { addToWatchlist, checkInWatchlist, removeFromWatchlist } from '../services/db';
import { PlayCircle, Plus, Check, Star, MonitorPlay, Layers, ChevronDown, Share2 } from 'lucide-react';

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isTV = location.pathname.includes('/tv');
  
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInList, setIsInList] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [isSeasonDropdownOpen, setIsSeasonDropdownOpen] = useState(false);
  const [episodes, setEpisodes] = useState([]);

  useEffect(() => {
    setLoading(true);
    const fetchDetails = isTV ? getTVDetails(id) : getMovieDetails(id);
    
    fetchDetails.then(data => {
      setMedia(data);
      setLoading(false);
      // Auto-select first season if it's TV
      if (isTV && data.seasons && data.seasons.length > 0) {
        // often season 0 is specials, try to pick season 1 if available
        const s1 = data.seasons.find(s => s.season_number === 1);
        setSelectedSeason(s1 ? 1 : data.seasons[0].season_number);
      }
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
    
    checkInWatchlist(id).then(status => setIsInList(status));
  }, [id, isTV]);

  // Fetch episodes when selectedSeason changes
  useEffect(() => {
    if (isTV && selectedSeason !== null) {
      getTVSeason(id, selectedSeason).then(data => {
        setEpisodes(data.episodes || []);
      }).catch(err => console.error(err));
    }
  }, [id, isTV, selectedSeason]);

  const toggleWatchlist = async () => {
    if (isInList) {
      await removeFromWatchlist(media.id);
      setIsInList(false);
    } else {
      await addToWatchlist({
        id: media.id,
        title: media.title || media.name,
        poster_path: media.poster_path,
        media_type: isTV ? 'tv' : 'movie'
      });
      setIsInList(true);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: media.title || media.name,
          text: `Check out ${media.title || media.name} on Aetheric Cinema!`,
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

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-primary text-xl">Loading Dream...</div>;
  }

  if (!media) {
    return <div className="min-h-screen flex items-center justify-center text-error">Media not found.</div>;
  }

  const cast = media.credits?.cast?.slice(0, 4) || [];
  const similar = media.similar?.results?.slice(0, 4) || [];

  return (
    <div className="relative min-h-screen bg-background text-on-background">
      {/* Background Hero */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent z-10 lg:w-2/3"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10"></div>
        <img className="w-full h-full object-cover opacity-60 mix-blend-screen" 
             src={getImageUrl(media.backdrop_path)} alt="Background" />
      </div>

      {/* Main Content */}
      <div className="relative z-20 pt-28 px-4 md:px-8 lg:px-container-padding pb-20 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        <aside className="lg:col-span-5 flex flex-col gap-8">
          <div className="glass-panel p-6 md:p-8 rounded-xl flex flex-col gap-6 shadow-[0_0_40px_rgba(212,165,255,0.1)]">
            <div className="space-y-4">
              {isTV && (
                <span className="inline-block px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary font-label-sm text-[10px] uppercase tracking-widest">
                  Series
                </span>
              )}
              <h1 className="font-display-lg text-3xl sm:text-4xl lg:text-5xl text-white text-glow leading-tight">
                {media.title || media.name}
              </h1>
              <div className="flex flex-wrap gap-3 items-center text-xs md:text-sm">
                <div className="flex items-center gap-1 text-tertiary">
                  <Star size={16} className="fill-tertiary" /> <span className="font-bold">{media.vote_average?.toFixed(1)}</span>
                </div>
                <span className="text-white/40">|</span>
                <span className="text-on-surface-variant font-bold">{media.release_date?.substring(0, 4) || media.first_air_date?.substring(0, 4)}</span>
                
                {!isTV && (
                  <>
                    <span className="text-white/40">|</span>
                    <span className="text-on-surface-variant">{media.runtime || media.episode_run_time?.[0] || 'N/A'} min</span>
                  </>
                )}
                {isTV && media.number_of_seasons && (
                  <>
                    <span className="text-white/40">|</span>
                    <span className="text-on-surface-variant flex items-center gap-1"><Layers size={14} /> {media.number_of_seasons} Seasons</span>
                    <span className="text-white/40">|</span>
                    <span className="text-on-surface-variant">{media.number_of_episodes} Episodes</span>
                  </>
                )}
                
                <span className="text-white/40">|</span>
                <div className="flex gap-2 relative z-50">
                  {media.genres?.slice(0,2).map(g => (
                    <Link key={g.id} to={isTV ? `/series?genre=${g.id}&name=${encodeURIComponent(g.name)}` : `/?genre=${g.id}&name=${encodeURIComponent(g.name)}`} className="px-2 py-0.5 rounded bg-white/10 border border-white/20 text-on-surface-variant text-[11px] hover:bg-white/20 hover:text-white transition-colors cursor-pointer">
                      {g.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              {!isTV && (
                <Link to={`/play/${media.id}`} className="w-full py-3 md:py-4 rounded-full bg-gradient-to-r from-primary to-[#d4a5ff] text-on-primary font-bold flex items-center justify-center gap-2 bloom-effect transition-all text-sm md:text-base">
                  <PlayCircle size={24} /> Play Now
                </Link>
              )}
              {isTV && (
                <button onClick={() => {
                    const firstEp = episodes[0];
                    if(firstEp) navigate(`/play/${media.id}?type=tv&season=${selectedSeason}&episode=${firstEp.episode_number}`);
                }} className="w-full py-3 md:py-4 rounded-full bg-gradient-to-r from-primary to-[#d4a5ff] text-on-primary font-bold flex items-center justify-center gap-2 bloom-effect transition-all text-sm md:text-base">
                  <PlayCircle size={24} /> Play S{selectedSeason} E1
                </button>
              )}
              <div className="flex gap-2 w-full">
                <button onClick={toggleWatchlist} className={`flex-1 py-3 md:py-4 rounded-full border border-white/20 glass hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-sm md:text-base ${isInList ? 'text-tertiary' : 'text-on-surface'}`}>
                  {isInList ? <><Check size={24} /> Added</> : <><Plus size={24} /> Watchlist</>}
                </button>
                <button onClick={handleShare} className="aspect-square py-3 md:py-4 px-4 md:px-5 rounded-full border border-white/20 glass hover:bg-white/10 transition-all flex items-center justify-center text-on-surface" title="Share">
                  <Share2 size={24} />
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 mt-2">
              <h3 className="text-primary font-bold text-headline-md mb-3">Synopsis</h3>
              <p className="text-on-surface-variant leading-relaxed font-body-md text-[15px]">
                {media.overview}
              </p>
            </div>
          </div>
        </aside>

        <div className="lg:col-span-7 flex flex-col gap-12">
          
          {/* Episodes List (For TV Only) */}
          {isTV && media.seasons && (
            <div className="glass-panel p-6 md:p-8 rounded-xl flex flex-col gap-6">
              <div className="flex justify-between items-end relative">
                <h3 className="text-on-surface font-bold text-headline-md">Episodes</h3>
                
                <div className="relative">
                  <button 
                    onClick={() => setIsSeasonDropdownOpen(!isSeasonDropdownOpen)}
                    className="flex items-center gap-2 bg-white/5 border border-white/20 hover:border-primary/50 transition-colors rounded-lg text-white px-4 py-2 text-sm font-bold shadow-lg"
                  >
                    Season {selectedSeason}
                    <ChevronDown size={16} className="text-white/50" />
                  </button>

                  {isSeasonDropdownOpen && (
                    <div className="absolute right-0 top-12 w-40 glass-panel border-white/20 rounded-xl overflow-hidden shadow-2xl z-50 flex flex-col max-h-60 overflow-y-auto">
                      {media.seasons.filter(s => s.season_number > 0).map(season => (
                        <div 
                          key={season.id} 
                          onClick={() => { setSelectedSeason(season.season_number); setIsSeasonDropdownOpen(false); }}
                          className={`px-4 py-3 text-sm cursor-pointer hover:bg-white/10 transition-colors ${selectedSeason === season.season_number ? 'bg-primary/20 text-primary font-bold' : 'text-white'}`}
                        >
                          Season {season.season_number}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {episodes.map(ep => (
                  <div key={ep.id} onClick={() => navigate(`/play/${media.id}?type=tv&season=${selectedSeason}&episode=${ep.episode_number}`)} className="flex gap-4 p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors group">
                    <div className="relative w-32 h-20 rounded-md overflow-hidden shrink-0">
                      <img src={getImageUrl(ep.still_path, 'w300')} alt={ep.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                        <PlayCircle size={24} className="text-white" />
                      </div>
                    </div>
                    <div className="flex flex-col justify-center">
                      <h4 className="text-white text-sm font-bold group-hover:text-primary transition-colors">{ep.episode_number}. {ep.name}</h4>
                      <p className="text-on-surface-variant text-xs mt-1 line-clamp-2">{ep.overview || "No overview available."}</p>
                      <span className="text-tertiary text-[10px] mt-1 flex items-center gap-1"><MonitorPlay size={10}/> {ep.runtime} min</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cast */}
          {cast.length > 0 && (
            <div className="glass-panel p-6 md:p-8 rounded-xl">
              <h3 className="text-on-surface font-bold text-headline-md mb-6">Top Cast</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {cast.map(person => (
                  <Link to={`/person/${person.id}`} key={person.id} className="flex items-center gap-4 group cursor-pointer">
                    <div className="w-14 h-14 rounded-full overflow-hidden border border-primary/30 group-hover:border-primary transition-colors shrink-0">
                      <img src={getImageUrl(person.profile_path, 'w200')} alt={person.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-white text-sm font-bold group-hover:text-primary transition-colors line-clamp-1">{person.name}</span>
                      <span className="text-on-surface-variant text-xs line-clamp-1">{person.character}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Similar Titles */}
          {similar.length > 0 && (
            <div>
              <h3 className="font-display-lg text-headline-md text-white mb-6">Similar Dreams</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {similar.map(sim => (
                  <Link to={`/${isTV ? 'tv' : 'movie'}/${sim.id}`} key={sim.id} className="group relative aspect-[2/3] rounded-xl overflow-hidden glass-panel border-white/10 hover:border-primary/50 transition-all duration-300">
                    <img src={getImageUrl(sim.poster_path, 'w300')} alt={sim.title || sim.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                      <h4 className="text-white font-bold text-sm truncate">{sim.title || sim.name}</h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
