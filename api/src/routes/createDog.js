const axios = require("axios");

const necessaryData = (breed) => {
  const weight = breed.weight.metric
    .split(" ")
    .map((w) => {
      if (w === "-") return "-";

      return `${w}kg`;
    })
    .join(" ");

  const height = breed.height.metric
    .split(" ")
    .map((w) => {
      if (w === "-") return "-";

      return `${w}cm`;
    })
    .join(" ");

  const image = breed.image?.url
    ? breed.image?.url
    : `https://cdn2.thedogapi.com/images/${breed["reference_image_id"]}.jpg`;
  return {
    id: breed.id,
    image,
    name: breed.name,
    temperament: breed.temperament,
    weight,
    height,
    lifeSpan: breed["life_span"],
    breedGroup: breed["breed_group"],
  };
};

const createDogRouter = async (req, res) => {
  // get breed by id
  try {
    const { data } = await axios.get(
      "https://api.thedogapi.com/v1/breeds/" + req.params.breedId
    );

    if (Object.keys(data).length === 0) {
      res.status(404).json({ message: "Dog breed don't exist" });
      return;
    }

    // Get details endpoint necessary data
    res.status(200).json(necessaryData(data));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = createDogRouter;
