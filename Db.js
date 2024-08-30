import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('imdbanas', 'root', 'aleena123', {
  host: 'localhost',
  dialect: 'mysql',
  logging: console.log, // Enable logging
});
export { sequelize };
