import { Router } from "express";

import { userRouter } from "../module/user/user.controller";

const router = Router();

router.get("/health", (req, res) => res.send({ message: "OK" }));
router.use("/user", userRouter);

export { router as rootRouter };
