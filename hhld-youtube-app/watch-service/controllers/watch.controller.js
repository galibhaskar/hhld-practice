import AWS from "aws-sdk";

const generateSignedURL = async (videoKey) => {
  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });

  const params = {
    Bucket: process.env.BUCKET,
    Key: videoKey,
    Expires: 3600, // URL expires in 1 hour
  };

  return new Promise((resolve, reject) => {
    s3.getSignedUrl("getObject", params, (err, url) => {
      if (err) {
        reject(err);
      } else {
        resolve(url);
      }
    });
  });
};

const watchVideo = async (req, res) => {
  try {
    const { key } = req.query;

    const url = await generateSignedURL(key);

    res.status(200).json({ url });
  } catch (error) {
    console.log("error in watch video method:" + error);

    res.status(500).json({ error });
  }
};

export default watchVideo;
