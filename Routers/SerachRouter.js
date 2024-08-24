import express from 'express';
import { searchEverything } from '../Controllers/SearchController.js'; // Adjust path accordingly

const searchrouter = express.Router();

searchrouter.get('/search', searchEverything); // Define the route for search

export default searchrouter;
