const {
  requestFailedMessage,
  requestNotFoundMessage,
} = require("../constants/messages");
const Waitlists = require("../models/Waitlist");
const apiHits = require("../models/apiHits");
const WaitlistData = require("../models/dataDump");
const { WrapHandler, validateRequest, generateID } = require("../utils");
const { apiHIT } = require("./apiController");

exports.createWaitlistForm = WrapHandler(async (req, res) => {
  const body = req?.body;
  const val = validateRequest(body, ["waitlistTitle"]);
  if (val) return res.status(400).send(val);
  // create waitlist
  body.waitlistID = generateID();
  body.userID = req.userID;

  let create = await Waitlists.create(body);
  if (!create) return res.status(400).send(requestFailedMessage);
  create = create.toObject();
  delete create._id;
  return res.send(create);
});
exports.updateWaitlistForm = WrapHandler(async (req, res) => {
  const body = req?.body;
  const val = validateRequest(body, ["waitlistTitle"]);
  if (val) return res.status(400).send(val);

  const { waitlistID } = req.params;

  //get the waitlist
  let waitlist = this.getWaitlist(req.userID, waitlistID);

  if (!waitlist) return res.status(404).send(requestNotFoundMessage);

  let create = await Waitlists.findByIdAndUpdate(waitlist._id, body);

  if (!create) return res.status(400).send(requestFailedMessage);

  return res.send(create);
});
exports.getWaitlist = async (waitlistID, userID) => {
  //TODO: implement cache here
  console.log(userID);
  let waitlist = await Waitlists.findOne({
    userID: userID,
    waitlistID,
  });
  return waitlist;
};
exports.getWaitlistForm = WrapHandler(async (req, res) => {
  const { waitlistID } = req.params;

  //get the waitlist
  let waitlist = this.getWaitlist(req.userID, waitlistID);

  if (!waitlist) return res.status(404).send(requestNotFoundMessage);
  waitlist = waitlist.toObject();
  delete waitlist._id;
  return res.send(waitlist);
});
exports.apiHIT = async (userID, add = true) => {
  var hit = await apiHits.findOne({ userID });
  if (!hit) {
    hit = await apiHits.create({
      userID: userID,
      hits: 0,
    });
  }
  var update = hit.hits;
  if (add) {
    await apiHits.findByIdAndUpdate(hit._id, { hits: hit.hits + 1 });
    update++;
  }
  return update;
};
exports.getWaitlistFormData = WrapHandler(async (req, res) => {
  const { waitlistID } = req.params;

  //get the waitlist

  let waitlist = await this.getWaitlist(waitlistID, req.userID);

  if (!waitlist) return res.status(404).send(requestNotFoundMessage);
  // waitlist = waitlist;
  //   delete waitlist._id;

  // now get the data
  console.log(waitlist);
  const data = await WaitlistData.find({
    waitlistID,
  }).sort({ createdAt: -1 });
  return res.send({ waitlist, data });
});
exports.getWaitlistDataOnly = WrapHandler(async (req, res) => {
  const { waitlistID } = req.params;

  //get the waitlist

  let waitlist = await this.getWaitlist(waitlistID, req.userID);

  if (!waitlist) return res.status(404).send(requestNotFoundMessage);
  // waitlist = waitlist;
  //   delete waitlist._id;

  // now get the data
  const data = await WaitlistData.find(
    {
      waitlistID,
    },
    "waitlistData"
  ).sort({ createdAt: -1 });
  const responseData = [];
  data.forEach((d) => {
    responseData.push(d.waitlistData);
  });
  return res.send({ data: responseData });
});
exports.getUserWaitlists = WrapHandler(async (req, res) => {
  const userID = req.userID;
  const hits = await this.apiHIT(userID, false);
  let waitlists = await Waitlists.find({
    userID,
  }).sort({ createdAt: -1 });

  return res.send({ waitlists, hits });
});

exports.controllerTemplate = WrapHandler(async (req, res) => {});
