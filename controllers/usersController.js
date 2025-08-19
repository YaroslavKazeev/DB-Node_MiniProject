import { hash, compare } from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
export const secondHandDB = {};
export const SECRET = "H6AIgu0wsGCH2mC6ypyRubiPoPSpV4t1";
const saltRounds = 12;

export const addUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (password.length > 7 && email.indexOf("@") > 2) {
      const hashedPassword = await hash(password, saltRounds);
      if (!secondHandDB[email]) {
        const userID = crypto.randomUUID();
        secondHandDB[email] = { userID, hashedPassword };
        res.status(201).json({ id: userID, email });
      } else {
        throw new Error("User's email already exists in the DB");
      }
    } else {
      throw new Error("Credentials are invalid");
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
  try {
    const { email, password } = req.body;
    if (!secondHandDB[email]) {
      throw new Error("User's email does not exists in the DB");
    } else {
      const { userID, hashedPassword } = secondHandDB[email];
      const isPasswordCorrect = await compare(password, hashedPassword);
      if (isPasswordCorrect) {
        const token = jsonwebtoken.sign(userID, SECRET);
        secondHandDB[email].token = token;
        res.status(200).json({ token });
      } else {
        throw new Error("User's password is incorrect");
      }
    }
  } catch (error) {
    // res.status(500).json({
    //   error: "Error when verifying the user's email and password in the DB",
    // });
    res.status(500).json({ error: "Not implemented" });
    console.log(error.message);
  }
};
