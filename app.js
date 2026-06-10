const express = require("express");
const morgan = require("morgan");

const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoute");

const app = express();

//midleware
app.use(morgan("dev"));
app.use(express.json());

app.use((req, res, next) => {
  console.log("middlewawre");
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

const port = 3000;
app.listen(port, () => {
  console.log(`app running on port ${port}...`);
});
