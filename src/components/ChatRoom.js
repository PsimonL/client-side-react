import React, { useEffect, useState, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import SockJsClient from 'react-stomp';

const ChatRoom = () => {
  const { roomId } = useParams();
  const location = useLocation();
  const { nickname } = location.state || { nickname: '' };
  const [privateChats, setPrivateChats] = useState(new Map());
  const [publicChats, setPublicChats] = useState([]);
  const [tab, setTab] = useState("CHATROOM");
  const [userData, setUserData] = useState({
    username: nickname,
    receivername: '',
    connected: false,
    message: ''
  });
  const [messageQueue, setMessageQueue] = useState([]);
  const clientRef = useRef(null);

  useEffect(() => {
    if (nickname && !userData.connected) {
      console.log("Connecting to WebSocket...");
      connect();
    }
  }, [nickname]);

  const connect = () => {
    setUserData(prevState => ({ ...prevState, connected: false }));
  };

  const onConnected = () => {
    console.log("Connected to WebSocket");
    setUserData(prevState => ({ ...prevState, connected: true }));

    messageQueue.forEach(msg => {
      clientRef.current.sendMessage(msg.destination, msg.message);
    });
    setMessageQueue([]);
    userJoin();
  };

  const userJoin = () => {
    var chatMessage = {
      sender: userData.username,
      type: "JOIN"
    };
    sendMessage(`/app/chat.addUser/${roomId}`, JSON.stringify(chatMessage));
  };

  const onMessageReceived = (msg) => {
    var payloadData = JSON.parse(msg.body);
    switch (payloadData.type) {
      case "JOIN":
        if (!privateChats.get(payloadData.sender)) {
          privateChats.set(payloadData.sender, []);
          setPrivateChats(new Map(privateChats));
        }
        break;
      case "CHAT":
        publicChats.push(payloadData);
        setPublicChats([...publicChats]);
        break;
    }
  };

  const onPrivateMessage = (msg) => {
    var payloadData = JSON.parse(msg.body);
    if (privateChats.get(payloadData.sender)) {
      privateChats.get(payloadData.sender).push(payloadData);
      setPrivateChats(new Map(privateChats));
    } else {
      let list = [];
      list.push(payloadData);
      privateChats.set(payloadData.sender, list);
      setPrivateChats(new Map(privateChats));
    }
  };

  const onError = (err) => {
    console.log("WebSocket error:", err);
    setUserData(prevState => ({ ...prevState, connected: false }));
  };

  const handleMessage = (event) => {
    const { value } = event.target;
    setUserData({ ...userData, message: value });
  };

  const sendMessage = (destination, message) => {
    if (clientRef.current && userData.connected) {
      clientRef.current.sendMessage(destination, message);
    } else {
      console.log("WebSocket is not connected yet. Message queued.");
      setMessageQueue(prevQueue => [...prevQueue, { destination, message }]);
    }
  };

  const sendValue = () => {
    var chatMessage = {
      sender: userData.username,
      content: userData.message,
      type: "CHAT"
    };
    sendMessage(`/app/message/${roomId}`, JSON.stringify(chatMessage));
    setUserData({ ...userData, message: "" });
  };

  const sendPrivateValue = () => {
    var chatMessage = {
      sender: userData.username,
      receiver: tab,
      content: userData.message,
      type: "CHAT"
    };
    if (userData.username !== tab) {
      privateChats.get(tab).push(chatMessage);
      setPrivateChats(new Map(privateChats));
    }
    sendMessage("/app/private-message", JSON.stringify(chatMessage));
    setUserData({ ...userData, message: "" });
  };

  return (
    <div className="container">
      <SockJsClient
        url="http://localhost:8080/ws"
        topics={userData.connected ? [`/topic/${roomId}`, `/user/${userData.username}/private`] : []}
        onConnect={onConnected}
        onDisconnect={() => {
          console.log("Disconnected");
          setUserData(prevState => ({ ...prevState, connected: false }));
        }}
        onMessage={(msg) => {
          if (msg.type === "CHAT" || msg.type === "JOIN") {
            onMessageReceived({ body: JSON.stringify(msg) });
          } else {
            onPrivateMessage({ body: JSON.stringify(msg) });
          }
        }}
        onError={onError}
        ref={clientRef}
      />
      <div className="chat-box">
        <div className="member-list">
          <ul>
            <li
              onClick={() => { setTab("CHATROOM"); }}
              className={`member ${tab === "CHATROOM" && "active"}`}
            >
              Chatroom
            </li>
            {[...privateChats.keys()].map((name, index) => (
              <li
                onClick={() => { setTab(name); }}
                className={`member ${tab === name && "active"}`}
                key={index}
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
        {tab === "CHATROOM" && (
          <div className="chat-content">
            <ul className="chat-messages">
              {publicChats.map((chat, index) => (
                <li className={`message ${chat.sender === userData.username && "self"}`} key={index}>
                  {chat.sender !== userData.username && <div className="avatar">{chat.sender}</div>}
                  <div className="message-data">{chat.content}</div>
                  {chat.sender === userData.username && <div className="avatar self">{chat.sender}</div>}
                </li>
              ))}
            </ul>
            <div className="send-message">
              <input
                type="text"
                className="input-message"
                placeholder="Enter the message"
                value={userData.message}
                onChange={handleMessage}
              />
              <button type="button" className="send-button" onClick={sendValue}>
                Send
              </button>
            </div>
          </div>
        )}
        {tab !== "CHATROOM" && (
          <div className="chat-content">
            <ul className="chat-messages">
              {[...privateChats.get(tab)].map((chat, index) => (
                <li className={`message ${chat.sender === userData.username && "self"}`} key={index}>
                  {chat.sender !== userData.username && <div className="avatar">{chat.sender}</div>}
                  <div className="message-data">{chat.content}</div>
                  {chat.sender === userData.username && <div className="avatar self">{chat.sender}</div>}
                </li>
              ))}
            </ul>
            <div className="send-message">
              <input
                type="text"
                className="input-message"
                placeholder="Enter the message"
                value={userData.message}
                onChange={handleMessage}
              />
              <button type="button" className="send-button" onClick={sendPrivateValue}>
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatRoom;
