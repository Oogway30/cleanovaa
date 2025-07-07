require("dotenv").config();

const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const pool = mysql
  .createPool({
    host: "127.0.0.1",
    user: "root",
    password: "Goney1234",
    database: "users",
  })
  .promise();

async function encrypt(password) {
  let hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
}

async function createUser(email, password, number, gender, name) {
  const hashedPassword = await bcrypt.hash(password, 10);
  await pool.query(
    "INSERT INTO users (email, password, number, gender, name) VALUES (?, ?, ?, ?, ?)",
    [email, hashedPassword, number, gender, name]
  );
}

async function CreateUserMessage(email, name, subject, message) {
  // Check if this email already sent a message in the last 24 hours
  const [rows] = await pool.query(
    "SELECT * FROM user_message WHERE email = ? AND created_at >= NOW() - INTERVAL 1 DAY",
    [email]
  );

  if (rows.length > 0) {
    throw new Error("You can only send one message every 24 hours.");
  }

  // Insert the new message
  await pool.query(
    "INSERT INTO user_message (email, name, subject, message) VALUES (?, ?, ?, ?)",
    [email, name, subject, message]
  );

  return "Message upload successful!";
}

async function checkUserAuthentication(email) {
  try {
    const [result] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (result.length === 0) {
      console.log("No user found.");
      return "Invalid email or password.";
    }
    return "User exists.";
  } catch (err) {
    console.error("Error checking user:", err);
    return "Error checking user.";
  }
}

async function checkUser(email, password) {
  try {
    const [result] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (result.length === 0) {
      console.log("No user found for email:", email);
      return "Invalid email or password.";
    }

    const user = result[0];
    console.log("User found:", user);

    const match = await bcrypt.compare(password, user.password);
    console.log("Password match for", email, ":", match);

    if (match) {
      return user.role === "admin"
        ? {
            email: user.email,
            name: user.name,
            role: "admin",
          }
        : {
            email: user.email,
            name: user.name,
            role: "user",
          };
    }

    return "Invalid email or password.";
  } catch (err) {
    console.error("Error checking user:", err);
    return "Error checking user.";
  }
}

async function getAllUsers() {
  try {
    const [result] = await pool.query("SELECT * FROM users");
    return result;
  } catch {
    return "I am sorry an error occured :(";
  }
}

async function getAllMessages() {
  try {
    const [result] = await pool.query("SELECT * FROM user_message");
    return result;
  } catch {
    return "I am sorry an error occured :(";
  }
}

async function getAllUserswith(filter1) {
  try {
    const result = await pool.query("SELECT * FROM users");
    result.forEach((element) => {
      console.log(element.filter1);
    });
  } catch {
    return "I am sorry an error occured :(";
  }
}

async function deleteUser(id) {
  try {
    const user = id;
    const query = await pool.query("DELETE FROM users WHERE id = ?", [user]);
    return "Successfully deleted!:)";
  } catch {
    return "Some Error Occurred Sorry";
  }
}

async function deleteUserMessage(id) {
  try {
    const query = await pool.query("DELETE FROM user_message WHERE id = ?", [id]);
    return "Successfully deleted!:)";
  } catch {
    return "Some Error Occurred Sorry";
  }
}

async function updateUser(email, number, gender, name, role, id) {
  try {
    const user = id;
    const query = await pool.query(
      "UPDATE users SET email=?,number=?,gender=?,name=?,role=? WHERE id = ?",
      [email, number, gender, name, role, id]
    );
    return "Successfully updated!:)";
  } catch {
    return "Some Error Occurred Sorry";
  }
}

// Create transporter ONCE
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user:"gone99768@gmail.com",
    pass:"ofxwkcstvyojdekt",
  },
});

// console.log("EMAIL_USER:", process.env.EMAIL_USER);
// console.log("EMAIL_PASSWORD:", process.env.EMAIL_PASSWORD ? "Loaded" : "Missing");

async function sendVerificationCode(toEmail) {
  const random_six_digit_code = Math.floor(100000 + Math.random() * 900000);
  console.log("Random code is: ", random_six_digit_code);

  const mailOptions = {
    from:"gone99768@gmail.com",
    to: toEmail,
    subject: "Verification Code || Cleanovaa",
    text: `Your code is ${random_six_digit_code}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return random_six_digit_code;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send verification email.");
  }
}
async function test(){
  let x = await encrypt("062606260626")
  console.log(x)
}
test()
// console.log(process.env.EMAIL_USER, process.env.EMAIL_PASSWORD);
// Export all functions
module.exports = {
  createUser,
  checkUser,
  getAllUsers,
  deleteUser,
  updateUser,
  sendVerificationCode,
  CreateUserMessage,
  getAllMessages,
  deleteUserMessage,
  checkUserAuthentication,
};
