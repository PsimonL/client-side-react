import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function JoinRoom() {
  const [nickname, setNickname] = useState('');
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();

  const joinRoom = () => {
    navigate(`/chat/${roomId}`, { state: { nickname } });
    console.log("RoomJoinde = ", roomId);
  };

  return (
    <div>
      <h2>Join a Chat Room</h2>
      <input
        type="text"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        placeholder="Enter your nickname"
      />
      <input
        type="text"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        placeholder="Enter Room ID"
      />
      <button onClick={joinRoom}>Join</button>
    </div>
  );
}

export default JoinRoom;
