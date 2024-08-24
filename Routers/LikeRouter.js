import express from 'express';
import Like from '../Models/LikeModel.js';
import Post from '../Models/PostModel.js';
import { sequelize } from '../Db.js';

const likerouter = express.Router();

// Like a post
likerouter.post('/posts/:postId/like', async (req, res) => {
  const { userId } = req.body;
  const { postId } = req.params;

  try {
    const existingLike = await Like.findOne({ where: { userId, postId } });
    if (existingLike) {
      return res.status(400).json({ message: 'Already liked' });
    }

    await Like.create({ userId, postId });

    await Post.update(
      { likes: sequelize.literal('(SELECT COUNT(*) FROM likes WHERE postId = :postId)') },
      { where: { id: postId }, replacements: { postId } }
    );

    res.status(201).json({ message: 'Post liked' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Unlike a post
likerouter.delete('/posts/:postId/like', async (req, res) => {
  const { userId } = req.body;
  const { postId } = req.params;

  try {
    await Like.destroy({ where: { userId, postId } });
    await Post.update(
      { likes: sequelize.literal('(SELECT COUNT(*) FROM likes WHERE postId = :postId)') },
      { where: { id: postId }, replacements: { postId } }
    );

    res.status(200).json({ message: 'Post unliked' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check like status
likerouter.get('/posts/:postId/like/status', async (req, res) => {
  const { userId } = req.query;
  const { postId } = req.params;

  try {
    const like = await Like.findOne({ where: { userId, postId } });
    res.status(200).json({ liked: !!like });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get like count
likerouter.get('/posts/:postId/like/count', async (req, res) => {
  const { postId } = req.params;

  try {
    const likeCount = await Like.count({ where: { postId } });
    res.status(200).json({ likeCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default likerouter;
