import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken.js';
import Post from '../models/post.model.js';

export const signup = async (req, res) => {
  try {
    const { username, fullname, email, password } = req.body;

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const existingEmail = await User.findOne({ email });
    const existingUsername = await User.findOne({ username });

    if (existingEmail || existingUsername) {
      return res.status(400).json({ error: "Email or username already registered." });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, fullname, email: email.trim(), password: hashPassword });
    await newUser.save();

    generateToken(newUser._id, res);

    res.status(201).json({
      message: "Signup successful",
      _id: newUser._id,
      username: newUser.username,
      fullname: newUser.fullname,
      email: newUser.email,
      followers: newUser.followers,
      following: newUser.following,
      profileImg: newUser.profileImg,
      coverImg: newUser.coverImg,
      bio: newUser.bio,
      link: newUser.link
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isBlocked) return res.status(403).json({ message: "Your account is blocked" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    generateToken(user._id, res);

    res.status(200).json({
      message: "Login successful",
      _id: user._id,
      username: user.username,
      fullname: user.fullname,
      email: user.email
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Logout error" });
  }
};

// 🔹 Logged-in user (getMe)
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password")
      .populate("followers", "username profileImg")
      .populate("following", "username profileImg");

    if (!user) return res.status(404).json({ error: "User not found" });

    const posts = await Post.find({ user: user._id });

    res.status(200).json({ ...user._doc, posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
