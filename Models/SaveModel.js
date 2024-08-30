import { DataTypes } from 'sequelize';
import { sequelize } from '../Db.js'; // Adjust the path as necessary
import User from './UsersModel.js'; // Adjust the path as necessary
import Post from './PostModel.js'; // Adjust the path as necessary

const SavedPost = sequelize.define('SavedPost', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  postId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Posts',
      key: 'id',
    },
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

User.belongsToMany(Post, { through: SavedPost, foreignKey: 'userId' });
Post.belongsToMany(User, { through: SavedPost, foreignKey: 'postId' });

export default SavedPost;
