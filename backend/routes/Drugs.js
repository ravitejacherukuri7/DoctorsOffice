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
  "/drug/add",
  [
    body("sub").notEmpty().isString(),
    body("name").notEmpty().isString(),
    body("form").notEmpty().isString(),
    body("strength").notEmpty().isString(),
    body("packSize").notEmpty().isNumeric(),
    body("pricePerUnit").notEmpty().isNumeric(),
    body("vat").notEmpty().isNumeric(),
    body("profitMargin").notEmpty().isNumeric(),
  
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const drugData = req.body;
      const userSub = drugData.sub;

      const drugCollection = client.db("crm").collection("drugs");

    
      const newDrug = {
        name: drugData.name,
        form: drugData.form,
        strength: drugData.strength,
        packSize: drugData.packSize,
        pricePerUnit: drugData.pricePerUnit,
        vat: drugData.vat,
        profitMargin: drugData.profitMargin,
      };

     
      const result = await drugCollection.updateOne(
        { sub: userSub },
        { $push: { drugs: newDrug } },
        { upsert: true }
      );

      res
        .status(201)
        .json({ message: "Drug added successfully", drug: newDrug });
    } catch (error) {
      console.error("Error in /drug/add:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

router.get("/drugs/get", async (req, res) => {
  console.log("Received request to /drugs/get");
  try {
    let { sub } = req.headers;

    if (!sub) {
      console.log("No sub received");
      return res.status(401).json({ message: "Authentication failed" });
    }

    const collection = client.db("crm").collection("drugs");
    const userDrugs = await collection.findOne({ sub: sub });

    if (!userDrugs || !userDrugs.drugs) {
      console.log("No user drugs found");
      return res.json([]);
    }


    if (userDrugs.drugs.length === 0) {
      console.log("User's drugs list is empty");
      return res.json([]); 
    }

    res.json(userDrugs.drugs);
  } catch (error) {
    console.error("Error fetching user drugs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/drug/delete", async (req, res) => {
  console.log("Received request to /drug/delete");
  console.log(req.body);

  try {
    let { sub, name } = req.body;

    console.log(`Received sub: ${sub}`); 
    console.log(`Received drugName: ${name}`); 

    if (!sub || !name) {
      console.log("No sub or drug name received");
      return res.status(400).json({ message: "Bad request" });
    }

    const collection = client.db("crm").collection("drugs");
    const result = await collection.updateOne(
      { sub: sub },
      { $pull: { drugs: { name: name } } }
    );

    if (result.modifiedCount === 0) {
      console.log("No drug deleted");
      return res.status(404).json({ message: "Drug not found" });
    }

    res.json({ message: "Drug deleted successfully" });
  } catch (error) {
    console.error("Error deleting drug:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
