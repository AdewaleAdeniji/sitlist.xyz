const { getFromCache, setToCache } = require("../utils/cache");
const configs = require("../utils/configs");
const apiConfig = configs.config;
var axios = require("axios");

exports.verifyToken = async (token) => {
  //TODO: implement caching here
  const user = getFromCache(token);
  if (user) {
    return user;
  }
  var config = {
    method: "get",
    url: apiConfig.USER_SERVICE_URL + "/token",
    headers: {
      appKey: apiConfig.USER_SERVICE_API_KEY,
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const req = await axios(config);
    setToCache(token, {
      success: true,
      ...req.data,
    });
    return {
      success: true,
      ...req.data,
    };
  } catch (err) {
    console.log(err?.response);
    return {
      success: false,
      message: err?.response?.data?.message || "Unauthorized User ",
    };
  }
};
exports.getUser = async (userID) => {
  var config = {
    method: "get",
    url: apiConfig.USER_SERVICE_URL + "/auth/user/" + userID,
    headers: {
      appKey: apiConfig.USER_SERVICE_API_KEY,
    },
  };
  try {
    const req = await axios(config);
    return {
      success: true,
      ...req.data,
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: err?.response?.data?.message || "Unauthorized User ",
    };
  }
};
