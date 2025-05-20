import jwt from "jsonwebtoken";

const generateJWTTokenAndSetCookie = (userID, res) => {
  const payload = {
    userID,
  };

  const secret = process.env.JWT_SECRET;

  const token = jwt.sign(payload, secret, {
    expiresIn: "15d",
  });

  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, // milliseconds,
    httpOnly: true,
    sameSite: "strict",
    secure: false,
  });
};

export default generateJWTTokenAndSetCookie;
