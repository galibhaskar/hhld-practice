import express from "express";
import {
  getCurrentUserInfo,
  getUsers,
} from "../controllers/users.controller.js";

const router = express.Router();

router.get("/", getUsers);

router.get("/currentUser", getCurrentUserInfo);

export default router;
