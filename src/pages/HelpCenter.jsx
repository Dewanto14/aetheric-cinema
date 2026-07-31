import React, { useState, useEffect, useRef } from 'react';

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFaq, setActiveFaq] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isEmailOpen, setIsEmailOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: 'Hello! I am Aetheric Support Bot. How can I assist you today?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isChatOpen]);

  const faqs = [
    // Streaming & Quality
    {
      id: 1,
      question: "How do I change my streaming quality?",
      answer: "To adjust your streaming quality, navigate to your Profile > Settings > Playback. You can select between Auto, 1080p, and 4K HDR depending on your current network connection. (Keywords: streaming, quality, resolution, playback, 4k, hd)"
    },
    {
      id: 2,
      question: "Can I download movies to watch offline?",
      answer: "Yes, premium subscribers can download up to 50 titles for offline viewing. Look for the download icon (a downward arrow) on the movie details page. (Keywords: download, offline, save)"
    },
    {
      id: 3,
      question: "Why is my video buffering constantly?",
      answer: "Buffering usually indicates a slow internet connection. We recommend a minimum of 5 Mbps for HD streaming. Try restarting your router or switching to a lower video quality setting in the player controls. (Keywords: buffering, slow, lag, streaming, playback, support, technical)"
    },
    // Account & Profile
    {
      id: 4,
      question: "How do I reset my password?",
      answer: "If you forgot your password, go to the login page and click 'Forgot Password'. A reset link will be sent to your registered email address. You can also change it in Profile > Security. (Keywords: account, password, reset, login, profile, security)"
    },
    {
      id: 5,
      question: "How do I update my profile picture?",
      answer: "Go to your Profile page and click the camera icon next to your avatar to upload a new image. (Keywords: account, profile, avatar, picture, image)"
    },
    // Subscription & Billing
    {
      id: 6,
      question: "When is my billing cycle?",
      answer: "Your billing cycle starts on the day you subscribe. You can view your exact billing date and past invoices by going to Profile > Subscription & Billing > Billing History. (Keywords: billing, cycle, invoice, subscription, history, payment)"
    },
    {
      id: 7,
      question: "How do I cancel or upgrade my subscription?",
      answer: "To upgrade to Twilight Premium or cancel your current plan, go to your Profile and click on the 'Current Plan' card. (Keywords: subscription, upgrade, cancel, premium, billing, plan)"
    },
    // Technical Support
    {
      id: 8,
      question: "The app crashes when I open it, what do I do?",
      answer: "Please ensure you are using the latest version of your browser. Clearing your browser cache or trying an Incognito window often resolves this issue. (Keywords: technical, support, crash, bug, error)"
    }
  ];

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setActiveFaq(null);
  };

  const setPopularSearch = (query) => {
    setSearchQuery(query);
  };

  const handleContactSupport = (type) => {
    if (type === 'chat') {
      setIsChatOpen(true);
    } else {
      setIsEmailOpen(true);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    setChatMessages([...chatMessages, { sender: 'user', text: chatInput }]);
    setChatInput('');
    
    // Simulate bot response
    setTimeout(() => {
      setChatMessages(prev => [...prev, { 
        sender: 'bot', 
        text: 'Thank you for reaching out! A human agent will connect with you shortly. (This is a simulated response)' 
      }]);
    }, 1000);
  };

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="font-body-md text-body-md antialiased overflow-x-hidden pt-32 min-h-screen text-on-surface">
      {/* Ambient Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-secondary-container/20 blur-[150px] mix-blend-screen"></div>
      </div>

      <main className="max-w-7xl mx-auto px-6 md:px-10 pb-section-margin relative z-10">
        
        {/* Hero Section & Search */}
        <section className="flex flex-col items-center justify-center text-center py-section-margin mb-section-margin">
          <h1 className="font-display-lg-mobile text-3xl md:font-display-lg md:text-5xl text-primary mb-8 max-w-3xl leading-tight font-bold">
            How can we help you float through your movies?
          </h1>
          <div className="w-full max-w-2xl relative group">
            <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none transition-colors group-focus-within:text-tertiary">search</span>
            <input 
              className="glass-input w-full rounded-full py-4 pl-14 pr-6 text-body-lg font-body-lg backdrop-blur-md" 
              placeholder="Search for answers, guides, or troubleshooting..." 
              type="text"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-3 items-center">
            <span className="text-on-surface-variant font-label-sm text-xs uppercase tracking-wider mr-2">Popular:</span>
            <button onClick={() => setPopularSearch('Password')} className="px-4 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-on-surface text-sm transition-colors backdrop-blur-sm">Reset Password</button>
            <button onClick={() => setPopularSearch('Playback')} className="px-4 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-on-surface text-sm transition-colors backdrop-blur-sm">Playback Issues</button>
            <button onClick={() => setPopularSearch('Billing')} className="px-4 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-on-surface text-sm transition-colors backdrop-blur-sm">Billing Cycle</button>
          </div>
        </section>

        {/* Help Categories Grid */}
        <section className="mb-section-margin">
          <h2 className="font-headline-md text-2xl text-primary-fixed mb-8 font-bold">Browse Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <a onClick={() => setPopularSearch('Account')} className="glass-panel cursor-pointer rounded-2xl p-6 flex flex-col items-center text-center bloom-hover group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="w-16 h-16 rounded-full bg-surface-container/50 border border-white/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                <span className="material-symbols-outlined text-3xl text-primary group-hover:text-primary-fixed-dim transition-colors" data-weight="fill" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
              </div>
              <h3 className="font-body-lg text-lg font-semibold text-on-surface mb-2">Account & Profile</h3>
              <p className="text-on-surface-variant font-body-md text-sm">Manage your details, security, and profiles.</p>
            </a>
            
            <a onClick={() => setPopularSearch('Streaming')} className="glass-panel cursor-pointer rounded-2xl p-6 flex flex-col items-center text-center bloom-hover group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-tertiary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="w-16 h-16 rounded-full bg-surface-container/50 border border-white/10 flex items-center justify-center mb-6 group-hover:bg-tertiary/20 transition-colors duration-300">
                <span className="material-symbols-outlined text-3xl text-tertiary group-hover:text-tertiary-fixed-dim transition-colors" data-weight="fill" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
              </div>
              <h3 className="font-body-lg text-lg font-semibold text-on-surface mb-2">Streaming & Quality</h3>
              <p className="text-on-surface-variant font-body-md text-sm">Video resolution, audio, and device settings.</p>
            </a>

            <a onClick={() => setPopularSearch('Billing')} className="glass-panel cursor-pointer rounded-2xl p-6 flex flex-col items-center text-center bloom-hover group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="w-16 h-16 rounded-full bg-surface-container/50 border border-white/10 flex items-center justify-center mb-6 group-hover:bg-secondary/20 transition-colors duration-300">
                <span className="material-symbols-outlined text-3xl text-secondary group-hover:text-secondary-fixed-dim transition-colors" data-weight="fill" style={{ fontVariationSettings: "'FILL' 1" }}>credit_card</span>
              </div>
              <h3 className="font-body-lg text-lg font-semibold text-on-surface mb-2">Subscription & Billing</h3>
              <p className="text-on-surface-variant font-body-md text-sm">Invoices, payment methods, and plans.</p>
            </a>

            <a onClick={() => setPopularSearch('Support')} className="glass-panel cursor-pointer rounded-2xl p-6 flex flex-col items-center text-center bloom-hover group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-error/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="w-16 h-16 rounded-full bg-surface-container/50 border border-white/10 flex items-center justify-center mb-6 group-hover:bg-error/20 transition-colors duration-300">
                <span className="material-symbols-outlined text-3xl text-error group-hover:text-error-container transition-colors" data-weight="fill" style={{ fontVariationSettings: "'FILL' 1" }}>build</span>
              </div>
              <h3 className="font-body-lg text-lg font-semibold text-on-surface mb-2">Technical Support</h3>
              <p className="text-on-surface-variant font-body-md text-sm">App crashes, network errors, and bugs.</p>
            </a>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-section-margin max-w-4xl mx-auto">
          <h2 className="font-headline-md text-2xl text-primary-fixed mb-8 text-center font-bold">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => (
                <div key={faq.id} className="glass-panel rounded-2xl overflow-hidden">
                  <button 
                    onClick={() => setActiveFaq(activeFaq === faq.id ? null : faq.id)}
                    className="w-full px-6 py-5 flex justify-between items-center text-left hover:bg-white/5 transition-colors focus:outline-none"
                  >
                    <span className="font-body-lg text-lg text-on-surface font-semibold">{faq.question}</span>
                    <span className={`material-symbols-outlined text-on-surface-variant transition-transform duration-300 ${activeFaq === faq.id ? 'rotate-180' : ''}`}>
                      expand_more
                    </span>
                  </button>
                  <div 
                    className={`transition-all duration-400 ease-in-out overflow-hidden px-6 text-on-surface-variant font-body-md text-sm ${activeFaq === faq.id ? 'max-h-[500px] opacity-100 pb-5' : 'max-h-0 opacity-0 pb-0'}`}
                  >
                    <p>{faq.answer}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-on-surface-variant">
                No articles found matching "{searchQuery}". Try browsing categories or contact support.
              </div>
            )}
          </div>
        </section>

        {/* Contact Support */}
        <section className="glass-panel-elevated rounded-3xl p-10 md:p-14 text-center max-w-4xl mx-auto relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          <h2 className="font-headline-md text-2xl text-primary mb-4 relative z-10 font-bold">Still lost in the clouds?</h2>
          <p className="text-on-surface-variant font-body-md mb-8 max-w-xl mx-auto relative z-10">Our support team is here to help you get back to your stories. Reach out via live chat or email, and we'll respond faster than a shooting star.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
            <button onClick={() => handleContactSupport('chat')} className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-primary to-inverse-primary text-white font-body-lg font-semibold hover:shadow-[0_0_20px_rgba(231,201,255,0.5)] transition-all duration-300">
              <span className="material-symbols-outlined" data-weight="fill" style={{ fontVariationSettings: "'FILL' 1" }}>chat</span>
              Start Live Chat
            </button>
            <button onClick={() => handleContactSupport('email')} className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-on-surface font-body-lg font-semibold transition-all duration-300 backdrop-blur-md">
              <span className="material-symbols-outlined">mail</span>
              Email Support
            </button>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-surface-dim/40 backdrop-blur-md border-t border-white/10 w-full mt-16 flex flex-col md:flex-row justify-between items-center px-6 md:px-10 py-8 gap-6 relative z-10">
        <div className="font-display-lg text-primary text-2xl md:text-3xl font-bold">Aetheric Cinema</div>
        <nav className="flex flex-wrap justify-center gap-4 md:gap-6">
          <a className="font-label-sm text-xs text-on-surface-variant hover:text-tertiary transition-colors opacity-80 hover:opacity-100 uppercase cursor-pointer">Terms of Service</a>
          <a className="font-label-sm text-xs text-on-surface-variant hover:text-tertiary transition-colors opacity-80 hover:opacity-100 uppercase cursor-pointer">Privacy Policy</a>
          <a className="font-label-sm text-xs text-on-surface-variant hover:text-tertiary transition-colors opacity-80 hover:opacity-100 uppercase cursor-pointer">Contact Us</a>
          <a className="font-label-sm text-xs text-primary transition-colors opacity-80 hover:opacity-100 uppercase cursor-pointer">Help Center</a>
        </nav>
        <div className="font-label-sm text-xs text-on-surface-variant opacity-80 text-center md:text-right">
          © 2024 Aetheric Cinema. Dreaming in high definition.
        </div>
      </footer>

      {/* Live Chat Widget */}
      {isChatOpen && (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 bg-surface border border-white/20 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex flex-col z-[400] overflow-hidden backdrop-blur-3xl animate-in fade-in slide-in-from-bottom-8">
          <div className="bg-gradient-to-r from-primary to-inverse-primary p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined">support_agent</span>
              <span className="font-bold">Live Support</span>
            </div>
            <button onClick={() => setIsChatOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
          
          <div className="p-4 h-64 overflow-y-auto flex flex-col gap-3 bg-surface-container-lowest/50">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === 'user' ? 'bg-primary/20 text-on-surface self-end rounded-tr-sm border border-primary/30' : 'bg-white/5 text-on-surface-variant self-start rounded-tl-sm border border-white/10'}`}>
                {msg.text}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          
          <form onSubmit={handleSendMessage} className="p-3 border-t border-white/10 bg-surface-container flex gap-2">
            <input 
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-on-surface focus:outline-none focus:border-primary/50"
            />
            <button type="submit" className="bg-primary text-on-primary w-10 h-10 rounded-full flex items-center justify-center hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-sm">send</span>
            </button>
          </form>
        </div>
      )}

      {/* Email Modal */}
      {isEmailOpen && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
          <div className="glass-panel w-full max-w-lg rounded-2xl p-8 relative border border-white/20 shadow-[0_0_80px_rgba(212,165,255,0.3)] animate-in fade-in zoom-in-95">
            <button onClick={() => setIsEmailOpen(false)} className="absolute top-4 right-4 text-on-surface-variant hover:text-white transition-colors">
              <span className="material-symbols-outlined">close</span>
            </button>
            <div className="text-center mb-6">
              <h3 className="font-display-lg text-2xl font-bold text-white mb-2">Email Support</h3>
              <p className="text-on-surface-variant text-sm">Fill out the form below and we'll get back to you within 24 hours.</p>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); alert("Email sent successfully! (Simulated)"); setIsEmailOpen(false); }} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider">Name</label>
                <input type="text" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary/50" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider">Email Address</label>
                <input type="email" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary/50" placeholder="your@email.com" />
              </div>
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider">Message</label>
                <textarea required rows="4" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary/50 resize-none" placeholder="Describe your issue..."></textarea>
              </div>
              <button type="submit" className="w-full py-4 bg-gradient-to-r from-primary to-inverse-primary rounded-xl font-bold text-white shadow-[0_0_20px_rgba(212,165,255,0.4)] hover:shadow-[0_0_30px_rgba(212,165,255,0.6)] transition-all">
                Send Message
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
