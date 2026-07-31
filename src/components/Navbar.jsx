import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getLatestNotifications } from '../services/db';
import { Search, Bell, X, Filter, Menu } from 'lucide-react';
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
    
    // Fetch genres based on route
    if (location.pathname === '/') {
      getGenres().then(data => setGenres(data.genres || []));
    } else if (location.pathname === '/series') {
      getTVGenres().then(data => setGenres(data.genres || []));
    } else if (location.pathname === '/anime') {
      getTVGenres().then(data => {
        if (data.genres) setGenres(data.genres.filter(g => g.id !== 16));
      });
    }

    // Fetch live notifications
    const fetchNotifications = async () => {
      try {
        const notifs = await getLatestNotifications();
        setLiveNotifications(notifs);
        
        // Check if user has read notifications
        const lastRead = localStorage.getItem('lastReadNotificationAt');
        
        if (!lastRead) {
          // User has never opened notifications, show red dot for the Welcome message
          setHasUnread(true);
        } else if (notifs.length > 0) {
          // Check if there are live notifications newer than the last read time
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
          // Filter to only show movies and tv shows
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
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchRef, filterRef]);

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

  const handleNotifClick = () => {
    const newState = !isNotifOpen;
    setIsNotifOpen(newState);
    if (newState) {
      setHasUnread(false);
      localStorage.setItem('lastReadNotificationAt', Date.now().toString());
    }
  };

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-[100] glass rounded-full px-4 md:px-8 py-3 flex justify-between items-center shadow-[0_8px_32px_0_rgba(212,165,255,0.15)] hover:backdrop-blur-2xl transition-all duration-300">
      <div className="flex items-center gap-4 md:gap-12">
        <button className="md:hidden text-on-surface-variant hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <Menu size={24} />
        </button>
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
        <div className="relative" ref={searchRef}>
          {isSearchOpen ? (
            <div className="flex items-center bg-surface-container/50 border border-white/10 rounded-full px-4 py-1.5 animate-pulse-slow">
              <input 
                type="text" 
                placeholder="Search dreams..." 
                autoFocus
                className="bg-transparent border-none text-white outline-none w-48 text-sm"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button onClick={() => { setIsSearchOpen(false); setQuery(''); }} className="text-white/50 hover:text-white">
                <X size={16} />
              </button>
            </div>
          ) : (
            <button onClick={() => setIsSearchOpen(true)} className="text-on-surface-variant hover:text-primary transition-colors mt-1">
              <Search size={20}/>
            </button>
          )}

          {/* Search Dropdown */}
          {isSearchOpen && results.length > 0 && (
            <div className="absolute top-12 right-0 w-80 glass-panel bg-[#100563]/95 backdrop-blur-3xl z-[200] rounded-xl shadow-2xl border-white/20 overflow-hidden flex flex-col">
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
              onClick={() => setIsFilterOpen(!isFilterOpen)} 
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 ${currentGenreId ? 'bg-primary/20 text-primary border border-primary/30' : 'text-on-surface-variant hover:text-primary'}`}
            >
              <Filter size={18} />
            </button>
            
            {isFilterOpen && (
              <div className="absolute top-12 right-0 w-48 glass-panel bg-[#100563]/95 backdrop-blur-3xl z-[200] rounded-xl shadow-2xl border-white/20 overflow-hidden flex flex-col max-h-80 overflow-y-auto">
                <div 
                  onClick={() => handleGenreSelect(null, null)} 
                  className={`px-4 py-2 text-sm cursor-pointer hover:bg-white/10 transition-colors ${!currentGenreId ? 'bg-primary/20 text-primary font-bold' : 'text-on-surface'}`}
                >
                  All Genres
                </div>
                {genres.map(g => (
                  <div 
                    key={g.id} 
                    onClick={() => handleGenreSelect(g.id, g.name)} 
                    className={`px-4 py-2 text-sm cursor-pointer hover:bg-white/10 transition-colors ${currentGenreId == g.id ? 'bg-primary/20 text-primary font-bold' : 'text-on-surface'}`}
                  >
                    {g.name}
                  </div>
                ))}
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
            <div className="absolute top-12 right-0 w-[300px] sm:w-80 glass-panel bg-[#100563]/95 backdrop-blur-3xl z-[200] rounded-xl shadow-2xl border-white/20 overflow-hidden flex flex-col">
              <div className="p-4 border-b border-white/10 flex justify-between items-center">
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
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="absolute top-16 left-0 w-64 glass-panel bg-[#100563]/95 backdrop-blur-3xl z-[200] rounded-2xl shadow-2xl flex flex-col overflow-hidden md:hidden border-white/20">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="px-6 py-4 text-on-surface hover:bg-white/10 transition-colors font-bold border-b border-white/5">Movies</Link>
          <Link to="/series" onClick={() => setIsMobileMenuOpen(false)} className="px-6 py-4 text-on-surface hover:bg-white/10 transition-colors font-bold border-b border-white/5">Series</Link>
          <Link to="/anime" onClick={() => setIsMobileMenuOpen(false)} className="px-6 py-4 text-on-surface hover:bg-white/10 transition-colors font-bold border-b border-white/5">Anime</Link>
          <Link to="/mylist" onClick={() => setIsMobileMenuOpen(false)} className="px-6 py-4 text-on-surface hover:bg-white/10 transition-colors font-bold">My List</Link>
        </div>
      )}
    </nav>
  );
}
