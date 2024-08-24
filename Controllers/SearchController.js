import Post from '../Models/PostModel.js'; // Adjust the path to your Post model
import User from '../Models/UsersModel.js'; // Adjust the path to your User model
import { Op } from 'sequelize'; // Sequelize operator for performing search queries

export const searchEverything = async (req, res) => {
  const { query } = req.query; // Assume search query is sent as a query parameter like /search?query=something

  if (!query) {
    return res.status(400).json({ error: 'Search query is required' });
  }

  try {
    // Search for users matching the query by username or full name
    const users = await User.findAll({
      where: {
        [Op.or]: [
          { username: { [Op.like]: `%${query}%` } },
          { fullName: { [Op.like]: `%${query}%` } },
        ],
      },
      attributes: ['id', 'username', 'fullName'], // Exclude 'profileImage' if it does not exist
    });

    // Search for posts matching the query by caption
    const posts = await Post.findAll({
      where: {
        caption: { [Op.like]: `%${query}%` },
      },
      include: {
        model: User,
        attributes: ['username'], // Include the username of the post creator
      },
    });

    // Return both results in a combined object
    res.json({ users, posts });
  } catch (error) {
    console.error('Error performing search:', error);
    res.status(500).json({ error: 'Failed to perform search' });
  }
};
