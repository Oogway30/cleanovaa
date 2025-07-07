// =======================
// External Modules
// =======================
const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const http = require("http");
const serverless = require("serverless-http")
// =======================
// Environment Setup
// =======================
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

// =======================
// Internal Modules
// =======================
const {
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
  
} = require("./database.js");

// =======================
// App Setup
// =======================
const app = express();
const server = http.createServer(app);

// =======================
// Middlewares
// =======================
app.use(cookieParser());
app.use(express.static(path.join(__dirname + "/static")));
app.use(express.static(path.join(__dirname + "/static/completed")));
app.use("/admin", express.static(path.join(__dirname + "/static/admin")));
app.use("/static", express.static(path.join(__dirname, "static")));
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

// =======================
// Auth Middlewares
// =======================
// User Auth Middleware

// Fix makeverificationCode to accept res
async function makeverificationCode(email, res) {
  try {
    const code = await sendVerificationCode(email);
    const token = jwt.sign({ VerificationCode: code }, JWT_SECRET, {
      expiresIn: "15min",
    });
    res.cookie("VerificationCode", token, { httpOnly: true, maxAge: 900000 });
    return true;
  } catch (error) {
    console.error("Error sending verification code:", error);
    return false;
  }
}

function checkAuth(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.redirect("/login");
  }
  try {
    const user = jwt.verify(token, JWT_SECRET);
    req.user = user;
    next();
  } catch (err) {
    return res.redirect("/login");
  }
}

// Admin Auth Middleware
function checkAuth_admin(req, res, next) {
  const adminToken = req.cookies.adminToken;

  if (!adminToken) {
    return res.redirect("/login");
  }

  try {
    const adminUser = jwt.verify(adminToken, JWT_SECRET);
    if (adminUser && adminUser.role === "admin") {
      req.user = adminUser;
      next();
    } else {
      return res
        .status(403)
        .send("Unauthorized! If you keep trying, legal actions will be taken!");
    }
  } catch (err) {
    console.error("Invalid admin token:", err);
    return res.redirect("/login");
  }
}

// =======================
// Routes
// =======================

// General Routes
app.get("/", (req, res) => {
  res.redirect("/homepage");
});
app.get("/admin-panel", (req, res) => {
  res.sendFile(path.join(__dirname + "/static/admin/admin-panel.html"));
});
app.get("/homepage", (req, res) => {
  res.sendFile(path.join(__dirname + "/static/homepage2.html"));
});
app.get("/homepage-logged",checkAuth, (req, res) => {
  const user = req.user;
  res.render("homepage2 copy.ejs", { user });
});
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname + "/static/completed/login.html"));
});
app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname + "/static/completed/register.html"));
});
app.get("/logout", checkAuth, (req, res) => {
  res.clearCookie("token");
  res.redirect("/homepage");
});

// Info Pages
app.get("/about", (req, res) => {
  const token = req.cookies.token;
  let user = null;

  if (token) {
    try {
      user = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      user = null;
    }
  }

  res.render("about2.ejs", { user });
});
app.get("/user-already-exists", (req, res) => {
  const token = req.cookies.token;
  let user = null;

  if (token) {
    try {
      user = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      user = null;
    }
  }

  res.render("user-exists.ejs", { user });
});
app.get("/message-limit-reached", (req, res) => {
  const token = req.cookies.token;
  let user = null;

  if (token) {
    try {
      user = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      user = null;
    }
  }

  res.render("message-limit.ejs", { user });
});
app.get("/contact", (req, res) => {
  const token = req.cookies.token;
  let user = null;

  if (token) {
    try {
      user = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      user = null;
    }
  }

  res.render("contact2.ejs", { user });
});
app.get("/services", (req, res) => {
  const token = req.cookies.token;
  let user = null;

  if (token) {
    try {
      user = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      user = null;
    }
  }

  res.render("services2.ejs", { user });
});

// Booking
app.get("/booking", checkAuth, (req, res) => {
  const token = req.cookies.token;
  let user = null;

  try {
    user = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    user = null;
  }
  res.render("booking.ejs", { user });
});

