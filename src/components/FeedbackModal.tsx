import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: { id: string, name: string };
}

export default function FeedbackModal({ isOpen, onClose, project }: FeedbackModalProps) {
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'feedbacks'), {
        projectId: project?.id || 'global',
        projectName: project?.name || 'General Feedback',
        rating,
        message: message.trim(),
        createdAt: new Date().toISOString()
      });
      alert('Feedback submitted successfully!');
      onClose();
      setMessage('');
      setRating(5);
    } catch (err) {
      alert('Failed to submit feedback.');
    }
    setSubmitting(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
          >
            <div className="bg-gradient-to-r from-[#D4AF37] to-[#FFD56B] p-6 flex justify-between items-center text-black">
              <div>
                <h3 className="font-serif text-xl font-bold tracking-widest uppercase">FEEDBACK</h3>
                <p className="text-[10px] font-bold uppercase tracking-wider opacity-60">MAYA NAGRI ECOSYSTEM</p>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/10 transition-colors"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              {project && (
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold mb-1">Project</p>
                  <p className="text-sm font-medium">{project.name}</p>
                </div>
              )}
              
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] text-white/50 mb-4 block font-bold">Your Experience</label>
                <div className="flex justify-between items-center bg-black/40 p-4 rounded-2xl border border-white/5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`text-4xl transition-all duration-300 ${star <= rating ? 'text-[#D4AF37] scale-110 drop-shadow-[0_0_10px_rgba(212,175,55,0.4)]' : 'text-white/10 grayscale'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] text-white/50 mb-4 block font-bold">Message</label>
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share your thoughts, suggestions or report issues..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-sm text-white focus:border-[#D4AF37]/50 outline-none resize-none transition-all h-[140px]"
                />
              </div>
              
              <button
                type="submit"
                disabled={submitting || !message.trim()}
                className="w-full py-5 bg-gradient-to-r from-[#D4AF37] to-[#FFD56B] text-black font-extrabold uppercase tracking-[0.2em] text-xs rounded-2xl shadow-[0_10px_30px_rgba(212,175,55,0.2)] hover:shadow-[0_15px_40px_rgba(212,175,55,0.4)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full"
                    />
                    Processing...
                  </>
                ) : 'Submit Sequence'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
