import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getTrendingTV, getPopularTV, getTVDetails, discoverTV, getImageUrl } from '../services/tmdb';
import { PlayCircle, Star, Layers } from 'lucide-react';
import CarouselContainer from '../components/CarouselContainer';

export default function Series() {
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [filteredShows, setFilteredShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const selectedGenre = searchParams.get('genre');
  const selectedGenreName = searchParams.get('name');

  useEffect(() => {
    const fetchWithDetails = async (fetchFunc) => {
      const data = await fetchFunc();
      const detailedResults = await Promise.all(
        data.results.slice(0, 15).map(async (show) => {
          try {
            const detail = await getTVDetails(show.id);
            return { ...show, number_of_episodes: detail.number_of_episodes };
          } catch (e) {
            return show;
          }
        })
      );
      return detailedResults;
    };

    Promise.all([
      fetchWithDetails(getTrendingTV),
      fetchWithDetails(getPopularTV)
    ]).then(([trendingData, popularData]) => {
      setTrending(trendingData);
      setPopular(popularData);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (selectedGenre) {
      setFilterLoading(true);
      discoverTV(selectedGenre).then(async data => {
        // Fetch details for episode counts just like the main lists
        const detailedResults = await Promise.all(
          data.results.map(async (show) => {
            try {
              const detail = await getTVDetails(show.id);
              return { ...show, number_of_episodes: detail.number_of_episodes };
            } catch (e) {
              return show;
            }
          })
        );
        setFilteredShows(detailedResults);
        setFilterLoading(false);
      });
    }
  }, [selectedGenre]);

  const renderTVRow = (title, shows, subtext) => (
    <section className="px-gutter mb-12">
      <h2 className="font-headline-md text-headline-md mb-6">{title}</h2>
      <CarouselContainer className="gap-card-gap pb-4 -mx-gutter px-gutter">
        {shows.map(show => (
          <Link to={`/tv/${show.id}`} key={show.id} className="min-w-[200px] w-[200px] group cursor-pointer block">
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden glass-panel bloom-hover mb-3">
              <img className="w-full h-full object-cover" 
                   src={getImageUrl(show.poster_path, 'w500')} alt={show.name} />
              <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform">
                <div className="flex justify-between items-center">
                  <span className="bg-primary/20 text-primary text-[10px] px-2 py-0.5 rounded border border-primary/30 uppercase flex items-center gap-1">
                    <Star size={10} className="fill-primary" /> {show.vote_average?.toFixed(1)}
                  </span>
                  <PlayCircle size={20} className="text-primary" />
                </div>
              </div>
            </div>
            <h4 className="font-body-md font-bold truncate text-on-surface">{show.name}</h4>
            <div className="flex gap-2 mt-1 items-center">
              <span className="text-[10px] text-on-surface-variant border border-white/10 px-1.5 py-0.5 rounded truncate">{show.first_air_date?.substring(0,4)}</span>
              {show.number_of_episodes && (
                <span className="text-[10px] text-tertiary border border-tertiary/30 bg-tertiary/10 px-1.5 py-0.5 rounded flex items-center gap-1">
                  <Layers size={10} /> {show.number_of_episodes} Eps
                </span>
              )}
            </div>
          </Link>
        ))}
      </CarouselContainer>
    </section>
  );

  return (
    <div className="min-h-screen pt-24 pb-20 relative z-10">
      {/* Header */}
      <div className="px-gutter mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="font-display-lg text-3xl">
          {selectedGenreName ? `${selectedGenreName} TV Series` : 'TV Series'}
        </h2>
      </div>

      {selectedGenre ? (
        <section className="px-gutter">
          {filterLoading ? (
            <div className="animate-pulse flex items-center justify-center h-40 text-primary">Memuat Filter...</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-card-gap">
              {filteredShows.map(show => (
                <Link to={`/tv/${show.id}`} key={show.id} className="group cursor-pointer">
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden glass-panel bloom-hover mb-3">
                    <img className="w-full h-full object-cover" 
                         src={getImageUrl(show.poster_path, 'w500')} alt={show.name} />
                    <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform">
                      <div className="flex justify-between items-center">
                        <span className="bg-primary/20 text-primary text-[10px] px-2 py-0.5 rounded border border-primary/30 uppercase flex items-center gap-1">
                          <Star size={10} className="fill-primary" /> {show.vote_average?.toFixed(1)}
                        </span>
                        <PlayCircle size={20} className="text-primary" />
                      </div>
                    </div>
                  </div>
                  <h4 className="font-body-md font-bold truncate text-on-surface">{show.name}</h4>
                  <div className="flex gap-2 mt-1 items-center">
                    <span className="text-[10px] text-on-surface-variant border border-white/10 px-1.5 py-0.5 rounded truncate">{show.first_air_date?.substring(0,4)}</span>
                    {show.number_of_episodes && (
                      <span className="text-[10px] text-tertiary border border-tertiary/30 bg-tertiary/10 px-1.5 py-0.5 rounded flex items-center gap-1">
                        <Layers size={10} /> {show.number_of_episodes} Eps
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      ) : (
        <>
          {/* Hero Section */}
          <section className="px-gutter mb-section-margin relative h-[65vh] rounded-lg overflow-hidden flex flex-col justify-end">
        {loading ? (
          <div className="w-full h-full rounded-lg glass-panel animate-pulse flex items-center justify-center text-primary">Memuat Serial TV...</div>
        ) : trending.length > 0 && (
          <>
            <div className="absolute inset-0 z-0">
              <div className="w-full h-full bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" 
                   style={{ backgroundImage: `url('${getImageUrl(trending[0].backdrop_path)}')` }}></div>
              <div className="absolute inset-0 hero-gradient"></div>
            </div>
            <div className="relative z-10 p-container-padding max-w-2xl">
              <span className="inline-block px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary font-label-sm text-label-sm mb-4 uppercase tracking-widest">
                Featured Tonight
              </span>
              <h1 className="font-display-lg text-display-lg mb-4 text-primary leading-tight">
                {trending[0].name}
              </h1>
              <p className="font-body-lg text-body-lg mb-8 text-on-surface-variant leading-relaxed line-clamp-3">
                {trending[0].overview}
              </p>
              <div className="flex gap-4">
                <Link to={`/play/${trending[0].id}`} className="bg-gradient-to-r from-primary to-secondary text-on-primary px-8 py-3 rounded-full font-body-md font-bold flex items-center gap-2 bloom-hover">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                  Watch Now
                </Link>
                <Link to={`/tv/${trending[0].id}`} className="glass-panel text-on-surface px-8 py-3 rounded-full font-body-md font-bold flex items-center gap-2 bloom-hover">
                  <span className="material-symbols-outlined">add</span>
                  Add to List
                </Link>
              </div>
            </div>
          </>
        )}
      </section>

      {!loading && (
        <>
          {renderTVRow("Trending TV Shows", trending.slice(1), "Trending")}
          {renderTVRow("Popular TV Shows", popular, "Popular")}
        </>
      )}
        </>
      )}
    </div>
  );
}
