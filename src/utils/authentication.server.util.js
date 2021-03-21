const request = require("supertest");
const app = require("../server");

function getLoginCredentails(role) {
  switch (role) {
    case "manager":
      return { email: "admin@gmail.com", password: "123456789" };
    case "user":
      return { email: "user@gmail.com", password: "123456789" };
    default:
      return { username: "admin", password: "123456789" };
  }
}

exports.login = async function login(role = "manage") {
  const credentials = getLoginCredentails(role);
  const agent = request.agent(app);
  return agent
    .post("/auth")
    .send(credentials)
    .expect(200)
    .then(() => {
      return agent;
    });
};
exports.accessApp = async () => {
  const agent = request.agent(app);
  return agent;
};
