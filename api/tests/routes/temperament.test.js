const session = require("supertest-session");
const app = require("../../src/app.js");
const { Temperament } = require("../../src/db.js");

const agent = session(app);

describe("temperament routes", () => {
  beforeEach(() => Temperament.sync({ force: true }));

  describe("GET /temperaments", () => {
    it("should get 200", async () => {
      const response = await agent.get("/temperaments");

      expect(response.status).toBe(200);
    });

    it("if is the first instance, save data in api, an get data from there", async () => {
      // check that db is empty
      const checkDB1 = await Temperament.findAll();
      expect(checkDB1.length).toBe(0);

      // make request
      await agent.get("/temperaments");

      // check that db is not empty
      const checkDB2 = await Temperament.findAll();
      expect(checkDB2.length).toBe(124);

      // make new request
      const response = await agent.get("/temperaments");

      // check length
      expect(response["_body"].length).toBe(124);
    });
  });
});
