const Employee = require("../employee.model.js");
const expect = require("chai").expect;
const mongoose = require("mongoose");

const createTestData = async () => {
  const testEmpOne = new Employee({
    firstName: "FirstName #1",
    lastName: "LastName #1",
    departmentId: "#1",
  });
  await testEmpOne.save();

  const testEmpTwo = new Employee({
    firstName: "FirstName #2",
    lastName: "LastName #2",
    departmentId: "#2",
  });
  await testEmpTwo.save();
};

describe("Employee CRUD", () => {
  before(async () => {
    try {
      await mongoose.connect("mongodb://localhost:27017/companyDBtest", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    } catch (err) {
      console.error(err);
    }
  });

  describe("Reading data", () => {
    beforeEach(() => createTestData());

    afterEach(async () => {
      await Employee.deleteMany();
    });

    it('should return all the data with "find" method', async () => {
      const employees = await Employee.find();

      expect(employees.length).to.be.equal(2);
    });

    it("should return a proper document by various params with 'findOne' method", async () => {
      const employee = await Employee.findOne({
        firstName: "FirstName #1",
        lastName: "LastName #1",
        departmentId: "#1",
      });

      expect(employee).not.to.be.null;
    });
  });

  describe("Creating data", () => {
    it("should insert new document with 'insertOne' method", async () => {
      const employee = new Employee({
        firstName: "FirstName #1",
        lastName: "LastName #1",
        departmentId: "#1",
      });
      await employee.save();

      expect(employee.isNew).to.be.false;
    });

    after(async () => {
      await Employee.deleteMany();
    });
  });
});
