const request = require("supertest");
const app = require("../../src/app.js");
const { Dog, Temperament, connect, disconnect } = require("../../src/db");

describe("dog routes", () => {
  beforeAll(async () => await connect());

  afterAll(async () => await disconnect());

  describe("GET /dogs", () => {
    it("should get 200", async () => {
      const response = await request(app).get("/dogs");
      expect(response.status).toBe(200);
    });

    it("response only with necessary data for primary endpoint", async () => {
      const response = await request(app).get("/dogs");

      expect(response["_body"].api.data[0]).toEqual({
        id: 1,
        image: "https://cdn2.thedogapi.com/images/BJa4kxc4X.jpg",
        name: "Affenpinscher",
        temperament:
          "Stubborn, Curious, Playful, Adventurous, Active, Fun-loving",
        weight: "3kg - 6kg",
      });
    });

    it("pagination (limit, page)", async () => {
      const pag = await request(app).get("/dogs?limit=40");

      expect(pag["_body"].api.data.length).toBe(40);

      const pag2 = await request(app).get("/dogs?limit=40&page=2");
      expect(pag2["_body"].api.data.length).toBe(40);
    });

    it("pagination, if page provided is > than last existence page, return last page result", async () => {
      const pag = await request(app).get("/dogs?limit=5&page=40");

      expect(pag["_body"].api.data[263].id).toBe(264);
    });

    it("sort (id, name), order (asc, desc)", async () => {
      const sort = await request(app).get("/dogs?sort=id&order=desc");

      expect(sort["_body"].api.data[0].id).toBe(264);

      const sort2 = await request(app).get("/dogs?sort=name&order=asc");

      expect(sort2["_body"].api.data[0].name).toBe("Affenpinscher");
    });

    describe("search by name GET /dogs?name=", () => {
      it("name", async () => {
        const response = await request(app).get("/dogs?name=labrador");

        expect(response["_body"].api.data[0]).toEqual({
          id: 149,
          image: "https://cdn2.thedogapi.com/images/B1uW7l5VX.jpg",
          name: "Labrador Retriever",
          temperament:
            "Kind, Outgoing, Agile, Gentle, Intelligent, Trusting, Even Tempered",
          weight: "25kg - 36kg",
        });
      });

      it("name don't exist", async () => {
        const response = await request(app).get("/dogs?name=mustang");
        const parsed = JSON.parse(response.text);

        expect(parsed.message).toBe("Dog breed don't exist");
      });
    });
  });

  describe("GET /dogs/:breedId", () => {
    it("should get 200", async () => {
      const response = await request(app).get("/dogs/1");

      expect(response.status).toBe(200);
    });

    it("response json need to have dog breed details", async () => {
      const response = await request(app).get("/dogs/149");

      expect(response["_body"]).toEqual({
        id: 149,
        image: "https://cdn2.thedogapi.com/images/B1uW7l5VX.jpg",
        name: "Labrador Retriever",
        temperament:
          "Kind, Outgoing, Agile, Gentle, Intelligent, Trusting, Even Tempered",
        weight: "25kg - 36kg",
        height: "55cm - 62cm",
        lifeSpan: "10 - 13 years",
        breedGroup: "Sporting",
      });
    });

    it("if id don't exist return error message", async () => {
      const response = await request(app).get("/dogs/1202002");
      const parsed = JSON.parse(response.text);

      expect(parsed.message).toBe("Dog breed don't exist");
    });
  });

  describe("POST /dogs", () => {
    it("should get 200", async () => {
      const response = await request(app).get("/dogs");

      expect(response.status).toBe(200);
    });

    it("save new dog breed and new temperaments, and receive a success message", async () => {
      // reset models
      await Dog.sync({ force: true });
      await Temperament.sync({ force: true });

      // read dog model
      const readDog = await Dog.findAll();
      expect(readDog.length).toBe(0);

      // read temperament model
      const readTemp = await Temperament.findAll();
      expect(readTemp.length).toBe(0);

      // make request
      const response = await request(app)
        .post("/dogs")
        .send({
          name: "labrador",
          weight: "25kg - 36kg",
          height: "55cm - 62cm",
          lifeSpan: "10 - 12 years",
          temperament: ["Active", "Happy"],
        });
      const parsed = JSON.parse(response.text);

      expect(parsed).toEqual({
        message: "success, saved breed in db",
        id: 1,
      });

      // read dog model again
      const readDogAgain = await Dog.findAll({ include: "temperament" });
      expect(readDogAgain.length).toBe(1);
      expect(readDogAgain[0].temperament.length).toBe(2);

      // read temp model again
      const readTempAgain = await Temperament.findAll();
      expect(readTempAgain.length).toBe(2);
    });

    it("if required fields are null, return error message", async () => {
      // make request
      const response = await request(app).post("/dogs", {
        height: "",
        weight: "",
        lifeSpan: "10 - 12 years",
        temperaments: ["Active", "Happy"],
      });
      const parsed = JSON.parse(response.text);

      expect(parsed.message).toMatch(/notnull/i);
    });
  });
});
