import { useState } from 'react';
import { motion } from 'motion/react';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function ProjectCard({ project }: { project: any }) {
  const isVideo = project.image && project.image.toLowerCase().includes('.mp4');
  const validImage = project.image || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80';
  
  let href = project.link || '#';
  if (href !== '#' && !href.startsWith('http') && !href.startsWith('/')) {
    href = 'https://' + href;
  }

  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitFeedback = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!message.trim()) return alert('Please enter your feedback message.');
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'feedbacks'), {
        projectId: project.id,
        projectName: project.name,
        rating,
        message: message.trim(),
        createdAt: new Date().toISOString()
      });
      alert('Feedback submitted successfully!');
      setShowFeedback(false);
      setMessage('');
      setRating(5);
    } catch (err) {
      alert('Failed to submit feedback.');
    }
    setSubmitting(false);
  };

  return (
    <motion.div 
      onClick={() => { if(!showFeedback) window.open(href, '_blank', 'noopener,noreferrer') }}
      whileHover={showFeedback ? {} : { scale: 1.08, y: -10, boxShadow: "0 20px 50px rgba(212,175,55,0.2)" }}
      whileTap={showFeedback ? {} : { scale: 1.08, y: -10, boxShadow: "0 20px 50px rgba(212,175,55,0.2)" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`group block w-full bg-white/[0.02] border border-white/10 hover:border-[#D4AF37]/50 rounded-2xl overflow-hidden backdrop-blur-sm relative ${showFeedback ? 'cursor-default' : 'cursor-pointer'}`}
    >
      <div className="relative aspect-video overflow-hidden bg-black/50">
        {isVideo ? (
          <video src={project.image} autoPlay loop muted playsInline className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700 group-hover:scale-110" />
        ) : (
          <img src={validImage} alt={project.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110" onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80' }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#060606] via-transparent to-transparent opacity-80"></div>
      </div>
      <div className="p-6 relative">
        <h4 className="text-xl font-medium text-white mb-2 transition-colors">{project.name}</h4>
        <p className="text-sm text-white/50 leading-relaxed">{project.description || 'A Maya Nagri digital ecosystem product.'}</p>
        <div className="mt-6 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0 duration-300">
            <span>Explore Link</span>
            <span>→</span>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); setShowFeedback(true); }}
            className="text-[10px] uppercase tracking-widest px-3 py-1.5 border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10 rounded-full transition-colors opacity-0 group-hover:opacity-100"
          >
            Leave Feedback
          </button>
        </div>
      </div>

      {showFeedback && (
        <div onClick={(e) => e.stopPropagation()} className="absolute inset-0 bg-black/90 backdrop-blur-md z-10 flex flex-col p-6 animate-in fade-in duration-300">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-[#D4AF37] font-serif text-lg tracking-widest">FEEDBACK</h4>
            <button onClick={() => setShowFeedback(false)} className="text-white/50 hover:text-white">✕</button>
          </div>
          
          <div className="flex-1 flex flex-col gap-4">
            <div>
              <label className="text-xs text-white/50 uppercase tracking-widest mb-2 block">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button 
                    key={star} 
                    onClick={() => setRating(star)}
                    className={`text-xl ${star <= rating ? 'text-[#D4AF37]' : 'text-white/20'}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex-1">
              <label className="text-xs text-white/50 uppercase tracking-widest mb-2 block">Issue / Comment</label>
              <textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe any issues or feedback..."
                className="w-full h-[80px] bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-[#D4AF37]/50 outline-none resize-none"
              />
            </div>
            
            <button 
              onClick={handleSubmitFeedback}
              disabled={submitting}
              className="w-full py-3 bg-gradient-to-r from-[#D4AF37] to-[#FFD56B] text-black font-bold uppercase tracking-widest text-xs rounded-lg hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
