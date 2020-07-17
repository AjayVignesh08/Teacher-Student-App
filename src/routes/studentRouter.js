const express = require("express");
const teachers = require("../models/teacherData");
const teachersRouter = require("./teachersRouter");

const studentRouter = express.Router();

let i, j;
const getteacher = (id, data) => {
  const dataId = parseInt(id);
  return data.find(each => each.id === dataId);
};

const getstudent = (id, data) => {
  const dataId = parseInt(id);
  return data.find(each => each.id === dataId);
};
const posting = (id, teacher, body) => {
  const ID = parseInt(id);
  console.log(ID);
  for (i = 0; i < teacher.length; i++) {
    console.log(ID, teacher[i].id);
    if (teacher[i].id === ID) {
      if (teacher[i].students) {
        body = { id: teacher[i].students.length + 1, ...body };
        return teacher[i].students.push(body);
      } else {
        body = { id: 1, ...body };
        return (teacher[i]["students"] = body);
      }
    }
  }
};

const update = (id, teachers, newtech) => {
  for (i = 0; i < teachers.length; i++) {
    if (teachers[i].id === id) {
      const updated = { ...teachers[i], ...newtech };
      teachers.splice(i, 1, updated);
      return true;
    }
  }
  return false;
};

const del = (id, teachers, stuid) => {
  for (i = 0; i < teachers.length; i++) {
    if (teachers[i].id === id) {
      for (j = 0; j < teachers[i].students.length; j++) {
        if (teachers[i].students[j].studentid === stuid)
          teachers[i].students.splice(j, 1);
        return true;
      }
    }
  }
  return false;
};

studentRouter
  // GET STUDENTS DETAILS
  .get("/:id/students/:studentid", (req, res) => {
    const { id, studentid } = req.params;

    const viewTeacher = getteacher(id, teachers);

    const studentdetails = getstudent(id, viewTeacher.students);
    console.log(id, studentid);
    console.log(viewTeacher);
    if (studentdetails) {
      res
        .status(200)
        .json({ message: "Student Details", data: studentdetails });
    } else {
      res.status(400).send("Invalid Request");
    }
  })

  //CREATING A STUDENT by Teacher ID
  .post("/teacher/:id/add-student", (req, res) => {
    const { id } = req.params;
    const post = posting(id, teachers, req.body);
    if (post) {
      res.status(200).json({ message: "Student created", data: post });
    } else {
      res.status(400).send("Invalid Request");
    }
    console.log(teachers[0].students);
  })

  // Update A Student by studentid
  .put("/teacher/:id/edit-student/:studId", (req, res) => {
    const { id } = req.params;
    const { studId } = req.params;
    const reaqteach = teachers.find(e => e.id == id);
    const reaqstudent = reaqteach.students.find(x => x.id == studId);
    const updatedstudent = {
      ...reaqstudent,
      ...req.body
    };
    update(parseInt(studId), reaqteach.students, updatedstudent);
    res.status(200).json({ message: "Student updated", data: updatedstudent });
  })

  //DELETE A STUDENT By teacher ID
  .delete("/:id/students/:studentid", (req, res) => {
    const { id, studentid } = req.params;
    const teacherId = parseInt(id);
    const studId = parseInt(studentid);
    const requiredteacher = getteacher(teacherId, teachers);
    const dele = del(teacherId, [requiredteacher], studId);

    if (dele) {
      res.status(200).json({ message: "Student deleted", data: del });
    } else {
      res.status(400).send("Invalid Request");
    }
  });

module.exports = studentRouter;
