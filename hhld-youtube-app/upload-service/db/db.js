import { PrismaClient } from "../generated/prisma/index.js";

const prismaInstance = new PrismaClient();

const addVideoDetailsToDB = async (title, description, author, url) => {
  console.log("add video details to DB");
  
  console.log(
    "title:",
    title,
    " desc:",
    description,
    " author:",
    author,
    " url:",
    url
  );
  const videoData = await prismaInstance.videoData.create({
    data: {
      title: title,
      description: description,
      author: author,
      url: url,
    },
  });

  console.log(videoData);
};

export default addVideoDetailsToDB;
