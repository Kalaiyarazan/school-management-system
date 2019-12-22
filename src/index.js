//Dependencies
const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

//Port
const PORT = process.env.PORT || 8080;

//Local Modules
const indexRouter = require("./routes/indexRoute");
const adminRouter = require("./routes/adminRoute");
const teacherRouter = require("./routes/teacherRoute");
const studentRouter = require("./routes/studentRoute");

const app = express();

app.engine(".hbs", exphbs({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "./views"));

//Middlewares
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(cookieParser());

//routes
app.use("/", indexRouter);
app.use("/admin", adminRouter);
app.use("/teacher", teacherRouter);
app.use("/student", studentRouter);

app.listen(PORT, () => console.log("Server up and running on PORT : " + PORT));

//test
