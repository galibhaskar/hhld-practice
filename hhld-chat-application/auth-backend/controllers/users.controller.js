import User from "../models/user.model.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}, "username");

    res.status(200).json(users);
  } catch (error) {
    console.log("error in get users:" + error.message);

    res.status(500).json({ message: "Users fetch failed" });
  }
};
