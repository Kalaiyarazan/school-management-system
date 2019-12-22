const express = require("express");
const { compareHash } = require("../utils/hash");
const {
  adminTokenGenerator,
  adminTokenValidator
} = require("../utils/adminTokenManager");

//Models Import
const { Admin } = require("../models/Admins");
const { Course } = require("../models/Courses");
const { Subject } = require("../models/Subjects");
const { Student } = require("../models/Students");
const { Teacher } = require("../models/Teachers");

//Association

// // Course.hasMany(Subject);
// Course.hasMany(Student, { as: "Students", foreignKey: "course" });
// Student.belongsTo(Course, { as: "Course", foreignKey: "course" });

// Course.hasMany(Teacher);

const adminRouter = express.Router();

adminRouter
  .route("/login")
  .get((req, res) => {
    const { jwt = "" } = req.cookies;
    const admin = adminTokenValidator(jwt);
    if (admin) {
      res.redirect("/admin");
    } else {
      res.render("login-form", {
        role: "admin"
      });
    }
  })

  .post((req, res) => {
    const { email, password } = req.body;
    Admin.findOne({
      where: {
        email
      }
    }).then(adminInstance => {
      if (adminInstance) {
        const admin = adminInstance.get();
        const {
          adminId = "",
          email: emailFromDB = "",
          fullName = "",
          password: passwordFromDB = ""
        } = admin;
        compareHash(password, passwordFromDB)
          .then(isSuccess => {
            if (isSuccess) {
              const jwtToken = adminTokenGenerator({
                adminId,
                email: emailFromDB,
                fullName
              });
              res.cookie("jwt", jwtToken, { httpOnly: true });
              res.status(200).redirect("/admin");
            } else {
              res.status(400).send("No user found");
            }
          })
          .catch(error => {
            console.error(error);
            res.status(500).send("Internal Server Error");
          });
      } else {
        res.status(400).send("No user found");
      }
    });
    console.log(email, password);
  });

adminRouter.route("/").get((req, res) => {
  const { jwt = "" } = req.cookies;
  const admin = adminTokenValidator(jwt);
  if (admin) {
    Course.count().then(courseCount => {
      Subject.count().then(subjectCount => {
        Student.count().then(studentCount => {
          Teacher.count().then(teacherCount => {
            res.render("admin-page", {
              courseCount,
              subjectCount,
              studentCount,
              teacherCount
            });
          });
        });
      });
    });
  } else {
    res.redirect("/admin/login");
  }
});

//Course Routes

adminRouter
  .route("/class")
  .get((req, res) => {
    const { jwt = "" } = req.cookies;
    const admin = adminTokenValidator(jwt);
    if (admin) {
      Course.findAll().then(courseInstance => {
        // Course.findAll({
        //   where: { course: "I" },
        //   include: [{ model: "Student", as: "Students" }]
        // }).then(courseInstance => {
        const courses = courseInstance.map(instance => instance.get());
        console.log(courses);
        res.render("admin-class", {
          courses
        });
      });
    } else {
      res.redirect("/admin/login");
    }
  })
  .post((req, res) => {
    const { course = "", description = "" } = req.body;
    const courseData = {
      course,
      description
    };

    Course.create(courseData)
      .then(result => {
        console.log(result.get());
        res.redirect("/admin/class");
      })
      .catch(console.error);
  });

//Subject Routes

adminRouter
  .route("/subject")
  .get((req, res) => {
    const { jwt = "" } = req.cookies;
    const admin = adminTokenValidator(jwt);
    if (admin) {
      Subject.findAll().then(subjectInstance => {
        const subjects = subjectInstance.map(instance => instance.get());
        res.render("admin-subject", {
          subjects
        });
      });
    } else {
      res.redirect("/admin/login");
    }
  })
  .post((req, res) => {
    const { subject = "" } = req.body;
    const subjectData = {
      subject: subject
    };

    Subject.create(subjectData)
      .then(result => {
        console.log(result.get());
        res.redirect("/admin/subject");
      })
      .catch(console.error);
  });

//Student Routes

adminRouter
  .route("/student")
  .get((req, res) => {
    const { jwt = "" } = req.cookies;
    const admin = adminTokenValidator(jwt);
    if (admin) {
      Student.findAll().then(studentInstance => {
        const students = studentInstance.map(instance => instance.get());
        Course.findAll().then(courseInstance => {
          const courses = courseInstance.map(instance => instance.get());

          res.render("admin-student", {
            students,
            courses
          });
        });
      });
    } else {
      res.redirect("/admin/login");
    }
  })
  .post((req, res) => {
    console.log(req.body);
    const { fullName = "", course = "", email = "", password = "" } = req.body;

    const studentData = {
      fullName,
      course,
      email,
      password
    };

    Student.create(studentData)
      .then(result => {
        console.log(result.get());
        res.redirect("/admin/student");
      })
      .catch(console.error);
  });

//Teacher Routes

adminRouter
  .route("/teacher")
  .get((req, res) => {
    const { jwt = "" } = req.cookies;
    const admin = adminTokenValidator(jwt);
    if (admin) {
      Teacher.findAll().then(teacherInstance => {
        const teachers = teacherInstance.map(instance => instance.get());
        Course.findAll().then(courseInstance => {
          const courses = courseInstance.map(instance => instance.get());

          res.render("admin-teacher", {
            teachers,
            courses
          });
        });
      });
    } else {
      res.redirect("/admin/login");
    }
  })
  .post((req, res) => {
    console.log(req.body);
    const { fullName = "", course = "", email = "", password = "" } = req.body;

    const teacherData = {
      fullName,
      course,
      email,
      password
    };

    Teacher.create(teacherData)
      .then(result => {
        console.log(result.get());
        res.redirect("/admin/teacher");
      })
      .catch(console.error);
  });

adminRouter.route("/profile").get((req, res) => {
  const { jwt = "" } = req.cookies;
  const admin = adminTokenValidator(jwt);
  if (admin) {
    Admin.findAll().then(adminInstance => {
      const admins = adminInstance.map(instance => instance.get());
      res.render("admin-profile", {
        admins
      });
    });
  } else {
    res.redirect("/admin/login");
  }
});

adminRouter.route("/signout").get((req, res) => {
  const { jwt = "" } = req.cookies;
  const admin = adminTokenValidator(jwt);
  if (admin) {
    res.clearCookie("jwt");
    res.redirect("/");
  }
});
module.exports = adminRouter;
