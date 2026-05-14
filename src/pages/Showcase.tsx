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
        {projects.map((p) => (
          <div key={p.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 overflow-hidden">
            <img src={p.image} alt={p.name} className="w-full h-48 object-cover rounded-xl mb-4" />
            <h3 className="text-xl mb-2">{p.name}</h3>
            <a href={p.link} className="text-[#D4AF37] hover:underline" target="_blank" rel="noopener noreferrer">View Project</a>
          </div>
        ))}
      </div>
    </div>
  );
}
