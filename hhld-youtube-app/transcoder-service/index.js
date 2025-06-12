import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import KafkaConfig from "./kafka/kafka.js";
import convertToHLS from "./hls/transcode.js";
import s3ToS3 from "./hls/s3tos3.js";

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
  let { title, url } = JSON.parse(message);

  console.log("title:", title);

  console.log("url:", url);

  s3ToS3(title, url);

  console.log("transcoding completed");
});

app.get("/transcode", (req, res) => {
  console.log("request received");

  convertToHLS();
  // s3ToS3();

  res.send("transcoding complete");
});

app.listen(PORT, () => {
  console.log("transcoding server running at http://localhost:" + PORT);
});
