require("dotenv").config();
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");
// Envs
const { DATABASE_URL } = process.env;

const sequelize = new Sequelize(DATABASE_URL);

const basename = path.basename(__filename);
const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, "/models"))
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, "/models", file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach((model) => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

// Associations
const { Dog, Temperament } = sequelize.models;

Dog.belongsToMany(Temperament, { through: "DogTemp", as: "temperament" });
Temperament.belongsToMany(Dog, { through: "DogTemp", as: "breeds" });

const connect = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");
    // change this line before production
    await sequelize.sync({ force: false });
    console.log("All models were synchronized successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

const disconnect = async () => await sequelize.close();

module.exports = {
  ...sequelize.models,
  connect,
  disconnect,
};
