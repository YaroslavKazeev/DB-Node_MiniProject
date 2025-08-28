import { hash, compare } from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import { configDotenv } from "dotenv";

configDotenv({ quiet: true });

class RAMdatabase {
  constructor() {
    this.db = {};
  }

  async addUser(email, password) {
    password = String(password);
    if (password.length > 7 && email.indexOf("@") > 2) {
      const hashedPassword = await hash(
        password,
        parseInt(process.env.saltRounds)
      );
      if (!this.db[email]) {
        const userID = crypto.randomUUID();
        this.db[email] = { userID, hashedPassword };
        return userID;
      } else {
        throw new Error("User's email already exists in the DB");
      }
    } else {
      throw new Error("Credentials are invalid");
    }
  }

  async giveToken(email, password) {
    password = String(password);
    if (this.db[email]) {
      const { userID, hashedPassword } = this.db[email];
      const isPasswordCorrect = await compare(password, hashedPassword);
      if (isPasswordCorrect) {
        const token = jsonwebtoken.sign(userID, process.env.JWTsecret);
        this.db[email].token = token;
        return token;
      } else {
        throw new Error("Credentials are invalid");
      }
    } else {
      throw new Error("User's email does not exists in the DB");
    }
  }

  validateToken(token) {
    const decodedUserID = jsonwebtoken.verify(token, process.env.JWTsecret);
    const email = Object.keys(this.db).find(
      (email) => this.db[email].userID === decodedUserID
    );
    if (token === this.db[email].token) {
      return email;
    } else {
      throw new Error("The user's token is invalid");
    }
  }

  addItemID(email) {
    const itemID = crypto.randomUUID();
    if (!this.db[email].items) {
      this.db[email].items = {};
    }
    this.db[email].items[itemID] = {};
    return itemID;
  }

  updateItem(email, itemID, title, price) {
    if (this.db[email].items[itemID]) {
      this.db[email].items[itemID] = { title, price };
    } else {
      throw new Error("Item's ID has not been found");
    }
  }

  getAllItems(sellerEmail) {
    return Object.entries(this.db[sellerEmail].items).map(([id, itemObj]) => {
      const { title, price } = itemObj;
      return { id, title, sellerEmail, price };
    });
  }

  getKeyWordItems(keyword) {
    return [].concat(
      ...Object.entries(this.db).map(([sellerEmail, { items }]) => {
        return Object.entries(items)
          .filter(([id, { title }]) =>
            title.toLowerCase().includes(keyword.toLowerCase())
          )
          .map(([id, { title, price }]) => ({ id, title, sellerEmail, price }));
      })
    );
  }

  deleteItem(email, itemID) {
    if (this.db[email].items[itemID]) {
      delete this.db[email].items[itemID];
    } else {
      throw new Error("The item does not exist.");
    }
  }
}

// Example usage
const dbInRAM = new RAMdatabase();

export default dbInRAM;
