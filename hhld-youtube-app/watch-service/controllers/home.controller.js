import { PrismaClient } from "../generated/prisma/index.js";

const getAllVideos = async (req, res) => {
  try {
    const prisma = new PrismaClient();

    // const response = await prisma.videoData.findMany();
    const response = await prisma.$queryRaw`SELECT * FROM "VideoData"`;

    console.log("response:", response);

    res.status(200).send(response);
  } catch (error) {
    console.log("error:" + error);

    res.status(500).json({ error: error });
  }
};

export default getAllVideos;
