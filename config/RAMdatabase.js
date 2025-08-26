import { hash, compare } from "bcrypt";
import jsonwebtoken from "jsonwebtoken";

class RAMdatabase {
  #SECRET = "H6AIgu0wsGCH2mC6ypyRubiPoPSpV4t1";
  #saltRounds = 12;
  constructor() {
    this.db = {};
  }

  async addUser(email, password) {
    password = String(password);
    if (password.length > 7 && email.indexOf("@") > 2) {
      const hashedPassword = await hash(password, this.#saltRounds);
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
        const token = jsonwebtoken.sign(userID, this.#SECRET);
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
    const decodedUserID = jsonwebtoken.verify(token, this.#SECRET);
    const email = Object.keys(this.db).find(
      (email) => this.db[email].userID === decodedUserID
    );
    if (token === this.db[email].token) {
      return email;
    } else {
      throw new Error("The user's token is invalid");
    }
  }

  // Get entire database
  getAllUsers() {
    return { ...this.db };
  }
}

// Example usage
export const dbInRAM = new RAMdatabase();

// Add some users
// console.log("Adding first user:");
// console.log(await dbInRAM.addUser("123@gmail.com", 12345678));

// console.log("\nAdding second user:");
// console.log(await dbInRAM.addUser("1234@gmail.com", "abcdefgh"));

// console.log("\nUpdating existing user:");
// console.log(await dbInRAM.giveToken("123@gmail.com", 12345678));

// console.log("\nGetting all users:");
// console.log(JSON.stringify(dbInRAM.getAllUsers(), null, 2));
// try {
//   console.log("\nTrying invalid email:");
//   await dbInRAM.addUser("invalid-email", 123);
// } catch (error) {
//   console.error(error.message);
// }
