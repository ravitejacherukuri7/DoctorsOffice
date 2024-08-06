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
  "/addUser",
  [
    body("sub").notEmpty().isString(),
    
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const collection = client.db("crm").collection("users");
      let userData = req.body;

      
      const existingUser = await collection.findOne({ sub: userData.sub });

      if (existingUser) {
        
        return res.json({ message: "User already exists" });
      }

      
      const result = await collection.insertOne(userData);
      res.json(result);
    } catch (error) {
      console.error("Error in /addUser:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

module.exports = router;
