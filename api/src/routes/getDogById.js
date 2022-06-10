const axios = require("axios");
// models
const { Dog } = require("../db");
// helpers
const requiredFields = require("../helpers/requiredFields");

const dogByIdRouter = async (req, res) => {
  let data = {};

  // get breed by id
  try {
    if (Number(req.params.breedId)) {
      const { data: api } = await axios.get(
        "https://api.thedogapi.com/v1/breeds/" + req.params.breedId
      );

      if (Object.keys(api).length === 0) {
        res.status(404).json({ message: "Dog breed don't exist" });
        return;
      }

      data = requiredFields([api], {
        image: true,
        lifeSpan: true,
        breedGroup: true,
        height: true,
      });
    }

    const createdId = req.params.breedId.split("_");
    if (createdId.includes("created")) {
      const db = await Dog.findOne({
        where: {
          id: Number(createdId[1]),
        },
        include: "temperament",
      });

      if (db === null) {
        res.status(404).json({ message: "Dog breed don't exist" });
        return;
      }

      data = requiredFields([db], {
        created: true,
        lifeSpan: true,
        breedGroup: true,
        height: true,
      });
    }

    // Get details endpoint necessary data
    res.status(200).json(data[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = dogByIdRouter;
