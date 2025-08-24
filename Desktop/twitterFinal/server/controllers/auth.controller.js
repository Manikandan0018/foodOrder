import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Post from '../models/post.model.js';

// Generate token helper
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "15d" });
};

// Signup
export const signup = async (req, res) => {
  try {
    const { username, fullname, email, password } = req.body;

    if (!email || !username || !password) return res.status(400).json({ error: "All fields required" });

    const existingEmail = await User.findOne({ email });
    const existingUsername = await User.findOne({ username });
    if (existingEmail || existingUsername) return res.status(400).json({ error: "Email or username already exists" });

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, fullname, email, password: hashPassword });
    await newUser.save();

    const token = generateToken(newUser._id);

    res.status(201).json({
      message: "Signup successful",
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      token // ✅ send token to frontend
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.isBlocked) return res.status(403).json({ error: "Your account is blocked" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = generateToken(user._id);

    res.status(200).json({
      message: "Login successful",
      _id: user._id,
      username: user.username,
      email: user.email,
      token // ✅ send token to frontend
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// getMe
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });

    const posts = await Post.find({ user: user._id });
    res.status(200).json({ ...user._doc, posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Logout (optional)
export const logout = async (req, res) => {
  res.status(200).json({ message: "Logout successful" });
};
