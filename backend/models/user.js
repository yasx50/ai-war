import mongoose from "mongoose";

const { Schema } = mongoose;

const UserSchema = new Schema({
  clerkId: { type: String, required: true, unique: true },


  profiles: { type: Number, required: true, default: 0 },
  email: String,
  tokensUsed: { type: Number, default: 0 },
  tokenLimit: { type: Number, default: 1000 },
  lastTokenResetDate: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("User", UserSchema);