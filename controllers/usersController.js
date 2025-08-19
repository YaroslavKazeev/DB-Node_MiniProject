import { hash, compare } from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
const secondHandDB = {};
const SECRET = "H6AIgu0wsGCH2mC6ypyRubiPoPSpV4t1";
const saltRounds = 12;

async function checkInput_hashPassword(req, res) {
  const { email, password } = req.body;
  if (password.length > 7 && email.indexOf("@") > 2) {
    const hashedPassword = await hash(password, saltRounds);
    return { email, hashedPassword };
  } else {
    throw new Error("Credentials are invalid");
  }
}

export const addUser = async (req, res) => {
  try {
    const { email, hashedPassword } = await checkInput_hashPassword(req, res);
    if (secondHandDB[email]) {
      throw new Error("User's email already exists in the DB");
    } else {
      const userID = crypto.randomUUID();
      secondHandDB[email] = { userID, hashedPassword };
      res.status(201).json({ userID, email });
    }
  } catch (error) {
    res.status(400).json({
      error:
        "Request must contain the email name (>2 chars long) and password (>7 chars long), the user's email should not repeat the same in the DB",
    });
    console.log(error.message);
  }
};

export const login = async (req, res) => {
  res.status(500).json({ error: "Not implemented" });
};
