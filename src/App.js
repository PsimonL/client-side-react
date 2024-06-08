import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import ChatRoom from './components/ChatRoom';
import JoinRoom from './components/JoinRoom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/join-room" element={<JoinRoom />} />
        <Route path="/chat/:roomId" element={<ChatRoom />} />
      </Routes>
    </Router>
  );
}

export default App;
