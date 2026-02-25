import { Router } from "express";
import Profile from "../models/profile.js";
import User from "../models/user.js";
import { requireAuth, syncUser } from "../middleware/clerkAuth.js";

const router = Router();

// Helper function to check if token reset is needed (daily)
const shouldResetTokens = (lastResetDate) => {
  const today = new Date().toDateString();
  const lastReset = new Date(lastResetDate).toDateString();
  return today !== lastReset;
};

// ✅ Get User Token Data (with daily reset)
router.get("/user/tokens", requireAuth, syncUser, async (req, res) => {
  try {
    let user = await User.findOne({ clerkId: req.auth.userId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if tokens need to be reset (daily)
    if (shouldResetTokens(user.lastTokenResetDate)) {
      user.tokensUsed = 0;
      user.lastTokenResetDate = new Date();
      await user.save();
    }

    res.json({
      tokensUsed: user.tokensUsed,
      tokenLimit: user.tokenLimit,
      lastTokenResetDate: user.lastTokenResetDate
    });
  } catch (err) {
    console.error("GET TOKENS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;