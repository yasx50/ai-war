// routes/profiles.js
import { requireAuth, syncUser } from "../middleware/clerkAuth.js";
import e, { Router } from "express";
const router = Router();

router.post('/', requireAuth, syncUser, async (req, res) => {
  const existingCount = await Profile.countDocuments({ userId: req.auth.userId });
  
  if (existingCount >= 2) {
    return res.status(400).json({ 
      error: 'Maximum 2 profiles allowed. Delete one to create a new profile.' 
    });
  }
  
  const profile = await Profile.create({
    userId: req.auth.userId,
    ...req.body
  });
  
  res.json(profile);
});

export default router;