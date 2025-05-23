import express from "express";
import dotenv from "dotenv";
import { createProxyMiddleware } from "http-proxy-middleware";

dotenv.config();

const app = express();

const PORT = process.env.PORT;

const routes = {
  "/api/auth": process.env.AUTH_URI,
  "/api/users": process.env.USERS_URI,
  "/api/msgs": process.env.CHAT_URI,
};

for (const route in routes) {
  const target = routes[route];

  app.use(route, createProxyMiddleware({ target, changeOrigin: true }));
}

app.listen(PORT, () => {
  console.log("API gateway running at http://localhost:", PORT);
});
