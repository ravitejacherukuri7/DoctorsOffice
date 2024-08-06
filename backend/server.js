require("dotenv").config();

const express = require("express");
const app = express();
const { MongoClient } = require("mongodb");
const cors = require("cors");
const { body, validationResult } = require("express-validator");
const helmet = require("helmet");

const userRoute = require("./routes/User");
const eventRoute = require("./routes/Event");
const clientRoute = require("./routes/Client");
const patientRoute = require("./routes/Patient");
const recordRoute = require("./routes/Record");
const drugsRoute = require("./routes/Drugs");
const procedureRoute = require("./routes/Procedure");
const suppliesRoute = require("./routes/Supplies");
const taskRoute = require("./routes/Task");


const client = new MongoClient(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


app.use(cors());

app.use(helmet());

app.use(express.json({ limit: "10kb" }));


async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

  
    const db = client.db("crm");
    const usersCollection = db.collection("users");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}


setTimeout(() => {
  run().catch(console.dir);
}, 1000);

app.use("/user", userRoute);

app.use("/event", eventRoute);
app.use("/client", clientRoute);
app.use("/patient", patientRoute);
app.use("/record", recordRoute);
app.use("/drugs", drugsRoute);
app.use("/procedure", procedureRoute);
app.use("/supplies", suppliesRoute);
app.use("/task", taskRoute);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
