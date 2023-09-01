const {
  requestFailedMessage,
  requestNotFoundMessage,
} = require("../constants/messages");
const Waitlists = require("../models/Waitlist");
const apiHits = require("../models/apiHits");
const WaitlistData = require("../models/dataDump");
const { WrapHandler, validateRequest, generateID } = require("../utils");
const { generateKeys } = require("../utils/apiKeys");
const { getWaitlist } = require("./waitlistControllers");

exports.getAPIKeys = WrapHandler(async (req, res) => {
  const userID = req.userID;
  const keys = generateKeys(userID);
  res.send(keys);
});
exports.apiKeyTest = WrapHandler(async (req, res) => {
  res.send(200);
});
// push new form
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
exports.pushFormData = WrapHandler(async (req, res) => {
  const body = req.body;
  const { waitlistID } = req.params;
  const waitlist = await getWaitlist(waitlistID, req.userID);
  if (!waitlist) return res.status(400).send(requestNotFoundMessage);
  // waitlist exist
  if (body.waitlistDataKey) {
    const waitlistDataKey = await WaitlistData.findOne({
      waitlistDataKey: body.waitlistDataKey,
      waitlistID,
    });
    if (waitlistDataKey) {
      return res
        .status(400)
        .send({ message: "Signed up for waitlist already" });
    }
  }
  // create waitlist dump
  const createDump = await WaitlistData.create({
    waitlistData: body,
    waitlistDataKey: body?.waitlistDataKey,
    waitlistID,
    dumpID: generateID(),
  });

  if (!createDump) return res.status(400).send(requestFailedMessage);
  await Waitlists.findByIdAndUpdate(waitlist._id, {
    filled: waitlist.filled + 1,
  });
  return res.send({ message: "Added to waitlist successfully!" });
});
exports.controllerTemplate = WrapHandler(async (req, res) => {});
