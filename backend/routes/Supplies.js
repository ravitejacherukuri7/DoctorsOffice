require("dotenv").config();

const express = require("express");
const app = express();
const { MongoClient } = require("mongodb");
const cors = require("cors");
const { body, validationResult } = require("express-validator");
const helmet = require("helmet");

const router = express.Router();


const client = new MongoClient(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect();

router.post(
  "/supply/add",
  [
    body("sub").notEmpty().isString(),
    body("name").notEmpty().isString(),
    body("price").notEmpty().isString(),
    body("description").isString(),
    
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const supplyData = req.body;
      const userSub = supplyData.sub;

      const supplyCollection = client.db("crm").collection("supplies");

      
      const newSupply = {
        name: supplyData.name,
        price: supplyData.price,
        description: supplyData.description,
      };

      
      const result = await supplyCollection.updateOne(
        { sub: userSub },
        { $push: { supplies: newSupply } },
        { upsert: true }
      );

      res.status(201).json({
        message: "Supply added successfully",
        supply: newSupply,
      });
    } catch (error) {
      console.error("Error in /supply/add:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

router.get("/supplies/get", async (req, res) => {
  console.log("Received request to /supplies/get");
  try {
    let { sub } = req.headers;

    if (!sub) {
      console.log("No sub received");
      return res.status(401).json({ message: "Authentication failed" });
    }

    const collection = client.db("crm").collection("supplies");
    const userSupplies = await collection.findOne({ sub: sub });

    if (!userSupplies || !userSupplies.supplies) {
      console.log("No user supplies found");
      return res.json([]);
    }

    
    if (userSupplies.supplies.length === 0) {
      console.log("User's supplies list is empty");
      return res.json([]);
    }

    res.json(userSupplies.supplies);
  } catch (error) {
    console.error("Error fetching user supplies:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/supply/delete", async (req, res) => {
  console.log("Received request to /supply/delete");
  console.log(req.body); 

  try {
    let { sub, name } = req.body;

    console.log(`Received sub: ${sub}`); 
    console.log(`Received supplyTitle: ${name}`); 

    if (!sub || !name) {
      console.log("No sub or supply title received");
      return res.status(400).json({ message: "Bad request" });
    }

    const collection = client.db("crm").collection("supplies");
    const result = await collection.updateOne(
      { sub: sub },
      { $pull: { supplies: { name: name } } }
    );

    if (result.modifiedCount === 0) {
      console.log("No supply deleted");
      return res.status(404).json({ message: "supply not found" });
    }

    res.json({ message: "supply deleted successfully" });
  } catch (error) {
    console.error("Error deleting supply:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
