import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../Models/UsersModel.js"; // Correct import path

const signup = async (req, res) => {
  const { email, fullName, username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      fullName,
      username,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign({ id: user.id }, "your_jwt_secret", {
      expiresIn: "1h",
    });

    // Include the user ID in the response
    res.status(200).json({
      message: "Logged in successfully",
      token,
      userId: user.id, // Add this line to include the user ID
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

export const updateProfilePicture = async (req, res) => {
  const userId = req.params.id;

  try {
    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Get the filename of the uploaded file
    const profileImage = req.file.filename;

    // Find and update the user's profile picture in the database
    const [updated] = await User.update(
      { profilePicture: profileImage },
      { where: { id: userId } }
    );

    // Check if the user was updated
    if (updated) {
      // Fetch the updated user data
      const updatedUser = await User.findByPk(userId);
      return res.status(200).json({ message: 'Profile picture updated', user: updatedUser });
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating profile picture:', error);
    res.status(500).json({ message: 'Error updating profile picture', error });
  }
};
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll(); // Retrieves all users from the database
    res.status(200).json(users); // Respond with the list of users
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users', error });
  }
};


const getUserById = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findByPk(userId); // Fetch user by primary key (ID)

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user); // Respond with the user data
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    res.status(500).json({ message: 'Error fetching user by ID', error });
  }
};

export { signup, login, getAllUsers, getUserById };
