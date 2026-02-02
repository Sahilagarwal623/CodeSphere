# 👨‍💻 CodeSphere – Real-Time Collaborative Code Editor

🚀 A powerful and modern online code editor that supports both **solo** and **collaborative** coding experiences – built with the **Monaco Editor**, featuring real-time **cursor sync**, **chat**, and future-ready **video call** integration.

---

## ✨ Features

- 🛠️ **Custom Rooms**
  - **Solo Mode** – Create a personal coding space to write and execute code privately.
  - **Collaborative Mode** – Invite others to your room and code together in real-time.

- 🔐 **Secure User Authentication**
  - JWT Authentication with Access & Refresh Tokens for secure login sessions.
  - Automatic token refresh without forcing users to log in repeatedly.
  
- 🧠 **Built with:**
  - JavaScript, Vite, Tailwind CSS
  - Docker, Monaco Editor
  
- 💬 **Integrated Chat**
  - Communicate with your collaborators directly inside the room using **WebSocket-based chat**.

- 🖱️ **Monaco Editor**
  - Live cursor synchronization for multiple users.
  - IntelliSense, syntax highlighting, and theming powered by [Monaco](https://microsoft.github.io/monaco-editor/).

- � **Isolated Code Execution**
  - Uses a **dedicated Code Executor microservice** with Docker to safely execute user code in a sandboxed environment.
  - Supports **Python, JavaScript, Java, and C++**.

---

## 🏗️ Architecture

```
┌─────────────┐      ┌─────────────┐      ┌──────────────────┐
│  Frontend   │ ───► │   Backend   │ ───► │  Code Executor   │
│  (Render)   │      │  (Render)   │      │  (Render/Docker) │
└─────────────┘      └─────────────┘      └──────────────────┘
                           │
                           ▼
                     ┌───────────┐
                     │  MongoDB  │
                     └───────────┘
```

| Service | Description |
|---------|-------------|
| **Frontend** | React + Vite app with Monaco Editor |
| **Backend** | Node.js/Express API with WebSocket support |
| **Code Executor** | Isolated Docker service for running user code |

---

## 🔭 Future Plans

- 🎥 **Webcam Video Calling** – Built-in video call for pair programming.
- 📁 **Multi-file Support** – Upload folders and edit multiple files.
- 📊 **AI Code Assistant** – AI-powered code completion and debugging.

---

## 🧪 Tech Stack

| Layer        | Technology                     |
|--------------|--------------------------------|
| Frontend     | JavaScript, Vite, Tailwind CSS |
| Editor       | Monaco Editor                  |
| Chat & Sync  | WebSockets                     |
| Backend      | Node.js, Express               |
| Execution    | Docker (Code Executor Service) |
| Database     | MongoDB                        |
| Hosting      | Render (All Services)          |

---

## 🚀 Deployment Guide

### Project Structure
```
CodeSphere/
├── frontend/         → Render Web Service (Static Site)
├── backend/          → Render Web Service (Node.js)
└── code-executor/    → Render Web Service (Docker)
```

### Step 1: Deploy Code Executor
1. Create a new **Web Service** on Render
2. Set **Root Directory** to `code-executor`
3. Set **Environment** to `Docker`
4. Deploy and copy the service URL

### Step 2: Deploy Backend
1. Create a new **Web Service** on Render
2. Set **Root Directory** to `backend`
3. Add environment variables:
   ```
   MONGO_URI=your_mongodb_connection_string
   CODE_EXECUTOR_URL=https://your-code-executor.onrender.com
   JWT_SECRET=your_jwt_secret
   ```
4. Deploy

### Step 3: Deploy Frontend
1. Create a new **Static Site** on Render
2. Set **Root Directory** to `frontend`
3. Add environment variable:
   ```
   VITE_BACKEND_URL=https://your-backend.onrender.com
   ```
4. Deploy

---

## 🧑‍💻 Local Development

```bash
# Clone the repository
git clone https://github.com/Sahilagarwal623/CodeSphere.git
cd CodeSphere

# Terminal 1: Start Code Executor
cd code-executor
npm install
npm start

# Terminal 2: Start Backend
cd backend
npm install
npm start

# Terminal 3: Start Frontend
cd frontend
npm install
npm run dev
```

### Environment Variables

**Backend (.env)**
```
MONGO_URI=mongodb://localhost:27017/codesphere
CODE_EXECUTOR_URL=http://localhost:3001
JWT_SECRET=your_secret
```

**Frontend (.env)**
```
VITE_BACKEND_URL=http://localhost:5000
```
