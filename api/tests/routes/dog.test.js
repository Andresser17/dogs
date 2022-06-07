/* eslint-disable import/no-extraneous-dependencies */
const app = require("../../src/app.js");
const { Dog, connect } = require("../../src/db.js");

// const agent = session(app);
const dog = {
  name: "Pug",
};

xdescribe("Videogame routes", () => {
  beforeAll(() =>
    conn.authenticate().catch((err) => {
      console.error("Unable to connect to the database:", err);
    })
  );

  beforeEach(() => Dog.sync({ force: true }).then(() => Dog.create(dog)));

  describe("GET /dogs", () => {
    it("should get 200", () => agent.get("/dogs").expect(200));
  });
});
