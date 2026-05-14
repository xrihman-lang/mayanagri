import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../lib/firebase';
import { doc, setDoc, addDoc, collection, getDoc, getDocs, deleteDoc, updateDoc } from 'firebase/firestore';
import { motion, PanInfo } from 'motion/react';

export default function Admin() {
  const [liveStatus, setLiveStatus] = useState('');
  const [liveStatusMediaUrl, setLiveStatusMediaUrl] = useState('');
  const [projectType, setProjectType] = useState<'website' | 'app'>('website');
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectImage, setProjectImage] = useState('');
  const [projectLink, setProjectLink] = useState('');
  const [projects, setProjects] = useState<any[]>([]);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('isAdmin') !== 'true') {
      navigate('/login');
    }
  }, [navigate]);

  const fetchData = async () => {
    const docRef = doc(db, 'status', 'main');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      setLiveStatus(data.text || '');
      setLiveStatusMediaUrl(data.mediaUrl || '');
    }

    const projectsSnapshot = await getDocs(collection(db, 'projects'));
    setProjects(projectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

    try {
      const feedbacksSnapshot = await getDocs(collection(db, 'feedbacks'));
      setFeedbacks(feedbacksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch(e) {
      console.log('No feedbacks yet');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async () => {
    setIsSaving(true);
    setSaveMessage('Updating Status...');
    await setDoc(doc(db, 'status', 'main'), { text: liveStatus, mediaUrl: liveStatusMediaUrl });
    setTimeout(() => setIsSaving(false), 800);
  };

  const handleSaveProject = async () => {
    setIsSaving(true);
    setSaveMessage(editingId ? 'Updating Project...' : 'Adding Project...');
    if (editingId) {
      await updateDoc(doc(db, 'projects', editingId), { 
        type: projectType,
        name: projectName, 
        description: projectDescription,
        image: projectImage, 
        link: projectLink 
      });
    } else {
      await addDoc(collection(db, 'projects'), { 
        type: projectType,
        name: projectName, 
        description: projectDescription,
        image: projectImage, 
        link: projectLink 
      });
    }
    
    setEditingId(null);
    setProjectName('');
    setProjectDescription('');
    setProjectImage('');
    setProjectLink('');
    fetchData(); // Refresh the list
    setTimeout(() => setIsSaving(false), 800);
  };

  const handleEditProject = (project: any) => {
    setEditingId(project.id);
    setProjectType(project.type || 'website');
    setProjectName(project.name || '');
    setProjectDescription(project.description || '');
    setProjectImage(project.image || '');
    setProjectLink(project.link || '');
    // scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteProject = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      await deleteDoc(doc(db, 'projects', id));
      alert('Project deleted!');
      // if deleting currently edited project, reset form
      if (editingId === id) {
        setEditingId(null);
        setProjectName('');
        setProjectDescription('');
        setProjectImage('');
        setProjectLink('');
      }
      fetchData(); // Refresh list
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setProjectName('');
    setProjectDescription('');
    setProjectImage('');
    setProjectLink('');
  };

  const handleDragEnd = (e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y > 100) navigate('/');
  };

  return (
    <motion.div 
      drag="y" 
      dragConstraints={{ top: 0, bottom: 0 }} 
      onDragEnd={handleDragEnd}
      className="min-h-screen bg-[#060606] text-white p-6 md:p-8 relative overflow-hidden"
    >
      {isSaving && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            className="w-24 h-24 rounded-full border-4 border-white/10 border-t-[#D4AF37] border-l-[#D4AF37] flex items-center justify-center shadow-[0_0_50px_rgba(212,175,55,0.4)] relative"
          >
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              className="absolute text-2xl font-serif text-[#D4AF37] font-bold tracking-widest drop-shadow-[0_0_10px_rgba(212,175,55,0.8)]"
            >
              MN
            </motion.div>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 text-sm text-[#D4AF37] tracking-[0.3em] uppercase font-bold"
          >
            {saveMessage}
          </motion.p>
        </div>
      )}

      <div className="flex justify-between items-center mb-8 sticky top-4 z-50">
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 px-5 py-2.5 bg-white/5 backdrop-blur-xl border border-[#D4AF37]/50 rounded-full text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all duration-300 shadow-[0_0_15px_rgba(212,175,55,0.1)] hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] text-sm font-medium tracking-wide"
        >
          <span>← Back to Home</span>
        </button>
        <button 
          onClick={() => navigate('/')} 
          className="w-10 h-10 flex items-center justify-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl text-[#D4AF37] mb-8 font-serif tracking-wide">Control Room</h1>
        
        <p className="text-white/50 mb-8 text-sm italic">Swipe down anywhere to return home.</p>

        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 mb-8 backdrop-blur-sm">
          <h2 className="text-xl mb-4 font-medium tracking-wide">Edit Live Status</h2>
          <input 
            value={liveStatus}
            onChange={(e) => setLiveStatus(e.target.value)}
            className="w-full p-3 mb-4 bg-black/50 border border-white/10 rounded-lg outline-none focus:border-[#D4AF37]/50 transition-colors"
            placeholder="Status Text"
          />
          <input 
            placeholder="Media URL (Image or MP4)"
            value={liveStatusMediaUrl}
            onChange={(e) => setLiveStatusMediaUrl(e.target.value)}
            className="w-full p-3 mb-4 bg-black/50 border border-white/10 rounded-lg outline-none focus:border-[#D4AF37]/50 transition-colors"
          />
          <button onClick={handleUpdateStatus} className="px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#FFD56B] text-black font-bold uppercase rounded-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all">Update Status</button>
        </div>

        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm mb-8">
          <h2 className="text-xl mb-4 font-medium tracking-wide">{editingId ? 'Edit Project' : 'Add Project (Website or App)'}</h2>
          <div className="flex gap-4 mb-6">
            <label className="flex items-center gap-2 cursor-pointer p-3 bg-black/30 rounded-lg border border-white/5 hover:border-white/20 transition-colors">
              <input type="radio" name="type" value="website" checked={projectType === 'website'} onChange={() => setProjectType('website')} className="accent-[#D4AF37] w-4 h-4" />
              Website
            </label>
            <label className="flex items-center gap-2 cursor-pointer p-3 bg-black/30 rounded-lg border border-white/5 hover:border-white/20 transition-colors">
              <input type="radio" name="type" value="app" checked={projectType === 'app'} onChange={() => setProjectType('app')} className="accent-[#D4AF37] w-4 h-4" />
              App
            </label>
          </div>
          <input placeholder="Name (Title)" value={projectName} onChange={(e) => setProjectName(e.target.value)} className="w-full p-3 mb-3 bg-black/50 border border-white/10 rounded-lg outline-none focus:border-[#D4AF37]/50 transition-colors" />
          <textarea placeholder="Description" value={projectDescription} onChange={(e) => setProjectDescription(e.target.value)} className="w-full p-3 mb-3 bg-black/50 border border-white/10 rounded-lg min-h-[100px] outline-none focus:border-[#D4AF37]/50 transition-colors" />
          <input placeholder="Media URL (Image or MP4)" value={projectImage} onChange={(e) => setProjectImage(e.target.value)} className="w-full p-3 mb-3 bg-black/50 border border-white/10 rounded-lg outline-none focus:border-[#D4AF37]/50 transition-colors" />
          <input placeholder="Project Link" value={projectLink} onChange={(e) => setProjectLink(e.target.value)} className="w-full p-3 mb-6 bg-black/50 border border-white/10 rounded-lg outline-none focus:border-[#D4AF37]/50 transition-colors" />
          <div className="flex gap-4">
            <button onClick={handleSaveProject} className="px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#FFD56B] text-black font-bold uppercase rounded-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all">
              {editingId ? 'Update Project' : 'Add Project'}
            </button>
            {editingId && (
              <button onClick={handleCancelEdit} className="px-6 py-3 bg-white/10 text-white font-bold uppercase rounded-lg hover:bg-white/20 transition-all border border-white/10">
                Cancel
              </button>
            )}
          </div>
        </div>

        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
          <h2 className="text-xl mb-6 font-medium tracking-wide">Manage Existing Projects</h2>
          {projects.length === 0 ? (
            <p className="text-white/50 text-sm italic">No projects found.</p>
          ) : (
            <div className="space-y-4">
              {projects.map((p) => {
                const isVideo = p.image && p.image.toLowerCase().includes('.mp4');
                const validImage = p.image || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80';
                return (
                  <div key={p.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-black/30 border border-white/5 rounded-xl hover:border-[#D4AF37]/30 transition-colors gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-black/50 border border-white/10">
                        {isVideo ? (
                          <video src={p.image} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                        ) : (
                          <img src={validImage} alt={p.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80' }} />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-white">{p.name || 'Unnamed Project'}</h3>
                          <span className={`text-[10px] uppercase px-2 py-0.5 rounded-full border ${p.type === 'app' ? 'border-blue-500/50 text-blue-400 bg-blue-500/10' : 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10'}`}>
                            {p.type || 'website'}
                          </span>
                        </div>
                        <p className="text-xs text-white/50 w-full sm:w-[300px] truncate">{p.description || 'No description'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button 
                        onClick={() => handleEditProject(p)}
                        className="flex-1 sm:flex-none px-4 py-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20 rounded-lg text-sm transition-colors"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteProject(p.id)}
                        className="flex-1 sm:flex-none px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-sm transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm mt-8">
          <h2 className="text-xl mb-6 font-medium tracking-wide">User Feedback</h2>
          {feedbacks.length === 0 ? (
            <p className="text-white/50 text-sm italic">No feedback received yet.</p>
          ) : (
            <div className="space-y-4">
              {feedbacks.map((f) => (
                <div key={f.id} className="p-4 bg-black/30 border border-white/5 rounded-xl hover:border-[#D4AF37]/30 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-[#D4AF37]">{f.projectName || 'Unknown Project'}</h3>
                      <div className="flex gap-1 text-sm mt-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <span key={star} className={star <= (f.rating || 5) ? 'text-[#D4AF37]' : 'text-white/20'}>★</span>
                        ))}
                      </div>
                    </div>
                    <button 
                      onClick={async () => {
                        if (window.confirm('Delete this feedback?')) {
                          await deleteDoc(doc(db, 'feedbacks', f.id));
                          fetchData();
                        }
                      }}
                      className="text-xs px-3 py-1 bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 rounded-lg transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                  <p className="text-sm text-white/80 whitespace-pre-wrap">{f.message}</p>
                  <span className="text-[10px] text-white/40 mt-3 block">
                    {new Date(f.createdAt).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

