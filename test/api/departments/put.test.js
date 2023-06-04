const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../../../server.js");
const Department = require("../../../models/department.model.js");

chai.use(chaiHttp);

const expect = chai.expect;
const request = chai.request;

describe("PUT /api/departments", () => {
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

  it("/:id should update choosen document and return success", async () => {
    const res = await request(server)
      .put("/api/departments/5d9f1140f10a81216cfd4408")
      .send({ name: "UpdatedDepartment #1" });

    const updatedDepartment = await Department.findOne({
      _id: "5d9f1140f10a81216cfd4408",
    });
    expect(res.status).to.be.equal(200);
    expect(res.body).to.not.be.null;
    expect(updatedDepartment.name).to.be.equal("UpdatedDepartment #1");
  });
});
