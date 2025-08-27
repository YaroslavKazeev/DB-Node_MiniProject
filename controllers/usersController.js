import dbInRAM from "../config/RAMdatabase.js";

export const addUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const id = await dbInRAM.addUser(email, password);
    res.status(201).json({ id, email });
  } catch (error) {
    res.status(400).json({
      error:
        "Request must contain the email name (>2 chars long) and password (>7 chars long), the user's email should not repeat the same in the DB",
    });
    console.log(error.message);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await dbInRAM.giveToken(email, password);
    res.status(200).json({ token });
  } catch (error) {
    res.status(400).json({
      error: "Error when verifying the user's email and password in the DB",
    });
  }
};
