import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import uploadRoutes from "./routes/uploadRoute.js";

dotenv.config();

const app = express();

app.use(cors());

const PORT = process.env.PORT;

app.use("/upload", uploadRoutes);

app.get("/", (req, res) => {
  res.send("Hello world from youtube");
});

app.listen(PORT, () => {
  console.log(`running at http://localhost:${PORT}`);
});
