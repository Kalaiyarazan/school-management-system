const express = require("express");
const { compareHash } = require("../utils/hash");
const {
  teacherTokenGenerator,
  teacherTokenValidator
} = require("../utils/teacherTokenManager");

//Models Import
// const { Admin } = require("../models/Admins");
// const { Course } = require("../models/Courses");
// const { Subject } = require("../models/Subjects");
// const { Student } = require("../models/Students");
const { Teacher } = require("../models/Teachers");
const { Mark } = require("../models/Marks");

const teacherRouter = express.Router();

teacherRouter
  .route("/login")
  .get((req, res) => {
    res.render("login-form", {
      role: "teacher"
    });
  })

  .post((req, res) => {
    const { email, password } = req.body;
    Teacher.findOne({
      where: {
        email
      }
    }).then(teacherInstance => {
      if (teacherInstance) {
        const teacher = teacherInstance.get();
        const {
          id = "",
          email: emailFromDB = "",
          fullName = "",
          course = "",
          password: passwordFromDB = ""
        } = teacher;
        compareHash(password, passwordFromDB)
          .then(isSuccess => {
            if (isSuccess) {
              const jwtToken = teacherTokenGenerator({
                id,
                email: emailFromDB,
                fullName
              });
              res.cookie("jwt", jwtToken, { httpOnly: true });
              res.status(200).redirect(`/teacher/${id}`);
            } else {
              res.status(400).send("No teacher found");
            }
          })
          .catch(error => {
            console.error(error);
            res.status(500).send("Internal Server Error");
          });
      } else {
        res.status(400).send("No teacher found");
      }
    });
    console.log(email, password);
  });

teacherRouter.route("/signout").get((req, res) => {
  console.log("Signed Out");
  const { jwt = "" } = req.cookies;
  const teacher = teacherTokenValidator(jwt);

  if (teacher) {
    res.clearCookie("jwt");
    res.redirect("/");
  }
});

teacherRouter
  .route("/:id")
  .get((req, res) => {
    const { jwt = "" } = req.cookies;
    const teacher = teacherTokenValidator(jwt);
    if (teacher) {
      Teacher.findOne({
        where: {
          id: req.params.id
        }
      }).then(teacherInstance => {
        if (teacherInstance) {
          const teacher = teacherInstance.get();
          const {
            id: teacherId = "",
            email: emailFromDB = "",
            fullName: teacherName = "",
            course = ""
          } = teacher;

          Mark.findAll({
            where: {
              course
            }
          }).then(markInstance => {
            const marks = markInstance.map(instance => instance.get());
            // const marks = Mark.findAll().then(markInstance => {const marks = markInstance.map(instance => instance.get());
            res.render("teacher-home", {
              marks,
              teacherId
            });
          });
        } else {
          res.redirect("/teacher/login");
        }
      });
      //
    }
  })
  //
  .post((req, res) => {
    const {
      course = {},
      studentId = {},
      exam = {},
      tamil = {},
      english = {},
      maths = {}
    } = req.body;
    const markData = {
      course,
      studentId,
      exam,
      tamil,
      english,
      maths
    };

    Mark.create(markData)
      .then(result => {
        console.log(result.get());
        res.redirect(`/teacher/${req.params.id}`);
      })
      .catch(console.error);
  });

teacherRouter.route("/profile/:id").get((req, res) => {
  const { jwt = "" } = req.cookies;
  const teacher = teacherTokenValidator(jwt);
  console.log(req.headers);
  if (teacher) {
    Teacher.findOne({
      where: {
        id: req.params.id
      }
    }).then(teacherInstance => {
      if (teacherInstance) {
        const teacher = teacherInstance.get();

        res.render("teacher-profile", {
          teacher
        });
      }
    });
  } else {
    res.redirect("/teacher/login");
  }
});

module.exports = teacherRouter;
