// middleware/clerkAuth.js
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';

export const requireAuth = ClerkExpressRequireAuth();

// Sync Clerk user to MongoDB on first request
export const syncUser = async (req, res, next) => {
  const clerkId = req.auth.userId;
  let user = await User.findOne({ clerkId });
  if (!user) {
    user = await User.create({ clerkId, email: req.auth.sessionClaims?.email });
  }
  req.dbUser = user;
  next();
};