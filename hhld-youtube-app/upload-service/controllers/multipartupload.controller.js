import AWS from "aws-sdk";
import fs from "fs";
import addVideoDetailsToDB from "../db/db.js";
import { pushVideoForEncoding } from "./kafkapublisher.controller.js";

export const initiateMultipartUpload = async (req, res) => {
  try {
    console.log("Initiating multipart upload");

    const { filename } = req.body;

    console.log("filename:", filename);

    AWS.config.update({
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });

    const s3 = new AWS.S3();

    const createParams = {
      Bucket: process.env.BUCKET,
      Key: filename,
      ContentType: "video/mp4",
    };

    const multipartParams = await s3
      .createMultipartUpload(createParams)
      .promise();

    console.log("multipart params:", multipartParams);

    const uploadID = multipartParams.UploadId;

    res.status(200).json({ uploadID });
  } catch (error) {
    console.log("error in initiating the multipart upload", error);

    res.status(400).send("error in initiating the multipart upload", error);
  }
};

export const uploadChunk = async (req, res) => {
  try {
    AWS.config.update({
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });

    const s3 = new AWS.S3();

    // const result = await s3
    //   .listMultipartUploads({
    //     Bucket: "your-bucket-name",
    //   })
    //   .promise();

    // console.log("------------------------------------");
    // console.log("active multipart uploads:", result);
    // console.log("------------------------------------");

    console.log("Uploading chunk");

    const { filename, chunkIndex, uploadID } = req.body;

    console.log("filename:", filename);

    console.log("uploadID:", uploadID);

    console.log("files:", req.files);

    const { chunk } = req.files;

    console.log("chunk:", chunk[0]);

    const partParams = {
      Bucket: process.env.BUCKET,
      Key: filename,
      UploadId: uploadID,
      PartNumber: parseInt(chunkIndex) + 1,
      Body: chunk[0].buffer,
    };

    const data = await s3.uploadPart(partParams).promise();

    console.log("data:", data);

    res.status(200).json({ success: true });
  } catch (error) {
    console.log("error in uploading chunk to s3", error);

    res.status(500).send("error in uploading chunk to s3" + error);
  }
};

export const completeMultipartUpload = async (req, res) => {
  try {
    console.log("completing multipart upload");

    const { filename, totalChunks, uploadID, title, author, description } =
      req.body;

    // const uploadedParts = [];

    // for (let i = 0; i < totalChunks; i++) {
    //   uploadedParts.push({ PartNumber: i + 1, ETag: req.body[`part${i + 1}`] });
    // }

    AWS.config.update({
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });

    const s3 = new AWS.S3();

    const completeParams = {
      Bucket: process.env.BUCKET,
      Key: filename,
      UploadId: uploadID,
    };

    const data = await s3.listParts(completeParams).promise();

    const parts = data.Parts.map((part) => ({
      ETag: part.ETag,
      PartNumber: part.PartNumber,
    }));

    completeParams.MultipartUpload = {
      Parts: parts,
    };

    const uploadResponse = await s3
      .completeMultipartUpload(completeParams)
      .promise();

    console.log("response:", uploadResponse);

    await addVideoDetailsToDB(
      title,
      description,
      author,
      uploadResponse.Location
    );

    const url = uploadResponse.Location;

    await pushVideoForEncoding(completeParams.Key, url);

    res.status(200).json({ message: "Upload Successful" });
  } catch (error) {
    console.log("error in completing the multipart upload", error);
    res.status(500).send("error in completing the multipart upload" + error);
  }
};

const multipartUploadFileToS3 = async (req, res) => {
  console.log("multipart upload service");

  const filePath =
    "/Users/vg588/Downloads/HHLD/1-AWS, AZs, VPCs, Subnets,EC2.mp4";

  if (!fs.existsSync(filePath)) {
    console.log("file not exists");

    res.status(400).send("file not exists");
  }

  AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });

  const s3 = new AWS.S3();

  // ACL - Allow Content Type
  // Note: Enable ACL for bucket and update permissions, CORS polices
  const uploadParams = {
    Bucket: process.env.BUCKET,
    Key: "trial_key",
    ACL: "public-read",
    ContentType: `video/mp4`,
  };

  try {
    console.log("creating multipart upload");

    // Step-1: Intitate Multipart upload for get UploadID
    const multipartParams = await s3
      .createMultipartUpload(uploadParams)
      .promise();

    // .promise() extracts the response once the promise is resolved

    const fileSize = fs.statSync(filePath).size;

    const chunkSize = 5 * 1024 * 1024;

    const totalChunks = Math.ceil(fileSize / chunkSize);

    const uploadedEtags = [];

    // Step-2: Upload parts(chunks) using UploadID and PartNumber for Etags
    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
      const start = chunkIndex * chunkSize;

      const end = Math.min(start + chunkSize, fileSize);

      const partParams = {
        Bucket: process.env.BUCKET,
        Key: uploadParams.Key,
        UploadId: multipartParams.UploadId,
        PartNumber: chunkIndex + 1,
        Body: fs.createReadStream(filePath, { start, end }),
        ContentLength: end - start,
      };

      const data = await s3.uploadPart(partParams).promise();

      console.log(`Uploaded part ${chunkIndex + 1}: ${data.ETag}`);

      uploadedEtags.push({
        ETag: data.ETag,
        PartNumber: partParams.PartNumber,
      });
    }

    //Step-3: Complete multipart upload
    const completeParams = {
      Bucket: process.env.BUCKET,
      Key: uploadParams.Key,
      UploadId: multipartParams.UploadId,
      MultipartUpload: { Parts: uploadedEtags },
    };

    console.log("completing multipart upload");

    const completeResponse = await s3
      .completeMultipartUpload(completeParams)
      .promise();

    console.log(completeResponse);

    console.log("file upload successful");

    res.status(200).send("File upload successful");
  } catch (err) {
    console.log("error in uploading to s3:", err);

    res.status(400).send("Error in uploading the file to S3", err);
  } finally {
  }
};

export const uploadToDB = async (req, res) => {
  console.log("uploading to db");

  try {
    const { author, title, description, url } = req.body;

    await addVideoDetailsToDB(title, description, author, url);

    res.status(200).json({ message: "uploaded to db" });
  } catch (error) {
    console.log("error in uploading to db");

    res.status(500).json({ error: error });
  }
};

export default multipartUploadFileToS3;