// Service Pages
app.get("/service/home-cleaning", (req, res) => {
  const token = req.cookies.token;
  let user = null;

  if (token) {
    try {
      user = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      user = null;
    }
  }
  const title = "Home Cleaning";
  const intro_text =
    "Don't want to worry about your home's cleanliness? Our Home Cleaning service takes care of it all—quick, reliable, and spotless every time.";
  const what_offers_txt =
    "We provide comprehensive cleaning solutions that include regular maintenance, deep cleaning, and customizable plans to fit your lifestyle.";
  const first =
    "Thorough dusting and vacuuming of every room to eliminate allergens and keep your space pristine.";
  const second =
    "Detailed kitchen and bathroom cleaning, including scrubbing surfaces and disinfecting high-touch areas.";
  const third =
    "Floor care services such as mopping, waxing, and polishing to ensure your floors look spotless.";
  const when_to_choose_1 =
    "Ideal for busy households or professionals who want a consistently clean environment without the hassle.";
  const when_to_choose_2 =
    "Perfect for special occasions or before hosting guests, ensuring your home is guest-ready at all times.";
  res.render("service2.ejs", {
    user,
    title,
    intro_text,
    what_offers_txt,
    first,
    second,
    third,
    when_to_choose_1,
    when_to_choose_2,
  });
});
app.get("/service/office-cleaning", (req, res) => {
  const token = req.cookies.token;
  let user = null;

  if (token) {
    try {
      user = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      user = null;
    }
  }
  const title = "Office Cleaning";
  const intro_text =
    "Need a tidy, fresh workspace without the stress? Our Office Cleaning service keeps your environment clean, professional, and ready for productivity.";
  const what_offers_txt =
    "We offer tailored office cleaning solutions including daily upkeep, sanitization, and flexible scheduling to match your business hours.";
  const first =
    "Desk and workspace cleaning to maintain a neat, organized environment for your team.";
  const second =
    "Sanitization of shared areas like kitchens, restrooms, and meeting rooms for a healthier workplace.";
  const third =
    "Floor care and trash removal services to keep your office spotless and professional at all times.";
  const when_to_choose_1 =
    "Ideal for businesses that value cleanliness and want to provide a welcoming space for clients and employees.";
  const when_to_choose_2 =
    "Perfect for offices preparing for meetings, inspections, or regular maintenance needs.";
  res.render("service2.ejs", {
    user,
    title,
    intro_text,
    what_offers_txt,
    first,
    second,
    third,
    when_to_choose_1,
    when_to_choose_2,
  });
});
app.get("/service/window-cleaning", (req, res) => {
  const token = req.cookies.token;
  let user = null;

  if (token) {
    try {
      user = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      user = null;
    }
  }
  const title = "Window Cleaning";
  const intro_text =
    "Say goodbye to streaks and smudges. Our Window Cleaning service delivers crystal-clear results—brightening your view and your space.";
  const what_offers_txt =
    "We clean interior and exterior windows, remove tough grime, and leave glass surfaces shining—safely and efficiently.";
  const first =
    "Streak-free cleaning of interior windows and glass doors to enhance your home’s brightness.";
  const second =
    "Exterior window washing, including upper-floor access, for a spotless view from inside and out.";
  const third =
    "Sill and frame cleaning to complete the job and keep all parts of your windows fresh and dirt-free.";
  const when_to_choose_1 =
    "Ideal for seasonal maintenance or when your windows have become noticeably dirty.";
  const when_to_choose_2 =
    "Perfect before parties, photoshoots, or if you're planning to sell your property.";
  res.render("service2.ejs", {
    user,
    title,
    intro_text,
    what_offers_txt,
    first,
    second,
    third,
    when_to_choose_1,
    when_to_choose_2,
  });
});
app.get("/service/gardening", (req, res) => {
  const token = req.cookies.token;
  let user = null;

  if (token) {
    try {
      user = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      user = null;
    }
  }
  const title = "Gardening";
  const intro_text =
    "Dreaming of a well-kept garden without the work? Our Gardening service keeps your outdoor spaces green, groomed, and gorgeous all year round.";
  const what_offers_txt =
    "Our gardening services include lawn mowing, hedge trimming, seasonal planting, and regular garden care tailored to your needs.";
  const first =
    "Lawn mowing and edging to maintain a clean and professional landscape.";
  const second =
    "Hedge trimming and weed removal to promote healthy plant growth and a tidy appearance.";
  const third =
    "Plant care and seasonal planting to keep your garden vibrant and colorful throughout the year.";
  const when_to_choose_1 =
    "Ideal for homeowners who want a beautiful yard without spending weekends working in it.";
  const when_to_choose_2 =
    "Perfect for seasonal cleanups, garden revamps, or maintaining rental properties.";
  res.render("service2.ejs", {
    user,
    title,
    intro_text,
    what_offers_txt,
    first,
    second,
    third,
    when_to_choose_1,
    when_to_choose_2,
  });
});
app.get("/user-exists", (req, res) => {
  res.sendFile(path.join(__dirname + "/static/user-exists.html"));
})
app.get("/authentication", (req, res) => {
  res.render("authentication.ejs");
});

