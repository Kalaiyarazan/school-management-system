const Sequelize = require("sequelize");
const SchoolDB = require("../config/SchoolDB");
// const { Student } = require("../models/Students");
// const { Course } = require("../models/Courses");

const Mark = SchoolDB.define("mark", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  course: {
    type: Sequelize.STRING
    // references: {
    //   model: Course,
    //   key: "course"
    // }
  },
  studentId: {
    type: Sequelize.INTEGER
    // references: {
    //   model: Student,
    //   key: "id"
    // }
  },
  exam: Sequelize.STRING,
  tamil: Sequelize.INTEGER,
  english: Sequelize.INTEGER,
  maths: Sequelize.INTEGER
  // science: Sequelize.INTEGER,
  // social: Sequelize.INTEGER
});

const MarkSync = ({ force = false } = { force: false }) => {
  Mark.sync({ force })
    .then(() => {
      const markData = {
        course: "I",
        studentId: "1",
        exam: "Exam 1",
        tamil: "10",
        english: "10",
        maths: "10"
        // science: "10",
        // social: "10"
      };

      Mark.create(markData)
        .then(result => {
          console.log(result.get());
        })
        .catch(console.error);
    })
    .catch(console.error);
};

exports.Mark = Mark;
exports.MarkSync = MarkSync;
