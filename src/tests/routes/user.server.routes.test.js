const { expect } = require("chai");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const authentcationUtil = require("../../utils/authentication.server.util");
describe("Tesing User Route", () => {
  describe("POST /users", async function() {
    const user = {
      _id: ObjectId("5e6679e2fdadfb4098d1485a"),
      email: "dangtai380@gmail.com",
      password: "123456789"
    };
    const request = await authentcationUtil.accessApp();
    it("should create new user", async () => {
      return request
        .post("/users")
        .send(user)
        .then(res => {
          expect(res.status).not.null;
        });
    });

    it("should not create new user because dulicate email", async () => {
      return request
        .post("/users")
        .send(user)
        .then(res => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal("Email đã được đăng ký!");
        });
    });

    it("should not create new user because have not email", async () => {
      return request
        .post("/users")
        .send({})
        .then(res => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal("Chưa có email!");
        });
    });

    it("should login success", async () => {
      return request
        .post("/auth")
        .send(user)
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body.token).not.null;
        });
    });
  });
});
