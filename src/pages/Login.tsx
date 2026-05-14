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
    <div className="min-h-screen bg-[#060606] flex items-center justify-center text-white">
      <form onSubmit={handleLogin} className="bg-white/5 p-8 rounded-2xl border border-white/10">
        <h2 className="text-[#D4AF37] text-2xl mb-6">Control Room Access</h2>
        <input 
          type="text" 
          placeholder="Username" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 mb-4 bg-black border border-white/10 rounded-lg text-white"
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-6 bg-black border border-white/10 rounded-lg text-white"
        />
        <button type="submit" className="w-full py-3 bg-[#D4AF37] text-black font-bold uppercase rounded-lg">Login</button>
      </form>
    </div>
  );
}
