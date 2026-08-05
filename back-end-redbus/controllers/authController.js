const Customer = require("../models/customer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register
exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      age,
      gender,
      dateOfBirth,
    } = req.body;

    const existingUser = await Customer.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const customer = new Customer({
      name,
      email,
      password: hashedPassword,
      googleId: null,
      age,
      gender,
      dateOfBirth,
      profilePicture: "",
    });

    await customer.save();

    res.status(201).json({
      success: true,
      message: "Registration successful",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const customer = await Customer.findOne({ email });

    if (!customer) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email",
      });
    }

    const match = await bcrypt.compare(password, customer.password);

    if (!match) {
      return res.status(400).json({
        success: false,
        message: "Invalid Password",
      });
    }

    const token = jwt.sign(
      {
        id: customer._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      success: true,
      token,
      customer,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};