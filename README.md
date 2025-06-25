# 🧑‍🤝‍🧑 CollabWhiteBoard

A **real-time collaborative whiteboard** that allows multiple users to draw, write, and interact live — recreating the experience of a physical whiteboard in your browser.

---
## 🎬 Demo Video

Watch the app in action:  
[![Watch the demo](https://img.youtube.com/vi/D-nu_yf8fTM/hqdefault.jpg)](https://youtu.be/D-nu_yf8fTM)

## ✨ Features

- 🖊️ **Drawing Tools**: Pen, rectangle, color picker
- 🔁 **Real-Time Sync**: Powered by WebSockets (Socket.IO)
- 👥 **Multi-User Collaboration**: Create or join rooms 
- 💾 **Save & Export**: Download your whiteboard as PNG or PDF
- 🧹 **Canvas Controls**: Undo/Redo, clear canvas

---

## ⚙️ Tech Stack

| Layer     | Tech                                      |
|-----------|-------------------------------------------|
| Frontend  | React.js, HTML5 Canvas / Fabric.js         |
| Backend   | Node.js, Express.js, Socket.IO             |
| Database  | MongoDB (via Mongoose)                     |
| Hosting   | Vercel / Netlify (frontend), Render / Heroku (backend) |

---

## 📁 Project Structure

CollabWhiteBoard/
├── backend/
│ ├── models/ # User model (Mongoose)
│ ├── utils/ # User utility functions
│ ├── server.js # Express + Socket.IO server
│ └── .env # Backend environment variables
│
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ │ ├── Forms/ # Room create/join forms
│ │ │ └── Whiteboard/ # Drawing & canvas logic
│ │ ├── pages/ # Room page logic
│ │ ├── App.jsx
│ │ └── main.jsx
│ └── .env # Frontend environment variables


---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Heckerdevl/CollabWhiteBoard-Frontend.git
cd CollabWhiteBoard


Backend
cd backend
npm install

Environment Vairable
PORT=3000
MONGO_URI=mongodb+srv://codinggeeks27:dVwMr1TlrNgM4yjn@cluster0.o5btegm.mongodb.net/CollabWhiteBoard
npm start


Frontend
cd frontend
npm install
npm run dev  # If using Vite
Environment Vairable
VITE_BACKEND_URL=http://localhost:3000





