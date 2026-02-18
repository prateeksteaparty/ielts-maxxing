import express from "express";
import { addTest, getTestsBySkill, deleteTest } from "../controllers/testController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, addTest);
router.get("/:skill", protect, getTestsBySkill);
router.delete("/:id", protect, deleteTest);

export default router;