const request = require("supertest");
const app = require("../../src/app.js");
const { Temperament, connect, disconnect } = require("../../src/db.js");

describe("temperament routes", () => {
  beforeAll(async () => await connect());
  afterAll(async () => await disconnect());

  describe("GET /temperaments", () => {
    it("should get 200", async () => {
      const response = await request(app).get("/temperaments");

      expect(response.status).toBe(200);
    });

    it("if is the first instance, save data in api, an get data from there", async () => {
      // reset models
      await Temperament.sync({ force: true });

      // check that db is empty
      const checkDB1 = await Temperament.findAll();
      expect(checkDB1.length).toBe(0);

      // make request
      await request(app).get("/temperaments");

      // check that db is not empty
      const checkDB2 = await Temperament.findAll();
      expect(checkDB2.length).toBe(124);

      // make new request
      const response = await request(app).get("/temperaments");

      // check length
      expect(response["_body"].length).toBe(124);
    });
  });
});
