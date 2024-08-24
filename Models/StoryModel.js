// models/StoryModel.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../Db.js';
import User from './UsersModel.js'; // Correct import path

const Story = sequelize.define('Story', {
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User, // Reference the User model
      key: 'id',
    },
    allowNull: false,
  },
}, {
  timestamps: true,
});

// Define associations
Story.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user', // Alias for the association
});

export default Story;