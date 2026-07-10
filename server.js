const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");

process.on('uncaughtException', err => {
   // console.log('UNCAUGHT EXCEPTION  shutting down...');
  // console.log(err.name,err.message);
    process.exit(1);
});

// console.log(process.env.NODE_ENV);
dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<DATABASE_PASSWORD>",
  process.env.DATABASE_PASSWORD,
);
mongoose
  .connect(DB, {
    // .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((con) => console.log("Connected to the database successfully!"));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`app running on port ${port}...`);
});

process.on('unhandledRejection', err => {
  // console.log('UNHANDLED REJECTION ');
  // console.log(err.name, err.message);
  server.close(()=>{ 
    process.exit(1);
  });
});

process.on('uncaughtException', err => {
   // console.log('UNCAUGHT EXCEPTION  shutting down...');
  // console.log(err.name,err.message);
  server.close(()=>{ 
    process.exit(1);
  });
});