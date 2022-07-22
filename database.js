const { Sequelize, DataTypes, Model } = require('sequelize');
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DB_USER,
  process.env.PASSWORD,
  {
    host: process.env.HOST,
    dialect: "postgres",
  }
);

async function checkConnection() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

checkConnection();

class User extends Model {}
class Room extends Model {}
class Message extends Model {}


User.init(
  {
    ID: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    Username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize
  }
);

Room.init(
  {
    ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Roomname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
  }
);

Message.init({
    ID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    MessageText: {
        type: DataTypes.STRING,
    },
}, {
    sequelize
});

Room.hasMany(User);
User.hasMany(Message);
Room.hasMany(Message);

async function createTables(){
    await sequelize.sync({ alter: true });
}

createTables();

module.exports = {
  sequelize,
  User,
  Model,
  Room
}







