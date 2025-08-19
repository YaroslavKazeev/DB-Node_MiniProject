import jsonwebtoken from "jsonwebtoken";
import { secondHandDB } from "./usersController.js";
import { SECRET } from "./usersController.js";

function validateToken(req, res) {
  const token = req.headers.authorization.split(" ")[1];
  const decodedUserID = jsonwebtoken.verify(token, SECRET);
  const email = Object.keys(secondHandDB).find(
    (email) => secondHandDB[email].userID === decodedUserID
  );
  if (token === secondHandDB[email].token) {
    return email;
  } else {
    throw new Error("The user's token is invalid");
  }
}

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
    const email = validateToken(req, res);
    const { title, price } = await validateItem(req);
    const itemID = crypto.randomUUID();
    res.status(201).json({ id: itemID, title, sellerEmail: email, price });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Either user's credentials or item info is invalid" });
    console.log(error.message);
  }
};

export const updateItem = async (req, res) => {
  res.status(500).json({ error: "Not implemented" });
};

export const getAllItems = async (req, res) => {
  res.status(500).json({ error: "Not implemented" });
};

export const deleteItem = async (req, res) => {
  res.status(500).json({ error: "Not implemented" });
};
