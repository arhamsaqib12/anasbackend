import express from 'express';
import { signup, login, updateProfilePicture ,getAllUsers,getUserById} from '../Controllers/UserController.js';
import upload from '../uploadConfig.js';

const authrouter = express.Router();

authrouter.post('/signup', signup);
authrouter.post('/login', login);
authrouter.put('/profile-picture/user/:id', upload.single('profilePicture'), updateProfilePicture);
// Route to get all users
authrouter.get("/", getAllUsers);
authrouter.get('/user/:id', getUserById);
export default authrouter;
