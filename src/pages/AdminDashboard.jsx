import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getContactMessages, getTotalUserCount, getAllUsers } from '../services/db';

export default function AdminDashboard() {
  const [messages, setMessages] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [usersList, setUsersList] = useState([]);
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/auth', { replace: true });
      return;
    }
    
    const user = JSON.parse(userStr);
    if (user.email?.toLowerCase() !== 'dewantomaulana14@gmail.com') {
      navigate('/', { replace: true }); // Not admin
      return;
    }

    // Fetch data
    const fetchData = async () => {
      try {
        const msgs = await getContactMessages();
        const users = await getAllUsers();
        setMessages(msgs);
        setUsersList(users);
        setUserCount(users.length);
      } catch (error) {
        console.error("Error fetching admin data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  return (
    <div className="pt-24 min-h-screen px-6 md:px-12 bg-background font-body text-on-surface">
      <main className="max-w-6xl mx-auto">
        <h1 className="font-display-lg text-4xl text-primary font-bold mb-2">Admin Command Center</h1>
        <p className="text-on-surface-variant font-body-md mb-8">Welcome back, Boss. Here is the latest intel.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Stats Cards */}
          <div onClick={() => setShowUsersModal(true)} className="glass-panel-elevated p-6 rounded-2xl border border-primary/30 relative overflow-hidden group cursor-pointer hover:border-primary/60 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/40 transition-colors"></div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-2xl">group</span>
              </div>
              <div>
                <p className="text-on-surface-variant text-sm font-bold uppercase tracking-wider flex items-center gap-2">Total Registered Users <span className="material-symbols-outlined text-[14px]">open_in_new</span></p>
                <div className="flex items-end gap-2">
                  <p className="font-display-lg text-4xl text-white font-bold">{isLoading ? '...' : userCount}</p>
                  <p className="text-xs text-on-surface-variant mb-1">/ 200 Limit</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="glass-panel-elevated p-6 rounded-2xl border border-secondary/30 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-secondary/40 transition-colors"></div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-secondary text-2xl">mail</span>
              </div>
              <div>
                <p className="text-on-surface-variant text-sm font-bold uppercase tracking-wider">Total Messages</p>
                <p className="font-display-lg text-4xl text-white font-bold">{isLoading ? '...' : messages.length}</p>
              </div>
            </div>
          </div>
        </div>

        <h2 className="font-headline-md text-2xl text-white font-bold mb-6">Inbox</h2>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="glass-panel p-10 rounded-2xl text-center border border-white/10">
            <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4">drafts</span>
            <p className="text-on-surface-variant font-body-lg">Inbox is empty. It's quiet... too quiet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {messages.map(msg => (
              <div key={msg.id} className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-primary/50 transition-colors group relative overflow-hidden">
                {!msg.read && <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>}
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-white text-lg">{msg.name}</h3>
                      <span className="text-xs px-2 py-1 bg-white/10 rounded-md text-on-surface-variant">{msg.email}</span>
                      {!msg.read && <span className="text-[10px] bg-primary text-on-primary px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">New</span>}
                    </div>
                    <p className="text-on-surface font-body-md whitespace-pre-wrap bg-surface-dim/30 p-4 rounded-xl border border-white/5">{msg.message}</p>
                  </div>
                  <div className="text-xs text-on-surface-variant shrink-0 flex flex-col items-end gap-4">
                    {new Date(msg.createdAt).toLocaleString()}
                    <a href={`mailto:${msg.email}?subject=Re: Aetheric Cinema Support`} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full font-bold transition-colors text-white flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">reply</span>
                      Reply
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Users Modal */}
        {showUsersModal && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-all duration-300">
            <div className="glass-panel-elevated w-full max-w-2xl max-h-[80vh] rounded-2xl p-8 relative flex flex-col border border-primary/30 shadow-[0_0_80px_rgba(212,165,255,0.2)] animate-in fade-in zoom-in-95">
              <button onClick={() => setShowUsersModal(false)} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-on-surface-variant hover:text-white transition-colors">
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
              
              <div className="mb-6 border-b border-white/10 pb-4">
                <h3 className="font-display-lg text-2xl font-bold text-primary flex items-center gap-3">
                  <span className="material-symbols-outlined">group</span>
                  Registered Users Directory
                </h3>
                <p className="text-on-surface-variant text-sm mt-1">Total: {userCount} / 200 users</p>
              </div>
              
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                {usersList.length === 0 ? (
                  <p className="text-center text-on-surface-variant py-8">No users found.</p>
                ) : (
                  usersList.map((u, index) => (
                    <div key={u.id || index} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-primary/30 hover:bg-white/10 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-primary/20 overflow-hidden shrink-0 border border-primary/50">
                        {u.avatar ? (
                          <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-primary font-bold">{u.name?.charAt(0) || '?'}</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-bold truncate">{u.name || 'Unknown Voyager'}</p>
                        <p className="text-on-surface-variant text-xs truncate">{u.email}</p>
                      </div>
                      {u.email?.toLowerCase() === 'dewantomaulana14@gmail.com' && (
                        <span className="px-2 py-1 bg-error/20 text-error rounded-md text-[10px] font-bold uppercase tracking-wider border border-error/30 shrink-0">Admin</span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

      </main>
      
      {/* Footer */}
      <footer className="flex flex-col items-center gap-4 mt-20 w-full py-12 border-t border-white/5 opacity-80 hover:opacity-100 transition-opacity max-w-6xl mx-auto">
        <div className="font-headline-md text-2xl text-primary">Aetheric Cinema</div>
        <p className="font-label-sm text-xs text-on-surface-variant">© 2024 Aetheric Cinema. Admin Dashboard.</p>
      </footer>
    </div>
  );
}
