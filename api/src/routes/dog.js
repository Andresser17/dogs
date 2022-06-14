const axios = require("axios");
// models
const { Dog } = require("../db");
// helpers
const requiredFields = require("../helpers/requiredFields");

let cache = {};

const pagination = (data, limit, page) => {
  limit = Number(limit);
  page = page ? Number(page) : 1;
  const results = {};
  const maxPage = Math.ceil(data.length / limit);
  let sliced;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  // if page provided is > than the total, return last page
  if (endIndex > data.length) {
    results.next = {
      page: maxPage,
      limit,
    };

    results.previous = {
      page: maxPage - 1,
      limit,
    };

    sliced = data.slice((maxPage - 1) * limit, maxPage * limit);
  } else {
    if (endIndex < data.length) {
      results.next = {
        page: page + 1,
        limit,
      };
    }

    // is more than result, return previous results, else return same page;
    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit,
      };
    } else {
      results.previous = {
        page: page,
        limit,
      };
    }

    sliced = data.slice(startIndex, endIndex);
  }

  return {
    ...results,
    maxPage,
    data: [...sliced],
  };
};

// sort by weight average
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
  // sort by and order
  if (queries.sort || queries.order)
    data = sortResults([...data], queries.sort, queries.order);

  // filter by temperament

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

      // filters
      if (Object.keys(req.query).length > 0) {
        const filteredData = filters(data, req.query);
        // data = requiredFields(api, { image: true });
        res.status(200).json(filteredData);
        return;
      }

      data = requiredFields(api, { image: true });
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
    if (req.query.origin === "db" && db.length > 0) {
      const db = await Dog.findAll({ include: "temperament" });
      data = db;
      data = requiredFields(db, { created: true });
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
