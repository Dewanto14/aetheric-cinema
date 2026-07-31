import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [isTwilightMode, setIsTwilightMode] = useState(true);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isBillingModalOpen, setIsBillingModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      } else {
        navigate('/auth');
      }
    };
    
    loadUser();
    
    // Listen for storage changes from Player or other tabs
    window.addEventListener('storage', loadUser);
    
    // Also poll every 10 seconds just in case it updates in the same window
    const interval = setInterval(loadUser, 10000);
    
    return () => {
      window.removeEventListener('storage', loadUser);
      clearInterval(interval);
    };
  }, [navigate]);

  const handleUpdateSetting = (key, value) => {
    if (user) {
      const updatedUser = { ...user, [key]: value };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const handleCycleSubtitle = () => {
    const options = ['English', 'Japanese', 'Indonesian', 'Off'];
    const current = user?.subtitle || 'English';
    const nextIdx = (options.indexOf(current) + 1) % options.length;
    handleUpdateSetting('subtitle', options[nextIdx]);
  };

  const handleCycleQuality = () => {
    const options = ['Auto', '1080p', '4K HDR'];
    const current = user?.quality || '4K HDR';
    const nextIdx = (options.indexOf(current) + 1) % options.length;
    handleUpdateSetting('quality', options[nextIdx]);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    // Dispatch an event so Navbar updates immediately
    window.dispatchEvent(new Event('storage'));
    navigate('/auth');
  };

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  const handleToggleTwilight = () => {
    setIsTwilightMode(!isTwilightMode);
    if (isTwilightMode) {
      document.documentElement.classList.remove('dark');
      document.body.style.filter = 'none';
    } else {
      document.documentElement.classList.add('dark');
      // Simulate adaptive blue light filter
      document.body.style.filter = 'sepia(30%) hue-rotate(-20deg)';
    }
  };

  const formatMemberSince = (dateString) => {
    if (!dateString) return 'Oct 2023';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  if (!user) return null;

  return (
    <div className="text-body-md min-h-screen sky-bg relative pt-28">
      {/* Atmospheric Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-white/5 blur-[100px] moon-glow"></div>
        <div className="absolute top-[20%] left-[5%] w-[400px] h-[200px] bg-white/5 rounded-full blur-[80px] animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-[10%] right-[15%] w-[500px] h-[250px] bg-primary/5 rounded-full blur-[90px] animate-pulse" style={{ animationDuration: '12s' }}></div>
      </div>

      {/* Main Content Canvas */}
      <main className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h2 className="font-display-lg text-4xl font-bold text-primary mb-2">Account Settings</h2>
            <p className="text-on-surface-variant max-w-md">Customize your cinematic journey through the twilight. Manage your profile, subscription, and preferences here.</p>
          </div>
          <div className="flex gap-4">
            <button onClick={handleEditProfile} className="px-6 py-3 rounded-full font-bold text-sm bg-white/5 border border-white/10 hover:bg-white/10 transition-all bloom-hover flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">edit</span>
              Edit Profile
            </button>
            <button onClick={handleLogout} className="px-6 py-3 rounded-full font-bold text-sm bg-error/10 text-error border border-error/20 hover:bg-error/20 transition-all flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">logout</span>
              Log Out
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section (Left Column) */}
          <div className="lg:col-span-1 space-y-8">
            <section className="glass-panel p-8 rounded-lg flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20 shadow-[0_0_40px_rgba(212,165,255,0.3)]">
                  <img className="w-full h-full object-cover" alt="Profile" src={user.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuAsftGrJxsYJC2dT0xRVHDEXvWnddPLAT67n3TXRk6mYpr7sbtCqnMuf49h0Xi2un3m1RBNUQuyP-7z4zkR98-FZs5mzoWWHKNimR3cQaB_DV2pP7DrTZ3bsBo28r3ZDJAILGdOyHhTNuX5i34nz2QDGDChqv1R-rsfgaBTSppI--Rb6eccXXTNUqZ83E8SGFlmPEqOrAptqyJ1YtjCHkVHXRR0VNCmtrHt97OuI_cig3b-vDMzAy7qgQ"} />
                </div>
                <button onClick={handleEditProfile} className="absolute bottom-1 right-1 bg-primary text-on-primary p-2 rounded-full shadow-lg hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-sm">photo_camera</span>
                </button>
              </div>
              <h3 className="font-headline-md text-2xl font-bold mb-1">{user.name || 'Elias Thorne'}</h3>
              <p className="text-on-surface-variant font-label-sm text-xs uppercase tracking-tighter mb-6">{user.email || 'stardust@aetheric.io'}</p>
              
              <div className="w-full space-y-3">
                <div className="flex justify-between items-center text-sm p-3 rounded-xl bg-white/5">
                  <span className="text-on-surface-variant">Member Since</span>
                  <span className="font-bold">{formatMemberSince(user.memberSince)}</span>
                </div>
                <div className="flex justify-between items-center text-sm p-3 rounded-xl bg-white/5">
                  <span className="text-on-surface-variant">Watch Time</span>
                  <span className="font-bold">{user.watchTime !== undefined ? `${Math.floor(user.watchTime / 60)} hrs ${user.watchTime % 60} mins` : '0 hrs 0 mins'}</span>
                </div>
              </div>
            </section>

            <section className="glass-panel p-8 rounded-lg">
              <h4 className="font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary">workspace_premium</span>
                Current Plan
              </h4>
              <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 mb-4">
                <p className="text-xs text-primary font-bold uppercase mb-1">Twilight Premium</p>
                <p className="text-xl font-bold">$14.99/mo</p>
                <p className="text-xs text-on-surface-variant mt-2">Next billing: Nov 14, 2024</p>
              </div>
              <button onClick={() => setIsPremiumModalOpen(true)} className="w-full py-3 gradient-btn rounded-xl font-bold transition-all bloom-hover">
                Upgrade Plan
              </button>
            </section>
          </div>

          {/* Settings Categories (Right Column) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Category: Subscription */}
            <div className="space-y-4">
              <h4 className="font-label-sm text-xs text-on-surface-variant/60 uppercase tracking-widest ml-2">Subscription & Billing</h4>
              <div className="flex flex-col gap-2">
                <div onClick={() => setIsPaymentModalOpen(true)} className="glass-panel p-5 rounded-lg flex items-center justify-between hover:bg-white/10 cursor-pointer transition-all">
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-primary">credit_card</span>
                    <div>
                      <p className="font-bold">Payment Methods</p>
                      <p className="text-xs text-on-surface-variant">Visa ending in 4421</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
                </div>
                <div onClick={() => setIsBillingModalOpen(true)} className="glass-panel p-5 rounded-lg flex items-center justify-between hover:bg-white/10 cursor-pointer transition-all">
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-primary">receipt_long</span>
                    <div>
                      <p className="font-bold">Billing History</p>
                      <p className="text-xs text-on-surface-variant">View all past invoices</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
                </div>
              </div>
            </div>

            {/* Category: Playback */}
            <div className="space-y-4">
              <h4 className="font-label-sm text-xs text-on-surface-variant/60 uppercase tracking-widest ml-2">Playback & Display</h4>
              <div className="flex flex-col gap-2">
                <div onClick={handleCycleQuality} className="glass-panel p-5 rounded-lg flex items-center justify-between hover:bg-white/10 cursor-pointer transition-all select-none">
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-tertiary">high_quality</span>
                    <div>
                      <p className="font-bold">Streaming Quality</p>
                      <p className="text-xs text-on-surface-variant">Current: {user?.quality || '4K HDR'}</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant">tune</span>
                </div>
                
                <div onClick={handleCycleSubtitle} className="glass-panel p-5 rounded-lg flex items-center justify-between hover:bg-white/10 cursor-pointer transition-all select-none">
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-tertiary">subtitles</span>
                    <div>
                      <p className="font-bold">Captions & Audio</p>
                      <p className="text-xs text-on-surface-variant">Language: {user?.subtitle || 'English'}</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
                </div>

                <div onClick={handleToggleTwilight} className="glass-panel p-5 rounded-lg flex items-center justify-between hover:bg-white/10 cursor-pointer transition-all select-none">
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-tertiary">nights_stay</span>
                    <div>
                      <p className="font-bold">Twilight Mode</p>
                      <p className="text-xs text-on-surface-variant">Adaptive blue-light filter</p>
                    </div>
                  </div>
                  <div className={`w-10 h-6 rounded-full relative flex items-center px-1 transition-colors ${isTwilightMode ? 'bg-primary' : 'bg-white/20'}`}>
                    <div className={`w-4 h-4 rounded-full absolute transition-all ${isTwilightMode ? 'right-1 bg-on-primary' : 'left-1 bg-white'}`}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Category: Privacy */}
            <div className="space-y-4">
              <h4 className="font-label-sm text-xs text-on-surface-variant/60 uppercase tracking-widest ml-2">Privacy & Security</h4>
              <div className="flex flex-col gap-2">
                <div onClick={() => navigate('/reset-password')} className="glass-panel p-5 rounded-lg flex items-center justify-between hover:bg-white/10 cursor-pointer transition-all">
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-secondary">security</span>
                    <div>
                      <p className="font-bold">Account Security (Reset Password)</p>
                      <p className="text-xs text-on-surface-variant">Update your password</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
                </div>
                
                <div className="glass-panel p-5 rounded-lg flex items-center justify-between hover:bg-white/10 cursor-pointer transition-all">
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-secondary">visibility_off</span>
                    <div>
                      <p className="font-bold">Privacy Settings</p>
                      <p className="text-xs text-on-surface-variant">Profile visibility: Friends Only</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
                </div>
              </div>
            </div>

            {/* Category: Support */}
            <div className="space-y-4">
              <h4 className="font-label-sm text-xs text-on-surface-variant/60 uppercase tracking-widest ml-2">Support</h4>
              <div className="flex flex-col gap-2">
                <div onClick={() => navigate('/help')} className="glass-panel p-5 rounded-lg flex items-center justify-between hover:bg-white/10 cursor-pointer transition-all">
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-on-surface-variant">help</span>
                    <div>
                      <p className="font-bold">Help Center</p>
                      <p className="text-xs text-on-surface-variant">FAQs and troubleshooting</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant">open_in_new</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <footer className="flex flex-col items-center gap-4 mt-16 w-full py-12 border-t border-white/5 opacity-80 hover:opacity-100 transition-opacity">
          <div className="font-headline-md text-2xl text-primary">Aetheric Cinema</div>
          <p className="font-label-sm text-xs text-on-surface-variant">© 2024 Aetheric Cinema. Drift into the clouds.</p>
          <div className="flex gap-6">
            <Link to="/help" className="text-on-surface-variant hover:text-tertiary transition-colors font-label-sm text-xs">Privacy Policy</Link>
            <Link to="/help" className="text-on-surface-variant hover:text-tertiary transition-colors font-label-sm text-xs">Terms of Service</Link>
            <Link to="/help" className="text-on-surface-variant hover:text-tertiary transition-colors font-label-sm text-xs">Help Center</Link>
            <Link to="/help" className="text-on-surface-variant hover:text-tertiary transition-colors font-label-sm text-xs">Contact</Link>
          </div>
        </footer>
      </main>

      {/* Premium Upgrade Modal */}
      {isPremiumModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
          <div className="glass-panel w-full max-w-lg rounded-2xl p-8 relative border border-white/20 shadow-[0_0_80px_rgba(212,165,255,0.3)]">
            <button onClick={() => setIsPremiumModalOpen(false)} className="absolute top-4 right-4 text-on-surface-variant hover:text-white transition-colors">
              <span className="material-symbols-outlined">close</span>
            </button>
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-primary text-3xl">workspace_premium</span>
              </div>
              <h3 className="font-display-lg text-2xl md:text-3xl font-bold text-white mb-2">Upgrade to Twilight Premium</h3>
              <p className="text-on-surface-variant text-sm">Experience Aetheric Cinema without limits.</p>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-tertiary">check_circle</span>
                <span className="text-white text-sm">Ad-free streaming across all devices</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-tertiary">check_circle</span>
                <span className="text-white text-sm">Unlock 4K HDR & Dolby Atmos</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-tertiary">check_circle</span>
                <span className="text-white text-sm">Unlimited Watch History & Playlists</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-tertiary">check_circle</span>
                <span className="text-white text-sm">Priority Support</span>
              </div>
            </div>
            
            <button onClick={() => { alert('Redirecting to payment gateway...'); setIsPremiumModalOpen(false); }} className="w-full py-4 bg-gradient-to-r from-primary to-inverse-primary rounded-xl font-bold text-white shadow-[0_0_20px_rgba(212,165,255,0.4)] hover:shadow-[0_0_30px_rgba(212,165,255,0.6)] transition-all">
              Start Free Trial - $14.99/mo
            </button>
            <p className="text-center text-[10px] text-on-surface-variant mt-4">Cancel anytime. Terms and conditions apply.</p>
          </div>
        </div>
      )}

      {/* Payment Methods Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
          <div className="glass-panel w-full max-w-lg rounded-2xl p-8 relative border border-white/20 shadow-[0_0_80px_rgba(212,165,255,0.3)] animate-in fade-in zoom-in-95">
            <button onClick={() => setIsPaymentModalOpen(false)} className="absolute top-4 right-4 text-on-surface-variant hover:text-white transition-colors">
              <span className="material-symbols-outlined">close</span>
            </button>
            <h3 className="font-display-lg text-2xl font-bold text-white mb-6">Payment Methods</h3>
            
            <div className="space-y-4 mb-6">
              <div className="bg-primary/10 border border-primary/30 p-4 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-primary text-3xl">credit_card</span>
                  <div>
                    <p className="font-bold">Visa ending in 4421</p>
                    <p className="text-xs text-on-surface-variant">Expires 12/2026</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-primary bg-primary/20 px-2 py-1 rounded">DEFAULT</span>
              </div>
            </div>
            
            <button onClick={() => { alert('Adding new payment method... (Simulated)'); setIsPaymentModalOpen(false); }} className="w-full py-3 bg-white/5 border border-white/20 rounded-xl font-bold text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-sm">add</span> Add New Card
            </button>
          </div>
        </div>
      )}

      {/* Billing History Modal */}
      {isBillingModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
          <div className="glass-panel w-full max-w-lg rounded-2xl p-8 relative border border-white/20 shadow-[0_0_80px_rgba(212,165,255,0.3)] animate-in fade-in zoom-in-95">
            <button onClick={() => setIsBillingModalOpen(false)} className="absolute top-4 right-4 text-on-surface-variant hover:text-white transition-colors">
              <span className="material-symbols-outlined">close</span>
            </button>
            <h3 className="font-display-lg text-2xl font-bold text-white mb-6">Billing History</h3>
            
            <div className="overflow-hidden rounded-xl border border-white/10 bg-surface-container-lowest/50">
              <table className="w-full text-sm text-left">
                <thead className="bg-white/5 text-xs text-on-surface-variant uppercase border-b border-white/10">
                  <tr>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3 text-right">Invoice</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-4 text-on-surface">Oct 14, 2024</td>
                    <td className="px-4 py-4 font-bold text-primary">$14.99</td>
                    <td className="px-4 py-4 text-right">
                      <button onClick={() => alert('Downloading invoice...')} className="text-tertiary hover:text-white transition-colors"><span className="material-symbols-outlined text-sm">download</span></button>
                    </td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-4 text-on-surface">Sep 14, 2024</td>
                    <td className="px-4 py-4 font-bold text-primary">$14.99</td>
                    <td className="px-4 py-4 text-right">
                      <button onClick={() => alert('Downloading invoice...')} className="text-tertiary hover:text-white transition-colors"><span className="material-symbols-outlined text-sm">download</span></button>
                    </td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-4 text-on-surface">Aug 14, 2024</td>
                    <td className="px-4 py-4 font-bold text-primary">$14.99</td>
                    <td className="px-4 py-4 text-right">
                      <button onClick={() => alert('Downloading invoice...')} className="text-tertiary hover:text-white transition-colors"><span className="material-symbols-outlined text-sm">download</span></button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
