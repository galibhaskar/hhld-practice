import AWS from "aws-sdk";

const uploadFileToS3 = async (req, res) => {
  console.log("upload to s3 request received");

  // large file uploading using chunks
  const { files } = req;

  const { chunkIndex, totalChunks, filename } = req.body;

  if (!files || !files["chunk"] || !chunkIndex || !totalChunks) {
    console.log("Missing required data");

    return res.status(400).send("Missing required data");
  }

  const chunk = files["chunk"];

  console.log("chunk:", chunk);

  console.log("filename:", filename);

  console.log("totalchunks:", totalChunks);

  console.log("chunkIndex:", chunkIndex);

  // res.status(200).send("Chunk with index:" + chunkIndex + " Received");

  // small file upload
  // const { file } = req;
  // if (!file) {
  //   console.log("No file received");

  //   return res.status(400).send("No file received");
  // }

  // static file from server
  // const filePath = "/Users/vg588/Downloads/pic.jpg";

  // if (!fs.existsSync(filePath)) {
  //   console.log("file does not exist", filePath);

  //   return;
  // }

  AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });

  if (filename && chunkIndex) {
    const payloadParams = {
      Bucket: process.env.BUCKET,
      Key: `${filename}_${chunkIndex}`,
      Body: chunk[0].buffer,
    };

    const s3 = new AWS.S3();

    s3.upload(payloadParams, (err, data) => {
      if (err) {
        console.log(`Error uploading chunk ${chunkIndex} : ${err}`);

        res.status(404).send(err);
      } else {
        console.log(
          `Chunk uploaded successfully. Chunk location: ${data.Location}`
        );

        res
          .status(200)
          .send(`Chunk with index: ${chunkIndex} uploaded successfully`);
      }
    });
  }
};

export default uploadFileToS3;
