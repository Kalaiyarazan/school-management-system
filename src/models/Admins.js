const Sequelize = require("sequelize");
const SchoolDB = require("../config/SchoolDB");
const { generateHashSync } = require("../utils/hash");

const Admin = SchoolDB.define(
  "admin",
  {
    adminId: Sequelize.STRING,
    fullName: Sequelize.STRING,
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

const AdminSync = ({ force = false } = { force: false }) => {
  Admin.sync({ force })
    .then(() => {
      const testAdmin = {
        adminId: "ADM100",
        fullName: "Kalaiyarazan",
        email: "kalai@admin.com",
        password: "admin"
      };

      Admin.create(testAdmin)
        .then(result => {
          console.log(result.get());
        })
        .catch(console.error);
    })
    .catch(console.error);
};

exports.Admin = Admin;
exports.AdminSync = AdminSync;
