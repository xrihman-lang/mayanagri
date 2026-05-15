import { motion } from "motion/react";
import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { doc, getDoc, collection, getDocs, addDoc } from 'firebase/firestore';
import ProjectCard from '../components/ProjectCard';

export default function Home() {
  const [liveStatus, setLiveStatus] = useState('Loading...');
  const [liveStatusMediaUrl, setLiveStatusMediaUrl] = useState('');
  const [projects, setProjects] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch Status
      const docRef = doc(db, 'status', 'main');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setLiveStatus(data.text || '');
        setLiveStatusMediaUrl(data.mediaUrl || '');
      }

      // Fetch Projects
      const querySnapshot = await getDocs(collection(db, 'projects'));
      const projectsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProjects(projectsData);
    };
    fetchData();
  }, []);

  const websites = projects.filter(p => (!p.type || p.type === 'website') && (!searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description?.toLowerCase().includes(searchQuery.toLowerCase())));
  const apps = projects.filter(p => p.type === 'app' && (!searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description?.toLowerCase().includes(searchQuery.toLowerCase())));

  return (
    <div className="min-h-screen bg-[#060606] text-white font-sans flex flex-col relative overflow-x-hidden">
      {/* Dynamic Mouse Follower */}
      <motion.div 
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300 hidden md:block"
        animate={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(212,175,55,0.03), transparent 40%)`
        }}
      />
      {/* Background elements */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_-20%,#2a200a_0%,transparent_70%)] opacity-40 z-0 pointer-events-none"></div>
      
      {/* Cinematic Loader */}
      <motion.div 
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 2, duration: 1 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black pointer-events-none"
      >
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-transparent bg-clip-text bg-linear-to-r from-[#D4AF37] to-[#FFD56B]">
          MAYA NAGRI
        </h1>
      </motion.div>

      {/* Hero Viewport */}
      <div className="min-h-screen flex flex-col p-8 relative z-10 w-full max-w-[1600px] mx-auto">
        <nav className="flex justify-between items-center mb-8 relative z-50">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#FFD56B]"></div>
            <span className="text-[11px] uppercase tracking-[0.3em] font-medium text-[#D4AF37]">Studio MN</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8 text-[11px] uppercase tracking-[0.2em] text-white/50 font-semibold">
            <a href="/" className="text-white border-b border-[#D4AF37] pb-1">Home</a>
            <a href="/showcase" className="hover:text-white transition-colors">Showcase</a>
            <a href="/login" className="hover:text-white transition-colors">Admin</a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-[#D4AF37] focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Mobile Menu Overlay */}
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-full left-0 right-0 mt-4 bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col space-y-4 md:hidden z-50 shadow-2xl"
            >
              <a href="/" className="text-[#D4AF37] text-sm font-bold uppercase tracking-widest">Home</a>
              <a href="/showcase" className="text-white/70 text-sm font-bold uppercase tracking-widest hover:text-[#D4AF37]">Showcase</a>
              <a href="/login" className="text-white/70 text-sm font-bold uppercase tracking-widest hover:text-[#D4AF37]">Admin</a>
            </motion.div>
          )}
        </nav>

        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="max-w-xl mx-auto w-full mb-12 relative z-50"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] to-[#FFD56B] rounded-full blur opacity-5 group-focus-within:opacity-20 transition duration-500"></div>
          <div className="relative group">
            <input
              type="text"
              placeholder="Search websites, projects, AI tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="relative w-full bg-white/5 backdrop-blur-xl border border-white/10 text-white placeholder-white/40 px-6 py-3.5 rounded-full text-sm outline-none focus:border-[#D4AF37]/50 transition-colors shadow-lg"
            />
            <svg className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-[#D4AF37] transition-colors pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            
            {searchQuery.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 max-h-[300px] overflow-y-auto custom-scrollbar">
                {(websites.length === 0 && apps.length === 0) ? (
                  <div className="p-4 text-center text-white/50 text-sm">No matches found for "{searchQuery}"</div>
                ) : (
                  <ul>
                    {/* Combine websites and apps for the dropdown, taking top 5 or so, or all of them */}
                    {[...websites, ...apps].map((p) => {
                      let href = p.link || '#';
                      if (href !== '#' && !href.startsWith('http') && !href.startsWith('/')) href = 'https://' + href;
                      return (
                        <li key={p.id}>
                          <a 
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                          >
                            <div className="w-10 h-10 rounded-md overflow-hidden bg-black/50 shrink-0 border border-white/10">
                              {(p.image && p.image.toLowerCase().includes('.mp4')) ? (
                                <video src={p.image} className="w-full h-full object-cover" muted playsInline />
                              ) : (
                                <img src={p.image || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80'} alt="" className="w-full h-full object-cover" />
                              )}
                            </div>
                            <div>
                              <h4 className="text-[#D4AF37] font-medium text-sm">{p.name}</h4>
                              <p className="text-white/50 text-xs truncate max-w-[200px] sm:max-w-[400px]">{p.description}</p>
                            </div>
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            )}
          </div>
        </motion.div>

        <div className="flex flex-1 flex-col lg:flex-row gap-8 md:gap-12 relative items-stretch">
          <aside className="w-full lg:w-[340px] flex flex-col space-y-4 z-20">
            <motion.div 
              whileHover={{ scale: 1.01, boxShadow: "0 0 40px rgba(212,175,55,0.15)" }}
              className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex-1 flex flex-col sticky top-8 lg:h-[calc(100vh-8rem)] transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h3 className="text-[10px] md:text-[12px] font-bold text-[#D4AF37] tracking-[0.2em] uppercase">MAYA AI</h3>
                <div className="w-2 h-2 rounded-full bg-[#D4AF37] shadow-[0_0_10px_#D4AF37] animate-pulse"></div>
              </div>
              <div className="space-y-4 md:space-y-6 flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar pr-2">
                <div className="border-l-2 border-[#D4AF37]/30 pl-4 py-1">
                  {liveStatusMediaUrl && (
                    <div className="w-full aspect-video overflow-hidden rounded-lg mb-4 shadow-[0_0_15px_rgba(212,175,55,0.1)] border border-white/5">
                      {liveStatusMediaUrl.toLowerCase().includes('.mp4') ? (
                        <video src={liveStatusMediaUrl} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                      ) : (
                        <img src={liveStatusMediaUrl} alt="MAYA AI Status" className="w-full h-full object-cover" onError={(e) => e.currentTarget.parentElement!.style.display = 'none'} />
                      )}
                    </div>
                  )}
                  <h4 className="text-white font-medium text-base md:text-lg mb-1 tracking-tight">Smart Voice Assistant</h4>
                  <p className="text-[12px] md:text-[13px] leading-relaxed text-white/70 mb-4">
                    MAYA AI is a next-generation voice assistant built for real-time conversations, creativity, and productivity.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {['Real-Time AI', 'Voice Assistant', 'Fast Response', 'Creative Tools'].map(chip => (
                      <span key={chip} className="text-[9px] md:text-[10px] uppercase tracking-wider px-2 py-1 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 rounded-full">
                        • {chip}
                      </span>
                    ))}
                  </div>
                  <p className="text-[11px] md:text-[12px] leading-relaxed text-[#D4AF37]/90 italic font-medium">{liveStatus}</p>
                </div>
              </div>
            </motion.div>
          </aside>

          <main className="flex-1 flex flex-col justify-center gap-8 px-0 md:px-12 z-20 py-12 lg:py-0">
            <section className="relative transition-transform duration-1000 ease-out hover:md:scale-105" style={{ transformOrigin: "left center" }}>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[10px] md:text-[14px] uppercase tracking-[0.3em] md:tracking-[0.5em] text-[#D4AF37] mb-2 font-medium"
              >
                DIGITAL REALITY STUDIO
              </motion.h2>
              
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.2 } },
                }}
                className="font-serif text-[40px] sm:text-[60px] md:text-[80px] lg:text-[120px] font-bold tracking-tighter leading-[0.8] mb-8 flex flex-col sm:flex-row sm:gap-8"
              >
                {['MAYA', 'NAGRI'].map((word, i) => (
                  <motion.div
                    key={word}
                    variants={{
                      hidden: { opacity: 0, y: 50, filter: "blur(10px)" },
                      visible: { opacity: 1, y: 0, filter: "blur(0px)" },
                    }}
                    animate={{ 
                      y: [0, -10, 0],
                      filter: ["drop-shadow(0 0 0px #D4AF37)", "drop-shadow(0 0 20px #D4AF37)", "drop-shadow(0 0 0px #D4AF37)"]
                    }}
                    transition={{
                      y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 },
                      filter: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }
                    }}
                    className="text-white drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]"
                  >
                    {word}
                  </motion.div>
                ))}
              </motion.div>

              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 1 }}
                className="text-white/60 max-w-lg leading-relaxed text-base md:text-lg"
              >
                Building autonomous intelligence and cinematic digital ecosystems. Where architectural precision meets futuristic technology.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="mt-12 flex justify-center sm:justify-start"
              >
                <div 
                  onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                  className="inline-block cursor-pointer px-10 py-5 bg-gradient-to-r from-[#D4AF37] to-[#FFD56B] text-black text-[12px] font-bold uppercase tracking-widest rounded-full shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_40px_rgba(212,175,55,0.6)] hover:scale-105 transition-all duration-300 active:scale-95"
                >
                  Enter Universe
                </div>
              </motion.div>
            </section>
          </main>
        </div>
      </div>

      {/* Projects Content Section */}
      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-8 pb-32 space-y-24">
        {websites.length > 0 && (
          <section>
            <div className="flex items-center gap-4 mb-12">
              <h3 className="text-3xl font-serif text-white tracking-widest">FEATURED <span className="text-[#D4AF37]">WEBSITES</span></h3>
              <div className="h-px flex-1 bg-gradient-to-r from-[#D4AF37]/50 to-transparent"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {websites.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          </section>
        )}

        {apps.length > 0 && (
          <section>
            <div className="flex items-center gap-4 mb-12">
              <h3 className="text-3xl font-serif text-white tracking-widest">PREMIUM <span className="text-[#D4AF37]">APPS</span></h3>
              <div className="h-px flex-1 bg-gradient-to-r from-[#D4AF37]/50 to-transparent"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {apps.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
