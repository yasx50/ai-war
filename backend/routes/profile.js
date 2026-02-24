// routes/profiles.js
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