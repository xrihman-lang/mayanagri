import React, { useState } from 'react';
import { motion } from 'motion/react';
import FeedbackModal from './FeedbackModal';

const ProjectCard: React.FC<{ project: any }> = ({ project }) => {
  const isVideo = project.image && project.image.toLowerCase().includes('.mp4');
  const validImage = project.image || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80';
  
  let href = project.link || '#';
  if (href !== '#' && !href.startsWith('http') && !href.startsWith('/')) {
    href = 'https://' + href;
  }

  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  return (
    <>
      <FeedbackModal 
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        project={{ id: project.id, name: project.name }}
      />
      <motion.div 
        onClick={() => { if(!isFeedbackModalOpen) window.open(href, '_blank', 'noopener,noreferrer') }}
        whileHover={{ scale: 1.02, y: -5, boxShadow: "0 10px 30px rgba(212,175,55,0.1)" }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="group block w-full bg-white/[0.02] border border-white/10 hover:border-[#D4AF37]/50 rounded-2xl overflow-hidden backdrop-blur-sm relative transition-all cursor-pointer"
      >
        <div className="relative aspect-video overflow-hidden bg-black/50">
          {isVideo ? (
            <video src={project.image} autoPlay loop muted playsInline className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-700 group-hover:scale-105" />
          ) : (
            <img 
              src={validImage} 
              alt={project.name} 
              className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105" 
              onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80' }} 
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#060606] via-transparent to-transparent opacity-80"></div>
        </div>
        <div className="p-5 md:p-6 relative">
          <h4 className="text-lg md:text-xl font-medium text-white mb-2 transition-colors">{project.name}</h4>
          <p className="text-[13px] md:text-sm text-white/50 leading-relaxed line-clamp-3 md:line-clamp-none">{project.description || 'A Maya Nagri digital ecosystem product.'}</p>
          
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity translate-x-0 sm:translate-x-[-10px] sm:group-hover:translate-x-0 duration-300">
              <span>Explore Link</span>
              <span>→</span>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); setIsFeedbackModalOpen(true); }}
              className="w-full sm:w-auto text-[10px] uppercase tracking-widest px-4 py-3 sm:py-1.5 border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10 rounded-full transition-colors opacity-100 sm:opacity-0 group-hover:opacity-100 flex items-center justify-center min-h-[48px] sm:min-h-0 relative z-20"
            >
              Leave Feedback
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default ProjectCard;
