import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import User from "../models/user.js";

export const requireAuth = ClerkExpressRequireAuth();

export const syncUser = async (req, res, next) => {
  const clerkId = req.auth.userId;

  let user = await User.findOne({ clerkId });

  if (!user) {
    user = await User.create({
      clerkId,
      email: req.auth.sessionClaims?.email
    });
  }

  req.dbUser = user;
  next();
};