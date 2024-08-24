import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('imdbanas', 'root', 'aleena123', {
  host: 'localhost',
  dialect: 'mysql',
  
});

export { sequelize };