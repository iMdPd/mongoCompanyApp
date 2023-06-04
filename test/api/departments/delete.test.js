const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../../../server.js");
const Department = require("../../../models/department.model.js");

chai.use(chaiHttp);

const expect = chai.expect;
const request = chai.request;

describe("DELETE /api/departments", () => {
  beforeEach(async () => {
    const testDepOne = new Department({
      _id: "5d9f1140f10a81216cfd4408",
      name: "Department #1",
    });
    await testDepOne.save();
  });

  afterEach(async () => {
    await Department.deleteMany();
  });

  it("/:id should properly delete choosen document and return sucess", async () => {
    const res = await request(server).delete(
      "/api/departments/5d9f1140f10a81216cfd4408"
    );

    const department = await Department.findOne({ name: "Department #1" });

    expect(res.body.message).to.be.equal(
      "You've successfully deleted department id: 5d9f1140f10a81216cfd4408"
    );
    expect(department).to.be.null;
  });
});
