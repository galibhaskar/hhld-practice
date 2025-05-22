import express from "express";
import { getMsgsofConversation } from "../controllers/msgs.controller.js";

const ChatRouter = express.Router();

ChatRouter.get("/", getMsgsofConversation);

export default ChatRouter;
