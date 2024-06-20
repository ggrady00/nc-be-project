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
const endPoints = require("../endpoints.json");
const { string } = require("pg-format");
const { checkCommentExists } = require("../api/utils");
require("jest-sorted");

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
        expect(Array.isArray(body.topics)).toBe(true);
        expect(body.topics).toHaveLength(3);
        body.topics.forEach((topic) => {
          expect(typeof topic).toBe("object");
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
        });
      });
  });
  test("responds with 404 when endpoint does not exist", () => {
    return request(app)
      .get("/api/hello")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
});

describe("GET /api", () => {
  test("200: sends object with all available endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.endpoints).toEqual(endPoints);
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: sends an article by its id", () => {
    const exampleRes = {
      article_id: 2,
      title: "Sony Vaio; or, The Laptop",
      topic: "mitch",
      author: "icellusedkars",
      body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
      created_at: "2020-10-16T05:03:00.000Z",
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    };
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article.article_id).toBe(2);
        expect(article.author).toBe("icellusedkars");
        expect(article.title).toBe("Sony Vaio; or, The Laptop");
        expect(article.body).toBe(
          "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me."
        );
        expect(article.topic).toBe("mitch");
        expect(article.created_at).toBe("2020-10-16T05:03:00.000Z");
        expect(article.votes).toBe(0);
        expect(article.article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
      });
  });
  test("404: responds with 404 when supplied with non-existant article id", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not Found");
      });
  });
  test("400: responds with correct error when supplied an invalid article id", () => {
    return request(app)
      .get("/api/articles/banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("200: should include a count of all comments left of article", () => {
    return request(app)
      .get("/api/articles/9")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article.comment_count).toBe(2);
      });
  });
});

describe("GET /api/articles", () => {
  test("200: returns array of all articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(10);
      });
  });
  test("200: returned articles should have correct properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        articles.forEach((article) => {
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("article_img_url");
          expect(article).toHaveProperty("comment_count");
          expect(article).not.toHaveProperty("body");
        });
      });
  });
  test("200: should return articles sorted by date in descening order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("200: accepts a topic query which filters articles by topic", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body: { articles } }) => {
        articles.forEach((article) => {
          expect(article.topic).toBe("mitch");
        });
      });
  });
  test("200: returns empty array with valid query but empty db", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toEqual([]);
      });
  });
  test("404: responds with correct error when invalid topic query ", () => {
    return request(app)
      .get("/api/articles?topic=banana")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Resource not Found");
      });
  });
  describe("sorting queries", () => {
    test("200: accepts sort_by query default descending order", () => {
      return request(app)
        .get("/api/articles?sort_by=author")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("author", { descending: true });
        });
    });
    test("200: accepts comment_count sort_by query default descending order", () => {
      return request(app)
        .get("/api/articles?sort_by=comment_count")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("comment_count", {
            descending: true,
            coerce: true,
          });
        });
    });
    test("400: responds with correct error when passed invalid sort_by query", () => {
      return request(app)
        .get("/api/articles?sort_by=banana")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
    test("200: accepts query order to define asc or desc", () => {
      return request(app)
        .get("/api/articles?order=asc")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("created_at");
        });
    });
    test("200: accepts order and topic query ", () => {
      return request(app)
        .get("/api/articles?sort_by=votes&order=asc")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("votes");
        });
    });
    test("400: responds with correct error when passed invalid order query", () => {
      return request(app)
        .get("/api/articles?order=banana")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
  });
});

