import express from "express";

const app = express();

const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Welcome to ECS Demo");
});

app.get("/health", (req, res) => {
  res.status(200).send("Ok");
});

app.listen(PORT, () => {
  console.log(`running at http://localhost:${PORT}`);
});
