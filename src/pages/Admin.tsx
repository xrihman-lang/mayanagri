import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../lib/firebase';
import { doc, setDoc, addDoc, collection, getDoc } from 'firebase/firestore';

export default function Admin() {
  const [liveStatus, setLiveStatus] = useState('');
  const [liveStatusMediaUrl, setLiveStatusMediaUrl] = useState('');
  const [projectType, setProjectType] = useState<'website' | 'app'>('website');
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectImage, setProjectImage] = useState('');
  const [projectLink, setProjectLink] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('isAdmin') !== 'true') {
      navigate('/login');
    }
  }, [navigate]);

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

  const handleUpdateStatus = async () => {
    await setDoc(doc(db, 'status', 'main'), { text: liveStatus, mediaUrl: liveStatusMediaUrl });
    alert('Status updated in Firestore!');
  };

  const handleAddProject = async () => {
    await addDoc(collection(db, 'projects'), { 
      type: projectType,
      name: projectName, 
      description: projectDescription,
      image: projectImage, 
      link: projectLink 
    });
    alert('Project added to Firestore!');
    setProjectName('');
    setProjectDescription('');
    setProjectImage('');
    setProjectLink('');
  };

  return (
    <div className="min-h-screen bg-[#060606] text-white p-8">
      <h1 className="text-3xl text-[#D4AF37] mb-8">Control Room</h1>
      <div className="bg-white/5 p-6 rounded-2xl border border-white/10 mb-8">
        <h2 className="text-xl mb-4">Edit Live Status</h2>
        <input 
          value={liveStatus}
          onChange={(e) => setLiveStatus(e.target.value)}
          className="w-full p-3 mb-4 bg-black border border-white/10 rounded-lg"
          placeholder="Status Text"
        />
        <input 
          placeholder="Media URL (Image or MP4)"
          value={liveStatusMediaUrl}
          onChange={(e) => setLiveStatusMediaUrl(e.target.value)}
          className="w-full p-3 mb-4 bg-black border border-white/10 rounded-lg"
        />
        <button onClick={handleUpdateStatus} className="px-6 py-2 bg-[#D4AF37] text-black font-bold uppercase rounded-lg">Update Status</button>
      </div>

      <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
        <h2 className="text-xl mb-4">Add Project (Website or App)</h2>
        <div className="flex gap-4 mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="type" value="website" checked={projectType === 'website'} onChange={() => setProjectType('website')} />
            Website
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="type" value="app" checked={projectType === 'app'} onChange={() => setProjectType('app')} />
            App
          </label>
        </div>
        <input placeholder="Name (Title)" value={projectName} onChange={(e) => setProjectName(e.target.value)} className="w-full p-3 mb-2 bg-black border border-white/10 rounded-lg" />
        <textarea placeholder="Description" value={projectDescription} onChange={(e) => setProjectDescription(e.target.value)} className="w-full p-3 mb-2 bg-black border border-white/10 rounded-lg min-h-[100px]" />
        <input placeholder="Media URL (Image or MP4)" value={projectImage} onChange={(e) => setProjectImage(e.target.value)} className="w-full p-3 mb-2 bg-black border border-white/10 rounded-lg" />
        <input placeholder="Project Link" value={projectLink} onChange={(e) => setProjectLink(e.target.value)} className="w-full p-3 mb-4 bg-black border border-white/10 rounded-lg" />
        <button onClick={handleAddProject} className="px-6 py-2 bg-[#D4AF37] text-black font-bold uppercase rounded-lg">Add Project</button>
      </div>
    </div>
  );
}
