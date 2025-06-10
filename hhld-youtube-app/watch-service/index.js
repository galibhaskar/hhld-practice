import express, { json } from "express";
import dotenv from "dotenv";
import watchRouter from "./routes/watch.route.js";
import cors from "cors";
import homeRouter from "./routes/home.route.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 6000;

app.use(cors());

app.use(json());

app.use("/watch", watchRouter);

app.use("/home", homeRouter);

app.get("/", (req, res) => {
  res.status(200).send("Welcome to watch service");
});

app.listen(PORT, () => {
  console.log(`watch service running at http://localhost:${PORT}`);
});
