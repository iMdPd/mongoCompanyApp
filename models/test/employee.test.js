const Employee = require("../employee.model.js");
const expect = require("chai").expect;
const mongoose = require("mongoose");

describe("Emplooyee", () => {
  it("should throw an error, if there is no args", () => {
    const emp = new Employee({});

    emp.validate((err) => {
      expect(
        err.errors.firstName && err.errors.lastName && err.errors.departmentId
      ).to.exist;
    });
  });

  it("should throw an error, if there is missing 'firstName' arg'", () => {
    const emp = new Employee({
      lastName: "Brown",
      departmentId: "1231231e2143123412",
    });

    emp.validate((err) => {
      expect(err.errors.firstName).to.exist;
      expect(err.errors.lastName && err.errors.departmentId).not.to.exist;
    });
  });

  it("should throw an error, if there is missing 'lastName' arg'", () => {
    const emp = new Employee({
      firstName: "Lucas",
      departmentId: "1231231e2143123412",
    });

    emp.validate((err) => {
      expect(err.errors.lastName).to.exist;
      expect(err.errors.firstName && err.errors.departmentId).not.to.exist;
    });
  });

  it("should throw an error, if there is missing 'departmentId' arg'", () => {
    const emp = new Employee({
      firstName: "Lucas",
      lastName: "Brown",
    });

    emp.validate((err) => {
      expect(err.errors.departmentId).to.exist;
      expect(err.errors.firstName && err.errors.lastName).not.to.exist;
    });
  });

  it("should throw an error, if any of args is not a string", () => {
    const cases = [
      {
        firstName: true,
        lastName: [],
        departmentId: {},
      },
      {
        firstName: null,
        lastName: {},
        departmentId: "1§2§998123123121289317",
      },
      {
        firstName: "Thomas",
        lastName: "Croft",
        departmentId: [],
      },
    ];

    for (let data of cases) {
      const emp = new Employee(data);
      emp.validate((err) => {
        expect(err.errors).to.exist;
      });
    }
  });

  it("should not to trow error, if all args meet requirements", () => {
    const cases = [
      {
        firstName: "Lucas",
        lastName: "Brown",
        departmentId: "1328bd28da98s0j91",
      },
      {
        firstName: "Mike",
        lastName: "Wazowski",
        departmentId: "1§2§998123123121289317",
      },
      {
        firstName: "Thomas",
        lastName: "Croft",
        departmentId: "asdasjdkadaidaiodnaasdew",
      },
    ];

    for (let data of cases) {
      const emp = new Employee(data);

      emp.validate((err) => {
        expect(err).to.not.exist;
      });
    }
  });

  afterEach(() => {
    mongoose.models = {};
  });
});
