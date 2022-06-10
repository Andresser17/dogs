const requiredFields = (data, include = {}) => {
  return data.map((dog) => {
    const result = {};

    (result.id = dog.id),
      (result.name = dog.name),
      (result.weight = dog.weight?.metric
        ? dog.weight.metric
            .split(" ")
            .map((w) => {
              if (w === "-") return "-";

              return `${w}kg`;
            })
            .join(" ")
        : dog.weight);

    result.temperament =
      typeof dog.temperament === "object"
        ? dog.temperament.reduce((accum, item, i) => {
            if (i === dog.temperament.length - 1) {
              return accum + `${item.name}`;
            }

            return accum + `${item.name}, `;
          }, "")
        : dog.temperament;

    if (include.height)
      result.height =
        typeof dog.height === "object"
          ? dog.height.metric
              .split(" ")
              .map((w) => {
                if (w === "-") return "-";

                return `${w}cm`;
              })
              .join(" ")
          : dog.height;

    if (include.lifeSpan) result.lifeSpan = dog["life_span"];
    if (include.breedGroup) result.breedGroup = dog["breed_group"];
    if (include.created) result.created = dog.created;

    if (include.image)
      result.image = dog.image?.url
        ? dog.image?.url
        : `https://cdn2.thedogapi.com/images/${dog["reference_image_id"]}.jpg`;

    return result;
  });
};

module.exports = requiredFields;
