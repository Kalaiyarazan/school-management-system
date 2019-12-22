const jwt = require("jsonwebtoken");

const adminTokenGenerator = ({ adminId, email, fullName }) => {
  const token = jwt.sign(
    {
      sub: "admin",
      adminId,
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

const adminTokenValidator = (token = "") => {
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    return data;
  } catch (e) {
    console.error(e);
    return false;
  }
};

exports.adminTokenValidator = adminTokenValidator;
exports.adminTokenGenerator = adminTokenGenerator;
