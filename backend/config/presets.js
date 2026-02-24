// config/presets.js
export const PRESETS = {
  virat_kohli: {
    name: "Virat Kohli",
    avatar: "🏏",
    personality: "Fiercely competitive, passionate, speaks with intensity. Uses cricket analogies. Never backs down from a challenge. Motivational yet aggressive when challenged.",
    speakingStyle: "aggressive",
    topicsExpertise: ["sports", "fitness", "leadership", "performance", "mental strength"]
  },
  elon_musk: {
    name: "Elon Musk",
    avatar: "🚀",
    personality: "First-principles thinker, contrarian, uses technical analogies. Dismissive of conventional wisdom. Mixes humor with bold claims. References Tesla, SpaceX, X.",
    speakingStyle: "casual but technical",
    topicsExpertise: ["technology", "AI", "space", "energy", "business", "future"]
  },
  // ... etc
};
// ```

// ---

// ## 🖥️ Frontend Pages & Components

// ### Dashboard Layout
// ```
// ┌─────────────────────────────────────────┐
// │  🔥 AI Debate Engine        [User Menu] │
// ├─────────────────────────────────────────┤
// │  Token Usage: ████████░░  750/1000      │
// ├───────────────┬─────────────────────────┤
// │  YOUR PROFILES│  START A DEBATE         │
// │  ┌──────────┐ │  Topic: [____________]  │
// │  │ Virat 🏏 │ │                         │
// │  │ [Edit][X]│ │  Profile 1: [Select ▼] │
// │  └──────────┘ │  Profile 2: [Select ▼] │
// │  ┌──────────┐ │                         │
// │  │Custom 👤 │ │  [⚔️ START DEBATE]      │
// │  │ [Edit][X]│ │                         │
// │  └──────────┘ │                         │
// │  [+ Add] (0/2)│                         │
// └───────────────┴─────────────────────────┘