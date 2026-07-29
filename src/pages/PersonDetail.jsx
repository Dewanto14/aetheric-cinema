import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPersonDetails, getImageUrl } from '../services/tmdb';
import { Star, PlayCircle } from 'lucide-react';

export default function PersonDetail() {
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getPersonDetails(id).then(data => {
      setPerson(data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-primary text-xl">Memuat Profil...</div>;
  }

  if (!person) {
    return <div className="min-h-screen flex items-center justify-center text-error">Profil tidak ditemukan.</div>;
  }

  const credits = person.combined_credits?.cast || [];
  // Sort by popularity or release date to show the best works
  const sortedCredits = credits.sort((a, b) => b.popularity - a.popularity).slice(0, 20);

  return (
    <div className="min-h-screen pt-28 pb-20 px-container-padding max-w-7xl mx-auto relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
        {/* Sidebar: Profile Picture & Info */}
        <aside className="md:col-span-4 lg:col-span-3 flex flex-col gap-6">
          <div className="rounded-2xl overflow-hidden glass-panel border border-white/10 shadow-[0_0_30px_rgba(212,165,255,0.1)]">
            <img 
              src={getImageUrl(person.profile_path, 'h632')} 
              alt={person.name} 
              className="w-full object-cover aspect-[2/3]" 
            />
          </div>
          <div className="glass-panel p-6 rounded-xl flex flex-col gap-4">
            <h3 className="text-white font-bold text-lg mb-2 border-b border-white/10 pb-2">Personal Info</h3>
            <div>
              <span className="text-on-surface-variant text-xs block mb-1">Known For</span>
              <span className="text-white text-sm">{person.known_for_department}</span>
            </div>
            {person.birthday && (
              <div>
                <span className="text-on-surface-variant text-xs block mb-1">Birthdate</span>
                <span className="text-white text-sm">{person.birthday}</span>
              </div>
            )}
            {person.place_of_birth && (
              <div>
                <span className="text-on-surface-variant text-xs block mb-1">Place of Birth</span>
                <span className="text-white text-sm">{person.place_of_birth}</span>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content: Bio & Known For */}
        <div className="md:col-span-8 lg:col-span-9 flex flex-col gap-8">
          <div className="space-y-4">
            <h1 className="font-display-lg text-4xl lg:text-5xl text-primary text-glow leading-tight">
              {person.name}
            </h1>
            {person.biography && (
              <div className="glass-panel p-6 rounded-xl">
                <h3 className="text-white font-bold text-headline-md mb-4">Biography</h3>
                <p className="text-on-surface-variant leading-relaxed text-sm whitespace-pre-wrap">
                  {person.biography}
                </p>
              </div>
            )}
          </div>

          <div>
            <h3 className="font-display-lg text-2xl text-white mb-6">Known For</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-card-gap">
              {sortedCredits.map(media => (
                <Link to={`/${media.media_type === 'tv' ? 'tv' : 'movie'}/${media.id}`} key={media.id} className="group cursor-pointer">
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden glass-panel bloom-hover mb-3">
                    <img className="w-full h-full object-cover" 
                         src={getImageUrl(media.poster_path, 'w300')} alt={media.title || media.name} />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center p-4">
                      <PlayCircle size={32} className="text-primary mb-2" />
                      <span className="text-white text-xs text-center font-bold">{media.character}</span>
                    </div>
                  </div>
                  <h4 className="font-body-md font-bold truncate text-on-surface text-sm">{media.title || media.name}</h4>
                  <div className="flex gap-2 mt-1 items-center">
                    <span className="text-[10px] text-on-surface-variant border border-white/10 px-1.5 py-0.5 rounded truncate">
                      {media.release_date?.substring(0,4) || media.first_air_date?.substring(0,4)}
                    </span>
                    <span className="text-tertiary text-[10px] flex items-center gap-1">
                      <Star size={10} className="fill-tertiary" /> {media.vote_average?.toFixed(1)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
