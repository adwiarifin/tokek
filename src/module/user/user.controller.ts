import { Router } from "express";

import { userService } from "./user.service";

const router = Router();

// signup
router.post("/", async (req, res) => {
  const user = await userService.signup({ ...req.body });
  res.status(201).json({ user });
});

// otp
router.post("/otp", async (req, res) => {
  const result = await userService.generateOTP({ ...req.body });
  res.status(200).json(result);
});

// login
router.post("/login", async (req, res) => {
  const { user, token } = await userService.login({ ...req.body });
  res.status(200).json({ user, token });
});

// list users
router.get("/", async (req, res) => {
  const users = await userService.list();
  res.status(200).json({ users });
});

export { router as userRouter };
