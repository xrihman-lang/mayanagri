/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Showcase from './pages/Showcase';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/showcase" element={<Showcase />} />
        <Route path="/gdx-control-room" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

