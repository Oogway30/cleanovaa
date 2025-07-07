const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const { error } = require("console");

const pool = mysql
  .createPool({
    host: "127.0.0.1",
    user: "root",
    password: "Goney1234",
    database: "users",
  })
  .promise();


  // async function checkUser(email, password) {
  //   try {
  //     console.log("Checking user:", email); // Debugging
  
  //     const [result] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
  
  //     if (result.length === 0) {
  //       console.log("No user found.");
  //       return "Invalid email or password.";
  //     }
  
  //     const user = result[0];
  
  //     console.log("Stored hashed password:", user.password); // Debugging
  //     console.log("Entered password:", password); // Debugging
  
  //     // Compare entered password with stored hash
  //     const match = await bcrypt.compare(password, user.password);
  
  //     console.log("Password match:", match); // Debugging
  
  //     if (match) {
  //       console.log("User role:", user.role); // Debugging
  //       return user.role === "admin" ? "Admin" : "User exists";
  //     }
  
  //     return "Invalid email or password.";
  //   } catch (err) {
  //     console.error("Error checking user:", err);
  //     return "Error checking user.";
  //   }
  // }
  


  async function checkUser(email, password) {
    try {
  
      const [result] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
  
      if (result.length === 0) {
        console.log("No user found.");
        return "Invalid email or password.";
      }
  
      const user = result[0];
  
  
      const match = await bcrypt.compare(password, user.password);
  
  
      if (match) {
        return user.role === "admin" ? "Admin" : "User exists";
      }
  
      return "Invalid email or password.";
    } catch (err) {
      console.error("Error checking user:", err);
      return "Error checking user.";
    }
  }  checkUser(".com", "hashedpassword3").then(console.log);
