import Story from "../Models/StoryModel.js"; // Adjust the path if necessary
import User from '../Models/UsersModel.js'; // Adjust the path to your User model
export const createStory = async (req, res) => {
  try {
    const { userId } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const story = await Story.create({ imageUrl, expiresAt, userId });
    res.status(201).json(story);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Other controller functions
export const getStoryById = async (req, res) => {
  try {
    const { storyId } = req.params;

    // Fetch the story with the associated user
    const story = await Story.findOne({
      where: { id: storyId },
      include: [{ model: User, as: 'user', attributes: ['username', 'profilePicture'] }],
    });

    // Check if story exists
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    // Return the story with associated user details
    res.status(200).json(story);
  } catch (error) {
    // Handle errors
    res.status(500).json({ error: error.message });
  }
};

export const getAllStories = async (req, res) => {
  try {
    const stories = await Story.findAll();
    res.status(200).json(stories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};







// Other controller functions...

// Deleting expired stories
export const deleteExpiredStories = async () => {
  try {
    const now = new Date();
    await Story.destroy({
      where: {
        expiresAt: {
          [Op.lte]: now,
        },
      },
    });
  } catch (error) {
    console.error("Error deleting expired stories:", error);
  }
};

// Call the deleteExpiredStories function periodically
setInterval(deleteExpiredStories, 60 * 60 * 1000); // Run every hour