app.get("/verification", (req, res) => {
  const token = req.cookies.VerificationCode;
  // const code = req.body.code; // Assuming the code is sent in the request body
  // if (token === code) {
  //   return res.json({ success: true, message: "Verification code is valid." });
  // }
  // res.json({ success: false, message: "Verification code is invalid." });
  res.json(token);
});



// =======================
// API Routes
// =======================
app.get("/api/user_messages", checkAuth_admin, async (_req, res) => {
  let x = await getAllMessages();
  res.send(x);
});
app.get("/api/users", checkAuth_admin, async (req, res) => {
  let x = await getAllUsers();
  res.send(x);
});
app.post("/submit-login", async (req, res) => {
  let result = await checkUser(req.body.email, req.body.password);

  if (result === "Invalid email or password.") {
    return res.json({ success: false, message: "Invalid email or password." });
  }

  let tokenPayload = {
    email: result.email,
    name: result.name,
  };

  if (result.role == "admin") {
    tokenPayload.role = "admin";
  }

  const token = jwt.sign(tokenPayload, JWT_SECRET, {
    expiresIn: result.role === "admin" ? "15min" : "1h",
  });

  res.cookie(result.role === "admin" ? "adminToken" : "token", token, {
    httpOnly: true,
    maxAge: 900000,
  });

  res.json({
    success: true,
    role: result.role,
    redirect: result.role === "admin" ? "/admin-panel" : "/homepage-logged",
  });
});
app.post("/submit-register", async (req, res) => {
  //this should make another token which can be opened after the verification to register this user

  const token = jwt.sign(
    {
      email: req.body.email,
      name: req.body.name,
      password: req.body.password,
      gender: req.body.gender,
      number: req.body.number,
    },
    JWT_SECRET,
    {
      expiresIn: "20min",
    }
  );

  res.cookie("registration-information", token, {
    httpOnly: true,
    maxAge: 20 * 60 * 1000, // 20 minutes
  });

  const sent = await makeverificationCode(req.body.email, res);
  if (sent) {
    res.redirect("/authentication");
  } else {
    res.send("Failed to send verification code.");
  }
});
app.post("/contact-submit", async (req, res) => {
  try {
    let result = await CreateUserMessage(
      req.body.email,
      req.body.name,
      req.body.subject,
      req.body.message
    );
    if (result == "Message upload successful!") {
      const token = jwt.sign(
        {
          email: req.body.email,
          name: req.body.name,
        },
        JWT_SECRET,
        {
          expiresIn: "24h",
        }
      );

      res.cookie("user-message-limit", token, {
        httpOnly: true,
        maxAge: 86400000,
      });
      res.redirect("/homepage");
    } else {
      res.send("result");
    }
  } catch (err) {
    if (err.message == "You can only send one message every 24 hours.") {
      return res.send(err.message);
    } else {
      return res.send("Failed to upload the message");
    }
  }
});
// for the admin panel
app.delete("/api/users/:id", checkAuth_admin, (req, res) => {
  const userId = req.params.id;
  deleteUser(userId)
    .then(() => {
      res.status(200).json({ message: "User deleted successfully" });
    })
    .catch((err) => {
      console.error("Error deleting user:", err);
      res.status(500).json({ message: "Failed to delete user" });
    });
});
app.delete("/api/user_messages/delete/:id", checkAuth_admin, (req, res) => {
  const userId = req.params.id;
  deleteUserMessage(userId)
    .then(() => {
      res.status(200).json({ message: "User deleted successfully" });
    })
    .catch((err) => {
      console.error("Error deleting user:", err);
      res.status(500).json({ message: "Failed to delete user" });
    });
});
app.put(
  "/api/users/update/:id/:email/:number/:gender/:name/:role",
  checkAuth_admin,
  (req, res) => {
    const userId = req.params.id;
    const userEmail = req.params.email;
    const userNumber = req.params.number;
    const userGender = req.params.gender;
    const userName = req.params.name;
    const userRole = req.params.role;
    updateUser(userEmail, userNumber, userGender, userName, userRole, userId)
      .then(() => {
        res.status(200).json({ message: "User updated successfully" });
      })
      .catch((err) => {
        console.error("Error updating user:", err);

        res.status(500).json({ message: "Failed to update user" });
      });
  }
);
app.put(
  "/api/users/add/:email/:password/:number/:gender/:name/:role",
  checkAuth_admin,
  async (req, res) => {
    let result = await createUser(
      req.params.email,
      req.params.password,
      req.params.number,
      req.params.gender,
      req.params.name
    )
      .then(() => {
        res.status(200).json({ message: "User creation successfully" });
      })
      .catch((err) => {
        console.error("Error creating user:", err);

        res.status(500).json({ message: "Failed to create user" });
      });
  }
);

