import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized user" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    req.userID = decodedToken.userID;

    next();
  } catch (error) {
    console.log("error in verify token:" + error.message);

    return res.status(500).json({ message: "token verification error" });
  }
};
