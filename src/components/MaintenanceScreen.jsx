import React from 'react';

export default function MaintenanceScreen() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center p-6 bg-background/80 backdrop-blur-xl transition-all duration-500 overflow-hidden">
      {/* Animated background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-error/20 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      <div className="glass-panel-elevated p-12 rounded-3xl max-w-2xl w-full text-center relative z-10 border border-error/30 shadow-[0_0_100px_rgba(255,0,0,0.1)]">
        <div className="w-24 h-24 mx-auto bg-error/20 rounded-full flex items-center justify-center mb-8 border border-error/50 shadow-[0_0_30px_rgba(255,0,0,0.4)]">
          <span className="material-symbols-outlined text-5xl text-error">lock</span>
        </div>
        
        <h1 className="font-display-lg text-4xl md:text-5xl font-bold text-white mb-4 tracking-wide">
          Under Maintenance
        </h1>
        
        <p className="font-body-lg text-xl text-on-surface-variant mb-10 leading-relaxed">
          Dewa sedang melakukan perbaikan sistem. Bioskop akan segera kembali!
        </p>

        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-on-surface font-mono text-sm">
          <span className="w-2 h-2 rounded-full bg-error animate-pulse"></span>
          System Lockdown Active
        </div>
      </div>
      
      <footer className="absolute bottom-8 text-center text-on-surface-variant text-xs opacity-60">
        &copy; {new Date().getFullYear()} Aetheric Cinema.
      </footer>
    </div>
  );
}
