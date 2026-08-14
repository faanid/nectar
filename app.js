const express = require("express");
const morgan = require("morgan");
const swaggerjsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoute");

const app = express();
//set security http headers
app.use(helmet());

//development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});

app.use("/api", limiter);

//body parser, reading data from into req.body
app.use(express.json({ limit: "10kb" }));

app.use(express.static(`${__dirname}/dev-data/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`));
});

app.use(globalErrorHandler);

const options = {
  definition: {
    openapi: "3.0.0",
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
    info: {
      title: "Nectar API",
      version: "1.0.0",
      description: "API documentation for the Nectar application",
    },
  },
  apis: ["./routes/*.js"],
};
const space = swaggerjsdoc(options);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(space));

module.exports = app;
