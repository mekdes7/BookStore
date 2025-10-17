import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';

import bookRoutes from './SRC/Routes/bookRoutes.js';
import router from './SRC/Routes/readerRouter.js';
import pool from './SRC/db.js';
import authorRouter from './SRC/Routes/authorRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app); 

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5000"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const connectedUsers = new Map(); 

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('userJoined', (userData) => {
    const { userId, role } = userData;
    connectedUsers.set(userId, { socketId: socket.id, role });
    console.log(`User ${userId} (${role}) connected with socket ${socket.id}`);
    
    const readerCount = Array.from(connectedUsers.values()).filter(user => user.role === 'reader').length;
    console.log(`Total connected readers: ${readerCount}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  
    for (let [userId, userData] of connectedUsers.entries()) {
      if (userData.socketId === socket.id) {
        connectedUsers.delete(userId);
        console.log(`User ${userId} (${userData.role}) disconnected`);
        break;
      }
    }
  });
});

export { io };

export const notifyReaders = (book) => {
  const readers = Array.from(connectedUsers.entries())
    .filter(([userId, userData]) => userData.role === 'reader')
    .map(([userId, userData]) => userData.socketId);

  console.log(`Notifying ${readers.length} readers about new book: ${book.title}`);
  
  if (readers.length > 0) {
    readers.forEach(socketId => {
      io.to(socketId).emit("newBookAdded", book);
    });
    console.log(`Notification sent to ${readers.length} readers`);
  } else {
    console.log('No readers connected to notify');
  }
};
export const notifyNewBook = (book) => {
  console.log('Emitting new book to ALL connected clients:', book.title);
  io.emit("newBookAdded", book);
};
app.use('/api/books', bookRoutes);
app.use('/api/readers', router);
app.use('/api/authors',authorRouter);
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({
      status: 'OK',
      database: 'Connected',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: 'Error',
      database: 'Disconnected',
      error: error.message,
    });
  }
});

app.post('/api/test-notification', (req, res) => {
  const testBook = {
    id: Date.now(),
    title: "Test Book Notification",
    author_name: "Test Author",
    category: "Fiction",
    book_cover: "https://via.placeholder.com/150",
    timestamp: new Date().toLocaleTimeString()
  };
  
  notifyReaders(testBook);
  res.json({ message: "Test notification sent to readers", book: testBook });
});

const testDatabaseConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('PostgreSQL connected successfully!');
    client.release();
    const result = await pool.query('SELECT NOW() as current_time');
    console.log('Database time:', result.rows[0].current_time);
  } catch (error) {
    console.error('Database connection failed:', error.message);
  }
};

const PORT = process.env.PORT || 5000;
server.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await testDatabaseConnection();
});