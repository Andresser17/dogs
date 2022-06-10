const axios = require("axios");
// models
const { Dog } = require("../db");
// helpers
const requiredFields = require("../helpers/requiredFields");

const cache = { api: { data: [] }, db: { data: [] } };

const pagination = (data, limit, page) => {
  limit = Number(limit);
  page = page ? Number(page) : 1;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  let results = {};
  const sliced = data.slice(startIndex, endIndex);

  // if page provided is > than the total, return last page
  if (endIndex > data.length) {
    
  }

  if (endIndex < data.length) {
    results.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    results.previous = {
      page: page - 1,
      limit,
    };
  }

  return {
    ...results,
    data: [...sliced],
  };
};

const sortResults = (data, sort, order) => {
  sort = sort ? sort : "id";
  order = order ? order : "asc";

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
  // pagination
  if (queries.limit)
    data.api = pagination([...data.api.data], queries.limit, queries.page);
  if (queries.limit && data.db.data.length > 0)
    data.db = pagination([...data.db.data], queries.limit, queries.page);

  // sort
  if (queries.sort || queries.order)
    data.api.data = sortResults(
      [...data.api.data],
      queries.sort,
      queries.order
    );
  if (data.db.data.length > 0)
    data.db.data = sortResults([...data.db.data], queries.sort, queries.order);

  return data;
};

const dogRouter = async (req, res) => {
  const data = { api: { data: [] }, db: { data: [] } };

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

      data.api.data = requiredFields(api, { image: true });

      // filters
      if (Object.keys(req.query).length > 0) {
        const filteredData = filters(data, req.query);
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
    if (cache.api.data.length === 0) {
      const { data: api } = await axios.get(
        "https://api.thedogapi.com/v1/breeds"
      );
      // get only primary endpoint necessary data
      data.api.data = requiredFields(api, { image: true });
      // save in cache
      cache.api.data = data.api.data;
    } else {
      data.api.data = cache.api.data;
    }
    // get data from db
    const db = await Dog.findAll({ include: "temperament" });
    if (db.length > 0) {
      data.db.data = requiredFields(db, { created: true });
    }

    // filters
    if (Object.keys(req.query).length > 0) {
      const filteredData = filters(data, req.query);
      res.status(200).json(filteredData);
      return;
    }

    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = dogRouter;
