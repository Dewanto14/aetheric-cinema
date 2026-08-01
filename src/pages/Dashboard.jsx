import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getTrendingMovies, getPopularMovies, getTopRatedMovies, discoverMovies, getImageUrl } from '../services/tmdb';
import { PlayCircle, Star, Search, Bell, Settings } from 'lucide-react';
import CarouselContainer from '../components/CarouselContainer';

export default function Dashboard() {
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [watchHistory, setWatchHistory] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const selectedGenre = searchParams.get('genre');
  const selectedGenreName = searchParams.get('name');

  useEffect(() => {
    Promise.all([
      getTrendingMovies(),
      getPopularMovies(),
      getTopRatedMovies()
    ]).then(([trendingData, popularData, topData]) => {
      setTrending(trendingData.results);
      setPopular(popularData.results);
      setTopRated(topData.results);
      setLoading(false);
      
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const userObj = JSON.parse(userStr);
          if (userObj.watchHistory && userObj.watchHistory.length > 0) {
            setWatchHistory(userObj.watchHistory.slice(0, 10));
          }
        } catch (e) {}
      }
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (selectedGenre) {
      setFilterLoading(true);
      discoverMovies(selectedGenre).then(data => {
        setFilteredMovies(data.results);
        setFilterLoading(false);
      });
    }
  }, [selectedGenre]);

  const renderContinueWatchingRow = (title, items) => {
    if (!items || items.length === 0) return null;
    return (
      <section className="px-4 md:px-gutter lg:px-container-padding mb-12">
        <h2 className="font-headline-md text-[20px] md:text-headline-md mb-6 text-tertiary-fixed">{title}</h2>
        <CarouselContainer className="gap-4 md:gap-card-gap pb-4 -mx-4 md:-mx-gutter lg:-mx-container-padding px-4 md:px-gutter lg:px-container-padding">
          {items.map(item => (
            <Link to={`/play/${item.id}?type=${item.media_type || 'movie'}`} key={item.id} className="min-w-[140px] w-[140px] md:min-w-[200px] md:w-[200px] group cursor-pointer block relative">
              <div className="relative aspect-video rounded-lg overflow-hidden glass-panel hover:border-tertiary-fixed transition-colors border border-white/10 mb-3 shadow-lg">
                <img className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
                     src={getImageUrl(item.backdrop_path || item.poster_path, 'w500')} alt={item.title} />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <PlayCircle size={32} className="text-white drop-shadow-md" />
                </div>
                {/* Fake progress bar */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
                  <div className="h-full bg-tertiary-fixed" style={{ width: `${Math.random() * 40 + 20}%` }}></div>
                </div>
              </div>
              <h4 className="font-body-md font-bold truncate text-on-surface text-sm md:text-base">{item.title}</h4>
              <p className="text-[10px] text-tertiary uppercase tracking-widest mt-1">Continue Watching</p>
            </Link>
          ))}
        </CarouselContainer>
      </section>
    );
  };

  const renderMovieRow = (title, movies) => (
    <section className="px-4 md:px-gutter lg:px-container-padding mb-12">
      <h2 className="font-headline-md text-[20px] md:text-headline-md mb-6">{title}</h2>
      <CarouselContainer className="gap-4 md:gap-card-gap pb-4 -mx-4 md:-mx-gutter lg:-mx-container-padding px-4 md:px-gutter lg:px-container-padding">
        {movies.map(movie => (
          <Link to={`/movie/${movie.id}`} key={movie.id} className="min-w-[140px] w-[140px] md:min-w-[200px] md:w-[200px] group cursor-pointer block">
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden glass-panel bloom-hover mb-3">
              <img className="w-full h-full object-cover" 
                   src={getImageUrl(movie.poster_path, 'w500')} alt={movie.title || movie.name} />
              <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform">
                <div className="flex justify-between items-center">
                  <span className="bg-primary/20 text-primary text-[10px] px-2 py-0.5 rounded border border-primary/30 uppercase flex items-center gap-1">
                    <Star size={10} className="fill-primary" /> {movie.vote_average?.toFixed(1)}
                  </span>
                  <PlayCircle size={20} className="text-primary" />
                </div>
              </div>
            </div>
            <h4 className="font-body-md font-bold truncate text-on-surface text-sm md:text-base">{movie.title || movie.name}</h4>
            <div className="flex gap-2 mt-1">
              <span className="text-[10px] text-on-surface-variant border border-white/10 px-1.5 py-0.5 rounded truncate">{movie.release_date?.substring(0,4)}</span>
            </div>
          </Link>
        ))}
      </CarouselContainer>
    </section>
  );

  return (
    <div className="min-h-screen pt-24 pb-20 relative z-10">
      {/* Header */}
      <div className="px-4 md:px-gutter lg:px-container-padding mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="font-display-lg text-2xl md:text-3xl">
          {selectedGenreName ? `${selectedGenreName} Movies` : 'Movies'}
        </h2>
      </div>

      {selectedGenre ? (
        <section className="px-4 md:px-gutter lg:px-container-padding">
          {filterLoading ? (
            <div className="animate-pulse flex items-center justify-center h-40 text-primary">Memuat Filter...</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-card-gap">
              {filteredMovies.map(movie => (
                <Link to={`/movie/${movie.id}`} key={movie.id} className="group cursor-pointer">
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden glass-panel bloom-hover mb-3">
                    <img className="w-full h-full object-cover" 
                         src={getImageUrl(movie.poster_path, 'w500')} alt={movie.title || movie.name} />
                    <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform">
                      <div className="flex justify-between items-center">
                        <span className="bg-primary/20 text-primary text-[10px] px-2 py-0.5 rounded border border-primary/30 uppercase flex items-center gap-1">
                          <Star size={10} className="fill-primary" /> {movie.vote_average?.toFixed(1)}
                        </span>
                        <PlayCircle size={20} className="text-primary" />
                      </div>
                    </div>
                  </div>
                  <h4 className="font-body-md font-bold truncate text-on-surface text-sm md:text-base">{movie.title || movie.name}</h4>
                </Link>
              ))}
            </div>
          )}
        </section>
      ) : (
        <>
          {/* Hero Section */}
          <section className="mx-4 md:mx-gutter lg:mx-container-padding mb-section-margin relative h-[50vh] md:h-[65vh] rounded-2xl md:rounded-[3rem] overflow-hidden flex flex-col justify-end shadow-2xl">
        {loading ? (
          <div className="w-full h-full rounded-lg glass-panel animate-pulse flex items-center justify-center text-primary">Memuat Film...</div>
        ) : trending.length > 0 && (
          <>
            <div className="absolute inset-0 z-0">
              <div className="w-full h-full bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" 
                   style={{ backgroundImage: `url('${getImageUrl(trending[0].backdrop_path)}')` }}></div>
              <div className="absolute inset-0 hero-gradient"></div>
            </div>
            <div className="relative z-10 p-6 md:p-12 lg:p-container-padding max-w-2xl">
              <span className="inline-block px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary font-label-sm text-[10px] md:text-label-sm mb-4 uppercase tracking-widest">
                Featured Premiere
              </span>
              <h1 className="font-display-lg text-[28px] md:text-display-lg mb-2 md:mb-4 text-primary leading-tight">
                {trending[0].title || trending[0].name}
              </h1>
              <p className="font-body-md md:font-body-lg text-[14px] md:text-body-lg mb-6 md:mb-8 text-on-surface-variant leading-relaxed line-clamp-2 md:line-clamp-3">
                {trending[0].overview}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <Link to={`/play/${trending[0].id}`} className="bg-gradient-to-r from-primary to-secondary text-on-primary px-6 md:px-8 py-3 rounded-full font-body-md font-bold flex items-center justify-center gap-2 bloom-hover">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                  Watch Now
                </Link>
                <Link to={`/movie/${trending[0].id}`} className="glass-panel text-on-surface px-6 md:px-8 py-3 rounded-full font-body-md font-bold flex items-center justify-center gap-2 bloom-hover">
                  <span className="material-symbols-outlined">info</span>
                  More Info
                </Link>
              </div>
            </div>
          </>
        )}
      </section>

      {!loading && (
        <>
          {/* Install App Tip Banner */}
          <section className="px-4 md:px-gutter lg:px-container-padding mb-8">
            <div className="glass-panel p-4 md:p-6 rounded-2xl bg-gradient-to-r from-primary/10 to-transparent border border-primary/20 flex flex-col sm:flex-row items-center gap-4 sm:justify-between shadow-[0_0_20px_rgba(212,165,255,0.1)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-[50px] pointer-events-none"></div>
              <div className="flex items-center gap-4 z-10">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0 border border-primary/30 text-primary">
                  <span className="material-symbols-outlined text-2xl">install_mobile</span>
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm md:text-base mb-1">Tips: Install Aetheric di HP Lu! 📱</h3>
                  <p className="text-on-surface-variant text-xs md:text-sm">Biar nonton makin mulus ala Netflix, klik menu browser (titik tiga) lalu pilih <strong>"Add to Home screen"</strong> (Tambahkan ke Layar Utama).</p>
                </div>
              </div>
            </div>
          </section>

          {renderContinueWatchingRow("Continue Watching", watchHistory)}
          {renderMovieRow("Trending Now", trending.slice(1))}
          {renderMovieRow("Popular Movies", popular)}
          {renderMovieRow("Top Rated", topRated)}
        </>
      )}
        </>
      )}
    </div>
  );
}
