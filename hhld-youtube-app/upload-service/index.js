import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import uploadRouter from "./routes/upload.route.js";
import kafkaPublisherRouter from "./routes/kafkapublisher.route.js";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

const PORT = process.env.PORT;

app.use("/upload", uploadRouter);

app.use("/publish", kafkaPublisherRouter);

app.get("/", (req, res) => {
  res.send("Hello world from youtube");
});

app.listen(PORT, () => {
  console.log(`running at http://localhost:${PORT}`);
});
