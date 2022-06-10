const { Temperament, connect } = require("../../src/db.js");

xdescribe("Temperament model", () => {
  // beforeAll(() => connect());

  beforeEach(() => Temperament.sync({ force: true }));

  // afterAll(() => connect(true));

  it("should throw an error if required fields are null", async () => {
    await expect(Temperament.create({})).rejects.toThrowError();
  });

  it("should work when it's required fields aren't null", async () => {
    const temp = await Temperament.create({ name: "Lazy" });

    expect(temp).toMatchObject({ id: 1, name: "Lazy" });
  });

  it("the id has to be unique", async () => {
    const temp1 = await Temperament.create({
      name: "Lazy",
    });

    const temp2 = await Temperament.create({
      name: "Aggresive",
    });

    const temp3 = await Temperament.create({
      name: "Caring",
    });

    expect([temp1.id, temp2.id, temp3.id]).toEqual([1, 2, 3]);
  });

  it("if name exist in db, throw an error", async () => {
    await Temperament.create({
      name: "Lazy",
    });

    const temp2 = () =>
      Temperament.create({
        name: "Lazy",
      });

    await expect(temp2).rejects.toThrowError(/validation error/i);
  });
});
