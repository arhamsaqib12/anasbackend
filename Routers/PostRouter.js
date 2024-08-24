import express from 'express';
import upload from '../uploadConfig.js'; // Ensure correct path
import {
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
  getUserById,
  getPostsByUserId
} from '../Controllers/PostController.js'; // Ensure correct path

const postrouter = express.Router();

// Post routes
postrouter.get('/posts', getAllPosts);
postrouter.get('/users/:userId/posts', getPostsByUserId);
postrouter.post('/posts', upload.single('image'), createPost); // Handle single file upload
postrouter.put('/posts/:id', updatePost);
postrouter.delete('/posts/:id', deletePost);

// User route
postrouter.get('/users/:id', getUserById);

export default postrouter;
