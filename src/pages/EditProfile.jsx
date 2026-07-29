import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateUser } from '../services/db';

export default function EditProfile() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsed = JSON.parse(userData);
      setUser(parsed);
      setName(parsed.name || '');
      setEmail(parsed.email || '');
      setAvatar(parsed.avatar || '');
    } else {
      navigate('/auth');
    }
  }, [navigate]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;
    
    const updatedUser = { ...user, name, email, avatar };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Sync to database if user has an ID
    if (user.id) {
      try {
        await updateUser(user.id, updatedUser);
      } catch (err) {
        console.error("Failed to sync profile to database", err);
      }
    }
    
    // Dispatch storage event so navbar updates
    window.dispatchEvent(new Event('storage'));
    
    navigate('/profile');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen text-on-background sky-bg relative pt-28">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-white/5 blur-[100px] moon-glow"></div>
      </div>

      <main className="max-w-3xl mx-auto px-6 relative z-10">
        <div className="mb-10">
          <h2 className="font-display-lg text-4xl font-bold text-primary mb-2">Edit Profile</h2>
          <p className="text-on-surface-variant">Update your cosmic identity.</p>
        </div>

        <div className="glass-panel p-8 md:p-10 rounded-2xl">
          <form onSubmit={handleSave} className="flex flex-col gap-8">
            {/* Avatar Preview */}
            <div className="flex flex-col items-center gap-4">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20 shadow-[0_0_40px_rgba(212,165,255,0.3)]">
                <img 
                  className="w-full h-full object-cover" 
                  alt="Avatar Preview" 
                  src={avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuAsftGrJxsYJC2dT0xRVHDEXvWnddPLAT67n3TXRk6mYpr7sbtCqnMuf49h0Xi2un3m1RBNUQuyP-7z4zkR98-FZs5mzoWWHKNimR3cQaB_DV2pP7DrTZ3bsBo28r3ZDJAILGdOyHhTNuX5i34nz2QDGDChqv1R-rsfgaBTSppI--Rb6eccXXTNUqZ83E8SGFlmPEqOrAptqyJ1YtjCHkVHXRR0VNCmtrHt97OuI_cig3b-vDMzAy7qgQ"} 
                  onError={(e) => { e.target.src = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAsftGrJxsYJC2dT0xRVHDEXvWnddPLAT67n3TXRk6mYpr7sbtCqnMuf49h0Xi2un3m1RBNUQuyP-7z4zkR98-FZs5mzoWWHKNimR3cQaB_DV2pP7DrTZ3bsBo28r3ZDJAILGdOyHhTNuX5i34nz2QDGDChqv1R-rsfgaBTSppI--Rb6eccXXTNUqZ83E8SGFlmPEqOrAptqyJ1YtjCHkVHXRR0VNCmtrHt97OuI_cig3b-vDMzAy7qgQ' }}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 items-start">
              <label className="font-label-sm text-on-surface-variant/80 uppercase ml-1 tracking-wider">Profile Photo</label>
              <label className="cursor-pointer group flex items-center gap-3 bg-surface-container-lowest/40 border border-white/10 hover:border-primary/50 rounded-xl px-6 py-3 transition-all">
                <span className="material-symbols-outlined text-primary">upload_file</span>
                <span className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">Choose from laptop...</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageUpload} 
                />
              </label>
              <p className="text-xs text-on-surface-variant ml-1 mt-1">Select an image from your computer to update your avatar.</p>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-label-sm text-on-surface-variant/80 uppercase ml-1 tracking-wider" htmlFor="displayName">Display Name</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-primary transition-colors">person</span>
                <input 
                  className="w-full bg-surface-container-lowest/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all" 
                  id="displayName" 
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-label-sm text-on-surface-variant/80 uppercase ml-1 tracking-wider" htmlFor="email">Email</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-primary transition-colors">mail</span>
                <input 
                  className="w-full bg-surface-container-lowest/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all" 
                  id="email" 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-4">
              <button 
                type="button" 
                onClick={() => navigate('/profile')}
                className="px-6 py-3 rounded-xl font-bold text-sm bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-on-surface"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-8 py-3 gradient-btn rounded-xl font-bold transition-all bloom-hover"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
