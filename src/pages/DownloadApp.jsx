import React from 'react';
import { Download, CheckCircle, ShieldCheck, MonitorPlay, Zap } from 'lucide-react';

export default function DownloadApp() {
  return (
    <div className="min-h-screen pt-[120px] pb-section-margin bg-gradient-to-b from-[#100563] via-[#3e3c8f] to-[#754b9d] text-on-surface">
      <main className="px-4 md:px-container-padding max-w-4xl mx-auto flex flex-col items-center">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary to-tertiary rounded-3xl p-1 shadow-[0_0_40px_rgba(212,165,255,0.4)] mb-6 transform rotate-3 hover:rotate-0 transition-transform duration-300">
            <div className="w-full h-full bg-[#0a061d] rounded-[22px] flex items-center justify-center">
              <span className="font-display-lg text-4xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-tertiary">AC</span>
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl font-headline-md text-white mb-4">Download Aetheric App</h1>
          <p className="text-on-surface-variant max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Dapatkan pengalaman menonton yang lebih cepat, mulus, dan bebas hambatan dengan aplikasi resmi Aetheric Cinema untuk Android.
          </p>
        </div>

        {/* Action Card */}
        <div className="glass-panel w-full p-6 md:p-10 rounded-3xl bg-surface-container-lowest/40 backdrop-blur-3xl border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.5)] relative overflow-hidden mb-12">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 z-10 relative">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-2">Aetheric Cinema v1.0</h2>
              <p className="text-on-surface-variant text-sm mb-6">Ukuran: ~5MB • Format: APK • Android 6.0+</p>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-sm text-white/90">
                  <CheckCircle size={18} className="text-primary" /> Menonton 100% Full Screen
                </li>
                <li className="flex items-center gap-3 text-sm text-white/90">
                  <CheckCircle size={18} className="text-primary" /> Lebih cepat dan ringan dari browser
                </li>
                <li className="flex items-center gap-3 text-sm text-white/90">
                  <CheckCircle size={18} className="text-primary" /> Ikon langsung di layar utama HP Anda
                </li>
              </ul>
            </div>

            <div className="w-full md:w-auto flex flex-col gap-4 shrink-0">
              <a 
                href="/Aetheric-Cinema.apk" 
                download
                className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-primary to-tertiary hover:from-primary/90 hover:to-tertiary/90 text-on-primary rounded-2xl font-bold text-lg transition-all shadow-[0_0_30px_rgba(212,165,255,0.4)] hover:shadow-[0_0_40px_rgba(212,165,255,0.6)] hover:scale-105 flex items-center justify-center gap-3"
              >
                <Download size={24} />
                Download APK
              </a>
              <p className="text-[10px] text-center text-white/50">* Jika ada peringatan keamanan, pilih "Tetap Install"</p>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 text-primary">
              <Zap size={24} />
            </div>
            <h3 className="text-white font-bold mb-2">Ultra Cepat</h3>
            <p className="text-xs text-on-surface-variant">Dioptimalkan penuh untuk Android, memuat film jauh lebih cepat.</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-tertiary/20 flex items-center justify-center mx-auto mb-4 text-tertiary">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-white font-bold mb-2">Aman & Bersih</h3>
            <p className="text-xs text-on-surface-variant">Bebas dari virus berbahaya. Aplikasi ringan tanpa *background process*.</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-blue-400/20 flex items-center justify-center mx-auto mb-4 text-blue-400">
              <MonitorPlay size={24} />
            </div>
            <h3 className="text-white font-bold mb-2">Native Player</h3>
            <p className="text-xs text-on-surface-variant">Pengalaman *streaming* yang dirancang khusus untuk layar sentuh.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
