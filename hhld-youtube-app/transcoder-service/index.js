import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import KafkaConfig from "./kafka/kafka.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("Welcome to transcoding service");
});

const kafkaConfigInstance = new KafkaConfig();

kafkaConfigInstance.consume("transcode", (message) => {
  console.log("Received at Transcoding Service:", message);
});

app.listen(PORT, () => {
  console.log("transcoding server running at http://localhost:" + PORT);
});
