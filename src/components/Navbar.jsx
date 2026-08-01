import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getLatestNotifications } from '../services/db';
import { Search, Bell, X, Filter, Menu, Film, Tv, PlaySquare, Bookmark, Check } from 'lucide-react';
import { searchMulti, getImageUrl, getGenres, getTVGenres } from '../services/tmdb';

export default function Navbar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [liveNotifications, setLiveNotifications] = useState([]);
  const [hasUnread, setHasUnread] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [genres, setGenres] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const filterRef = useRef(null);
  const notifRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const currentGenreId = new URLSearchParams(location.search).get('genre');
  const showFilter = ['/', '/series', '/anime'].includes(location.pathname);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    let userObj = null;
    if (userData) {
      userObj = JSON.parse(userData);
      setUser(userObj);
    } else {
      setUser(null);
    }
    
    if (location.pathname === '/') {
      getGenres().then(data => setGenres(data.genres || []));
    } else if (location.pathname === '/series') {
      getTVGenres().then(data => setGenres(data.genres || []));
    } else if (location.pathname === '/anime') {
      getTVGenres().then(data => {
        if (data.genres) setGenres(data.genres.filter(g => g.id !== 16));
      });
    }

    const fetchNotifications = async () => {
      try {
        const notifs = await getLatestNotifications();
        setLiveNotifications(notifs);
        const lastRead = localStorage.getItem('lastReadNotificationAt');
        
        if (!lastRead) {
          setHasUnread(true);
        } else if (notifs.length > 0) {
          const latestNotifTime = new Date(notifs[0].createdAt).getTime();
          if (latestNotifTime > parseInt(lastRead)) {
            setHasUnread(true);
          } else {
            setHasUnread(false);
          }
        } else {
          setHasUnread(false);
        }
      } catch (e) {
        console.error("Error fetching notifications", e);
      }
    };
    
    if (userObj) {
      fetchNotifications();
    }
  }, [location.pathname]);

  useEffect(() => {
    if (query.length > 2) {
      const delayDebounceFn = setTimeout(() => {
        searchMulti(query).then(data => {
          setResults(data.results.filter(i => i.media_type === 'movie' || i.media_type === 'tv').slice(0, 5));
        });
      }, 500);
      return () => clearTimeout(delayDebounceFn);
    } else {
      setResults([]);
    }
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchRef, filterRef, notifRef, mobileMenuRef]);

  const handleGenreSelect = (genreId, genreName) => {
    setIsFilterOpen(false);
    if (genreId) {
      navigate({ search: `?genre=${genreId}&name=${encodeURIComponent(genreName)}` });
    } else {
      navigate({ search: '' });
    }
  };

  const handleResultClick = (item) => {
    setIsSearchOpen(false);
    setQuery('');
    navigate(`/${item.media_type === 'tv' ? 'tv' : 'movie'}/${item.id}`);
  };

  const handleMobileMenuClick = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);
    if (newState) {
      setIsFilterOpen(false);
      setIsSearchOpen(false);
      setIsNotifOpen(false);
    }
  };

  const handleFilterClick = () => {
    const newState = !isFilterOpen;
    setIsFilterOpen(newState);
    if (newState) {
      setIsMobileMenuOpen(false);
      setIsSearchOpen(false);
      setIsNotifOpen(false);
    }
  };

  const handleSearchClick = () => {
    setIsSearchOpen(true);
    setIsMobileMenuOpen(false);
    setIsFilterOpen(false);
    setIsNotifOpen(false);
  };

  const handleNotifClick = () => {
    const newState = !isNotifOpen;
    setIsNotifOpen(newState);
    if (newState) {
      setIsMobileMenuOpen(false);
      setIsFilterOpen(false);
      setIsSearchOpen(false);
      setHasUnread(false);
      localStorage.setItem('lastReadNotificationAt', Date.now().toString());
    }
  };

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-[100] glass rounded-full px-4 md:px-8 py-3 flex justify-between items-center shadow-[0_8px_32px_0_rgba(212,165,255,0.15)] hover:backdrop-blur-2xl transition-all duration-300">
      <div className="flex items-center gap-4 md:gap-12">
        <div className="md:hidden relative" ref={mobileMenuRef}>
          <button className="text-on-surface-variant hover:text-primary transition-colors" onClick={handleMobileMenuClick}>
            <Menu size={24} />
          </button>
          
          {/* Premium Mobile Menu Overlay */}
          {isMobileMenuOpen && (
            <div className="absolute top-12 -left-2 w-[260px] glass-panel bg-[#0a061d]/95 backdrop-blur-3xl z-[200] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden border border-white/10">
              <div className="px-5 py-3 border-b border-white/5 bg-white/5">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Navigation</span>
              </div>
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className={`px-5 py-3.5 flex items-center gap-3 transition-colors font-bold ${location.pathname === '/' ? 'text-primary bg-primary/10 border-l-2 border-primary' : 'text-on-surface hover:bg-white/5 hover:text-primary border-l-2 border-transparent'}`}>
                <Film size={18} className={location.pathname === '/' ? 'text-primary' : 'text-on-surface-variant'} />
                Movies
              </Link>
              <Link to="/series" onClick={() => setIsMobileMenuOpen(false)} className={`px-5 py-3.5 flex items-center gap-3 transition-colors font-bold ${location.pathname === '/series' ? 'text-primary bg-primary/10 border-l-2 border-primary' : 'text-on-surface hover:bg-white/5 hover:text-primary border-l-2 border-transparent'}`}>
                <Tv size={18} className={location.pathname === '/series' ? 'text-primary' : 'text-on-surface-variant'} />
                Series
              </Link>
              <Link to="/anime" onClick={() => setIsMobileMenuOpen(false)} className={`px-5 py-3.5 flex items-center gap-3 transition-colors font-bold ${location.pathname === '/anime' ? 'text-primary bg-primary/10 border-l-2 border-primary' : 'text-on-surface hover:bg-white/5 hover:text-primary border-l-2 border-transparent'}`}>
                <PlaySquare size={18} className={location.pathname === '/anime' ? 'text-primary' : 'text-on-surface-variant'} />
                Anime
              </Link>
              <Link to="/mylist" onClick={() => setIsMobileMenuOpen(false)} className={`px-5 py-3.5 flex items-center gap-3 transition-colors font-bold ${location.pathname === '/mylist' ? 'text-primary bg-primary/10 border-l-2 border-primary' : 'text-on-surface hover:bg-white/5 hover:text-primary border-l-2 border-transparent'}`}>
                <Bookmark size={18} className={location.pathname === '/mylist' ? 'text-primary' : 'text-on-surface-variant'} />
                My List
              </Link>
            </div>
          )}
        </div>
        
        <Link to="/" className="font-display-lg text-[20px] md:text-headline-md text-primary drop-shadow-[0_0_8px_rgba(222,183,255,0.5)]">
          Aetheric
        </Link>
        <div className="hidden md:flex gap-8 items-center">
          <Link to="/" className="text-on-surface-variant hover:text-primary transition-colors font-bold">Movies</Link>
          <Link to="/series" className="text-on-surface-variant hover:text-primary transition-colors font-bold">Series</Link>
          <Link to="/anime" className="text-on-surface-variant hover:text-primary transition-colors font-bold">Anime</Link>
          <Link to="/mylist" className="text-on-surface-variant hover:text-primary transition-colors font-bold">My List</Link>
        </div>
      </div>
      
      <div className="flex items-center gap-3 md:gap-6">
        <div className="static md:relative" ref={searchRef}>
          {isSearchOpen ? (
            <div className="absolute inset-0 md:relative md:inset-auto z-[150] flex items-center bg-[#100563] md:bg-surface-container/50 border border-white/10 rounded-full px-4 animate-pulse-slow w-full md:w-auto h-full md:h-auto md:py-1.5">
              <Search size={18} className="text-white/50 md:hidden shrink-0" />
              <input 
                type="text" 
                placeholder="Search dreams..." 
                autoFocus
                className="bg-transparent border-none text-white outline-none flex-1 md:w-48 text-sm px-3 md:px-0"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button onClick={() => { setIsSearchOpen(false); setQuery(''); }} className="text-white/50 hover:text-white p-2 md:p-0 shrink-0">
                <X size={20} className="hidden md:block w-4 h-4" />
                <X size={20} className="md:hidden" />
              </button>
            </div>
          ) : (
            <button onClick={handleSearchClick} className="text-on-surface-variant hover:text-primary transition-colors mt-1">
              <Search size={20}/>
            </button>
          )}

          {/* Search Dropdown */}
          {isSearchOpen && results.length > 0 && (
            <div className="fixed md:absolute top-20 md:top-12 right-[5%] md:right-0 w-[90%] md:w-80 glass-panel bg-[#100563]/95 backdrop-blur-3xl z-[200] rounded-xl shadow-2xl border-white/20 overflow-hidden flex flex-col">
              {results.map(item => (
                <div key={item.id} onClick={() => handleResultClick(item)} className="flex items-center gap-3 p-3 hover:bg-white/10 cursor-pointer transition-colors border-b border-white/5 last:border-0">
                  <img src={getImageUrl(item.poster_path, 'w92')} alt={item.title || item.name} className="w-10 h-14 object-cover rounded shadow-md" />
                  <div className="flex flex-col">
                    <span className="text-white text-sm font-bold truncate w-56">{item.title || item.name}</span>
                    <span className="text-on-surface-variant text-[10px] uppercase">{item.media_type} • {item.release_date?.substring(0,4) || item.first_air_date?.substring(0,4)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {showFilter && (
          <div className="relative" ref={filterRef}>
            <button 
              onClick={handleFilterClick} 
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 ${currentGenreId ? 'bg-primary/20 text-primary border border-primary/30 shadow-[0_0_15px_rgba(212,165,255,0.2)]' : 'text-on-surface-variant hover:text-primary'}`}
            >
              <Filter size={18} />
            </button>
            
            {/* Premium Filter Dropdown */}
            {isFilterOpen && (
              <div className="absolute top-12 -right-[100px] sm:right-0 w-[240px] glass-panel bg-[#0a061d]/95 backdrop-blur-3xl z-[200] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-white/10 overflow-hidden flex flex-col max-h-[70vh] sm:max-h-96">
                <div className="px-5 py-3 border-b border-white/5 bg-white/5 sticky top-0 z-10 backdrop-blur-xl">
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Select Genre</span>
                </div>
                <div className="overflow-y-auto custom-scrollbar p-2">
                  <div 
                    onClick={() => handleGenreSelect(null, null)} 
                    className={`px-3 py-2.5 rounded-xl text-sm cursor-pointer flex items-center justify-between transition-all mb-1 ${!currentGenreId ? 'bg-primary/20 text-primary font-bold shadow-[inset_0_0_15px_rgba(212,165,255,0.15)] border border-primary/20' : 'text-on-surface hover:bg-white/5 hover:text-white'}`}
                  >
                    All Genres
                    {!currentGenreId && <Check size={16} className="text-primary" />}
                  </div>
                  {genres.map(g => (
                    <div 
                      key={g.id} 
                      onClick={() => handleGenreSelect(g.id, g.name)} 
                      className={`px-3 py-2.5 rounded-xl text-sm cursor-pointer flex items-center justify-between transition-all mb-1 ${currentGenreId == g.id ? 'bg-primary/20 text-primary font-bold shadow-[inset_0_0_15px_rgba(212,165,255,0.15)] border border-primary/20' : 'text-on-surface hover:bg-white/5 hover:text-white'}`}
                    >
                      {g.name}
                      {currentGenreId == g.id && <Check size={16} className="text-primary" />}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="relative" ref={notifRef}>
          <button onClick={handleNotifClick} className="text-on-surface-variant hover:text-primary transition-colors relative mt-1">
            <Bell size={20}/>
            {hasUnread && <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full animate-pulse"></span>}
          </button>
          
          {isNotifOpen && (
            <div className="fixed sm:absolute top-20 sm:top-12 right-[5%] sm:right-0 w-[90%] sm:w-80 glass-panel bg-[#100563]/95 backdrop-blur-3xl z-[200] rounded-xl shadow-2xl border-white/20 overflow-hidden flex flex-col">
              <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                <span className="font-bold text-white flex items-center gap-2"><Bell size={16} className="text-primary"/> Notifications</span>
                <button onClick={() => { setHasUnread(false); localStorage.setItem('lastReadNotificationAt', Date.now().toString()); }} className="text-xs text-primary hover:text-white transition-colors">Mark all read</button>
              </div>
              <div className="flex flex-col max-h-80 overflow-y-auto custom-scrollbar">
                {liveNotifications.map((notif) => (
                  <div key={notif.id} className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer flex gap-3 group">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 border border-primary/30">
                      <span className="text-primary text-[14px]">!</span>
                    </div>
                    <div>
                      <p className="text-sm text-white font-bold mb-1">{notif.title}</p>
                      <p className="text-xs text-on-surface-variant line-clamp-2">{notif.message}</p>
                      <p className="text-[10px] text-white/40 mt-2">{new Date(notif.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
                <div onClick={() => { navigate('/profile'); setIsNotifOpen(false); }} className="p-4 hover:bg-white/5 transition-colors cursor-pointer flex gap-3">
                  <div className="w-2 h-2 mt-1.5 rounded-full bg-error shrink-0 animate-pulse shadow-[0_0_8px_rgba(255,0,0,0.8)]"></div>
                  <div>
                    <p className="text-sm text-white font-bold mb-1">Welcome to Aetheric Cinema! 🍿</p>
                    <p className="text-xs text-on-surface-variant">Halo! Saya <strong>Dewanto</strong>, developer di balik web ini. Selamat datang di Aetheric Cinema! Nikmati ribuan film gratis berkualitas HD tanpa batas.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        {user ? (
          <div className="flex items-center gap-3">
            {user.email?.toLowerCase() === 'dewantomaulana14@gmail.com' && (
              <Link to="/admin" className="hidden md:flex px-4 py-1.5 rounded-full bg-error/20 border border-error/50 text-error font-bold hover:bg-error/30 transition-colors text-xs uppercase tracking-wider items-center gap-1 shadow-[0_0_10px_rgba(255,0,0,0.3)]">
                <span className="material-symbols-outlined text-[14px]">shield_person</span>
                Admin
              </Link>
            )}
            <Link to="/profile" className="w-10 h-10 rounded-full bg-primary/20 border-2 border-primary/50 flex items-center justify-center text-primary font-bold hover:scale-110 transition-transform overflow-hidden">
              <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
            </Link>
          </div>
        ) : (
          <Link to="/auth" className="px-4 py-1.5 rounded-full bg-primary/20 border-2 border-primary/50 text-primary font-bold hover:bg-primary/30 transition-colors text-sm">
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}
