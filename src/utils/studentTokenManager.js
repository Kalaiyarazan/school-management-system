const jwt = require("jsonwebtoken");

const studentTokenGenerator = ({ id, email, fullName }) => {
  const token = jwt.sign(
    {
      sub: "student",
      id,
      email,
      fullName
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1 hour"
    }
  );
  return token;
};

const studentTokenValidator = (token = "") => {
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    return data;
  } catch (e) {
    console.error(e);
    return false;
  }
};

exports.studentTokenValidator = studentTokenValidator;
exports.studentTokenGenerator = studentTokenGenerator;
