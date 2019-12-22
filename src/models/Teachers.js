const Sequelize = require("sequelize");
const SchoolDB = require("../config/SchoolDB");
const { generateHashSync } = require("../utils/hash");
const { Course } = require("../models/Courses");

const Teacher = SchoolDB.define(
  "teacher",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    fullName: Sequelize.STRING,
    course: {
      type: Sequelize.STRING,
      references: {
        model: Course,
        key: "course"
      }
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: Sequelize.STRING
  },
  {
    setterMethods: {
      password(plainTextPassword) {
        this.setDataValue("password", generateHashSync(plainTextPassword));
      }
    }
  }
);

const TeacherSync = ({ force = false, course = {} } = { force: false }) => {
  Teacher.sync({ force })
    .then(() => {
      const teacherData = {
        fullName: "Teacher 1",
        course: course.course,
        email: "teacher1@teacher.com",
        password: "teacher"
      };

      Teacher.create(teacherData)
        .then(result => {
          console.log(result.get());
        })
        .catch(console.error);
    })
    .catch(console.error);
};

exports.Teacher = Teacher;
exports.TeacherSync = TeacherSync;
