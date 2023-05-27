const express = require("express");
const router = express.Router();
const ObjectId = require("mongodb").ObjectId;

router.get("/employees", (req, res) => {
  req.db
    .collection("employees")
    .find()
    .toArray((err, data) => {
      if (err) res.status(500).json({ message: err });
      else res.json(data);
    });
});

router.get("/employees/random", (req, res) => {
  req.db
    .collection("employees")
    .aggregate([{ $sample: { size: 1 } }])
    .toArray((err, data) => {
      if (err) res.status(500).json({ message: err });
      else res.json(data[0]);
    });
});
router.get("/employees/:id", (req, res) => {
  req.db
    .collection("employees")
    .findOne({ _id: ObjectId(req.params.id) }, (err, data) => {
      if (err) res.status(500).json({ message: err });
      else if (!data) res.status(404).json({ message: "Not found!" });
      else res.json(data);
    });
});

router.post("/employees", (req, res) => {
  const { firstName, lastName } = req.body;

  if (firstName && lastName)
    req.db
      .collection("employees")
      .insertOne({ firstName: firstName, lastName: lastName }, (err) => {
        if (err) res.status(500).json({ message: err });
        else res.json({ message: "OK" });
      });
  else
    res.status(409).json({
      message: `You must pass ${!firstName ? "firstName" : ""} ${
        !firstName && !lastName ? "and" : ""
      } ${!lastName ? "lastName" : ""} value.`,
    });
});

router.put("/employees/:id", (req, res) => {
  const { firstName, lastName } = req.body;

  if (firstName || lastName)
    req.db
      .collection("employees")
      .findOne({ _id: ObjectId(req.params.id) }, (err, data) => {
        if (err) res.status(500).json({ message: err });
        else if (!data) res.status(404).json({ message: "Not found" });
        else
          req.db.collection("employees").updateOne(
            { _id: ObjectId(req.params.id) },
            {
              $set: {
                firstName: firstName ? firstName : data.firstName,
                lastName: lastName ? lastName : data.lastName,
              },
            },
            (err) => {
              if (err) res.status(500).json({ message: err });
              else res.json({ message: "OK" });
            }
          );
      });
  else
    res
      .status(409)
      .json({ message: "You must pass firstName and lastName value." });
});

router.delete("/employees/:id", (req, res) => {
  req.db
    .collection("employees")
    .deleteOne({ _id: ObjectId(req.params.id) }, (err) => {
      if (err) res.status(500).json({ message: err });
      else res.json({ message: "OK" });
    });
});

module.exports = router;
