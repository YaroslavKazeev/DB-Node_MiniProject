import { hash, compare } from "bcrypt";
import jsonwebtoken from "jsonwebtoken";

class RAMdatabase {
  constructor() {
    this.db = {};
  }

  #saltRounds() {
    return 12;
  }

  #secret() {
    return "H6AIgu0wsGCH2mC6ypyRubiPoPSpV4t1";
  }

  async addUser(email, password) {
    password = String(password);
    if (password.length > 7 && email.indexOf("@") > 2) {
      const hashedPassword = await hash(password, this.#saltRounds());
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
        const token = jsonwebtoken.sign(userID, this.#secret());
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
    const decodedUserID = jsonwebtoken.verify(token, this.#secret());
    const email = Object.keys(this.db).find(
      (email) => this.db[email].userID === decodedUserID
    );
    if (token === this.db[email].token) {
      // this.db[email]["items"] = {};
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

  deleteItem(email, itemID) {
    if (this.db[email].items[itemID]) {
      delete this.db[email].items[itemID];
      console.log(dbInRAM);
    } else {
      throw new Error("The item does not exist.");
    }
  }
}

// Example usage
const dbInRAM = new RAMdatabase();

export default dbInRAM;
