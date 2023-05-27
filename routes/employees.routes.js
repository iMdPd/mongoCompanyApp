const express = require("express");
const router = express.Router();
const Employee = require("../models/employee.model");

router.get("/employees", async (req, res) => {
  try {
    res.json(await Employee.find());
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/employees/random", async (req, res) => {
  try {
    const count = await Employee.countDocuments();
    const rand = Math.floor(Math.random() * count);
    const empl = await Employee.findOne().skip(rand);
    if (!empl) res.status(404).json({ message: "Not found" });
    else res.json(empl);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.get("/employees/:id", async (req, res) => {
  try {
    const empl = await Employee.findById(req.params.id);
    if (!empl) res.status(404).json({ message: "Not found" });
    else res.json(empl);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.post("/employees", async (req, res) => {
  const { firstName, lastName, department } = req.body;

  if (firstName && lastName && department)
    try {
      const newEmployee = new Employee({
        firstName: firstName,
        lastName: lastName,
        department: department,
      });
      await newEmployee.save();
      res.json({
        message: "You've successfully added new employee",
        addedEmployee: newEmployee,
      });
    } catch (err) {
      res.status(500).json({ message: err });
    }
  else
    res.status(409).json({
      message: `You must pass ${!firstName ? "firstName" : ""} ${
        !department ? "department" : ""
      } ${!lastName ? "lastName" : ""} value.`,
    });
});

router.put("/employees/:id", async (req, res) => {
  const { firstName, lastName, department } = req.body;

  if (firstName || lastName || department)
    try {
      const empl = await Employee.findById(req.params.id);
      if (empl) {
        await Employee.updateOne(
          { _id: req.params.id },
          {
            $set: {
              firstName: firstName ? firstName : empl.firstName,
              lastName: lastName ? lastName : empl.lastName,
              department: department ? department : empl.department,
            },
          }
        );
        res.json({
          message: `You've successfully modified employee id: ${req.params.id}`,
          beforeModification: empl,
          modifications: {
            firstName: firstName,
            lastName: lastName,
            department: department,
          },
        });
      } else res.status(404).json({ message: "Not found..." });
    } catch (err) {
      res.status(500).json({ message: err });
    }
  else
    res.status(409).json({
      message:
        "You must pass min one of these values: firstName, lastName or department.",
    });
});

router.delete("/employees/:id", async (req, res) => {
  try {
    const empl = await Employee.findById(req.params.id);
    if (empl) {
      await Employee.deleteOne({ _id: req.params.id });
      res.json({
        message: `You've successfully deleted employee id: ${req.params.id}`,
        deletedEmployee: empl,
      });
    } else res.status(404).json({ message: "Not found..." });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

module.exports = router;
