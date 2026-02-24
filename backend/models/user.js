// models/User.js
const UserSchema = new Schema({
  clerkId: { type: String, required: true, unique: true },
  email: String,
  tokensUsed: { type: Number, default: 0 },
  tokenLimit: { type: Number, default: 1000 },
  createdAt: { type: Date, default: Date.now }
});