import dbInRAM from "../config/RAMdatabase.js";
export const searchItems = async (req, res) => {
  try {
    const keyword = req.query.q;
    res.status(200).json(dbInRAM.getKeyWordItems(keyword));
  } catch (error) {
    res.status(400).json({ message: "User's credentials are invalid" });
    console.log(error.message);
  }
};
