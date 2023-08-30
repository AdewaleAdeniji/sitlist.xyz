const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
const { verifyToken } = require("../services/UserService");
const { brands, vulgarWords } = require("../constants");
const createHash = async function (plainTextPassword) {
  // return password hash
  return await argon2.hash(plainTextPassword);
};
const generateID = () => {
  const timestamp = new Date().getTime().toString(); // get current timestamp as string
  const random = Math.random().toString().substr(2, 5); // generate a random string of length 5
  const userId = timestamp + random; // concatenate the timestamp and random strings
  return generateRandomEmail(7) + userId + generateRandomEmail(5);
};

// Method to validate the entered password using argon2
const validateHash = async function (hashed, candidatePassword) {
  return await argon2.verify(hashed, candidatePassword);
};
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const signToken = (data) => {
  let jwtSecretKey = process.env.JWT_SECRET_KEY;
  const payload = { payload: data };
  payload.date = Date.now();

  return jwt.sign(payload, jwtSecretKey);
};
const validateUser = async (req, res, next) => {
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
const generateOTP = (otpLength = 6) => {
  let digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < otpLength; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};
const WrapHandler = (controllerFn) => {
  return async (req, res, next) => {
    try {
      await controllerFn(req, res, next);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err.message });
    }
  };
};
const validateRequest = (obj, keys) => {
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const words = key.split(/(?=[A-Z])/); // Split the key based on capital letters
    const humanReadableKey = words.join(" "); // Join the words with spaces
    const formattedKey =
      humanReadableKey.charAt(0).toUpperCase() + humanReadableKey.slice(1); // Capitalize the first letter
    if (!(key in obj)) {
      return `${formattedKey} is required`;
    }
    if(key in obj && obj[key] === "") {
      return `${formattedKey} is required`;
    }
  }
  return false;
};
const generateRandomEmail = (length = 7)  => {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let email = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    email += characters.charAt(randomIndex);
  }
  return email;
}


function isSuspiciousEmail(username) {
  // const emailParts = email.split("@");
  // if (emailParts.length !== 2) {
  //   return false; // Invalid email format
  // }

  // const username = emailParts[0].toLowerCase();
  // const domain = emailParts[1].toLowerCase();

  // Check against brand names and vulgar words
  for (const brand of brands) {
    if (username.includes(brand)) {
      return brand; // Suspicious brand in username
    }
  }

  for (const word of vulgarWords) {
    if (username.includes(word)) {
      return word; // Suspicious vulgar word in username
    }
  }

  return false; // Email appears to be legitimate
}

module.exports = {
  verifyToken,
  signToken,
  createHash,
  validateHash,
  isValidEmail,
  generateID,
  generateOTP,
  WrapHandler,
  validateRequest,
  generateRandomEmail,
  validateUser,
  isSuspiciousEmail
};
