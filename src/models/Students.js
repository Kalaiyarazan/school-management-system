const Sequelize = require("sequelize");
const SchoolDB = require("../config/SchoolDB");
const { generateHashSync } = require("../utils/hash");
const { Course } = require("../models/Courses");

const Student = SchoolDB.define(
  "student",
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

const StudentSync = ({ force = false, course = {} } = { force: false }) => {
  Student.sync({ force })
    .then(() => {
      const studentData = {
        fullName: "Student 1",
        course: course.course,
        email: "student1@student.com",
        password: "student"
      };

      Student.create(studentData)
        .then(result => {
          console.log(result.get());
        })
        .catch(console.error);
    })
    .catch(console.error);
};

exports.Student = Student;
exports.StudentSync = StudentSync;
