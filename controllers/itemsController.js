import dbInRAM from "../config/RAMdatabase.js";

async function validateItem(req) {
  try {
    const { title, price } = req.body;
    if (title.length > 2 && price > 0 && price < 10000) {
      return { title, price };
    } else {
      throw new Error(
        "Request must contain the item's title (>2 chars long) and the price in the range (0-10000)."
      );
    }
  } catch (error) {
    throw new Error(error);
  }
}

export const createItem = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const sellerEmail = dbInRAM.validateToken(token);
    const { title, price } = await validateItem(req);
    const id = dbInRAM.addItemID(sellerEmail);
    dbInRAM.updateItem(sellerEmail, id, title, price);
    res.status(201).json({ id, title, sellerEmail, price });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Either user's credentials or item info is invalid" });
    console.log(error.message);
  }
};

export const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const token = req.headers.authorization.split(" ")[1];
    const sellerEmail = dbInRAM.validateToken(token);
    const { title, price } = await validateItem(req);
    dbInRAM.updateItem(sellerEmail, id, title, price);
    res.status(201).json({ id, title, sellerEmail, price });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Either user's credentials or item info is invalid" });
    console.log(error.message);
  }
};

export const getAllItems = async (req, res) => {
  res.status(500).json({ error: "Not implemented" });
};

export const deleteItem = async (req, res) => {
  res.status(500).json({ error: "Not implemented" });
};
