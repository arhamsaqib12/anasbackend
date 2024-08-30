import jwt from 'jsonwebtoken';
import User from './Models/UsersModel.js'; // Adjust the path as necessary

const authenticate = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return res.status(401).json({ message: 'Authorization header is missing' });
    }

    const token = authorizationHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token is missing' });
    }

    const jwtSecret = process.env.JWT_SECRET; // Load JWT secret from environment variable
    if (!jwtSecret) {
      throw new Error('JWT secret is not defined');
    }

    const decoded = jwt.verify(token, jwtSecret);
    const user = await User.findByPk(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user; // Set the user object in the request
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    res.status(401).json({ message: 'Authentication failed', error: error.message });
  }
};

export default authenticate;
