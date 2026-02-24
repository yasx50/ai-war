import { Router } from "express";
import OpenAI from "openai";
import { requireAuth, syncUser } from "../middleware/clerkAuth.js";
import { buildDebatePrompt } from "../utils/buildDebatePrompt.js";
import User from "../models/user.js";

const router = Router();

// Logger utility
const logger = {
  info: (msg, data = {}) => {
    console.log(`[DEBATE] ${new Date().toISOString()} - ${msg}`, data);
  },
  error: (msg, error = {}) => {
    console.error(`[DEBATE ERROR] ${new Date().toISOString()} - ${msg}`, error);
  },
};

// Helper to clean response text and extract just dialogue
function extractDialogue(text) {
  if (!text) return "";
  
  let cleaned = text
    .replace(/\*\*/g, "")           // Remove bold markers
    .replace(/\*/g, "")              // Remove asterisks
    .replace(/#+\s/g, "")            // Remove markdown headers
    .replace(/\n\n+/g, " ")          // Remove extra newlines
    .replace(/\n/g, " ")             // Replace remaining newlines with space
    .replace(/\s+/g, " ")            // Remove excessive spaces
    .replace(/[""]/g, '"')           // Fix smart quotes
    .replace(/['']/g, "'")           // Fix smart apostrophes
    .trim();

  // Remove meta-commentary patterns
  const metaPatterns = [
    /.*?let's (continue|generate|proceed).*?[:.]/gi,
    /.*?as.*?(turn|response|due).*?[:.]/gi,
    /.*?however.*?for.*?(sake|sake of|continuing).*?[:.]/gi,
    /.*?Here's the (correct|proper).*?[:.]/gi,
    /.*?To (continue|proceed|respond).*?[:.]/gi,
  ];

  for (const pattern of metaPatterns) {
    cleaned = cleaned.replace(pattern, "");
  }

  // Take only the first coherent sentence/statement, removing trailing meta-commentary
  const sentences = cleaned.split(/[.!?]+/).filter(s => s.trim().length > 3);
  if (sentences.length > 0) {
    let dialogue = sentences[0].trim();
    
    // If it's too short or looks like meta, try the next sentence
    if (dialogue.length < 10 || dialogue.match(/^(as|however|let|here|to|while|but)/i)) {
      dialogue = sentences.find(s => !s.match(/^(as|however|let|here|to|while|but)/i)) || dialogue;
    }
    
    return dialogue.trim();
  }

  return cleaned.substring(0, 200).trim();
}

// Generate a single debate response
async function generateDebateResponse(systemPrompt, conversationHistory) {
  const groq = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
  });

  const messages = [
    { role: "system", content: systemPrompt },
    ...conversationHistory,
  ];

  try {
    logger.info("API Call", { messageCount: messages.length });
    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: messages,
      max_tokens: 200,  // Reduced max tokens to get shorter, focused responses
    });

    const rawContent = response.choices[0]?.message?.content || "";
    const dialogue = extractDialogue(rawContent);
    
    logger.info("Response generated", {
      rawLength: rawContent.length,
      extractedLength: dialogue.length,
      preview: dialogue.substring(0, 100),
    });

    return dialogue;
  } catch (error) {
    logger.error("Failed to generate debate response", {
      message: error.message,
      status: error.status,
    });
    throw error;
  }
}

