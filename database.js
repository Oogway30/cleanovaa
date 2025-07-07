require("dotenv").config();

const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

// PostgreSQL connection pool
const pool = new Pool({
  host: process.env.PGHOST || "localhost",
  user: process.env.PGUSER || "postgres",
  password: process.env.PGPASSWORD || "",
  database: process.env.PGDATABASE || "postgres",
  port: process.env.PGPORT ? parseInt(process.env.PGPORT) : 5432,
  ssl:{
    require:true
  }
});

async function encrypt(password) {
  let hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
}

async function createUser(email, password, number, gender, name) {
  const hashedPassword = await bcrypt.hash(password, 10);
  await pool.query(
    "INSERT INTO users (email, password, number, gender, name) VALUES ($1, $2, $3, $4, $5)",
    [email, hashedPassword, number, gender, name]
  );
}

async function CreateUserMessage(email, name, subject, message) {
  const { rows } = await pool.query(
    "SELECT * FROM user_message WHERE email = $1 AND created_at >= NOW() - INTERVAL '1 day'",
    [email]
  );

  if (rows.length > 0) {
    throw new Error("You can only send one message every 24 hours.");
  }

  await pool.query(
    "INSERT INTO user_message (email, name, subject, message) VALUES ($1, $2, $3, $4)",
    [email, name, subject, message]
  );

  return "Message upload successful!";
}

async function checkUserAuthentication(email) {
  try {
    console.log("[checkUserAuthentication] Checking email:", email);
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    console.log("[checkUserAuthentication] Query result:", rows);
    if (rows.length === 0) {
      console.log("[checkUserAuthentication] No user found, email available.");
      return "Available";
    }
    console.log("[checkUserAuthentication] User exists.");
    return "User exists.";
  } catch (err) {
    console.error("[checkUserAuthentication] Error:", err);
    return "Error checking user.";
  }
}

async function checkUser(email, password) {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (rows.length === 0) {
      console.log("No user found for email:", email);
      return "Invalid email or password.";
    }

    const user = rows[0];
    console.log("User found:", user);

    const match = await bcrypt.compare(password, user.password);
    console.log("Password match for", email, ":", match);

    if (match) {
      const userRole = user.role ? user.role.trim() : "";
      return userRole === "admin"
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
    const { rows } = await pool.query("SELECT * FROM users");
    return rows;
  } catch {
    return "I am sorry an error occured :(";
  }
}

async function getAllMessages() {
  try {
    const { rows } = await pool.query("SELECT * FROM user_message");
    return rows;
  } catch {
    return "I am sorry an error occured :(";
  }
}

async function getAllUserswith(filter1) {
  try {
    const { rows } = await pool.query("SELECT * FROM users");
    rows.forEach((element) => {
      console.log(element.filter1);
    });
  } catch {
    return "I am sorry an error occured :(";
  }
}

async function deleteUser(id) {
  try {
    await pool.query("DELETE FROM users WHERE id = $1", [id]);
    return "Successfully deleted!:)";
  } catch {
    return "Some Error Occurred Sorry";
  }
}

async function deleteUserMessage(id) {
  try {
    await pool.query("DELETE FROM user_message WHERE id = $1", [id]);
    return "Successfully deleted!:)";
  } catch {
    return "Some Error Occurred Sorry";
  }
}

async function updateUser(email, number, gender, name, role, id) {
  try {
    await pool.query(
      "UPDATE users SET email=$1, number=$2, gender=$3, name=$4, role=$5 WHERE id = $6",
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
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

async function sendVerificationCode(toEmail) {
  const random_six_digit_code = Math.floor(100000 + Math.random() * 900000);
  console.log("Random code is: ", random_six_digit_code);

  const mailOptions = {
    from: process.env.EMAIL_USER,
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

async function test() {
  let x = await encrypt("062606260626");
  console.log(x);
}
test();

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
