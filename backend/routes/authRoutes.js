import express from "express";
import { signup, signin, googleAuth, updateTarget } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";


const router = express.Router();
router.patch("/target", protect, updateTarget);
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", googleAuth);


export default router;
