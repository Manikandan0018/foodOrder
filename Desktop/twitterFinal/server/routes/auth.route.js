import express from "express";
import { signup, login, getMe, logout } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/getMe", protectRoute, getMe);
router.post("/logout", logout);

export default router;
