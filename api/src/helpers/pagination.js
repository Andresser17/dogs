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

module.exports = pagination;
