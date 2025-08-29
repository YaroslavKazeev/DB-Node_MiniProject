import RAMdb from "./RAMdbController.js";

export const searchItems = async (req, res) => {
  try {
    const keyword = req.query.q;
    res.status(200).json(await RAMdb.getKeyWordItems(keyword));
  } catch (error) {
    res.status(400).json({
      error:
        "To perform a search for the keyword q, the URL must be in the following format: http://localhost:7890/search/?q={keyword}",
    });
    console.log(error);
  }
};
