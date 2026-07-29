import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getTrendingTV, getPopularTV, getImageUrl } from '../services/tmdb';
import { PlayCircle, Star } from 'lucide-react';
import CarouselContainer from '../components/CarouselContainer';

export default function TVShows() {
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getTrendingTV(),
      getPopularTV()
    ]).then(([trendingData, popularData]) => {
      setTrending(trendingData.results);
      setPopular(popularData.results);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const renderTVRow = (title, shows) => (
    <section className="px-container-padding space-y-gutter">
      <h3 className="font-headline-md text-primary text-2xl">{title}</h3>
      <CarouselContainer className="gap-gutter pb-8 no-scrollbar scroll-smooth">
        {shows.map(show => (
          <Link to={`/tv/${show.id}`} key={show.id} className="min-w-[240px] w-[240px] space-y-4 group cursor-pointer block">
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden poster-glow">
              <img className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110" 
                   src={getImageUrl(show.poster_path, 'w500')} alt={show.name} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-6 pb-8">
                 <PlayCircle size={48} className="text-white drop-shadow-lg" />
              </div>
            </div>
            <div className="px-2">
              <h4 className="font-bold text-on-surface text-body-lg truncate">{show.name}</h4>
              <p className="text-on-surface-variant text-body-md truncate flex items-center gap-1">
                <Star size={14} className="text-tertiary fill-tertiary" /> {show.vote_average?.toFixed(1)}
              </p>
            </div>
          </Link>
        ))}
      </CarouselContainer>
    </section>
  );

  return (
    <div className="min-h-screen pt-28 pb-20 space-y-section-margin relative z-10">
      <div className="px-container-padding text-center max-w-3xl mx-auto space-y-4">
        <h1 className="font-display-lg text-4xl text-primary">Explore TV Shows</h1>
        <p className="text-on-surface-variant">Binge-worthy series and trending episodic dreams.</p>
      </div>

      {!loading ? (
        <>
          {renderTVRow("Trending TV Shows", trending)}
          {renderTVRow("Popular TV Shows", popular)}
        </>
      ) : (
        <div className="text-center text-primary">Memuat Serial TV...</div>
      )}
    </div>
  );
}
