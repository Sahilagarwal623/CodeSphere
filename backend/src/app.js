import express from 'express';
import http from 'http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { Server } from "socket.io";
// import fs from 'fs/promises';


// const key = await fs.readFile('cert.key');
// const cert = await fs.readFile('cert.crt');

const app = express();
// app.use(express.static(__dirname))
const server = http.createServer( app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true
  }
});


const rooms = {};

io.on("connection", (socket) => {

  socket.on("join-room", ({ roomId, username }) => {
    console.log(`a new user connected with username: ${username} and roomId: ${roomId} with socket Id: ${socket.id}`);

    socket.join(roomId);
    socket.roomId = roomId; // save roomId in socket object


    if (!rooms[roomId]) {
      rooms[roomId] = { code: "", cursors: {}, length: 0 };
    }

    rooms[roomId].length += 1;
    // Send current code to the new user
    socket.emit("init-code", rooms[roomId].code);
    io.to(roomId).emit('send-message', { username, message: `${username} joined the room.` });

    console.log("rooms: ", rooms);
  });


  socket.on("code-change", ({ code, position }) => {
    const roomId = socket.roomId;
    if (rooms[roomId]) {
      rooms[roomId].code = code;
      rooms[roomId].cursors[socket.id] = position;
      socket.to(roomId).emit("code-change", { code, position, userId: socket.id });
    }
  });

  socket.on('send-message', ({ username, message }) => {
    const roomId = socket.roomId;
    io.to(roomId).emit('send-message', ({ username, message }));
  })

  socket.on('leaveRoom', ({ roomId, username }) => {
    socket.leave(roomId);
    rooms[roomId].length -= 1;
    if (rooms[roomId] && rooms[roomId].cursors) {
      delete rooms[roomId].cursors[socket.id];
    }
    if (rooms[roomId].length === 0) {
      delete rooms[roomId];
    }
    io.to(roomId).emit('send-message', { username, message: `${username} left the room.` });
    console.log(`socketId: ${socket.id} left the roomId: ${roomId}`);
    console.log("rooms: ", rooms);
  });
});

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ limit: '16kb', extended: true }));
app.use(cookieParser());


//routes

import userRouter from './routes/user.routes.js';
import roomRouter from './routes/room.routes.js';


//routes declaration
app.use('/users', userRouter);
app.use('/room', roomRouter);

export { server };