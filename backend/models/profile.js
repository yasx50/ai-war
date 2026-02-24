// models/Profile.js
const ProfileSchema = new Schema({
  userId: { type: String, required: true }, // clerkId
  type: { 
    type: String, 
    enum: ['preset', 'custom'], 
    required: true 
  },
  name: { type: String, required: true },
  // For preset profiles (Virat, Ronaldo, Modi, Trump, Elon, Sam)
  presetKey: { 
    type: String, 
    enum: ['virat_kohli', 'cristiano_ronaldo', 'narendra_modi', 
           'donald_trump', 'elon_musk', 'sam_altman', null] 
  },
  // For custom profiles
  avatar: String,           // URL or emoji
  personality: String,      // "aggressive debater, uses stats..."
  background: String,       // "Software engineer from Mumbai..."
  speakingStyle: String,    // "formal | casual | aggressive | diplomatic"
  topicsExpertise: [String],
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});