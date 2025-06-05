import AWS from "aws-sdk";

const uploadFileToS3 = async (req, res) => {
  console.log("upload to s3 request received");

  const { file } = req;

  if (!file) {
    console.log("No file received");

    return res.status(400).send("No file received");
  }

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

  const payloadParams = {
    Bucket: process.env.BUCKET,
    Key: file.originalname,
    Body: file.buffer,
  };

  const s3 = new AWS.S3();

  s3.upload(payloadParams, (err, data) => {
    if (err) {
      console.log("Error uploading file:", err);

      res.status(404).send(err);
    } else {
      console.log("File uploaded successfully. File location:", data.Location);

      res.status(200).send("File uploaded successfully");
    }
  });
};

export default uploadFileToS3;
