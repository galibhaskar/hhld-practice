import express from "express";
import getAllVideos from "../controllers/home.controller.js";

const homeRouter = express.Router();

homeRouter.get("/", getAllVideos);

export default homeRouter;
