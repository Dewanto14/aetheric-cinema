import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ResetPassword() {
  const [user, setUser] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate('/auth');
    }
  }, [navigate]);

  const handleReset = (e) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }
    if (currentPassword === newPassword) {
      setError('New password cannot be the same as the old password.');
      return;
    }

    // In a real app we'd verify currentPassword. For demo, we just update it.
    if (user) {
      const updatedUser = { ...user, password: newPassword }; // mock save
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setSuccess(true);
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen text-on-background sky-bg relative pt-28">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-white/5 blur-[100px] moon-glow"></div>
      </div>

      <main className="max-w-xl mx-auto px-6 relative z-10">
        <div className="mb-10 text-center">
          <h2 className="font-display-lg text-4xl font-bold text-primary mb-2">Reset Password</h2>
          <p className="text-on-surface-variant">Update your account security to stay safe in the cosmos.</p>
        </div>

        <div className="glass-panel p-8 md:p-10 rounded-2xl">
          {success ? (
            <div className="text-center py-10">
              <span className="material-symbols-outlined text-6xl text-tertiary mb-4">check_circle</span>
              <h3 className="text-2xl font-bold text-primary mb-2">Password Updated!</h3>
              <p className="text-on-surface-variant">Your password has been changed successfully. Redirecting...</p>
            </div>
          ) : (
            <form onSubmit={handleReset} className="flex flex-col gap-6">
              
              {error && (
                <div className="bg-error/10 border border-error/20 text-error p-4 rounded-xl flex items-center gap-3">
                  <span className="material-symbols-outlined">error</span>
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <label className="font-label-sm text-on-surface-variant/80 uppercase ml-1 tracking-wider">Current Password</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-primary transition-colors">lock</span>
                  <input 
                    className="w-full bg-surface-container-lowest/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all" 
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-label-sm text-on-surface-variant/80 uppercase ml-1 tracking-wider">New Password</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-primary transition-colors">key</span>
                  <input 
                    className="w-full bg-surface-container-lowest/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all" 
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-label-sm text-on-surface-variant/80 uppercase ml-1 tracking-wider">Confirm New Password</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-primary transition-colors">password</span>
                  <input 
                    className="w-full bg-surface-container-lowest/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all" 
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-6">
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
                  Update Password
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
