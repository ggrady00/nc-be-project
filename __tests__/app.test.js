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
const endPoints = require("../endpoints.json")

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
  test("200: sends object with all available endpoints", ()=>{
    return request(app)
    .get("/api")
    .expect(200)
    .then(({body}) => {
      expect(body.endpoints).toEqual(endPoints)
    }) 
  })
})

describe("GET /api/articles/:article_id", ()=>{
  test("200: sends an article by its id", ()=>{
    const exampleRes = {
      article_id:  2,
      title: "Sony Vaio; or, The Laptop",
      topic: "mitch",
      author: "icellusedkars",
      body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
      created_at: "2020-10-16T05:03:00.000Z",
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    }
    return request(app)
    .get("/api/articles/2")
    .expect(200)
    .then(({body}) => {
      expect(body.article).toMatchObject(exampleRes)
    })
  })
})