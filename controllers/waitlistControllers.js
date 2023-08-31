const {
  requestFailedMessage,
  requestNotFoundMessage,
} = require("../constants/messages");
const Waitlists = require("../models/Waitlist");
const WaitlistData = require("../models/dataDump");
const { WrapHandler, validateRequest, generateID } = require("../utils");
const { getFromCache, setToCache } = require("../utils/cache");

exports.createWaitlistForm = WrapHandler(async (req, res) => {
  const body = req?.body;
  const val = validateRequest(body, ["title"]);
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
exports.getWaitlist = async (waitlistID, userID) => {
  //TODO: implement cache here
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
exports.getWaitlistFormData = WrapHandler(async (req, res) => {
  const { waitlistID } = req.params;

  //get the waitlist

  let waitlist = this.getWaitlist(req.userID, waitlistID);

  if (!waitlist) return res.status(404).send(requestNotFoundMessage);
  waitlist = waitlist.toObject();
  delete waitlist._id;

  // now get the data

  const data = await WaitlistData.find({
    waitlistID,
  });
  return res.send({ waitlist, data });
});
exports.getUserWaitlists = WrapHandler(async (req, res) => {
  const userID = req.userID;

  let waitlists = await Waitlists.find({
    userID,
  });

  return res.send(waitlists);
});

exports.controllerTemplate = WrapHandler(async (req, res) => {});
