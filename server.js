const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION  shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

const DB = process.env.DATABASE.replace(
  "<DATABASE_PASSWORD>",
  process.env.DATABASE_PASSWORD,
);
console.log("FINAL DB:", DB);
mongoose
  .connect(DB)
  .then((con) => {
    console.log("Connected to the database successfully!");

    const port = process.env.PORT || 3000;

    const server = app.listen(port, () => {
      console.log(`app running on port ${port}...`);
    });
  })
  .catch((err) => {
    console.log("DATABASE CONNECTION ERROR:");
    console.log(err);
  });
process.on("unhandledRejection", (err) => {
  // console.log("UNHANDLED REJECTION");
  // console.log(err.name);
  // console.log(err.message);

  server.close(() => {
    process.exit(1);
  });
});
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION  shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
