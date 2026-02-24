// lib/api.js
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

// Create authenticated axios instance
export const useApi = () => {
  const { getToken } = useAuth();
  
  const api = axios.create({ baseURL: '/api' });
  
  api.interceptors.request.use(async (config) => {
    const token = await getToken();
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
  
  return api;
};
// ```

// ---

// ## 🔄 Complete User Flow
// ```
// 1. User lands on site
//    └── Sign up / Sign in via Clerk
//        └── Clerk webhook / first API call → auto-create User in MongoDB

// 2. Dashboard
//    ├── Shows token counter (used/1000)
//    ├── Shows profiles (0, 1, or 2 created)
//    └── "Create Profile" button (disabled if 2 exist)

// 3. Profile Management
//    ├── CREATE: Choose preset OR custom
//    │   ├── Preset: Pick from Virat/Ronaldo/Modi/Trump/Elon/Sam
//    │   └── Custom: Fill form (name, personality, style, expertise)
//    │   └── Validation: MAX 2 profiles per user
//    ├── READ: View profile cards
//    ├── UPDATE: Edit custom profiles (preset only allow nickname edit)
//    └── DELETE: Remove profile (opens slot for new one)

// 4. Start Debate
//    ├── Select Profile 1 (from your profiles)
//    ├── Select Profile 2 (from your profiles OR pick any preset)
//    ├── Enter debate topic
//    └── Click "Start Debate"
//        ├── Check tokens: (1000 - tokensUsed) > 0 ?
//        ├── Send to backend → AI generates debate turns
//        ├── Stream responses back
//        └── Deduct tokens used from user.tokensUsed
// ```

// ---

// ## 🛣️ API Routes

// ### Profiles (`/api/profiles`)
// ```
// GET    /api/profiles          → Get all profiles for logged-in user
// POST   /api/profiles          → Create profile (check: max 2)
// PUT    /api/profiles/:id      → Update profile (owner check)
// DELETE /api/profiles/:id      → Delete profile (owner check)
// GET    /api/profiles/presets  → Get all available preset profiles (public)
// ```

// ### Debate (`/api/debate`)
// ```
// POST   /api/debate/start      → Start debate, returns streamed AI response
// GET    /api/debate/history    → User's past debates (optional feature)
// ```

// ### User (`/api/user`)
// ```
// GET    /api/user/me           → Get user info + token count