import { Router } from "express";
import Profile from "../models/profile.js";
import User from "../models/user.js";
import { requireAuth, syncUser } from "../middleware/clerkAuth.js";

const router = Router();

// Helper: safely parse topicsExpertise regardless of input type
const parseTopics = (topics) => {
  if (!topics) return [];
  if (Array.isArray(topics)) return topics.map((t) => t.trim());
  if (typeof topics === "string") return topics.split(",").map((t) => t.trim());
  return [];
};

// ✅ Create Custom Profile
router.post("/", requireAuth, syncUser, async (req, res) => {
  try {
    const { name, avatar, personality, background, speakingStyle, topicsExpertise } = req.body;

    if (!name || !personality) {
      return res.status(400).json({ error: "Name and personality are required" });
    }

    const newProfile = await Profile.create({
      userId: req.auth.userId,
      type: "custom",
      name,
      avatar,
      personality,
      background,
      speakingStyle,
      topicsExpertise: parseTopics(topicsExpertise),
    });

    await User.updateOne(
      { clerkId: req.auth.userId },
      { $inc: { profiles: 1 } }
    );

    res.json(newProfile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create profile" });
  }
});

// ✅ Get All User Profiles
router.get("/", requireAuth, async (req, res) => {
  try {
    const profiles = await Profile.find({ userId: req.auth.userId });
    res.json(profiles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch profiles" });
  }
});

// ✅ Update Profile
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const updateData = { ...req.body, updatedAt: Date.now() };

    // ✅ Fix: safely parse topicsExpertise instead of blindly calling .split()
    if (req.body.topicsExpertise !== undefined) {
      updateData.topicsExpertise = parseTopics(req.body.topicsExpertise);
    }

    const updated = await Profile.findOneAndUpdate(
      { _id: req.params.id, userId: req.auth.userId },
      updateData,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

// ✅ Delete Profile
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const deleted = await Profile.findOneAndDelete({
      _id: req.params.id,
      userId: req.auth.userId,
    });

    if (!deleted) {
      return res.status(404).json({ error: "Profile not found" });
    }

    await User.updateOne(
      { clerkId: req.auth.userId },
      { $inc: { profiles: -1 } }
    );

    res.json({ message: "Profile deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete profile" });
  }
});

export default router;