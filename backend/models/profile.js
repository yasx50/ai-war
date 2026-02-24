import { Schema, model } from "mongoose";

const ProfileSchema = new Schema({
  userId: { 
    type: String, 
    required: true 
  }, // clerkId

  type: { 
    type: String, 
    enum: ["preset", "custom"], 
    required: true 
  },

  name: { 
    type: String, 
    required: true 
  },

  // Preset profiles
  presetKey: { 
    type: String, 
    enum: [
      "virat_kohli",
      "cristiano_ronaldo",
      "narendra_modi",
      "donald_trump",
      "elon_musk",
      "sam_altman",
      null
    ]
  },

  // Custom profile fields
  avatar: String,
  personality: String,
  background: String,
  speakingStyle: String, // formal | casual | aggressive | diplomatic
  topicsExpertise: [String],

  createdAt: { 
    type: Date, 
    default: Date.now 
  },

  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Optional: auto-update updatedAt
ProfileSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export default model("Profile", ProfileSchema);