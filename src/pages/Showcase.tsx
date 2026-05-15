import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import ProjectCard from '../components/ProjectCard';
import FeedbackModal from '../components/FeedbackModal';

export default function Showcase() {
  const [projects, setProjects] = useState<any[]>([]);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      const querySnapshot = await getDocs(collection(db, 'projects'));
      const projectsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProjects(projectsData);
    };
    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen bg-[#060606] text-white p-6 md:p-12 relative">
      <h1 className="text-3xl md:text-4xl font-serif text-[#D4AF37] mb-8 md:mb-12 tracking-widest">SHOWCASE</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-24">
        {projects.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>

      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsFeedbackModalOpen(true)}
        className="md:hidden fixed bottom-6 right-6 z-[60] w-14 h-14 bg-[#D4AF37] rounded-full shadow-[0_10px_30px_rgba(212,175,55,0.4)] flex items-center justify-center text-black"
      >
        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute inset-0 rounded-full bg-[#D4AF37] opacity-20" />
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
      </motion.button>

      <FeedbackModal isOpen={isFeedbackModalOpen} onClose={() => setIsFeedbackModalOpen(false)} />
    </div>
  );
}
