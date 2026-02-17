# 🤖 AI War Arena - Enhanced Features

## New Features

### 1. **Multi-Person Support**
- Create profiles for 2 different people
- Each person gets their own AI powered by Groq's Llama 3.1
- PersonAI personalities are customized based on each person's context

### 2. **Person Context & Background**
- Add detailed context for each person (profession, expertise, personality, background)
- AI uses this context to respond more authentically based on the person's profile
- Context influences the tone and style of AI responses

### 3. **Photo Upload**
- Upload profile photos for each person
- Supported formats: JPG, PNG, GIF, WebP, etc.
- Photos are displayed in the setup screen and during debates
- Visual identification of who is currently speaking

### 4. **Enhanced UI/UX**
- Modern gradient design with purple/violet color scheme
- Responsive layout for mobile and desktop
- Person Cards display photos and context
- Active speaker indicator during debates
- Smooth animations and transitions
- Better visual hierarchy with improved spacing

### 5. **Improved Debate Experience**
- Personalized AI responses based on user context
- Debate history maintained throughout the conversation
- Clear speaker identification with photos and names
- Topic display at the start of debates
- Visual feedback for thinking/processing state

## Project Structure

```
c:\ai war\
├── src/
│   ├── components/
│   │   ├── PersonSetup.jsx      (NEW) - Setup screen for profiles
│   │   ├── PersonSetup.css      (NEW) - Setup styling
│   │   ├── PersonCard.jsx       (NEW) - Display person info
│   │   ├── PersonCard.css       (NEW) - Person card styling
│   │   └── Map3D.jsx
│   ├── App.jsx                  (UPDATED) - Main app with new flow
│   ├── App.css                  (UPDATED) - Enhanced styling
│   ├── main.jsx
│   └── index.css                (UPDATED) - Global styles
├── backend/
│   └── server.js                (UPDATED) - Multi-person support
├── vite.config.js
├── package.json
└── README.md
```

## How to Use

### Setup Phase
1. When you first load the app, you'll see the setup screen
2. Upload photos for each person (optional but recommended)
3. Enter each person's name and detailed context
4. Click "Start Battle"

### Debate Phase
1. Enter a debate topic
2. Click "⚡ Start Battle" to begin
3. Click "⚡ Next Turn" to let the AIs respond
4. Each AI will respond based on their assigned person's context
5. Click "New Debate" to start a fresh debate with the same people
6. Click the Settings button to setup different people

## Backend API

### POST /debate-start
Initializes a new debate with person contexts
```json
{
  "person1": {
    "name": "Alice",
    "context": "Software engineer with 10 years experience..."
  },
  "person2": {
    "name": "Bob",
    "context": "Philosopher interested in ethics..."
  }
}
```

### POST /debate-turn
Gets the next turn of responses
```json
{
  "topic": "AI will replace all jobs",
  "person1Name": "Alice",
  "person2Name": "Bob"
}
```

Response:
```json
{
  "logs": [
    {
      "personName": "Alice",
      "text": "Actually, AI will create new jobs we haven't imagined..."
    },
    {
      "personName": "Bob",
      "text": "That's historically what happened with automation, but..."
    }
  ]
}
```

## Technical Stack

- **Frontend**: React 19, Vite, Tailwind CSS
- **Backend**: Express.js, Groq SDK (Llama 3.1)
- **AI Model**: Llama 3.1 8B Instant
- **Styling**: Custom CSS with modern gradients and animations

## Environment Setup

Create a `.env` file in the backend directory:
```
GROQ_API_KEY=your_groq_api_key_here
```

## Running the App

1. **Frontend**:
```bash
npm run dev
```

2. **Backend**:
```bash
cd backend
node server.js
```

Visit `http://localhost:5173` to start!

---

**Note**: The AI responses are generated using Groq's API. Make sure you have a valid GROQ_API_KEY in your environment.
