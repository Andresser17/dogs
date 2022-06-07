const session = require("supertest-session");
const app = require("../../src/app.js");

const agent = session(app);

describe("dog routes", () => {
  describe("GET /dogs", () => {
    it("should get 200", async () => {
      const response = await agent.get("/dogs");

      expect(response.status).toBe(200);
    });

    it("response only with necessary data for primary endpoint", async () => {
      const response = await agent.get("/dogs");

      expect(response["_body"][0]).toEqual({
        id: 1,
        image: "https://cdn2.thedogapi.com/images/BJa4kxc4X.jpg",
        name: "Affenpinscher",
        temperament:
          "Stubborn, Curious, Playful, Adventurous, Active, Fun-loving",
        weight: "3kg - 6kg",
      });
    });
  });

  describe("GET /dogs?name", () => {
    it("should get 200", async () => {
      const response = await agent.get("/dogs?name=labrador");

      expect(response.status).toBe(200);
    });

    it("should return a list of dogs that contain name pass as query parameter", async () => {
      const response = await agent.get("/dogs?name=labrador");

      expect(response["_body"][0]).toEqual({
        id: 149,
        image: "https://cdn2.thedogapi.com/images/B1uW7l5VX.jpg",
        name: "Labrador Retriever",
        temperament:
          "Kind, Outgoing, Agile, Gentle, Intelligent, Trusting, Even Tempered",
        weight: "25kg - 36kg",
      });
    });

    it("if dog breeds don't exist, return an error message", async () => {
      const response = await agent.get("/dogs?name=mustang");
      const parsed = JSON.parse(response.text);

      expect(parsed.message).toBe("Dog breed don't exist");
    });
  });

  describe("GET /dogs/:breedId", () => {
    it("should get 200", async () => {
      const response = await agent.get("/dogs/1");

      expect(response.status).toBe(200);
    });

    it("response json need to have dog breed details and breed-related temperaments", async () => {
      const response = await agent.get("/dogs/149");

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
      const response = await agent.get("/dogs/1202002");
      const parsed = JSON.parse(response.text);

      expect(parsed.message).toBe("Dog breed don't exist");
    });
  });
});
