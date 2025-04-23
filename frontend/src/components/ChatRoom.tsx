import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

const ChatRoom: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const messagesRef = useRef<HTMLUListElement>(null);
  const socketRef = useRef<any>(null);

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io(BACKEND_URL);

    // Listen for chat messages
    socketRef.current.on('chat message', (msg: string) => {
      setMessages(prevMessages => [...prevMessages, msg]);
      // Scroll to bottom when new message arrives
      setTimeout(() => {
        window.scrollTo(0, document.body.scrollHeight);
      }, 0);
    });

    // Clean up on component unmount
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue) {
      socketRef.current.emit('chat message', inputValue);
      setInputValue('');
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <ul 
        ref={messagesRef} 
        style={{ 
          listStyleType: 'none', 
          margin: 0, 
          padding: 0,
          flexGrow: 1,
          overflow: 'auto' 
        }}
      >
        {messages.map((msg, index) => (
          <li 
            key={index} 
            style={{ 
              padding: '0.5rem 1rem',
              backgroundColor: index % 2 === 0 ? '#ffffff' : '#efefef' 
            }}
          >
            {msg}
          </li>
        ))}
      </ul>

      <form 
        onSubmit={handleSubmit}
        style={{ 
          background: 'rgba(0, 0, 0, 0.15)', 
          padding: '0.25rem', 
          position: 'fixed', 
          bottom: 0, 
          left: 0, 
          right: 0, 
          display: 'flex', 
          height: '3rem', 
          boxSizing: 'border-box', 
          backdropFilter: 'blur(10px)' 
        }}
      >
        <input 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          style={{ 
            border: 'none', 
            padding: '0 1rem', 
            flexGrow: 1, 
            borderRadius: '2rem', 
            margin: '0.25rem' 
          }}
          placeholder="Type a message..." 
          autoComplete="off"
        />
        <button 
          type="submit"
          style={{ 
            background: '#333', 
            border: 'none', 
            padding: '0 1rem', 
            margin: '0.25rem', 
            borderRadius: '3px', 
            outline: 'none', 
            color: '#fff' 
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatRoom;