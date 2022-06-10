const axios = require("axios");
const { Dog, Temperament } = require("../../src/db.js");

const associateTemps = async (breed, temperament = []) => {
  const readTemps = await Temperament.findAll();
  const mappedTemps = readTemps.map((t) => t.name);

  for (let temp of temperament) {
    // if temp don't exist, save
    if (!mappedTemps.includes(temp)) {
      // save temp
      await Temperament.create({ name: temp });
    }

    // find temperament rows
    const findedTemp = await Temperament.findOne({
      where: {
        name: temp,
      },
    });

    // INSERT new temperaments
    await breed.addTemperament(findedTemp, { through: "DogTemp" });
  }

  return breed;
};

const createDogRouter = async (req, res) => {
  // get body
  const { name, height, weight, lifeSpan, temperament } = req.body;

  try {
    // create new dog breed
    const breed = await Dog.create(
      {
        name,
        height,
        weight,
        lifeSpan,
      },
      { include: "temperament" }
    );
    const associated = await associateTemps(breed, temperament);

    res
      .status(200)
      .json({ message: "success, saved breed in db", id: associated.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = createDogRouter;
