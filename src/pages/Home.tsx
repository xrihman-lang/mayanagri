import { motion } from "motion/react";
import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function Home() {
  const [liveStatus, setLiveStatus] = useState('Loading...');
  const [liveStatusMediaUrl, setLiveStatusMediaUrl] = useState('');

  useEffect(() => {
    const fetchStatus = async () => {
      const docRef = doc(db, 'status', 'main');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setLiveStatus(data.text || '');
        setLiveStatusMediaUrl(data.mediaUrl || '');
      }
    };
    fetchStatus();
  }, []);

  return (
    <div className="min-h-screen bg-[#060606] text-white font-sans overflow-hidden flex flex-col p-8 relative">
      {/* Cinematic Loader */}
      <motion.div 
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 2, duration: 1 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black"
      >
        <h1 className="text-6xl font-serif font-bold text-transparent bg-clip-text bg-linear-to-r from-[#D4AF37] to-[#FFD56B]">
          MAYA NAGRI
        </h1>
      </motion.div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#2a200a_0%,transparent_70%)] opacity-40"></div>
      
      <nav className="flex justify-between items-center z-10 mb-12">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#FFD56B]"></div>
          <span className="text-[11px] uppercase tracking-[0.3em] font-medium text-[#D4AF37]">Studio MN</span>
        </div>
        <div className="flex items-center space-x-8 text-[11px] uppercase tracking-[0.2em] text-white/50 font-semibold">
          <a href="/" className="text-white border-b border-[#D4AF37] pb-1">Home</a>
          <a href="/showcase" className="hover:text-white transition-colors">Showcase</a>
        </div>
      </nav>

      <div className="flex flex-1 gap-8 z-10 overflow-hidden">
        <aside className="w-72 flex flex-col space-y-4">
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[10px] font-bold text-[#D4AF37] tracking-[0.2em] uppercase">Live Status</h3>
              <div className="w-2 h-2 rounded-full bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]"></div>
            </div>
            <div className="space-y-6 flex-1 overflow-hidden opacity-80">
              <div className="border-l-2 border-[#D4AF37]/30 pl-4 py-1">
                {liveStatusMediaUrl && (
                  liveStatusMediaUrl.toLowerCase().endsWith('.mp4') ? (
                    <video src={liveStatusMediaUrl} autoPlay loop muted playsInline className="w-full h-auto mb-2 rounded-lg" />
                  ) : (
                    <img src={liveStatusMediaUrl} alt="Live Status" className="w-full h-auto mb-2 rounded-lg" />
                  )
                )}
                <p className="text-[12px] leading-relaxed text-white/90">{liveStatus}</p>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 flex flex-col justify-center gap-8 z-10 p-12">
          <section className="relative">
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
              className="font-serif text-[120px] font-bold tracking-tighter leading-[0.8] mb-8"
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
                    y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                    filter: { duration: 3, repeat: Infinity, ease: "easeInOut" }
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
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(212,175,55,0.5)" }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 bg-gradient-to-r from-[#D4AF37] to-[#FFD56B] text-black text-[12px] font-bold uppercase tracking-widest rounded-full shadow-[0_10px_30px_rgba(212,175,55,0.2)]"
              >
                Enter Universe
              </motion.button>
            </motion.div>
          </section>
        </main>
      </div>
    </div>
  );
}
