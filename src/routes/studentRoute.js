const express = require("express");
const { compareHash } = require("../utils/hash");
const {
  studentTokenGenerator,
  studentTokenValidator
} = require("../utils/studentTokenManager");

const { Student } = require("../models/Students");
// const { Teacher } = require("../models/Teachers");
const { Mark } = require("../models/Marks");
const StudentRouter = express.Router();

StudentRouter.route("/login")
  .get((req, res) => {
    res.render("login-form", {
      role: "student"
    });
  })
  .post((req, res) => {
    const { email, password } = req.body;
    Student.findOne({
      where: {
        email
      }
    }).then(studentInstance => {
      if (studentInstance) {
        const student = studentInstance.get();
        const {
          id = "",
          email: emailFromDB = "",
          fullName = "",
          course = "",
          password: passwordFromDB = ""
        } = student;
        compareHash(password, passwordFromDB)
          .then(isSuccess => {
            if (isSuccess) {
              const jwtToken = studentTokenGenerator({
                id,
                email: emailFromDB,
                fullName
              });
              res.cookie("jwt", jwtToken, { httpOnly: true });
              res.status(200).redirect(`/student/${id}`);
            } else {
              res.status(400).send("No student found");
            }
          })
          .catch(error => {
            console.error(error);
            res.status(500).send("Internal Server Error");
          });
      } else {
        res.status(400).send("No student found");
      }
    });
    console.log(email, password);
  });

StudentRouter.route("/signout").get((req, res) => {
  console.log("Signed Out");
  const { jwt = "" } = req.cookies;
  const student = studentTokenValidator(jwt);

  if (student) {
    res.clearCookie("jwt");
    res.redirect("/");
  }
});

StudentRouter.route("/:id").get((req, res) => {
  const { jwt = "" } = req.cookies;
  const student = studentTokenValidator(jwt);
  if (student) {
    Student.findOne({
      where: {
        id: req.params.id
      }
    }).then(studentInstance => {
      if (studentInstance) {
        const student = studentInstance.get();
        const {
          id: studentId = "",
          email: emailFromDB = "",
          fullName: studentName = "",
          course = ""
        } = student;

        Mark.findAll({
          where: {
            course
          }
        }).then(markInstance => {
          const marks = markInstance.map(instance => instance.get());
          // const marks = Mark.findAll().then(markInstance => {const marks = markInstance.map(instance => instance.get());
          res.render("student-home", {
            marks,
            studentId
          });
        });
      } else {
        res.redirect("/student/login");
      }
    });
    //
  }
});

StudentRouter.route("/profile/:id").get((req, res) => {
  const { jwt = "" } = req.cookies;
  const student = studentTokenValidator(jwt);
  console.log(req.headers);
  if (student) {
    Student.findOne({
      where: {
        id: req.params.id
      }
    }).then(studentInstance => {
      if (studentInstance) {
        const student = studentInstance.get();

        res.render("student-profile", {
          student
        });
      }
    });
  } else {
    res.redirect("/student/login");
  }
});

module.exports = StudentRouter;
