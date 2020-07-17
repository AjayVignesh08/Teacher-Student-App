const express = require("express");
const bodyParser = require("body-parser");
// const {
//   studentsRouter,
//   getallstudents,
//   getStudentById
// } = require("./routes/studentRouter");
const teachers = require("./models/teacherData");
const teachersRouter = require("./routes/teachersRouter");
const studentsRouter = require("./routes/studentRouter");
//const getStudentById = require("./routes/studentRouter");
const expressHbs = require("express-handlebars");
const path = require("path");
const ifequality = require("./views/helpers/ifEquality");

const app = express();

// Creating handlebars engine
const hbs = expressHbs.create({
  extname: ".hbs",
  layoutsDir: path.join(__dirname, "./views/layouts"),
  partialsDir: path.join(__dirname, "./views/partials"),
  helpers: {
    ifequality
  }
});

// Let express know to use handlebars
app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "./views"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (request, response) => {
  response.status(200).render("home.hbs", {
    layout: "navigation.hbs",
    title: "Home"
  });
});

app.get("/teachers", (req, res) => {
  res.status(200).render("teachers.hbs", {
    layout: "navigation",
    title: "Teachers Details",
    data: teachers
  });
});

app.get("/add-teacher", (request, response) => {
  response.status(200).render("addTeachers.hbs", {
    layout: "navigation.hbs",
    title: "Add Teachers",
    action: "/teachers/",
    method: "POST"
  });
});

app.get("/edit-teacher/:id", (req, res) => {
  const { id } = req.params;
  const reqteach = teachers.find(each => each.id == id);
  if (reqteach) {
    res.status(200).render("addTeachers.hbs", {
      layout: "navigation",
      title: "Add Teacher",
      teacher: reqteach,
      action: "/teachers/" + reqteach.id,
      method: "PUT"
    });
  } else {
    res.status(404).send("Teachers not found");
  }
});

app.get("/teacher/:id/students", (req, res) => {
  const { id } = req.params;
  const reqteach = teachers.find(each => each.id == id);
  res.status(200).render("students.hbs", {
    layout: "navigation",
    title: "Teachers Details",
    data: reqteach.students,
    addroute: "/teacher/" + id
  });
});

app.get("/teacher/:id/add-student", (request, response) => {
  const { id } = request.params;
  response.status(200).render("addStudents.hbs", {
    layout: "navigation.hbs",
    title: "Add Student",
    action: "/teachers/teacher/" + id + "/add-student",
    method: "POST",
    addroute: "/teacher/" + id
  });
});

app.get("/teacher/:id/edit-student/:studid", (req, res) => {
  const { id, studid } = req.params;
  const reqteach = teachers.find(each => each.id == id);
  const requiredStudent = reqteach.students.find(x => x.id == studid);
  if (requiredStudent) {
    res.status(200).render("addStudents.hbs", {
      layout: "navigation",
      title: "Add Student",
      student: requiredStudent,
      action: `/teachers/teacher/${id}/edit-student/` + requiredStudent.id,
      method: "PUT",
      addroute: "/teacher/" + id
    });
  } else {
    res.status(404).send("Student not found");
  }
});

app.get("/teachers", (req, res) => {
  res.status(200).render("teachers.hbs", {
    layout: "navigation.hbs",
    title: "Add Teachers",
    action: "/teachers",
    method: "POST"
  });
});
app.get("/about", (request, response) => {
  response.status(200).render("home.hbs", {
    message: "About this page"
  });
});

app.use("/students", studentsRouter);

app.use("/teachers", teachersRouter);

app.get("*", (req, res) => {
  res.status(404).send("404 Page not found");
});

app.listen(8080, () => {
  console.log("server running");
});
