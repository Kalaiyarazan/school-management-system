const { AdminSync } = require("../models/Admins");
const { CourseSync } = require("../models/Courses");
const { SubjectSync } = require("../models/Subjects");
const { StudentSync } = require("../models/Students");
const { TeacherSync } = require("../models/Teachers");
const { MarkSync } = require("../models/Marks");
AdminSync({ force: true });
SubjectSync({ force: true });
CourseSync({ force: true }).then(course => {
  StudentSync({ force: true, course });
  TeacherSync({ force: true, course });
});
MarkSync({ force: true });
// TeacherSync({ force: true });
