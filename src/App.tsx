/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import Home from './pages/Home';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Showcase from './pages/Showcase';
import WelcomeSplash from './components/WelcomeSplash';

export default function App() {
  const [hasEntered, setHasEntered] = useState(false);

  return (
    <>
      <AnimatePresence mode="wait">
        {!hasEntered && (
          <motion.div
            key="splash"
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[100]"
          >
            <WelcomeSplash onEnter={() => setHasEntered(true)} />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={false}
        animate={hasEntered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: hasEntered ? 0.2 : 0 }}
        className="min-h-screen bg-[#060606]"
      >
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/showcase" element={<Showcase />} />
            <Route path="/gdx-control-room" element={<Admin />} />
          </Routes>
        </BrowserRouter>
      </motion.div>
    </>
  );
}

