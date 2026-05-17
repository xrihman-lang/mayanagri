import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Code, Gamepad2, Cpu, Terminal } from 'lucide-react';

interface WelcomeSplashProps {
  onEnter: () => void;
}

export default function WelcomeSplash({ onEnter }: WelcomeSplashProps) {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Fake loading progress
    const duration = 2000; // 2 seconds to load
    const interval = 20; // update every 20ms
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = Math.min(Math.round((currentStep / steps) * 100), 100);
      setLoadingProgress(progress);
      
      if (progress === 100) {
        clearInterval(timer);
        setTimeout(() => setIsLoaded(true), 500);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-black text-white flex items-center justify-center overflow-hidden font-sans perspective-1000">
      {/* Background Deep Space & Cyberpunk Gradients */}
      <div className="absolute inset-0 bg-[#020205]"></div>
      
      <motion.div 
        className="absolute inset-0 opacity-40 mix-blend-screen"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(30, 0, 100, 0.4) 0%, rgba(0, 50, 150, 0.2) 20%, transparent 60%)',
          backgroundSize: '200% 200%'
        }}
      />

      <motion.div 
        className="absolute inset-0 opacity-30 mix-blend-screen"
        animate={{
          backgroundPosition: ['100% 0%', '0% 100%'],
        }}
        transition={{ duration: 25, repeat: Infinity, repeatType: 'reverse' }}
        style={{
          backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(100, 0, 200, 0.2) 0%, rgba(0, 150, 255, 0.2) 40%, transparent 70%)',
          backgroundSize: '200% 200%'
        }}
      />

      {/* Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_20%,transparent_100%)]"></div>

      {/* Floating Particles and Icons */}
      <div className="absolute inset-0 z-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-blue-500/30 blur-[2px]"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: Math.random() * 0.5 + 0.1,
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              x: [null, Math.random() * window.innerWidth],
              opacity: [0.1, 0.4, 0.1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{ width: 10, height: 10 }}
          />
        ))}

        {/* Floating Icons */}
        <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} className="absolute top-[20%] left-[15%] text-blue-500/20">
          <Code size={48} />
        </motion.div>
        <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }} className="absolute bottom-[20%] right-[15%] text-purple-500/20">
          <Gamepad2 size={48} />
        </motion.div>
        <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }} className="absolute top-[30%] right-[20%] text-cyan-500/20">
          <Cpu size={48} />
        </motion.div>
        <motion.div animate={{ y: [0, 15, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }} className="absolute bottom-[25%] left-[25%] text-indigo-500/20">
          <Terminal size={48} />
        </motion.div>
      </div>

      {/* Main Content Area */}
      <motion.div 
        className="relative z-10 flex flex-col items-center justify-center text-center w-full max-w-4xl px-4"
        animate={{
          x: mousePos.x,
          y: mousePos.y,
        }}
        transition={{ type: 'spring', stiffness: 50, damping: 20 }}
      >
        <AnimatePresence mode="wait">
          {!isLoaded ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center"
            >
              <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden mb-6 relative">
                <motion.div 
                  className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500"
                  animate={{ width: `${loadingProgress}%` }}
                />
              </div>
              <div className="text-4xl font-mono text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 tracking-widest font-bold">
                {loadingProgress}%
              </div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 mt-4 font-mono">Loading Digital Ecosystem...</p>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center w-full"
            >
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-[10px] md:text-sm uppercase tracking-[0.5em] text-white/60 mb-6 font-medium"
              >
                Welcome To
              </motion.div>

              {/* Logo with Zoom and Blur Reveal */}
              <div className="relative group perspective-1000 mb-8 md:mb-10">
                {/* Neon Glow Pulse */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: [0.5, 0.8, 0.5], scale: [1, 1.05, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -inset-8 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full blur-3xl opacity-30 z-0"
                />
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.2, filter: 'blur(20px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }} // Spring-like beautiful curve
                  className="relative z-10 w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden border border-white/20 shadow-[0_0_50px_rgba(0,150,255,0.4)]"
                >
                  <img 
                    src="https://i.postimg.cc/CM7ygX2m/GDX-BARND-LOGO.jpg" 
                    alt="GDX MAYA NAGRI Logo" 
                    className="w-full h-full object-cover"
                  />
                  {/* Cinematic light streak sweep over logo */}
                  <motion.div 
                    initial={{ x: '-100%', skewX: -20 }}
                    animate={{ x: '200%' }}
                    transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }}
                    className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent z-20 pointer-events-none"
                  />
                </motion.div>
              </div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-3xl md:text-5xl lg:text-7xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-white tracking-widest mb-6 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              >
                GDX MAYA NAGRI
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 md:gap-6 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-cyan-400 mb-12 bg-white/5 px-6 py-3 rounded-full backdrop-blur-md border border-white/10"
              >
                <span>Web Developer</span>
                <span className="hidden sm:inline opacity-30">|</span>
                <span className="sm:hidden opacity-30">•</span>
                <span>Game Developer</span>
                <span className="hidden sm:inline opacity-30">|</span>
                <span className="sm:hidden opacity-30">•</span>
                <span>AI Developer</span>
              </motion.div>

              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.2 }}
                onClick={onEnter}
                whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(0, 150, 255, 0.4)' }}
                whileTap={{ scale: 0.95 }}
                className="relative overflow-hidden group px-12 py-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 border border-blue-400/50 text-white text-xs md:text-sm font-bold uppercase tracking-[0.3em] transition-all"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <span>ENTER</span>
                  <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>→</motion.span>
                </span>
                
                {/* Button light sweep */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent z-0 transform -translate-x-full"
                  animate={{ translateX: ['-100%', '200%'] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
                />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
