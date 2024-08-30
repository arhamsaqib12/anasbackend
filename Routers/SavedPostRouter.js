import express from 'express';
import SavedPost from '../Models/SaveModel.js'; // Adjust the path as necessary
import authenticate from '../Middleware.js'; // Adjust the path as necessary

const savedPostsRouter = express.Router();

// Save a post
savedPostsRouter.post('/posts/:postId/save', authenticate, async (req, res) => {
  const userId = req.userId; // Get user ID from authentication middleware
  const { postId } = req.params;

  try {
    const savedPost = await SavedPost.create({ userId, postId });
    res.status(201).json(savedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to save post' });
  }
});

// Remove a saved post
savedPostsRouter.delete('/posts/:postId/unsave', authenticate, async (req, res) => {
  const userId = req.userId; // Get user ID from authentication middleware
  const { postId } = req.params;

  try {
    const deleted = await SavedPost.destroy({
      where: { userId, postId }
    });

    if (deleted) {
      res.status(200).json({ message: 'Post unsaved' });
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to unsave post' });
  }
});

// Get saved posts for a user
savedPostsRouter.get('/users/:userId/saved-posts', authenticate, async (req, res) => {
  const userId = req.params.userId;

  try {
    const savedPosts = await SavedPost.findAll({
      where: { userId },
      include: [{ model: Post, as: 'post' }],
    });
    res.status(200).json(savedPosts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve saved posts' });
  }
});
savedPostsRouter.get('/posts/:postId/saved/status', authenticate, async (req, res) => {
    const userId = req.userId; // Get user ID from authentication middleware
    const { postId } = req.params;
  
    try {
      const savedPost = await SavedPost.findOne({
        where: { userId, postId }
      });
  
      if (savedPost) {
        res.status(200).json({ saved: true });
      } else {
        res.status(200).json({ saved: false });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to check save status' });
    }
  });



export default savedPostsRouter;
