import { hash, compare } from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import { configDotenv } from "dotenv";
import { client } from "../app.js";
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
      if (client) {
        const result = await client.query(
          "SELECT email FROM users WHERE email=$1",
          [email]
        );
        if (result.rows.length === 0) {
          const userID = crypto.randomUUID();
          const addUserQuery = {
            text: `
          INSERT INTO users(user_id, email, hashedPassword)
          VALUES($1, $2, $3)
          ON CONFLICT (email) DO NOTHING
        `,
            values: [userID, email, hashedPassword],
          };
          await client.query(addUserQuery);
          return userID;
        } else {
          throw new Error("User's email already exists in the DB");
        }
      } else {
        if (!this.db[email]) {
          const userID = crypto.randomUUID();
          this.db[email] = { userID, hashedPassword };
          return userID;
        } else {
          throw new Error("User's email already exists in the DB");
        }
      }
    } else {
      throw new Error("Credentials are invalid");
    }
  }

  async giveToken(email, password) {
    password = String(password);
    if (client) {
      const result = await client.query(
        "SELECT user_id, email, hashedPassword FROM users WHERE email=$1",
        [email]
      );
      if (result.rows.length !== 0) {
        const [{ user_id: userID, email, hashedpassword: hashedPassword }] =
          result.rows;
        const isPasswordCorrect = await compare(password, hashedPassword);
        if (isPasswordCorrect) {
          const token = jsonwebtoken.sign(userID, process.env.JWTsecret);
          if (!this.db[email]) {
            this.db[email] = {};
          }
          this.db[email] = { userID, hashedPassword };
          this.db[email].token = token;
          return token;
        } else {
          throw new Error("Credentials are invalid");
        }
      } else {
        throw new Error("User's email does not exists in the DB");
      }
    } else {
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
    if (client) {
      if (!this.db[email].items) {
        this.db[email].items = {};
      }
      this.db[email].items[itemID] = {};
      return itemID;
    } else {
      if (!this.db[email].items) {
        this.db[email].items = {};
      }
      this.db[email].items[itemID] = {};
      return itemID;
    }
  }

  updateItem(email, itemID, title, price) {
    if (client) {
      if (this.db[email].items[itemID]) {
        this.db[email].items[itemID] = { title, price };
      } else {
        throw new Error("Item's ID has not been found");
      }
    } else {
      if (this.db[email].items[itemID]) {
        this.db[email].items[itemID] = { title, price };
      } else {
        throw new Error("Item's ID has not been found");
      }
    }
  }

  getAllItems(sellerEmail) {
    if (client) {
      return Object.entries(this.db[sellerEmail].items).map(([id, itemObj]) => {
        const { title, price } = itemObj;
        return { id, title, sellerEmail, price };
      });
    } else {
      return Object.entries(this.db[sellerEmail].items).map(([id, itemObj]) => {
        const { title, price } = itemObj;
        return { id, title, sellerEmail, price };
      });
    }
  }

  getKeyWordItems(keyword) {
    if (client) {
      return [].concat(
        ...Object.entries(this.db).map(([sellerEmail, { items }]) => {
          return Object.entries(items)
            .filter(([id, { title }]) =>
              title.toLowerCase().includes(keyword.toLowerCase())
            )
            .map(([id, { title, price }]) => ({
              id,
              title,
              sellerEmail,
              price,
            }));
        })
      );
    } else {
      return [].concat(
        ...Object.entries(this.db).map(([sellerEmail, { items }]) => {
          return Object.entries(items)
            .filter(([id, { title }]) =>
              title.toLowerCase().includes(keyword.toLowerCase())
            )
            .map(([id, { title, price }]) => ({
              id,
              title,
              sellerEmail,
              price,
            }));
        })
      );
    }
  }

  deleteItem(email, itemID) {
    if (client) {
      if (this.db[email].items[itemID]) {
        delete this.db[email].items[itemID];
      } else {
        throw new Error("The item does not exist.");
      }
    } else {
      if (this.db[email].items[itemID]) {
        delete this.db[email].items[itemID];
      } else {
        throw new Error("The item does not exist.");
      }
    }
  }
}

// Example usage
const RAMdb = new RAMdatabase();

export default RAMdb;
