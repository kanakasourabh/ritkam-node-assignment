import { app } from "./app.js";
import { connectDB } from "./db/index.js";
import dotenv from "dotenv";

dotenv.config({
  path: "./env",
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is listening to the port || ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("Error connecting to database", error);
  });
