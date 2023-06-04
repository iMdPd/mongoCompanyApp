const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../../../server.js");
const Department = require("../../../models/department.model.js");

chai.use(chaiHttp);

const expect = chai.expect;
const request = chai.request;

describe("POST /api/departments", () => {
  afterEach(async () => {
    await Department.deleteMany();
  });

  it("/ should insert new document to db and return success", async () => {
    const res = await request(server)
      .post("/api/departments")
      .send({ name: "Department #1" });

    const newDepartment = await Department.findOne({ name: "Department #1" });

    expect(res.status).to.be.equal(200);
    expect(res.body.message).to.be.equal(
      "You've successfully added new department"
    );
    expect(newDepartment).not.to.be.null;
  });
});
