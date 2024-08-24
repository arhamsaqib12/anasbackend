import { DataTypes } from 'sequelize';
import { sequelize } from '../Db.js'; // Adjust the path as necessary
import User from './UsersModel.js'; // Adjust the path as necessary

const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users', // Adjusted to match the table name in the database
      key: 'id',
    },
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  caption: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

User.hasMany(Post, { foreignKey: 'userId' });
Post.belongsTo(User, { foreignKey: 'userId' });

export default Post;
