import { Router } from "express";
import Profile from "../models/profile.js";
import { requireAuth, syncUser } from "../middleware/clerkAuth.js";

const router = Router();

router.post("/", requireAuth, syncUser, async (req, res) => {
  try {
    const existingCount = await Profile.countDocuments({
      userId: req.auth.userId
    });

    if (existingCount >= 2) {
      return res.status(400).json({
        error: "Maximum 2 profiles allowed. Delete one to create a new profile."
      });
    }

    const profile = await Profile.create({
      userId: req.auth.userId,
      ...req.body
    });

    res.json(profile);
  } catch (err) {
    console.error("PROFILE CREATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;