import express from "express";
import { login, register } from "../controllers/auth.js";

const router = express.Router();

router.post("/register", register)
router.post("/login", login)
router.post("/logout", (req, res) => {
  res
    .clearCookie("access_token", {
      secure: true,
      sameSite: "none",
    })
    .status(200)
    .json("Logged out successfully.");
});

export default router