const express = require("express");
const morgan = require("morgan");
const swaggerjsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoute");

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//midleware
app.use(express.json());
app.use(express.static(`${__dirname}/dev-data/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

app.all('*', (req,res,next)=>{
  next(new AppError(`Can't find ${req.originalUrl} on this server!`))
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
