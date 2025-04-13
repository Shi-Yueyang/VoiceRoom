# 🎤 Voice Chat App

A real-time online voice chat room built with **React**, **Express**, **WebRTC**, and **Socket.IO**.

## 🚀 Features

- 🔊 Real-time peer-to-peer voice communication
- 👥 Join or create chat rooms
- ⚡ Live signaling using WebSockets (Socket.IO)
- 🌐 WebRTC for low-latency audio streaming
- 🔒 Optional user authentication and room management

---

## 🛠️ Tech Stack

| Frontend     | Backend       | Real-time     | Media      |
|--------------|---------------|---------------|------------|
| React + Vite | Express + TS  | Socket.IO     | WebRTC     |

---

## 📁 Project Structure

```
/voice-chat-app
├── /client   # React + Vite frontend
└── /server   # Express + TypeScript backend
```

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/your-username/voice-chat-app.git
cd voice-chat-app
```

### 2. Set up the backend

```bash
cd server
npm install
npm run dev
```

### 3. Set up the frontend

```bash
cd client
npm install
npm run dev
```

The frontend will be served at http://localhost:5173 and the backend at http://localhost:3001.

## 🧠 How It Works

- Users join a room via the frontend.
- Socket.IO is used for signaling (offer/answer/ICE candidates).
- WebRTC creates peer-to-peer voice connections.
- Audio streams flow directly between clients.

## 🌐 Future Improvements

- User authentication (JWT)
- Persistent chat history
- TURN/STUN server integration
- UI/UX enhancements
- Mobile responsiveness

## 📄 License

MIT License © [Your Name]