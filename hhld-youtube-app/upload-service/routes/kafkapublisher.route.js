import express from "express";
import sendMessageToKafka from "../controllers/kafkapublisher.controller.js";

const kafkaPublishRouter = express.Router();

kafkaPublishRouter.post("/", sendMessageToKafka);

export default kafkaPublishRouter;
