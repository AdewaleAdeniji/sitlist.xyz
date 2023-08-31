const NodeCache = require("node-cache");
const myCache = new NodeCache({ stdTTL: 60000, checkperiod: 120 });

exports.setToCache = (key, obj) => {
  myCache.set(key, obj);
};
exports.getFromCache = (key) => {
  const value = myCache.get(key);
  if (value == undefined) {
    // handle miss!
    return false;
  }
  return value;
};
