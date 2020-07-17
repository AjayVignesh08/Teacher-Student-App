const express = require("express");
const teachers = require("../models/teacherData");
const studentRouter = require("./studentRouter");

const teacherRouter = express.Router();
teacherRouter.use("/", studentRouter);
let i;

const teachbyId = (id, teacher) => {
  const Id = parseInt(id);
  return teacher.find(x => x.id === Id);
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

const del = (id, teachers) => {
  for (i = 0; i < teachers.length; i++) {
    if (teachers[i].id === id) {
      teachers.splice(i, 1);
      return true;
    }
  }
  return false;
};

teacherRouter
  //Get all the Teachers Details
  .get("/", (req, res) => {
    res.status(200).json({
      message: "Teacher data",
      data: teachers
    });
  })

  //Create a New Teacher
  .post("/", (req, res) => {
    const id = teachers.length + 1;
    teachers.push({ id: id, ...req.body });
    res.status(200).json({
      message: "Teacher added Successfully",
      data: req.body
    });
  })

  //update  Teacher by ID
  .put("/:id", (req, res) => {
    const { id } = req.params;
    const Id = parseInt(id);
    const updatedteach = update(Id, teachers, req.body);
    if (updatedteach) {
      res.status(200).json({
        message: "Teacher updated Successfully",
        data: req.body
      });
    } else {
      res.status(400).send("Invalid Teacher");
    }
  })

  //Delete All Teachers
  .delete("/", (req, res) => {
    teachers.splice(0, teachers.length);
    res.status(200).json({ message: "All Teacher Data has been deleted" });
  })

  //Delete a Teacher by ID
  .delete("/:id", (req, res) => {
    const { id } = req.params;
    const Id = parseInt(id);
    const dele = del(Id, teachers);
    if (dele) {
      res.status(200).json({
        message: "Teacher Deleted Successfully"
      });
    } else {
      res.status(400).send("Invalid Delete");
    }
  })
  // Get teacher by ID
  .get("/:id", (req, res) => {
    const { id } = req.params;
    const reqteach = teachbyId(id, teachers);
    if (reqteach) {
      res.status(200).json({
        message: "Required Teacher",
        data: reqteach
      });
    } else {
      res.status(400).send("Invaild Teacher Id");
    }
  });

module.exports = teacherRouter;
