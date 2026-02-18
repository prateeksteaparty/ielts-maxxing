import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES } from "../config/jwt.js";


const generateToken = (id) =>
  jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 🔒 Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("SIGNUP ERROR:", error);
    res.status(500).json({ message: "Server error during signup" });
  }
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("SIGNIN ERROR:", error);
    res.status(500).json({ message: "Server error during signin" });
  }
};

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
);

export const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Google token missing" });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        password: "GOOGLE_AUTH",
      });
    }

    const jwtToken = jwt.sign(
      { id: user._id },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    res.json({
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("GOOGLE AUTH ERROR:", error);
    res.status(500).json({ message: "Google login failed" });
  }
};

export const updateTarget = async (req, res) => {
  try {
    const { targetBand } = req.body;
    if (targetBand < 0 || targetBand > 9) {
      return res.status(400).json({ message: "Invalid band score" });
    }
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { targetBand },
      { new: true }
    ).select("-password");
    res.json({ targetBand: user.targetBand });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};