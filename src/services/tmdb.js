// src/services/tmdb.js
const BASE_URL = 'https://api.themoviedb.org/3';

export const getApiKey = () => import.meta.env.VITE_TMDB_API_KEY || localStorage.getItem('tmdb_api_key');
export const setApiKey = (key) => localStorage.setItem('tmdb_api_key', key);
export const hasApiKey = () => !!getApiKey();

const fetchFromTMDB = async (endpoint, params = {}) => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('API Key missing');

  const queryParams = new URLSearchParams({ api_key: apiKey, ...params });
  const response = await fetch(`${BASE_URL}${endpoint}?${queryParams}`);
  
  if (!response.ok) {
    throw new Error(`TMDB Error: ${response.statusText}`);
  }
  return response.json();
};

export const getTrendingMovies = () => fetchFromTMDB('/trending/movie/week');
export const getPopularMovies = () => fetchFromTMDB('/movie/popular');
export const getTopRatedMovies = () => fetchFromTMDB('/movie/top_rated');
export const getTrendingTV = () => fetchFromTMDB('/trending/tv/week');
export const getPopularTV = () => fetchFromTMDB('/tv/popular');
export const getAnime = () => fetchFromTMDB('/discover/tv', { with_genres: '16', with_original_language: 'ja' });
export const getMovieDetails = (id) => fetchFromTMDB(`/movie/${id}`, { append_to_response: 'videos,credits,similar' });
export const getTVDetails = (id) => fetchFromTMDB(`/tv/${id}`, { append_to_response: 'videos,credits,similar' });
export const getTVSeason = (id, seasonNumber) => fetchFromTMDB(`/tv/${id}/season/${seasonNumber}`);
export const searchMulti = (query) => fetchFromTMDB('/search/multi', { query });
export const getGenres = () => fetchFromTMDB('/genre/movie/list');
export const getTVGenres = () => fetchFromTMDB('/genre/tv/list');
export const discoverMovies = (genreId) => fetchFromTMDB('/discover/movie', { with_genres: genreId });
export const discoverTV = (genreId) => fetchFromTMDB('/discover/tv', { with_genres: genreId });
export const discoverAnime = (genreId) => fetchFromTMDB('/discover/tv', { with_genres: genreId ? `16,${genreId}` : '16', with_original_language: 'ja' });
export const getPersonDetails = (id) => fetchFromTMDB(`/person/${id}`, { append_to_response: 'combined_credits' });

export const getImageUrl = (path, size = 'original') => path ? `https://image.tmdb.org/t/p/${size}${path}` : '';
