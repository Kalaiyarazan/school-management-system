const jwt = require("jsonwebtoken");

const teacherTokenGenerator = ({ id, email, fullName }) => {
  const token = jwt.sign(
    {
      sub: "teacher",
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

const teacherTokenValidator = (token = "") => {
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    return data;
  } catch (e) {
    console.error(e);
    return false;
  }
};

exports.teacherTokenValidator = teacherTokenValidator;
exports.teacherTokenGenerator = teacherTokenGenerator;
