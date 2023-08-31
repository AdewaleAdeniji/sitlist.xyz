const { verifyToken } = require("../services/user.service");
const { decrypt } = require("../utils/apiKeys");

exports.validateUser = async (req, res, next) => {
  const headers = req.headers;
  const authorization = headers.authorization;
  if (!authorization) {
    return res.status(403).send({ message: "Forbidden access, login first" });
  }
  //validate the token itself
  const val = await verifyToken(authorization.split(" ")[1]);
  if (!val || !val.success) {
    return res.status(403).send({ message: "Access expired, login first" });
  }
  req.userID = val.userID;
  req.user = val;
  next();
};

exports.validateAPIKey = async (req, res, next) => {
  const headers = req.headers;
  const privateKey = headers.sitprivatekey;
  const publicKey = headers.sitpublickey;
  if (!privateKey || !publicKey) {
    return res.status(403).send({ message: "Forbidden ACCESS" });
  }
  //validate the token itself
  const val = await decrypt(privateKey, publicKey)
  if (!val) {
    return res.status(403).send({ message: "Invalid API key access" });
  }
  req.userID = val;
  next();
};
