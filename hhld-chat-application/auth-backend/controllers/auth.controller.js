import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import generateJWTTokenAndSetCookie from "../utils/generateToken.js";

export const signup = async (req, res) => {
  try {
    console.log("sign up request");

    const { username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const foundUser = await User.findOne({ username });

    if (foundUser) {
      res.status(201).json({ message: "Username already exists" });
    } else {
      const user = new User({ username: username, password: hashedPassword });

      await user.save();

      generateJWTTokenAndSetCookie(user._id, res);

      res.status(201).json({ message: "User signed up successfully" });
    }
  } catch (error) {
    console.log("error in controller:" + error.message);

    res.status(500).json({ message: "User signup failed" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const isSuccess = await bcrypt.compare(password, user.password);

    if (!isSuccess) {
      return res.status(401).json({ message: "Password doesn't match" });
    }

    generateJWTTokenAndSetCookie(user._id, res);

    res.status(201).json({ message: "Login Success" });
  } catch (error) {
    console.log("error in login controller:" + error.message);

    res.status(500).json({ message: "User login failed" });
  }
};

export default signup;
