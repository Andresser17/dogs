const axios = require("axios");
const { Temperament } = require("../../src/db.js");

const saveTemps = async () => {
  const { data } = await axios.get("https://api.thedogapi.com/v1/breeds");

  // map to get only temperaments
  const temps = data.reduce((accum, breed) => {
    if (breed.temperament && breed.temperament.length > 0) {
      // split temperament string
      const splited = breed.temperament.split(", ");
      // if temp is repeated, not merge
      const filtered = splited.filter((t) => !accum.includes(t));

      return [...accum, ...filtered];
    }
    return accum;
  }, []);

  // save in db
  for (let [temp] of Object.entries(temps)) {
    await Temperament.create({
      name: temp,
    });
  }
};

const tempRouter = async (_, res) => {
  try {
    // check that db is empty
    const readDB = await Temperament.findAll();
    // if db is empty
    if (readDB.length === 0) await saveTemps();

    // read db again
    const readAgain = await Temperament.findAll();
    const temps = readAgain.map((t) => ({ id: t.id, name: t.name }));

    res.status(200).json(temps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = tempRouter;
