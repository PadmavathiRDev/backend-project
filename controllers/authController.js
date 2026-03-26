const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
exports.register = async (req, res) => {
  try {
    const name = req.body.name?.trim();
    const mobile = req.body.mobile?.trim();
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    if (!name || !req.body.email || !mobile || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const email = req.body.email?.trim().toLowerCase();

    // email format check
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return res.status(400).json({ message: "Enter valid email" });
    }

    // domain check
    const allowedDomains = ["gmail.com", "yahoo.in", "outlook.com"];
    const domain = email.split("@")[1];

    if (!allowedDomains.includes(domain)) {
      return res.status(400).json({
        message: "Only Gmail, Yahoo, Outlook emails are allowed"
      });
    }

    // password match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // mobile validation
    const mobilePattern = /^[0-9]{10}$/;
    if (!mobilePattern.test(mobile)) {
      return res.status(400).json({ message: "Enter valid mobile number" });
    }

    // password validation
    const passwordPattern = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;
    if (!passwordPattern.test(password)) {
      return res.status(400).json({
        message: "Password must contain 8 characters, uppercase, number and special character"
      });
    }

    // check existing email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    await User.create({
      name,
      email,
      mobile,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const email = req.body.email;
    const mobile = req.body.mobile;
    const password = req.body.password;

    if (!password || (!email && !mobile)) {
      return res.status(400).json({
        message: "Email or mobile and password are required"
      });
    }

    let user;

    if (email) {
      const cleanEmail = email.trim().toLowerCase();
      user = await User.findOne({ email: cleanEmail });
    } else if (mobile) {
      user = await User.findOne({ mobile });
    }

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token: token
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
