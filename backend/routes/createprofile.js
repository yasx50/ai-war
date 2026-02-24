import { Router } from "express";
import Profile from "../models/profile.js";
import User from "../models/user.js";
import { requireAuth, syncUser } from "../middleware/clerkAuth.js";

const router = Router();


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
      topicsExpertise: topicsExpertise
        ? topicsExpertise.split(",").map(t => t.trim())
        : []
    });

    // increment profile count
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
  const profiles = await Profile.find({ userId: req.auth.userId });
  res.json(profiles);
});


// ✅ Update Profile
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const updated = await Profile.findOneAndUpdate(
      { _id: req.params.id, userId: req.auth.userId },
      {
        ...req.body,
        topicsExpertise: req.body.topicsExpertise
          ? req.body.topicsExpertise.split(",").map(t => t.trim())
          : undefined,
        updatedAt: Date.now()
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.json(updated);

  } catch (err) {
    res.status(500).json({ error: "Failed to update profile" });
  }
});


// ✅ Delete Profile
router.delete("/:id", requireAuth, async (req, res) => {
  const deleted = await Profile.findOneAndDelete({
    _id: req.params.id,
    userId: req.auth.userId
  });

  if (!deleted) {
    return res.status(404).json({ error: "Profile not found" });
  }

  await User.updateOne(
    { clerkId: req.auth.userId },
    { $inc: { profiles: -1 } }
  );

  res.json({ message: "Profile deleted" });
});

export default router;