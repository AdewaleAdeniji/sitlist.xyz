const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
var bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { Log } = require("./services/log.service");
const { validateUser, validateAPIKey } = require("./middlewares");
const {
  createWaitlistForm,
  getWaitlistForm,
  getUserWaitlists,
  getWaitlistFormData,
} = require("./controllers/waitlistControllers");
const { getAPIKeys, apiKeyTest, pushFormData } = require("./controllers/apiController");

app.use(cors({ origin: "*" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

//ROUTES

app.post("/waitlist/create", validateUser, createWaitlistForm);
app.get("/waitlists/:waitlistID", validateUser, getWaitlistForm);
app.get("/waitlists/data/:waitlistID", validateUser, getWaitlistFormData);
app.get("/waitlists", validateUser, getUserWaitlists);

app.get("/keys", validateUser, getAPIKeys);
app.get("/keys/test", validateAPIKey, apiKeyTest);
app.post("/api/waitlist/:waitlistID", validateAPIKey, pushFormData);


app.get("/health", (_, res) => {
  return res.status(200).send("OK");
});

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: process.env.WAITLIST_DB,
  })
  .then(async () => {
    console.log("connected to mongodb");
    // await Log("Connected to mongo");
  })
  .catch(() => console.log("error occured connecting to mongodb"));

app.listen(process.env.PORT, async () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
