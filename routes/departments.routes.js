const express = require("express");
const router = express.Router();
const Department = require("../models/department.model");

router.get("/departments", async (req, res) => {
  try {
    res.json(await Department.find());
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.get("/departments/random", async (req, res) => {
  try {
    const count = await Department.countDocuments();
    const rand = Math.floor(Math.random() * count);
    const dep = await Department.findOne().skip(rand);
    if (!dep) res.status(404).json({ message: "Not found" });
    else res.json(dep);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.get("/departments/:id", async (req, res) => {
  try {
    const dep = await Department.findById(req.params.id);
    if (!dep) res.status(404).json({ message: "Not found" });
    else res.json(dep);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.post("/departments", async (req, res) => {
  const { name } = req.body;

  if (name)
    try {
      const newDepartment = new Department({ name: name });
      await newDepartment.save();
      res.json({
        message: "You've successfully added new department",
        addedDepartment: newDepartment,
      });
    } catch (err) {
      res.status(500).json({ message: err });
    }
  else res.status(409).json({ message: "You must pass name value." });
});

router.put("/departments/:id", async (req, res) => {
  const { name } = req.body;

  if (!name) res.status(409).json({ message: "You must pass name value." });
  else
    try {
      const dep = await Department.findById(req.params.id);
      if (dep) {
        await Department.updateOne(
          { _id: req.params.id },
          { $set: { name: name } }
        );
        res.json({
          message: `You've successfully modified department id: ${req.params.id}`,
          beforeModification: dep,
          modifications: { name: name },
        });
      } else res.status(404).json({ message: "Not found..." });
    } catch (err) {
      res.status(500).json({ message: err });
    }
});

router.delete("/departments/:id", async (req, res) => {
  try {
    const dep = await Department.findById(req.params.id);
    if (dep) {
      await Department.deleteOne({ _id: req.params.id });
      res.json({
        message: `You've successfully deleted department id: ${req.params.id}`,
        deletedDepartment: dep,
      });
    } else res.status(404).json({ message: "Not found..." });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

module.exports = router;
