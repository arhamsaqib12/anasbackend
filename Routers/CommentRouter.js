import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import Comment from '../Models/CommentModel.js';
import User from '../Models/UsersModel.js';
import Post from '../Models/PostModel.js';
const commentRouter = express.Router();
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());

// Define your routes here...

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log('A user connected');
  
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Fetch comments for a specific post
commentRouter.get('/posts/:postId/specomments', async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.findAll({
      where: { postId },
      include: [User], // Include user details
      order: [['createdAt', 'ASC']],
    });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching comments', error });
  }
});

// Create a new comment
commentRouter.post('/posts/:postId/comments', async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId, commentText } = req.body;

    const newComment = await Comment.create({
      postId,
      userId,
      commentText,
    });

    const commentWithUser = await Comment.findByPk(newComment.id, {
      include: [User], // Include user details
    });

    // Emit the new comment to all connected clients
    io.emit('new-comment', { postId, comment: commentWithUser });

    res.status(201).json(commentWithUser);
  } catch (error) {
    res.status(500).json({ message: 'Error creating comment', error });
  }
});

// Delete a comment
commentRouter.delete('/comments/:commentId', async (req, res) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findByPk(commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Authorization check (assuming req.userId is available)
    if (comment.userId !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await comment.destroy();
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting comment', error });
  }
});

// Start the server
const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});




export default commentRouter; // Default export