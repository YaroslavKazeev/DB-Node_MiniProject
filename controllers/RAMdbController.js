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
        const queryRes = await client.query(
          "SELECT email FROM users WHERE email=$1",
          [email]
        );
        if (queryRes.rows.length === 0) {
          const userID = crypto.randomUUID();
          const addUserQuery = {
            text: `
          INSERT INTO users(user_id, email, hashedpassword)
          VALUES($1, $2, $3)
          ON CONFLICT (email) DO NOTHING
        `,
            values: [userID, email, hashedPassword],
          };
          await client.query(addUserQuery);
          this.db[email] = { userID, hashedPassword };
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

  async validatePassword(password, hashedPassword, userID, email) {
    const isPasswordCorrect = await compare(password, hashedPassword);
    if (isPasswordCorrect) {
      const token = jsonwebtoken.sign(userID, process.env.JWTsecret);
      this.db[email].token = token;
      return token;
    } else {
      throw new Error("Credentials are invalid");
    }
  }

  async giveToken(email, password) {
    password = String(password);
    if (client) {
      const queryRes = await client.query(
        "SELECT user_id, email, hashedPassword FROM users WHERE email=$1",
        [email]
      );
      if (queryRes.rows.length !== 0) {
        const [{ user_id: userID, email, hashedpassword: hashedPassword }] =
          queryRes.rows;
        this.db[email] = { userID, hashedPassword };
        return this.validatePassword(password, hashedPassword, userID, email);
      } else {
        throw new Error("User's email does not exists in the DB");
      }
    } else {
      if (this.db[email]) {
        const { userID, hashedPassword } = this.db[email];
        return this.validatePassword(password, hashedPassword, userID, email);
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
      return { email, decodedUserID };
    } else {
      throw new Error("The user's token is invalid");
    }
  }

  async addItemID(email, sellerID) {
    const itemID = crypto.randomUUID();
    if (client) {
      const addItemQuery = {
        text: `
          INSERT INTO items(item_id, user_id)
          VALUES($1, $2)
          ON CONFLICT (item_id) DO NOTHING
        `,
        values: [itemID, sellerID],
      };
      await client.query(addItemQuery);
      return itemID;
    } else {
      if (!this.db[email].items) {
        this.db[email].items = {};
      }
      this.db[email].items[itemID] = {};
      return itemID;
    }
  }

  async updateItem(email, itemID, title, price) {
    if (client) {
      const queryRes = await client.query(
        "SELECT item_id FROM items WHERE item_id=$1",
        [itemID]
      );
      if (queryRes.rows.length !== 0) {
        const updateItemQuery = {
          text: `
          UPDATE items
          SET title = \$1, price = \$2
          WHERE item_id = \$3
          `,
          values: [title, price, itemID],
        };
        await client.query(updateItemQuery);
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

  async getAllItems(sellerEmail, sellerID) {
    let result = [];
    if (client) {
      const queryRes = await client.query(
        "SELECT item_id, title, price FROM items WHERE user_id=$1",
        [sellerID]
      );
      if (queryRes.rows.length !== 0) {
        result = queryRes.rows.map(({ item_id: id, title, price }) => ({
          id,
          title,
          sellerEmail,
          price,
        }));
      }
    } else {
      result = Object.entries(this.db[sellerEmail].items).map(
        ([id, { title, price }]) => ({ id, title, sellerEmail, price })
      );
    }
    return result;
  }

  async getKeyWordItems(keyword) {
    let result = [];
    if (client) {
      const selectKeywordItems = {
        text: `
          SELECT i.item_id, i.title, u.email, i.price
          FROM items i
          JOIN users u ON u.user_id = i.user_id
          WHERE LOWER(i.title) LIKE $1
      `,
        values: [`%${keyword.toLowerCase()}%`],
      };
      const queryRes = await client.query(selectKeywordItems);
      if (queryRes.rows.length !== 0) {
        result = queryRes.rows.map(({ item_id: id, title, email, price }) => ({
          id,
          title,
          sellerEmail: email,
          price,
        }));
      }
    } else {
      result = [].concat(
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
    return result;
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
