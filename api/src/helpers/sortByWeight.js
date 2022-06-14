// sort by average weight
const sortByWeight = (data, sort, order) => {
  const getAverage = (w) => {
    const splited = w.split(" ");
    const regex = /(\d+)([A-Za-z]+)$/i;
    const max =
      splited[0] && splited[0] !== "NaNkg"
        ? Number(splited[0].match(regex)[1])
        : 0;
    const min =
      splited[2] && splited[2] !== "NaNkg"
        ? Number(splited[2].match(regex)[1])
        : 0;

    return (max + min) / 2;
  };

  return data.sort((a, b) => {
    if (!a.hasOwnProperty(sort) || !b.hasOwnProperty(sort)) {
      // property doesn't exist on either object
      return 0;
    }
    const averageA = getAverage(a[sort]);
    const averageB = getAverage(b[sort]);

    // convert strings to uppercase
    a = typeof a === "string" ? a.toUpperCase() : a;
    b = typeof b === "string" ? b.toUpperCase() : b;

    if (order === "desc") {
      if (averageA > averageB) return -1;
      if (averageA < averageB < 0) return 1;
    }

    if (order === "asc") {
      if (averageA < averageB) return -1;
      if (averageA > averageB < 0) return 1;
    }
  });
};

module.exports = sortByWeight;
