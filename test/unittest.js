
const assert = require("assert");
const expect = require("chai").expect;
const request = require("supertest");
const app = require("../app");

describe("Unit testing the / route", function () {
  it("index should contain Welcome", function () {
    return request(app)
      .get("/")
      .then(function (response) {
        expect(response.text).to.contain("Welcome");
      });
  });
  it("index should return OK status", function () {
    return request(app)
      .get("/")
      .then(function (response) {
        assert.equal(response.status, 200);
      });
  });
});

describe("Unit testing the /getUsers route", function () {
  it("getUsers should return htmlpage", function () {
    return request(app)
      .post("/getUsers")
      .expect(200)
      .expect("Content-Type", "text/html; charset=utf-8");
  });
  
  it("getUsers should contain user George Bluth", function () {
    let parsedanswer =
      '<p><h1>This is: George Bluth</h1><br><img src="https://reqres.in/img/faces/1-image.jpg"alt="Avatar" ></br><br>email: george.bluth@reqres.in</br></p>';
    return request(app)
      .post("/getUsers")
      .then((response) => {
        expect(response.text).to.contain(parsedanswer);
      });
  });
});

describe("Unit testing the arbitary route", function () {
  it("/form33 should return 404 status", function () {
    return request(app)
      .get("/form33")
      .then(function (response) {
        assert.equal(response.status, 404);
      });
  });

  it("/form33 should not return 200 status", function () {
    return request(app)
      .get("/form33")
      .then(function (response) {
        assert.notEqual(response.status, 200);
      });
  });
});
