# CollabWhiteBoard

A **real-time collaborative whiteboard** that allows multiple users to draw, write, and interact live — recreating the experience of a physical whiteboard in your browser.

---
##  Demo Video

Watch the app in action:  
[![Watch the demo](https://img.youtube.com/vi/D-nu_yf8fTM/hqdefault.jpg)](https://youtu.be/D-nu_yf8fTM)

## Deployment Links

- **Frontend**: [collab-white-board-frontend.vercel.app](https://collab-white-board-frontend.vercel.app)
- **Backend**: [collabwhiteboard-backend01.onrender.com](https://collabwhiteboard-backend01.onrender.com)
- **Backend Repo Link**: [github.com/Heckerdevl/CollabWhiteBoard-Backed](https://github.com/Heckerdevl/CollabWhiteBoard-Backed)

##  Features

- **Drawing Tools**: Pen, rectangle, color picker
- **Real-Time Sync**: Powered by WebSockets (Socket.IO)
- **Multi-User Collaboration**: Create or join rooms 
- **Save & Export**: Download your whiteboard as PNG or PDF
- **Canvas Controls**: Undo/Redo, clear canvas

---

##  Tech Stack

| Layer     | Tech                                      |
|-----------|-------------------------------------------|
| Frontend  | React.js, HTML5 Canvas        |
| Backend   | Node.js, Express.js, Socket.IO             |
| Database  | MongoDB (via Mongoose)                     |
| Hosting   | Vercel(frontend), Render (backend) |

---

##  Project Structure

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

##  Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Heckerdevl/CollabWhiteBoard-Frontend.git
cd CollabWhiteBoard


Backend
cd backend
npm install
npm start

Environment Vairable
PORT=3000
MONGO_URI=mongodb+srv://codinggeeks27:dVwMr1TlrNgM4yjn@cluster0.o5btegm.mongodb.net/CollabWhiteBoard


Frontend
cd frontend
npm install
npm run dev  
Environment Vairable
VITE_SERVER_URL=wss://collabwhiteboard-backend01.onrender.com





