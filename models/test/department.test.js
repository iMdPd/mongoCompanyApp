const Department = require("../department.model.js");
const expect = require("chai").expect;
const mongoose = require("mongoose");

describe("Department", () => {
  it('should throw an error if, no "name" arg', () => {
    const dep = new Department({});

    dep.validate((err) => {
      expect(err.errors.name).to.exist;
    });
  });

  it('should throw an error if, "name" is not a string', () => {
    const cases = [{}, []];
    for (let name of cases) {
      const dep = new Department({ name });

      dep.validate((err) => {
        expect(err.errors.name).to.exist;
      });
    }
  });

  it('should throw an error if, "name" is shorter than 5 chars or longer than 20 chars', () => {
    const cases = ["Asd", "asdq", "Wa", "Lorem Ipsum, Lorem Ipum"];

    for (let name of cases) {
      const dep = new Department({ name });

      dep.validate((err) => {
        expect(err.errors.name).to.exist;
      });
    }
  });

  it('should not to error if, "name" atr meets requirements', () => {
    const cases = ["Managment", "Human Resources"];

    for (let name of cases) {
      const dep = new Department({ name });

      dep.validate((err) => {
        expect(err).to.not.exist;
      });
    }
  });

  afterEach(() => {
    mongoose.models = {};
  });
});
