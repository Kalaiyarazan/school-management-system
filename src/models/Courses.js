const Sequelize = require("sequelize");
const SchoolDB = require("../config/SchoolDB");

const Course = SchoolDB.define("course", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true
  },
  course: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  description: Sequelize.STRING
});

const CourseSync = ({ force = false } = { force: false }) => {
  return new Promise((resolve, reject) => {
  Course.sync({ force })
    .then(() => {
      const courseData = Course.build({
        course: "I",
        description: "First Standard"
      });

      courseData.save()
        .then(result => {
          console.log(result.get());
          resolve(result.get());
        });
      })
      .catch(reject);
  });
};

exports.Course = Course;
exports.CourseSync = CourseSync;
