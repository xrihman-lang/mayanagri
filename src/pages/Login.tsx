import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'zishan' && password === 'zishangdx') {
      localStorage.setItem('isAdmin', 'true');
      navigate('/gdx-control-room');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-[#060606] flex items-center justify-center text-white p-6">
      <form onSubmit={handleLogin} className="w-full max-w-sm bg-white/5 p-6 md:p-8 rounded-2xl border border-white/10 backdrop-blur-xl shadow-2xl">
        <h2 className="text-[#D4AF37] text-xl md:text-2xl mb-8 font-serif tracking-widest text-center uppercase">ACCESS PORTAL</h2>
        <div className="space-y-4">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-white/50 mb-2 block font-bold">Commander ID</label>
            <input 
              type="text" 
              placeholder="Username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-4 bg-black/50 border border-white/10 rounded-xl text-white outline-none focus:border-[#D4AF37]/50 transition-colors"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-white/50 mb-2 block font-bold">Access Sequence</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 bg-black/50 border border-white/10 rounded-xl text-white outline-none focus:border-[#D4AF37]/50 transition-colors"
            />
          </div>
        </div>
        <button type="submit" className="w-full mt-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#FFD56B] text-black font-extrabold uppercase rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all tracking-widest text-xs translate-y-0 active:scale-95">Initiate Login</button>
        <p className="mt-6 text-center text-[10px] text-white/30 uppercase tracking-[0.2em]">Authorized Personnel Only</p>
      </form>
    </div>
  );
}
