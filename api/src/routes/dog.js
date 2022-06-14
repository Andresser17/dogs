const axios = require("axios");
// models
const { Dog } = require("../db");
// helpers
const requiredFields = require("../helpers/requiredFields");
const pagination = require("../helpers/pagination");
const sortByWeight = require("../helpers/sortByWeight");
const filterByTemp = require("../helpers/filterByTemp");

let cache = {};

const sortResults = (data, sort, order) => {
  sort = sort ? sort : "id";
  order = order ? order : "asc";

  // sort by weight
  if (sort === "weight") return sortByWeight(data, sort, order);

  return data.sort((a, b) => {
    if (order === "desc") {
      if (!a.hasOwnProperty(sort) || !b.hasOwnProperty(sort)) {
        // property doesn't exist on either object
        return 0;
      }

      // convert strings to uppercase
      a = typeof a === "string" ? a.toUpperCase() : a;
      b = typeof b === "string" ? b.toUpperCase() : b;

      if (a[sort] > b[sort]) return -1;

      if (a[sort] < b[sort] < 0) return 1;
    }
  });
};

const filters = (data, queries) => {
  if (!data || data.length === 0) return data;

  // filter by temperament
  if (queries.temp && queries.temp !== "default")
    data = filterByTemp([...data], queries.temp);

  // sort by and order
  if (queries.sort || queries.order)
    data = sortResults([...data], queries.sort, queries.order);

  // pagination
  if (queries.limit) data = pagination([...data], queries.limit, queries.page);

  return data;
};

const dogRouter = async (req, res) => {
  let data = {};

  // Search by name
  if (req.query.name) {
    try {
      const { data: api } = await axios.get(
        `https://api.thedogapi.com/v1/breeds/search?name=${req.query.name}`
      );

      if (api.length === 0) {
        res.status(404).json({ message: "Dog breed don't exist" });
        return;
      }

      data = requiredFields(api, { image: true });

      // filters
      if (Object.keys(req.query).length > 0) {
        const filteredData = filters(data, req.query);
        // data = requiredFields(api, { image: true });
        res.status(200).json(filteredData);
        return;
      }

      // Get only primary endpoint necessary data
      res.status(200).json(data);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err.message });
    }

    return;
  }

  try {
    // get data from api
    if (!req.query.origin || req.query.origin === "api") {
      if (Object.keys(cache).length === 0) {
        const { data: api } = await axios.get(
          "https://api.thedogapi.com/v1/breeds"
        );
        // get only primary endpoint necessary data
        data = requiredFields(api, { image: true });
        // save in cache
        cache = data;
      } else {
        data = cache;
      }
    }

    // get data from db
    if (req.query.origin === "db") {
      const db = await Dog.findAll({ include: "temperament" });
      if (db.length > 0) {
        data = requiredFields(db, { created: true });
      } else data = [];
    }

    // filters
    if (Object.keys(req.query).length > 0) {
      data = filters(data, req.query);
      res.status(200).json(data);
      return;
    }

    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = dogRouter;
