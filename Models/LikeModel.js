import { DataTypes } from 'sequelize';
import { sequelize } from '../Db.js'; // Adjust the import path as needed

const Like = sequelize.define('Like', {
  // Define attributes
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  postId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  // Model options
  timestamps: true, // Adds createdAt and updatedAt timestamps
  tableName: 'likes', // Customize the table name if needed
});

// Define relationships
// Assuming you have User and Post models
import User from './UsersModel.js'; // Adjust the import path as needed
import Post from './PostModel.js'; // Adjust the import path as needed

// Define associations
Like.belongsTo(User, { foreignKey: 'userId' });
Like.belongsTo(Post, { foreignKey: 'postId' });

export default Like;
