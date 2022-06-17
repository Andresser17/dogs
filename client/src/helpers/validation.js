export const validateName = (name) => {
  const regex = /^[a-zA-Z\s]+$/gi;

  if (name.length === 0) return { code: 0, message: "" };

  if (name.match(regex) !== null) {
    if (name.length > 40)
      return {
        code: 2,
        message: "The name can only have a max of 40 characters",
      };

    return { code: 1, message: "" };
  }

  return { code: 2, message: "The name can only include letters and whitespaces" };
};

export const validateWeight = (w) => {
  if (w.min === 0 || w.max === 0)
    return { code: 2, message: "Min and max weight can't be zero" };
  if (w.min > w.max)
    return { code: 2, message: "Minimum can't be greather than maximum" };
  if (w.max > 120)
    return { code: 2, message: "Maximum can't be greather than 120kg" };

  return { code: 0, message: "" };
};

export const validateHeight = (h) => {
  if (h.min === 0 || h.max === 0)
    return { code: 2, message: "Min and max height can't be zero" };
  if (h.min > h.max)
    return { code: 2, message: "Minimum can't be greather than maximum" };
  if (h.max > 120)
    return { code: 2, message: "Maximum can't be greather than 120cm" };

  return { code: 0, message: "" };
};

export const validateLife = (l) => {
  if (l.min === 0 || l.max === 0)
    return { code: 2, message: "Min and max years can't be zero" };
  if (l.min > l.max)
    return { code: 2, message: "Minimum can't be greather than maximum" };
  if (l.max > 20)
    return { code: 2, message: "Maximum can't be greather than 20 years" };

  return { code: 0, message: "" };
};

export const validateTemp = (tag) => {
  const regex = /^[a-zA-Z]+$/gi;

  if (tag.length === 0) return { code: 0, message: "" };

  if (tag.match(regex) !== null) {
    if (tag.length > 15)
      return {
        code: 2,
        message: "Tag can only have a max of 15 characters",
      };

    return { code: 1, message: "" };
  }

  return { code: 2, message: "Tag can only include letters" };
};
