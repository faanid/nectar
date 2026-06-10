const express = require("express");
const fs = require("fs");

const tours = JSON.parse(
  require("fs").readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
);

const getAllTours = (req, res) => {
  console.log(req.requestTime);

  res.status(200).json({
    status: "success",

    requestedAt: req.requestTime,

    results: tours.length,

    data: {
      tours,
    },
  });
};

const getTour = (req, res) => {
  const id = req.params.id * 1;

  const tour = tours.find((el) => el.id === id);

  if (!tour) {
    return res.status(404).json({
      status: "fail",

      message: "Invalid ID",
    });
  }

  res.status(200).json({
    status: "success",

    data: {
      tour,
    },
  });
};

const creatTour = (req, res) => {
  // console.log(req.body);

  const newId = tours[tours.length - 1].id + 1;

  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  res.status(201).json({
    status: "success",

    received: req.body,
  });
};

const updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: "fail",

      message: "Invalid ID",
    });
  }

  res.status(200).json({
    status: "success",

    data: {
      tour: "<Updated tour here...>",
    },
  });
};

const deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: "fail",

      message: "Invalid ID",
    });
  }

  res.status(204).json({
    status: "success",

    data: null,
  });
};

const router = express.Router();

router.route("/").get(getAllTours).post(creatTour);
router.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
