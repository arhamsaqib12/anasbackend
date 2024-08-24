import Post from '../Models/PostModel.js'; // Adjust the path to your Post model
import User from '../Models/UsersModel.js'; // Adjust the path to your User model

// Get all posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: User // Ensure User model is included to get user details
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving posts' });
  }
};

// Get posts by user ID
export const getPostsByUserId = async (req, res) => {
    const { userId } = req.params;
    try {
      const posts = await Post.findAll({ where: { userId } });
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve posts' });
    }
  };

// Create a new post
export const createPost = async (req, res) => {
    const { userId, caption } = req.body;
    const imageUrl = req.file ? req.file.path : null; // Get image path from Multer
  
    try {
      const post = await Post.create({ userId, imageUrl, caption });
      res.status(201).json(post);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create post' });
    }
  };
  

// Update an existing post
export const updatePost = async (req, res) => {
  const { id } = req.params;
  const { userId, imageUrl, caption } = req.body;
  try {
    const post = await Post.findByPk(id);
    if (post) {
      post.userId = userId ?? post.userId;
      post.imageUrl = imageUrl ?? post.imageUrl;
      post.caption = caption ?? post.caption;
      await post.save();
      res.json(post);
    } else {
      res.status(404).json({ error: 'Post not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update post' });
  }
};

// Delete a post
export const deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findByPk(id);
    if (post) {
      await post.destroy();
      res.status(204).end();
    } else {
      res.status(404).json({ error: 'Post not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete post' });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve user' });
  }
};
