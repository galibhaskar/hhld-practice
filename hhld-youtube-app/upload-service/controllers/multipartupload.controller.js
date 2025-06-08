import AWS from "aws-sdk";
import fs from "fs";

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

export default multipartUploadFileToS3;
