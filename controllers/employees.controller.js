const Employee = require("../models/employee.model");

exports.getAll = async (req, res) => {
  try {
    res.json(await Employee.find().populate("departmentId"));
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getRandom = async (req, res) => {
  try {
    const count = await Employee.countDocuments();
    const rand = Math.floor(Math.random() * count);
    const empl = await Employee.findOne().skip(rand).populate("departmentId");
    if (!empl) res.status(404).json({ message: "Not found" });
    else res.json(empl);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.getById = async (req, res) => {
  try {
    const empl = await Employee.findById(req.params.id).populate(
      "departmentId"
    );
    if (!empl) res.status(404).json({ message: "Not found" });
    else res.json(empl);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.post = async (req, res) => {
  const { firstName, lastName, departmentId } = req.body;

  if (firstName && lastName && departmentId)
    try {
      const newEmployee = new Employee({
        firstName: firstName,
        lastName: lastName,
        departmentId: departmentId,
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
        !departmentId ? "departmentId" : ""
      } ${!lastName ? "lastName" : ""} value.`,
    });
};

exports.put = async (req, res) => {
  const { firstName, lastName, departmentId } = req.body;

  if (firstName || lastName || departmentId)
    try {
      const empl = await Employee.findById(req.params.id);
      if (empl) {
        await Employee.updateOne(
          { _id: req.params.id },
          {
            $set: {
              firstName: firstName ? firstName : empl.firstName,
              lastName: lastName ? lastName : empl.lastName,
              departmentId: departmentId ? departmentId : empl.departmentId,
            },
          }
        );
        res.json({
          message: `You've successfully modified employee id: ${req.params.id}`,
          beforeModification: empl,
          modifications: {
            firstName: firstName,
            lastName: lastName,
            departmentId: departmentId,
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
};

exports.delete = async (req, res) => {
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
};
