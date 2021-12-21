import { Router } from "express";

import { userService } from "./user.service";

const router = Router();

// signup
router.post("/", async (req, res) => {
  const user = await userService.signup({ ...req.body });
  res.status(201).json({ user });
});

// list users
router.get("/", async (req, res) => {
  const users = await userService.list();
  res.status(200).json({ users });
});

export { router as userRouter };
