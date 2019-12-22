const { userTokenValidator } = require("../utils/userTokenManager");

const teacherAuth = (req, res, next) => {
  const { jwt = "" } = req.cookies;
  const teacher = userTokenValidator(jwt);
  if (teacher) {
    req.teacher = teacher;
    next();
  } else {
    res.redirect("/teacher/login");
  }
};

module.exports = teacherAuth;
