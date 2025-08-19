import express from "express";
import usersRouter from "./routes/users.js";
import itemsRouter from "./routes/items.js";
import searchRouter from "./routes/search.js";

const app = express();

app.use(express.json());
app.use("/users", usersRouter);
app.use("/items", itemsRouter);
app.use("/search", searchRouter);

// TODO: add other routers if needed...

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

export default app;
