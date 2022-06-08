const { Router } = require("express");
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const dogRouter = require("./dog");
const dogByIdRouter = require("./getDogById");
const tempRouter = require("./temperament");
const createDogRouter = require("./createDog");

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
router.get("/dogs", dogRouter);
router.get("/dogs/:breedId", dogByIdRouter);
router.get("/temperaments", tempRouter);
router.post("/dogs", createDogRouter);

module.exports = router;
