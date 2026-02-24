# 🎬 AI War Arena - Hindi/Hinglish Edition

## ✅ Fixed Issues:
1. **Message Display** - Added proper error handling and logging
2. **Hindi Support** - AI now responds in Hindi/Hinglish
3. **Gaaliyan/Slang** - Explicitly enabled Indian street language and abuses
4. **Better Debugging** - Console logs for troubleshooting

---

## 🚀 How to Run:

### Step 1: Start Backend Server
```bash
cd backend
node server.js
```
You should see:
```
🎬 Server running on 5000
```

### Step 2: Start Frontend
In a new terminal:
```bash
npm run dev
```
You should see:
```
✅ http://localhost:5173
```

### Step 3: Test the App
1. Go to `http://localhost:5173`
2. Upload photos for both people (optional)
3. Enter names and context for both people
4. Click "Start Battle"
5. Enter a debate topic
6. Click "⚡ Start Battle"
7. Click "⚡ Next Turn" to see debating AIs

---

## 🎯 AI Language Features:

The AI now:
- ✅ Responds in **Hindi/Hinglish** (mixed)
- ✅ Uses **Indian slang** (chal, bakwas, behta hai, etc.)
- ✅ Can use **gaaliyan** (Indian abuses/profanity) freely
- ✅ Uses **street language** naturally
- ✅ Stays in character based on person's context

---

## 📝 Example Debate:

**Person 1**: Rahul (IT Engineer)  
**Person 2**: Priya (Philosopher)  
**Topic**: "Artificial Intelligence insano ke kaam le lega"

**Rahul**: "Bakwas hai bhai! AI sirf repetitive kaam karega. Creative cheezon mein insaan hi superior hai."

**Priya**: "Tu dekh nahi raha na? Already engineering mein AI replace kar raha hai. 20 saal mein total landscape change ho jayega."

---

## 🔧 Debugging:

### Check if Backend is Running:
```bash
curl http://localhost:5000/health
```

Should return: `{"status":"✅ Server running!"}`

### Check Console Logs:
- **Backend**: Shows messages like `✅ Rahul: ...` or `❌ Error in debate-turn: ...`
- **Frontend**: Open DevTools (F12) and check Console tab for errors

### Common Issues:

| Issue | Solution |
|-------|----------|
| "Cannot reach server" | Make sure backend is running on port 5000 |
| "Empty messages" | Check browser console for error messages |
| "Wrong language" | Clear browser cache and restart backend |
| "No API response" | Check `.env` file has valid `GROQ_API_KEY` |

---

## 🌐 API Endpoints:

### GET /health
```bash
curl http://localhost:5000/health
```

### POST /debate-start
```bash
curl -X POST http://localhost:5000/debate-start \
  -H "Content-Type: application/json" \
  -d '{
    "person1": {
      "name": "Rahul",
      "context": "Software engineer, loves coding"
    },
    "person2": {
      "name": "Priya",
      "context": "Philosopher, questions everything"
    }
  }'
```

### POST /debate-turn
```bash
curl -X POST http://localhost:5000/debate-turn \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "AI replace karega sab",
    "person1Name": "Rahul",
    "person2Name": "Priya"
  }'
```

Expected Response:
```json
{
  "logs": [
    {
      "personName": "Rahul",
      "text": "Bakwas! Engineering mein already AI demand ho gaya. Financial analysis mein to bot ka zamana hai."
    },
    {
      "personName": "Priya",
      "text": "Argument chhod. Facts dekh. 50% jobs next decade mein risky ho jayengi AI se."
    }
  ]
}
```

---

## 📦 Tech Stack:

- **Frontend**: React 19 + Vite
- **Backend**: Express.js + Groq SDK
- **AI Model**: Llama 3.1 8B (Hindi-capable)
- **Language**: Hindi/Hinglish with street language

---

## 🎨 Features:

✅ Multi-person profile setup  
✅ Photo upload for each person  
✅ Custom context for each AI  
✅ Hindi/Hinglish responses  
✅ Street language & gaaliyan support  
✅ Debate history tracking  
✅ Beautiful gradient UI  
✅ Error handling & logging  
✅ Mobile responsive design  

---

**Notes**: 
- AI responses are contextual based on person's background
- Language mixing (Hinglish) is intentional for authenticity
- Gaaliyan are allowed as per your requirement
- Responses use street-style casual Hindi

Enjoy the chaos! 🔥⚔️
