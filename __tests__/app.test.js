const app = require("../api/app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const {
  topicData,
  userData,
  articleData,
  commentData,
} = require("../db/data/test-data/index");

beforeEach(() => {
  return seed({ topicData, userData, articleData, commentData });
});
afterAll(() => {
  return db.end();
});

describe("GET /api/topics", () => {
  test("responds with 200 status", () => {
    return request(app).get("/api/topics").expect(200);
  });
  test("sends an array of topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.topics)).toBe(true)
        expect(body.topics).toHaveLength(3)
        body.topics.forEach(topic => {
          expect(typeof topic).toBe('object')
          expect(topic).toHaveProperty('slug')
          expect(topic).toHaveProperty('description')
        })
      });
  });
  test("responds with 404 when endpoint does not exist", ()=> {
    return request(app)
    .get("/api/hello")
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe("Not Found")
    })
  })
});

describe("GET /api", ()=>{
  test("200: sends object with all available endpoints")
})