router.post("/start", requireAuth, syncUser, async (req, res) => {
  const user = req.dbUser;
  const remainingTokens = user.tokenLimit - user.tokensUsed;

  logger.info("Debate START request received", {
    userId: req.auth.userId,
    profile1: req.body.profile1?.name,
    profile2: req.body.profile2?.name,
    topic: req.body.topic,
    remainingTokens,
  });

  if (remainingTokens <= 0) {
    logger.info("Insufficient tokens", { remainingTokens });
    return res.status(403).json({
      error: "Token limit reached (1000/1000). Upgrade for more.",
    });
  }

  try {
    // Profile1 speaks first
    logger.info("Generating Profile1 initial response (turn 1)");
    const systemPrompt1 = buildDebatePrompt(
      req.body.profile1,
      req.body.profile2,
      req.body.topic,
      true  // Profile1's turn
    );
    const profile1Response = await generateDebateResponse(systemPrompt1, []);
    logger.info("Profile1 response completed", {
      length: profile1Response.length,
      content: profile1Response.substring(0, 80),
    });

    // Profile2 responds
    logger.info("Generating Profile2 initial response (turn 2)");
    const systemPrompt2 = buildDebatePrompt(
      req.body.profile1,
      req.body.profile2,
      req.body.topic,
      false  // Profile2's turn
    );
    const conversationHistory = [
      { role: "user", content: profile1Response },
    ];
    const profile2Response = await generateDebateResponse(systemPrompt2, conversationHistory);
    logger.info("Profile2 response completed", {
      length: profile2Response.length,
      content: profile2Response.substring(0, 80),
    });

    const tokensUsed = Math.ceil((profile1Response.length + profile2Response.length) / 4);

    await User.updateOne(
      { clerkId: req.auth.userId },
      { $inc: { tokensUsed } }
    );

    logger.info("Debate STARTED successfully", {
      tokensUsed,
      profile1Length: profile1Response.length,
      profile2Length: profile2Response.length,
    });

    const responseData = {
      profile1Response: profile1Response || "I'm ready to debate this topic.",
      profile2Response: profile2Response || "I appreciate that perspective.",
      tokensUsed: {
        profile1: Math.ceil((profile1Response || "").length / 4),
        profile2: Math.ceil((profile2Response || "").length / 4),
      },
    };

    logger.info("Sending response", { hasProfile1: !!responseData.profile1Response, hasProfile2: !!responseData.profile2Response });
    res.json(responseData);
  } catch (error) {
    logger.error("Error starting debate", {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({ error: "Failed to start debate: " + error.message });
  }
});

router.post("/continue", requireAuth, syncUser, async (req, res) => {
  const user = req.dbUser;
  const remainingTokens = user.tokenLimit - user.tokensUsed;

  const { profile1, profile2, topic, messages } = req.body;

  logger.info("Debate CONTINUE request received", {
    userId: req.auth.userId,
    profile1: profile1?.name,
    profile2: profile2?.name,
    messageCount: messages?.length,
    remainingTokens,
  });

  if (remainingTokens <= 0) {
    logger.info("Insufficient tokens for continue", { remainingTokens });
    return res.status(403).json({
      error: "Token limit reached. Upgrade for more.",
    });
  }

  try {
    // Determine whose turn it is
    // If even messages count, Profile1 speaks next. If odd, Profile2 speaks next.
    const messageCount = (messages || []).length;
    const isProfile1Turn = messageCount % 2 === 0;
    const currentSpeaker = isProfile1Turn ? profile1.name : profile2.name;

    logger.info("Turn determination", {
      messageCount,
      isProfile1Turn,
      currentSpeaker,
    });

    const systemPrompt = buildDebatePrompt(profile1, profile2, topic, isProfile1Turn);

    // Build conversation history from previous messages
    const conversationHistory = (messages || [])
      .filter((msg) => msg.role !== "system")
      .map((msg) => ({
        role: "user",  // All previous messages go as user messages
        content: msg.content,
      }));

    logger.info("Conversation history built", {
      historyLength: conversationHistory.length,
      lastMessage: conversationHistory[conversationHistory.length - 1]?.content?.substring(0, 50),
    });

    // Generate response for whoever's turn it is
    logger.info(`Generating ${isProfile1Turn ? 'Profile1' : 'Profile2'} continue response...`);
    const response = await generateDebateResponse(systemPrompt, conversationHistory);
    
    logger.info(`${isProfile1Turn ? 'Profile1' : 'Profile2'} continue response completed`, {
      length: response.length,
      content: response.substring(0, 80),
    });

    const tokensUsed = Math.ceil(response.length / 4);

    await User.updateOne(
      { clerkId: req.auth.userId },
      { $inc: { tokensUsed } }
    );

    logger.info("Debate CONTINUED successfully", {
      tokensUsed,
      responseLength: response.length,
      speaker: currentSpeaker,
    });

    const responseData = {
      profile1Response: isProfile1Turn ? (response || "I agree with your point.") : null,
      profile2Response: isProfile1Turn ? null : (response || "That's an interesting perspective."),
      currentSpeaker,
      isProfile1Turn,
      tokensUsed: {
        profile1: isProfile1Turn ? tokensUsed : 0,
        profile2: isProfile1Turn ? 0 : tokensUsed,
      },
    };

    logger.info("Sending continue response", { speaker: currentSpeaker, hasResponse: !!response });
    res.json(responseData);
  } catch (error) {
    logger.error("Error continuing debate", {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({ error: "Failed to continue debate: " + error.message });
  }
});

export default router;