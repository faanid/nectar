const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");

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
app.listen(port, () => {
  console.log(`app running on port ${port}...`);
});

console.log(process.env.DATABASE);
console.log(mongoose.connection.name);
