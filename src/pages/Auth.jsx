import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { getUserByEmail, createUser } from '../services/db';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname + (location.state?.from?.search || '') || '/profile';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    try {
      let dbUser = await getUserByEmail(email);
      
      if (isLogin) {
        if (!dbUser) {
          setErrorMsg('Account not found. Please register first.');
          return;
        }
      } else {
        if (dbUser) {
          setErrorMsg('Account already exists. Please sign in instead.');
          return;
        }
        // Create new user if not exists and trying to register
        dbUser = await createUser({
          email,
          name: 'Stardust Voyager',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDRHp8BUhbtNBwJd9gSUGt3qNehRdbFWlBFpeW7DW4KsLPAtiaKzzBIxAydSs1Va5umpWSmhirvRir9aqbm0RkPF0EouKR3vNa2pqoB9qdAaHpJdl_tlF0yrbsIz27JqZBFU2AaO31Y3E80IPV6-fAHZs4bsl080KelPCkxK2894H9Qcp5gboKsSOfeJDYEWHMNjjUNL6Bv3hFRSxa2NfRpDJp7itYpk1yPe3oGPpSrwr-OM5u47uz3vA',
          memberSince: new Date().toISOString(),
          watchTime: 0
        });
      }

      // Save to localStorage so app knows we're logged in
      localStorage.setItem('user', JSON.stringify(dbUser));
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Login failed:", error);
      // Fallback if json-server is not running
      localStorage.setItem('user', JSON.stringify({ 
          email, 
          name: 'Stardust Voyager', 
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDRHp8BUhbtNBwJd9gSUGt3qNehRdbFWlBFpeW7DW4KsLPAtiaKzzBIxAydSs1Va5umpWSmhirvRir9aqbm0RkPF0EouKR3vNa2pqoB9qdAaHpJdl_tlF0yrbsIz27JqZBFU2AaO31Y3E80IPV6-fAHZs4bsl080KelPCkxK2894H9Qcp5gboKsSOfeJDYEWHMNjjUNL6Bv3hFRSxa2NfRpDJp7itYpk1yPe3oGPpSrwr-OM5u47uz3vA',
          memberSince: new Date().toISOString(),
          watchTime: 0
      }));
      navigate(from, { replace: true });
    }
  };

  useEffect(() => {
    document.querySelectorAll('.particle').forEach(p => {
        p.style.left = Math.random() * 100 + '%';
        p.style.animationDelay = (Math.random() * 10) + 's';
    });
  }, []);

  const handleMouseMove = (e) => {
    const card = document.querySelector('.glass-card');
    const x = (window.innerWidth / 2 - e.pageX) / 60;
    const y = (window.innerHeight / 2 - e.pageY) / 60;
    if (card) {
        card.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${-y}deg)`;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative twilight-bg" onMouseMove={handleMouseMove}>
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" id="particles-container">
        <div className="particle" style={{left: '10%', width: '4px', height: '4px', animationDuration: '18s', animationDelay: '2s'}}></div>
        <div className="particle" style={{left: '30%', width: '6px', height: '6px', animationDuration: '22s', animationDelay: '5s'}}></div>
        <div className="particle" style={{left: '60%', width: '3px', height: '3px', animationDuration: '15s', animationDelay: '0s'}}></div>
        <div className="particle" style={{left: '80%', width: '5px', height: '5px', animationDuration: '25s', animationDelay: '8s'}}></div>
        <div className="particle" style={{left: '90%', width: '4px', height: '4px', animationDuration: '20s', animationDelay: '12s'}}></div>
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background/90 pointer-events-none z-10"></div>
      
      <main className="relative z-20 w-full max-w-md px-6 py-12 flex flex-col items-center mt-20">
        <div className="mb-10 text-center floating">
          <Link to="/">
            <h1 className="font-display-lg text-[40px] md:text-[48px] tracking-tight mb-2 text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-container to-secondary-fixed-dim drop-shadow-[0_0_15px_rgba(212,165,255,0.4)] hover:scale-105 transition-transform cursor-pointer">
              Aetheric Cinema
            </h1>
          </Link>
          <p className="font-body-md text-primary-fixed-dim/80 italic font-light tracking-wide">Your sanctuary in the clouds.</p>
        </div>
        
        <div className="glass-card w-full rounded-2xl p-8 md:p-10 flex flex-col gap-8 relative overflow-hidden transition-transform duration-300">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary-container/20 rounded-full blur-[50px] pointer-events-none"></div>
          
          <div className="flex p-1 bg-background/40 rounded-full border border-white/5 backdrop-blur-md">
            <button 
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 rounded-full font-label-sm uppercase tracking-wider text-sm transition-all duration-300 ${isLogin ? 'toggle-active' : 'text-on-surface-variant/70 hover:text-on-surface'}`}
            >
              Sign In
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 rounded-full font-label-sm uppercase tracking-wider text-sm transition-all duration-300 ${!isLogin ? 'toggle-active' : 'text-on-surface-variant/70 hover:text-on-surface'}`}
            >
              Register
            </button>
          </div>
          
          <div className="flex flex-col gap-2 text-center">
            <h2 className="font-headline-md text-on-surface text-[28px]">{isLogin ? 'Welcome Back' : 'Join the Stardust'}</h2>
            <p className="font-body-md text-on-surface-variant/80">{isLogin ? 'Step into the stardust.' : 'Create your cinematic sanctuary.'}</p>
          </div>
          
          {errorMsg && (
            <div className="bg-error-container/20 border border-error/50 text-error-container px-4 py-3 rounded-lg text-sm text-center">
              {errorMsg}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="font-label-sm text-on-surface-variant/80 uppercase ml-1 tracking-wider" htmlFor="identifier">Email or Username</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-primary transition-colors">mail</span>
                <input 
                  className="w-full bg-surface-container-lowest/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-on-surface font-body-md input-focus transition-all backdrop-blur-md" 
                  id="identifier" 
                  name="identifier" 
                  placeholder="stardust@lofi.com" 
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center px-1">
                <label className="font-label-sm text-on-surface-variant/80 uppercase tracking-wider" htmlFor="password">Password</label>
                {isLogin && <a className="font-label-sm text-tertiary-fixed-dim hover:text-tertiary transition-all" href="#">Forgot Password?</a>}
              </div>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-primary transition-colors">lock</span>
                <input 
                  className="w-full bg-surface-container-lowest/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-on-surface font-body-md input-focus transition-all backdrop-blur-md" 
                  id="password" 
                  name="password" 
                  placeholder="••••••••" 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            
            {isLogin && (
              <div className="flex items-center gap-3 px-1 mt-[-8px]">
                <div className="relative flex items-center">
                  <input className="peer w-5 h-5 rounded border-white/20 bg-background/30 text-primary-container focus:ring-primary-container/50 focus:ring-offset-background transition-all appearance-none checked:bg-primary-container cursor-pointer" id="remember" type="checkbox"/>
                  <span className="material-symbols-outlined absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[16px] text-on-primary-container opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity">check</span>
                </div>
                <label className="font-body-md text-on-surface-variant/90 select-none cursor-pointer text-[15px]" htmlFor="remember">Keep me in the loop</label>
              </div>
            )}
            
            <button className="bloom-button w-full bg-gradient-to-r from-[#754b9d] to-[#5c3283] text-[#f0dbff] font-headline-md py-4 rounded-xl shadow-[0_4px_20px_rgba(117,75,157,0.4)] transition-all mt-2 border border-white/10" type="submit">
              {isLogin ? 'Sign In' : 'Register'}
            </button>
          </form>
          
          <div className="flex items-center gap-4 my-1">
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent flex-grow"></div>
            <span className="font-label-sm text-on-surface-variant/50 tracking-widest">OR</span>
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent flex-grow"></div>
          </div>
          
          <div className="flex justify-center gap-5">
            <button className="w-14 h-14 rounded-full bg-surface-container-lowest/40 border border-white/10 flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-white/5 transition-all duration-300 group hover:shadow-[0_0_15px_rgba(212,165,255,0.2)]">
              <svg className="w-6 h-6 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            </button>
            <button className="w-14 h-14 rounded-full bg-surface-container-lowest/40 border border-white/10 flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-white/5 transition-all duration-300 group hover:shadow-[0_0_15px_rgba(212,165,255,0.2)]">
              <svg className="w-6 h-6 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.15 2.95.93 3.78 2.04-3.18 1.98-2.65 6.47.53 7.79-.76 1.76-1.78 3.53-2.96 3.18zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.35 2.45-1.87 4.54-3.74 4.25z"/>
              </svg>
            </button>
          </div>
        </div>
      </main>

      <div className="fixed bottom-12 right-12 z-20 md:block hidden">
        <div className="glass-card px-6 py-4 rounded-full flex items-center gap-4 opacity-80 hover:opacity-100 transition-all duration-300 cursor-pointer hover:shadow-[0_0_20px_rgba(234,212,122,0.2)]">
          <span className="material-symbols-outlined text-tertiary drop-shadow-[0_0_8px_rgba(234,212,122,0.6)]">music_note</span>
          <div className="flex flex-col">
            <span className="font-label-sm text-on-surface uppercase leading-none tracking-widest text-[10px]">Now Playing</span>
            <span className="font-body-md text-on-surface-variant text-[13px] mt-1">Sunset Beats • 2:34</span>
          </div>
          <div className="flex gap-[3px] items-end h-4 mb-1 ml-2">
            <div className="w-1 bg-tertiary/80 rounded-t-sm animate-pulse" style={{height: '60%'}}></div>
            <div className="w-1 bg-tertiary/80 rounded-t-sm animate-pulse" style={{height: '100%', animationDelay: '0.2s'}}></div>
            <div className="w-1 bg-tertiary/80 rounded-t-sm animate-pulse" style={{height: '40%', animationDelay: '0.4s'}}></div>
            <div className="w-1 bg-tertiary/80 rounded-t-sm animate-pulse" style={{height: '80%', animationDelay: '0.1s'}}></div>
          </div>
        </div>
      </div>
      
      <footer className="absolute bottom-0 w-full py-8 z-20 pointer-events-none">
        <div className="flex flex-col md:flex-row justify-between items-center px-8 max-w-7xl mx-auto opacity-50">
          <p className="font-body-md text-on-surface-variant/80 text-xs mb-4 md:mb-0">© 2024 Aetheric Cinema. Floating in the lofi sky.</p>
          <div className="flex gap-6 pointer-events-auto">
            <a className="font-body-md text-on-surface-variant/80 text-xs hover:text-tertiary-fixed-dim transition-colors" href="#">Privacy</a>
            <a className="font-body-md text-on-surface-variant/80 text-xs hover:text-tertiary-fixed-dim transition-colors" href="#">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
