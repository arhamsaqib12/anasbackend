import express from "express";
import cors from "cors";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import authrouter from "./Routers/UserRouter.js"; // Correct import path
import postrouter from "./Routers/PostRouter.js";
import { sequelize } from "./Db.js";
import "./Models/InitializeAssociations.js";
import User from "./Models/UsersModel.js";
import storyrouter from "./Routers/StoryRouter.js";
import searchrouter from "./Routers/SerachRouter.js";
import Like from "./Models/LikeModel.js";
import likerouter from "./Routers/LikeRouter.js";

const app = express();
const port = 5000;

// Serve static files
app.use("/uploads", express.static("uploads"));
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/uploads/profile_pics', express.static('uploads/profile_pics'));

// Define routes
app.use("/", searchrouter);
app.use("/user", authrouter); // Authentication routes
app.use("/", postrouter); // Post routes with a specific prefix
app.use("/story", storyrouter);
app.use("/like", likerouter);

// Set up Socket.IO
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: ['http://localhost:3000', 'https://twit-backend-production.up.railway.app'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('joinRoom', ({ roomId, userId }) => {
    console.log(`User ${userId} joining room ${roomId}`);
    socket.join(roomId);
  });

  socket.on('chatMessage', ({ roomId, message }) => {
    io.to(roomId).emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Test database connection
sequelize.authenticate()
  .then(() => {
    console.log("Connection to Sequelize has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

// Synchronize Sequelize models with the database
sequelize.sync().then(() => {
  console.log("Database & tables created with Sequelize!");
}).catch(console.error);

// Start the server
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
