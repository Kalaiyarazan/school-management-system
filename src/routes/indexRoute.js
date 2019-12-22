const express = require("express");

const indexRouter = express.Router();


indexRouter.route("/").get((req, res) => {
  res.render("home", {
    title: "Home | School Manangement System"
  });
});

module.exports = indexRouter;