app.post("/verify-email", async (req, res) => {
  const code =
    req.body.digit1 +
    req.body.digit2 +
    req.body.digit3 +
    req.body.digit4 +
    req.body.digit5 +
    req.body.digit6;
  const token = req.cookies.VerificationCode;
  const registrationToken = req.cookies["registration-information"];

  let decodedRegistrationToken;
  try {
    decodedRegistrationToken = jwt.verify(registrationToken, JWT_SECRET);
    console.log("[/verify-email] Decoded registration token:", decodedRegistrationToken);
  } catch (err) {
    console.error("[/verify-email] Registration token invalid:", err);
    return res.redirect("/user-exists");
  }
  const emailToCheck = decodedRegistrationToken.email;
  console.log("[/verify-email] Checking if user exists for email:", emailToCheck);

  const result = await checkUserAuthentication(emailToCheck);
  console.log("[/verify-email] checkUserAuthentication result:", result);

  if (result === "User exists.") {
    console.log("[/verify-email] User already exists, rendering error.");
    return res.render("authentication.ejs", {
      error: "User already exists. Please log in.",
    });
  }

  if (!token) {
    console.log("[/verify-email] No verification token found.");
    return res.render("authentication.ejs", {
      error: "Verification expired. Please request a new code.",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userCode = String(code).trim();
    const expectedCode = String(decoded.VerificationCode).trim();
    console.log("[/verify-email] User code:", userCode, "Expected code:", expectedCode);

    if (userCode === expectedCode) {
      console.log("[/verify-email] Codes match, creating user...");
      await createUser(
        decodedRegistrationToken.email,
        decodedRegistrationToken.password,
        decodedRegistrationToken.number,
        decodedRegistrationToken.gender.charAt(0).toUpperCase() + decodedRegistrationToken.gender.slice(1).toLowerCase(),
        decodedRegistrationToken.name
      );
      const loginToken = jwt.sign(
        {
          email: decodedRegistrationToken.email,
          name: decodedRegistrationToken.name,
        },
        JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.cookie("token", loginToken, { httpOnly: true, maxAge: 60 * 60 * 1000 });
      console.log("[/verify-email] User created and logged in, redirecting to homepage-logged.");
      return res.redirect("/homepage-logged");
    } else {
      console.log("[/verify-email] Invalid code entered.");
      return res.render("authentication.ejs", {
        error: "Invalid code. Please try again.",
      });
    }
  } catch (err) {
    console.error("[/verify-email] Verification error:", err);
    return res.render("authentication.ejs", {
      error: "Verification expired. Please request a new code.",
    });
  }
});

app.get("/resend-code", (req, res) => {
  const registrationToken = req.cookies["registration-information"];
  if (!registrationToken) {
    return res.render("authentication.ejs", {
      error: "Registration expired. Please register again.",
    });
  }

  try {
    const decodedRegistrationToken = jwt.verify(registrationToken, JWT_SECRET);
    const email = decodedRegistrationToken.email;
    res.clearCookie("VerificationCode");
    makeverificationCode(email, res)
      .then((result) => {
        if (result) {
          res.redirect("/authentication");
        } else {
          res.render("authentication.ejs", {
            error: "Failed to resend verification code. Please try again.",
          });
        }
      })
      .catch(() => {
        res.render("authentication.ejs", {
          error: "Failed to resend verification code. Please try again.",
        });
      });
  } catch (err) {
    return res.render("authentication.ejs", {
      error: "Registration expired. Please register again.",
    });
  }
});
// =======================
// Server
// =======================
export const handler = serverless(app);