# 👨‍💻 CodeSphere – Real-Time Collaborative Code Editor

🚀 A powerful and modern online code editor that supports both **solo** and **collaborative** coding experiences – built with the **Monaco Editor**, featuring real-time **cursor sync**, **chat**, and future-ready **video call** integration.

---

## ✨ Features

- 🛠️ **Custom Rooms**
  - **Solo Mode** – Create a personal coding space to write and execute code privately.
  - **Collaborative Mode** – Invite others to your room and code together in real-time.
  
- 🧠 **Built with:**
  - [JavaScript]
  - [Vite]
  - [Tailwind CSS]
  - [Docker]
  - [Monaco Editor]
  
- 💬 **Integrated Chat**
  - Communicate with your collaborators directly inside the room using **WebSocket-based chat**.

- 🖱️ **Monaco Editor**
  - Live cursor synchronization for multiple users.
  - IntelliSense, syntax highlighting, and theming powered by [Monaco](https://microsoft.github.io/monaco-editor/).

- 🔐 **Secure Deployment**
  - **Frontend** deployed on [Render]
  - **Backend** hosted on **AWS EC2** with **SSL certificate** and **custom domain**.
  
- 🐳 **Isolated Code Execution**
  - Uses **Docker containers** to safely execute user code in a sandboxed environment.

---

## 🔭 Future Plans

- 🎥 **Webcam Video Calling**
  - Built-in video call feature inside collaborative rooms for smoother pair programming and team discussions.
  
- 📁 **Multi-file Support**
  - Support for uploading folders and editing multiple files in a session.

- 📊 **AI Code Assistant**
  - Built-in AI to assist with code completion and debugging.

---

## 🧪 Tech Stack

| Layer        | Technology                     |
|--------------|--------------------------------|
| Frontend     | JavaScript, Vite, Tailwind CSS |
| Editor       | Monaco Editor                  |
| Chat & Sync  | WebSockets                     |
| Backend      | Node.js, Express, AWS EC2      |
| Execution    | Docker                         |
| Hosting      | Render (Frontend), AWS(Backend)|
| Domain       | Custom with SSL                |

---

## 🧑‍💻 Getting Started (Dev Setup)

```bash
# Clone the repository
git clone https://github.com/Sahilagarwal623/CodeSphere.git
cd CodeSphere

# Install frontend dependencies
cd frontend
npm install

# Start frontend
npm run dev

# Start backend in a separate terminal
cd ../backend
npm install
nodemon index.js
