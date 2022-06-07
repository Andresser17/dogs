const axios = require("axios");

const necessaryData = (data) => {
  return data.map((dog) => {
    const weight = dog.weight.metric
      .split(" ")
      .map((w) => {
        if (w === "-") return "-";

        return `${w}kg`;
      })
      .join(" ");

    const image = dog.image?.url
      ? dog.image?.url
      : `https://cdn2.thedogapi.com/images/${dog["reference_image_id"]}.jpg`;
    return {
      id: dog.id,
      image,
      name: dog.name,
      temperament: dog.temperament,
      weight,
    };
  });
};

const dogRouter = async (req, res) => {
  // Search by name
  if (req.query.name) {
    try {
      const { data } = await axios.get(
        `https://api.thedogapi.com/v1/breeds/search?name=${req.query.name}`
      );

      if (data.length === 0) {
        res.status(404).json({ message: "Dog breed don't exist" });
        return;
      }

      // Get only primary endpoint necessary data
      res.status(200).json(necessaryData(data));
    } catch (err) {
      res.status(500).json({ message: err.message });
    }

    return;
  }

  try {
    const { data } = await axios.get("https://api.thedogapi.com/v1/breeds");

    // Get only primary endpoint necessary data
    res.status(200).json(necessaryData(data));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = dogRouter;