describe("GET /api/articles/:articled_id/comments", () => {
  test("200: returns an array of all comments for given article id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toHaveLength(11);
        comments.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id");
          expect(comment).toHaveProperty("votes");
          expect(comment).toHaveProperty("created_at");
          expect(comment).toHaveProperty("author");
          expect(comment).toHaveProperty("body");
          expect(comment).toHaveProperty("article_id");
        });
      });
  });
  test("200: returns comments in descening order by date", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("400: responds with correct error when supplied an invalid article id", () => {
    return request(app)
      .get("/api/articles/banana/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("404: responds with 404 when supplied with non-existent article id", () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not Found");
      });
  });
  test("200: responds with 200 and an empty array when supplied with existent article id but no comments", () => {
    return request(app)
      .get("/api/articles/8/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toHaveLength(0);
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  const requestBody = {
    username: "rogersop",
    body: "testComment",
  };
  test("201: responds with comment for a specified article", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send(requestBody)
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment.comment_id).toBe(19);
        expect(comment.body).toBe(requestBody.body);
        expect(comment.article_id).toBe(2);
        expect(comment.author).toBe(requestBody.username);
        expect(comment.votes).toBe(0);
        expect(typeof comment.created_at).toBe("string");
      });
  });
  test("inserts comment into database", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send(requestBody)
      .expect(201)
      .then(() => {
        return request(app)
          .get("/api/articles/2/comments")
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).toHaveLength(1);
          });
      });
  });
  test("400: responds with correct error when supplied invalid article_id", () => {
    return request(app)
      .post("/api/articles/banana/comments")
      .send(requestBody)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("400: responds with correct error when request body is missing elements", () => {
    const requestBody = {
      body: "testBody",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(requestBody)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("404: responds with correct error when request body is has all elements but username not in db", () => {
    const requestBody = {
      body: "testBody",
      username: "invalidUser",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(requestBody)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Resource not Found");
      });
  });
  test("404: responds with correct error when trying to post to non-exisent article_id", () => {
    return request(app)
      .post("/api/articles/999/comments")
      .send(requestBody)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not Found");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  const newVotes = { inc_votes: 20 };
  test("200: updates article votes by article id and responds with updated article", () => {
    return request(app)
      .patch("/api/articles/3")
      .send(newVotes)
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          article_id: 3,
          title: "Eight pug gifs that remind me of mitch",
          topic: "mitch",
          author: "icellusedkars",
          body: "some gifs",
          created_at: "2020-11-03T09:12:00.000Z",
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          votes: 20,
        });
      });
  });
  test("200: updates votes to 0 if decrements votes past 0", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: -200 })
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article.votes).toBe(0);
      });
  });
  test("400: respons with correct error when supplied invalid article_id", () => {
    return request(app)
      .patch("/api/articles/banana")
      .send(newVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("400: responds with correct error when request body is invalid", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("404: responds with correct error when attempting to update non existant article", () => {
    return request(app)
      .patch("/api/articles/999")
      .send(newVotes)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not Found");
      });
  });
  test("400: responds with correct error when attempting to request body has incorrect data type", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "banana" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: deletes comment by comment_id and responds with no content", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });
  test("400: repsonds with correct error when supplied invalid comment_id", () => {
    return request(app)
      .delete("/api/comments/banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("404: repsonds with correct error when supplied valid but non-existent id", () => {
    return request(app)
      .delete("/api/comments/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Comment not Found");
      });
  });
});

describe("GET /api/users", () => {
  test("200: responds with array of all user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toHaveProperty("username");
          expect(user).toHaveProperty("name");
          expect(user).toHaveProperty("avatar_url");
        });
      });
  });
});

describe("GET /api/users/:username", () => {
  test("200: returns user by username", () => {
    return request(app)
      .get("/api/users/butter_bridge")
      .expect(200)
      .then(({ body: { user } }) => {
        expect(user.username).toBe("butter_bridge");
        expect(user).toHaveProperty("avatar_url");
        expect(user).toHaveProperty("name");
      });
  });
  test("404: returns correct error when invalid username", () => {
    return request(app)
      .get("/api/users/banana")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("User not Found");
      });
  });
});

