function filterByTemp(data, temp) {
  return data.filter((dog) => {
    if (!dog.temperament) return false;

    return dog.temperament.split(", ").includes(temp);
  });
}

module.exports = filterByTemp;
