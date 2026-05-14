import { motion } from "motion/react";
import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';

export default function Home() {
  const [liveStatus, setLiveStatus] = useState('Loading...');
  const [liveStatusMediaUrl, setLiveStatusMediaUrl] = useState('');
  const [projects, setProjects] = useState<any[]>([]);

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

  const websites = projects.filter(p => !p.type || p.type === 'website');
  const apps = projects.filter(p => p.type === 'app');

  return (
    <div className="min-h-screen bg-[#060606] text-white font-sans flex flex-col relative overflow-x-hidden">
      {/* Background elements */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_-20%,#2a200a_0%,transparent_70%)] opacity-40 z-0 pointer-events-none"></div>
      
      {/* Cinematic Loader */}
      <motion.div 
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 2, duration: 1 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black pointer-events-none"
      >
        <h1 className="text-6xl font-serif font-bold text-transparent bg-clip-text bg-linear-to-r from-[#D4AF37] to-[#FFD56B]">
          MAYA NAGRI
        </h1>
      </motion.div>

      {/* Hero Viewport */}
      <div className="min-h-screen flex flex-col p-8 relative z-10 w-full max-w-[1600px] mx-auto">
        <nav className="flex justify-between items-center mb-12">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#FFD56B]"></div>
            <span className="text-[11px] uppercase tracking-[0.3em] font-medium text-[#D4AF37]">Studio MN</span>
          </div>
          <div className="flex items-center space-x-8 text-[11px] uppercase tracking-[0.2em] text-white/50 font-semibold">
            <a href="/" className="text-white border-b border-[#D4AF37] pb-1">Home</a>
            <a href="/showcase" className="hover:text-white transition-colors">Showcase</a>
            <a href="/login" className="hover:text-white transition-colors">Admin</a>
          </div>
        </nav>

        <div className="flex flex-1 gap-8 relative items-stretch">
          <aside className="w-72 flex flex-col space-y-4">
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex-1 flex flex-col sticky top-8 h-[calc(100vh-8rem)]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[10px] font-bold text-[#D4AF37] tracking-[0.2em] uppercase">Live Status</h3>
                <div className="w-2 h-2 rounded-full bg-[#D4AF37] shadow-[0_0_8px_#D4AF37] animate-pulse"></div>
              </div>
              <div className="space-y-6 flex-1 overflow-y-auto overflow-x-hidden opacity-80 custom-scrollbar pr-2">
                <div className="border-l-2 border-[#D4AF37]/30 pl-4 py-1">
                  {liveStatusMediaUrl && (
                    liveStatusMediaUrl.toLowerCase().includes('.mp4') ? (
                      <video src={liveStatusMediaUrl} autoPlay loop muted playsInline className="w-full aspect-video object-cover mb-4 rounded-lg shadow-lg border border-white/5" />
                    ) : (
                      <img src={liveStatusMediaUrl} alt="Live Status" className="w-full aspect-video object-cover mb-4 rounded-lg shadow-lg border border-white/5" onError={(e) => e.currentTarget.style.display = 'none'} />
                    )
                  )}
                  <p className="text-[12px] leading-relaxed text-white/90">{liveStatus}</p>
                </div>
              </div>
            </div>
          </aside>

          <main className="flex-1 flex flex-col justify-center gap-8 px-12">
            <section className="relative transition-transform duration-1000 ease-out hover:scale-105" style={{ transformOrigin: "left center" }}>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[14px] uppercase tracking-[0.5em] text-[#D4AF37] mb-2 font-medium"
              >
                DIGITAL REALITY STUDIO
              </motion.h2>
              
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.2 } },
                }}
                className="font-serif text-[120px] font-bold tracking-tighter leading-[0.8] mb-8 flex gap-8"
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
                className="text-white/60 max-w-lg leading-relaxed text-lg"
              >
                Building autonomous intelligence and cinematic digital ecosystems. Where architectural precision meets futuristic technology.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="mt-12"
              >
                <div 
                  onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                  className="inline-block cursor-pointer px-10 py-4 bg-gradient-to-r from-[#D4AF37] to-[#FFD56B] text-black text-[12px] font-bold uppercase tracking-widest rounded-full shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_40px_rgba(212,175,55,0.6)] hover:scale-105 transition-all duration-300"
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

function ProjectCard({ project }: { project: any }) {
  const isVideo = project.image && project.image.toLowerCase().includes('.mp4');
  const validImage = project.image || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80';
  
  // Ensure the link is absolute if it's meant to be external and doesn't start with /
  let href = project.link || '#';
  if (href !== '#' && !href.startsWith('http') && !href.startsWith('/')) {
    href = 'https://' + href;
  }

  return (
    <motion.a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}
      className="group block bg-white/[0.02] border border-white/10 hover:border-[#D4AF37]/50 rounded-2xl overflow-hidden transition-all duration-500 backdrop-blur-sm"
    >
      <div className="relative aspect-video overflow-hidden bg-black/50">
        {isVideo ? (
          <video src={project.image} autoPlay loop muted playsInline className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-105" />
        ) : (
          <img src={validImage} alt={project.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105" onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80' }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#060606] via-transparent to-transparent opacity-80"></div>
      </div>
      <div className="p-6 relative">
        <h4 className="text-xl font-medium text-white mb-2 group-hover:text-[#D4AF37] transition-colors">{project.name}</h4>
        <p className="text-sm text-white/50 line-clamp-2 leading-relaxed">{project.description || 'A Maya Nagri digital ecosystem product.'}</p>
        <div className="mt-6 flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0 duration-300">
          <span>Explore Link</span>
          <span>→</span>
        </div>
      </div>
    </motion.a>
  );
}