describe("PATCH /api/comments/:comment_id", () => {
  const exampleRequest = { inc_votes: 20 };
  test("200: updates votes on a comment by commnet id and responds with updated comment", () => {
    return request(app)
      .patch("/api/comments/1")
      .send(exampleRequest)
      .expect(200)
      .then(({ body: { comment } }) => {
        expect(comment).toMatchObject({
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          votes: 36,
          author: "butter_bridge",
          article_id: 9,
          created_at: "2020-04-06T12:17:00.000Z",
        });
      });
  });
  test("200: updates votes to 0 on a comment when decrement below 0", () => {
    const exampleRequest = { inc_votes: -20 };
    return request(app)
      .patch("/api/comments/1")
      .send(exampleRequest)
      .expect(200)
      .then(({ body: { comment } }) => {
        expect(comment.votes).toBe(0)
      });
  });
  test("400: responds with correct error when invalid comment_id", () => {
    const exampleRequest = { inc_votes: 20 };
    return request(app)
      .patch("/api/comments/banana")
      .send(exampleRequest)
      .expect(400)
      .then(({ body}) => {
        expect(body.msg).toBe("Bad Request")
      });
  });
  test("400: responds with correct error when request body is invalid", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("404: responds with correct error when attempting to update non existant comment id", () => {
    return request(app)
      .patch("/api/comments/999")
      .send(exampleRequest)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Comment not Found");
      });
  })
  test("400: responds with correct error when request body has incorrect data type", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: "banana" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("POST /api/articles", ()=>{
  test("201: responds with new article and adds to db", ()=>{
    const newArticle = {
      author: "lurker",
      title : "new article",
      body : "articles body",
      topic : "paper",
      article_img_url: "http://testurl.com"
    }
    return request(app)
    .post("/api/articles")
    .send(newArticle)
    .expect(201)
    .then(({body: {article}}) => {
      expect(article).toMatchObject(
        {
          author: "lurker",
          title : "new article",
          body : "articles body",
          topic : "paper",
          article_img_url: "http://testurl.com",
          article_id: 14,
          votes: 0,
          created_at: expect.any(String),
          comment_count: 0
        }
      )
    })
  })
  test("201: responds with deafult img_url when not provided", ()=>{
    const newArticle = {
      author: "lurker",
      title : "new article",
      body : "articles body",
      topic : "paper"
    }
    return request(app)
    .post("/api/articles")
    .send(newArticle)
    .expect(201)
    .then(({body: {article}}) => {
      expect(article.article_img_url).toBe('https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700')
    })
  })
  test("400: responds with correct error when body missing elements", ()=>{
    const newArticle = {
      author: "lurker",
      title : "new article",
      body : "articles body",
    }
    return request(app)
    .post("/api/articles")
    .send(newArticle)
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe("Bad Request")
    })
  })
  test("404: responds with correct error when invalid username", ()=>{
    const newArticle = {
      author: "badUser",
      title : "new article",
      body : "articles body",
      topic: "paper"
    }
    return request(app)
    .post("/api/articles")
    .send(newArticle)
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe("Resource not Found")
    })
  })
  test("404: responds with correct error when invalid topic", ()=>{
    const newArticle = {
      author: "lurker",
      title : "new article",
      body : "articles body",
      topic: "badTopic"
    }
    return request(app)
    .post("/api/articles")
    .send(newArticle)
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe("Resource not Found")
    })
  })
})

describe("GET /api/articles (pagination)",()=>{
  test("200: accepts limit query",()=>{
    return request(app)
    .get("/api/articles?limit=5")
    .expect(200)
    .then(({body: {articles}}) => {
      expect(articles).toHaveLength(5)
    })
  })
  test("200: limit defaults to 10", ()=>{
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({body: {articles}}) => {
      expect(articles).toHaveLength(10)
    })
  })
  test("200: accepts p query and returns that page" ,() => {
    return request(app)
    .get("/api/articles?limit=5&p=2&sort_by=article_id&order=asc")
    .expect(200)
    .then(({body: {articles}}) => {
      expect(articles).toHaveLength(5)
      expect(articles[0].article_id).toBe(6)
      expect(articles[4].article_id).toBe(10)
    })
  })
  test("200: returns total count property", ()=>{
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({body: {totalCount}}) => {
      expect(totalCount).toBe(13)
    })
  })
  test("200: returns total count property when given a topic", ()=>{
    return request(app)
    .get("/api/articles?topic=mitch")
    .expect(200)
    .then(({body: {totalCount}}) => {
      expect(totalCount).toBe(12)
    })
  })
  test("400: responds with correct error when given invalid limit", ()=>{
    return request(app)
    .get("/api/articles?limit=banana")
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe("Bad Request")
    })
  })
  test("400: responds with correct error when given invalid page", ()=>{
    return request(app)
    .get("/api/articles?p=banana")
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe("Bad Request")
    })
  })
})

describe.only("GET /api/articles/:article_id/comments (pagination)", ()=>{
  test("200: accepts limit query", ()=>{
    return request(app)
    .get("/api/articles/1/comments?limit=5")
    .expect(200)
    .then(({body: {comments}}) => {
      expect(comments).toHaveLength(5)
    })
  })
  test("200: limit query defualts to 10", ()=>{
    return request(app)
    .get("/api/articles/1/comments")
    .expect(200)
    .then(({body: {comments}}) => {
      expect(comments).toHaveLength(10)
    })
  })
  test("200: accepts page query", ()=>{
    return request(app)
    .get("/api/articles/1/comments?limit=4&p=3")
    .expect(200)
    .then(({body: {comments}}) => {
      expect(comments).toHaveLength(3)
    })
  })
  test("400: responds with correct error when given invalid limit", ()=>{
    return request(app)
    .get("/api/articles/1/comments?limit=banana")
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe("Bad Request")
    })
  })
  test("400: responds with correct error when given invalid page", ()=>{
    return request(app)
    .get("/api/articles/1/comments?p=banana")
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe("Bad Request")
    })
  })
})