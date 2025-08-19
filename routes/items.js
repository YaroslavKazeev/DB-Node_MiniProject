import express from "express";
import {
  getAllItems,
  createItem,
  updateItem,
  deleteItem,
} from "../controllers/itemsController.js";
const itemsRouter = express.Router();

itemsRouter.get("/", getAllItems);
itemsRouter.post("/", createItem);
itemsRouter.patch("/:id", updateItem);
itemsRouter.delete("/:id", deleteItem);

export default itemsRouter;
