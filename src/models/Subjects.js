const Sequelize = require("sequelize");
const SchoolDB = require("../config/SchoolDB");

const Subject = SchoolDB.define("subject", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  subject: {
    type: Sequelize.STRING,
    primaryKey: true
  }
});

const SubjectSync = ({ force = false } = { force: false }) => {
  Subject.sync({ force })
    .then(() => {
      const studentData = {
        subject: "Tamil"
      };

      Subject.create(studentData)
        .then(result => {
          console.log(result.get());
        })
        .catch(console.error);
    })
    .catch(console.error);
};

exports.Subject = Subject;
exports.SubjectSync = SubjectSync;
