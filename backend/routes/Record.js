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
  "/record/add",
  [
    body("sub").notEmpty().isString(),
    body("appointmentNo").notEmpty().isString(),
    body("clientId").isString(),
    body("patientId").isString(),
    body("date").isString(),
    body("time").isString(),
    body("anamnesis").isString(),
    body("diagnosis").isString(),
    body("additionalNotes").isString(),
    body("dischargeNotes").isString(),
    body("procedures").isNumeric(),
    body("medicine").isNumeric(),
    body("supplies").isNumeric(),
    body("totalPrice").isNumeric(),
  ],
  async (req, res) => {
    console.log(req.body); 

    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const recordData = req.body;
      const userSub = recordData.sub;

      const recordCollection = client.db("crm").collection("record");

     
      const userDoc = await recordCollection.findOne({ sub: userSub });

      
      const recordCount = userDoc ? userDoc.records.length : 0;

      
      const id = String(recordCount + 1);

      
      const newRecord = {
        id: id,
        clientId: recordData.clientId,
        patientId: recordData.patientId,
        appointmentNo: recordData.appointmentNo,
        date: recordData.date,
        time: recordData.time,
        anamnesis: recordData.anamnesis,
        diagnosis: recordData.diagnosis,
        additionalNotes: recordData.additionalNotes,
        procedures: recordData.procedures,
        medicine: recordData.medicine,
        supplies: recordData.supplies,
        dischargeNotes: recordData.dischargeNotes,
        totalPrice: recordData.totalPrice,
      };

      const result = await recordCollection.updateOne(
        { sub: userSub },
        { $push: { records: newRecord } },
        { upsert: true }
      );

      res
        .status(201)
        .json({ message: "Record added successfully", record: newRecord });
    } catch (error) {
      console.error("Error in /record/add:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

router.get("/record/get", async (req, res) => {
  const userSub = req.headers.sub;

  if (!userSub) {
    return res.status(400).json({ message: "Missing user sub in headers" });
  }

  try {
    const recordCollection = client.db("crm").collection("record");

    
    const userDoc = await recordCollection.findOne({ sub: userSub });

    if (!userDoc) {
      return res.status(200).json([]);
    }

    // Return the user's records
    res.status(200).json(userDoc.records); 
  } catch (error) {
    console.error("Error in /record/get:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/record/getNextId", async (req, res) => {
  try {
    const recordCollection = client.db("crm").collection("record");

    
    const highestRecord = await recordCollection
      .aggregate([
        { $unwind: "$records" },
        { $group: { _id: null, maxId: { $max: { $toInt: "$records.id" } } } },
      ])
      .toArray();

    
    const nextId = highestRecord.length > 0 ? highestRecord[0].maxId + 1 : 1;

    
    res.status(200).json({ nextId: nextId.toString() });
  } catch (error) {
    console.error("Error in /record/getNextId:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
