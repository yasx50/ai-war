import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Memory & State
let history = [];
let persons = {
  person1: { name: "Person 1", context: "" },
  person2: { name: "Person 2", context: "" }
};

// START Debate
app.post("/debate-start", (req, res) => {
  const { person1, person2 } = req.body;
  
  if (person1) persons.person1 = person1;
  if (person2) persons.person2 = person2;
  
  history = [];
  console.log("Debate Started with:", persons);
  res.json({ ok: true });
});

// AI Response with context
async function getAIResponse(personKey, topic, isFirst) {
  const person = persons[personKey];
  const otherPersonKey = personKey === "person1" ? "person2" : "person1";
  const otherPerson = persons[otherPersonKey];
  
  const basePrompt = isFirst
    ? `You are ${person.name}. Your background: ${person.context}\n\nYou are starting a debate about the topic. Take your initial stance.`
    : `You are ${person.name}. Your background: ${person.context}\n\nRespond to ${otherPerson.name}'s argument. Defend your position.`;

  const conversationHistory = history.map(h => `${h.personName}: ${h.text}`).join("\n");

  const fullPrompt = `
${basePrompt}

Rules:
- Reply only 1 or 2 short lines
- Max 25 words
- No paragraph
- No emojis
- Stay in character

${conversationHistory ? `Conversation so far:\n${conversationHistory}\n` : ""}

Topic: ${topic}

Your response as ${person.name}:
`;

  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: fullPrompt }],
    temperature: isFirst ? 0.7 : 1.0,
    max_tokens: 60,
  });

  return response.choices[0].message.content.trim();
}

// NEXT TURN
app.post("/debate-turn", async (req, res) => {
  try {
    const { topic, person1Name, person2Name } = req.body;

    if (!topic) return res.status(400).json({ error: "No topic" });

    // Update person names if provided
    if (person1Name) persons.person1.name = person1Name;
    if (person2Name) persons.person2.name = person2Name;

    const isFirst = history.length === 0;

    // Person 1 Response
    const response1 = await getAIResponse("person1", topic, isFirst);
    const log1 = { personName: persons.person1.name, text: response1 };
    history.push(log1);
    console.log(`${persons.person1.name}:`, response1);

    // Person 2 Response
    const response2 = await getAIResponse("person2", topic, false);
    const log2 = { personName: persons.person2.name, text: response2 };
    history.push(log2);
    console.log(`${persons.person2.name}:`, response2);

    res.json({
      logs: [log1, log2]
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "AI Failed" });
  }
});

app.listen(5000, () => {
  console.log("Server running on 5000");
});
