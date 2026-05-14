import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function Showcase() {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const querySnapshot = await getDocs(collection(db, 'projects'));
      const projectsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProjects(projectsData);
    };
    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen bg-[#060606] text-white p-12">
      <h1 className="text-4xl font-serif text-[#D4AF37] mb-12">SHOWCASE</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((p) => {
          const isVideo = p.image && p.image.toLowerCase().includes('.mp4');
          const validImage = p.image || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80';
          
          let href = p.link || '#';
          if (href !== '#' && !href.startsWith('http') && !href.startsWith('/')) {
            href = 'https://' + href;
          }

          return (
            <div key={p.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 overflow-hidden">
              {isVideo ? (
                <video src={p.image} autoPlay loop muted playsInline className="w-full h-48 object-cover rounded-xl mb-4" />
              ) : (
                <img src={validImage} alt={p.name} className="w-full h-48 object-cover rounded-xl mb-4" onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80' }} />
              )}
              <h3 className="text-xl mb-2">{p.name}</h3>
              <p className="text-sm text-white/50 mb-4 line-clamp-2">{p.description}</p>
              <a href={href} className="text-[#D4AF37] hover:underline" target="_blank" rel="noopener noreferrer">View Project</a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
