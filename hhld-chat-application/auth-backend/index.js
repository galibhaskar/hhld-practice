import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth.route.js";
import connectToMongoDB from "./db/connectToMongoDB.js";
import cors from "cors";

dotenv.config();

const app = express();

// middleware
app.use(express.json());

app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);

const PORT = process.env.PORT || 5000;

// const httpServer = http.createServer(app);

app.use("/auth", authRouter);

app.get("/", (req, res) => {
  res.send("Hello world from auth backend");
});

app.listen(PORT, () => {
  console.log(`running at http://localhost:${PORT}`);
  connectToMongoDB();
});
