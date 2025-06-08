import express from "express";
import uploadFileToS3 from "../controllers/upload.controller.js";
import multer from "multer";
import multipartUploadFileToS3 from "../controllers/multipartupload.controller.js";

const router = express.Router();

const multerParser = multer();

// multer parses the request for the file
// router.post("/", multerParser.single('file'), uploadFileToS3);

// multer parses the request for the fields
// router.post(
//   "/",
//   multerParser.fields([
//     {
//       name: "chunk",
//     },
//     {
//       name: "totalChunks",
//     },
//     {
//       name: "chunkIndex",
//     },
//   ]),
//   uploadFileToS3
// );

router.post("/", multipartUploadFileToS3);

export default router;
