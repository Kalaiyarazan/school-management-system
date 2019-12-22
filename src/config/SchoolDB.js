const Sequelize = require("sequelize");

const SchoolDB = new Sequelize(process.env.DB_URL);

SchoolDB.authenticate()
  .then(() => {
    console.log(
      "Connection has been established succesfully with school database"
    );
  })
  .catch(err => {
    console.error("unable to connect to the school database: ", err);
  });

module.exports = SchoolDB;
