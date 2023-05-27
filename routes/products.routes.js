const express = require("express");
const router = express.Router();
const Product = require("../models/product.model");

router.get("/products", async (req, res) => {
  try {
    res.json(await Product.find());
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/products/random", async (req, res) => {
  try {
    const count = await Product.countDocuments();
    const rand = Math.floor(Math.random() * count);
    const prod = await Product.findOne().skip(rand);
    if (!prod) res.status(404).json({ message: "Not found" });
    else res.json(prod);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.get("/products/:id", async (req, res) => {
  try {
    const prod = await Product.findById(req.params.id);
    if (!prod) res.status(404).json({ message: "Not found" });
    else res.json(prod);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.post("/products", async (req, res) => {
  const { name, client } = req.body;

  if (name && client)
    try {
      const newProduct = new Product({
        name: name,
        client: client,
      });
      await newProduct.save();
      res.json({
        message: "You've successfully added new product",
        addedProduct: newProduct,
      });
    } catch (err) {
      res.status(500).json({ message: err });
    }
  else
    res.status(409).json({
      message: `You must pass ${!name ? "name" : ""} ${
        !name && !client ? "and" : ""
      } ${!client ? "client" : ""} value.`,
    });
});

router.put("/products/:id", async (req, res) => {
  const { name, client } = req.body;

  if (name || client)
    try {
      const prod = await Product.findById(req.params.id);
      if (prod) {
        await Product.updateOne(
          { _id: req.params.id },
          {
            $set: {
              name: name ? name : prod.name,
              client: client ? client : prod.client,
            },
          }
        );
        res.json({
          message: `You've successfully modified product id: ${req.params.id}`,
          beforeModification: prod,
          modifications: {
            name: name,
            client: client,
          },
        });
      } else res.status(404).json({ message: "Not found..." });
    } catch (err) {
      res.status(500).json({ message: err });
    }
  else
    res.status(409).json({ message: "You must pass name and client value." });
});

router.delete("/products/:id", async (req, res) => {
  try {
    const prod = await Product.findById(req.params.id);
    if (prod) {
      await Product.deleteOne({ _id: req.params.id });
      res.json({
        message: `You've successfully deleted product id: ${req.params.id}`,
        deletedProduct: prod,
      });
    } else res.status(404).json({ message: "Not found..." });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

module.exports = router;
