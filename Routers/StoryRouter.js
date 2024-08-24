import express from "express";
import upload from "../uploadConfig.js"; // Adjust path if needed
import {
  createStory,
  getStoryById,
  getAllStories,
} from "../Controllers/StoryController.js";

const storyrouter = express.Router();

// Route to handle file upload
storyrouter.post("/upload", upload.single("image"), createStory);

// Route to get stories by user ID
storyrouter.get("/:storyId", getStoryById);


// Route to get all stories
storyrouter.get("/", getAllStories);

export default storyrouter;
