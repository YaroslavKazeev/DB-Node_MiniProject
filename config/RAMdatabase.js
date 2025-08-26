import { hash, compare } from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
const SECRET = "H6AIgu0wsGCH2mC6ypyRubiPoPSpV4t1";
const saltRounds = 12;

class RAMdatabase {
  constructor() {
    this.db = {};
  }

  async addUser(email, password) {
    password = String(password);
    if (password.length > 7 && email.indexOf("@") > 2) {
      const hashedPassword = await hash(password, saltRounds);
      if (!this.db[email]) {
        const id = crypto.randomUUID();
        this.db[email] = { id, hashedPassword };
        return { id, email };
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
      const { id, hashedPassword } = this.db[email];
      const isPasswordCorrect = await compare(password, hashedPassword);
      if (isPasswordCorrect) {
        const token = jsonwebtoken.sign(id, SECRET);
        this.db[email].token = token;
      } else {
        throw new Error("Credentials are invalid");
      }
    } else {
      throw new Error("User's email does not exists in the DB");
    }
  }

  // Remove user by email
  removeUser(email) {
    if (!(email in this.db)) {
      throw new Error(`User not found: ${email}`);
    }
    delete this.db[email];
  }

  // Get entire database
  getAllUsers() {
    return { ...this.db };
  }
}

// Example usage
const dbInRAM = new RAMdatabase();

// Add some users
console.log("Adding first user:");
console.log(await dbInRAM.addUser("123@gmail.com", 12345678));

console.log("\nAdding second user:");
console.log(await dbInRAM.addUser("1234@gmail.com", "abcdefgh"));

console.log("\nUpdating existing user:");
console.log(await dbInRAM.giveToken("123@gmail.com", 12345678));

console.log("\nGetting all users:");
console.log(JSON.stringify(dbInRAM.getAllUsers(), null, 2));
try {
  console.log("\nTrying invalid email:");
  await dbInRAM.addUser("invalid-email", 123);
} catch (error) {
  console.error(error.message);
}
