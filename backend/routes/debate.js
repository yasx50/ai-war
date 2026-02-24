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

// Helper to clean response text
function cleanResponse(text) {
  if (!text) return "";
  return text
    .replace(/\*\*/g, "")           // Remove bold markers
    .replace(/\*/g, "")              // Remove asterisks
    .replace(/#+\s/g, "")            // Remove markdown headers
    .replace(/\n\n+/g, " ")          // Remove extra newlines
    .replace(/\n/g, " ")             // Replace remaining newlines with space
    .replace(/\s+/g, " ")            // Remove excessive spaces
    .replace(/[""]/g, '"')           // Fix smart quotes
    .replace(/['']/g, "'")           // Fix smart apostrophes
    .trim();
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
      max_tokens: 300,
    });

    const rawContent = response.choices[0]?.message?.content || "";
    const cleanedContent = cleanResponse(rawContent);
    
    logger.info("Response generated", {
      rawLength: rawContent.length,
      cleanedLength: cleanedContent.length,
      preview: cleanedContent.substring(0, 100),
    });

    return cleanedContent;
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
    const systemPrompt = buildDebatePrompt(
      req.body.profile1,
      req.body.profile2,
      req.body.topic
    );

    logger.info("System prompt built", {
      promptLength: systemPrompt.length,
    });

    // Start with profile1 response
    logger.info("Generating profile1 response...");
    const profile1Response = await generateDebateResponse(systemPrompt, []);
    logger.info("Profile1 response completed", {
      length: profile1Response.length,
      content: profile1Response.substring(0, 50),
    });

    // Profile2 responds to profile1
    logger.info("Generating profile2 response...");
    const conversationHistory = [
      { role: "assistant", content: profile1Response },
    ];
    const profile2Response = await generateDebateResponse(
      systemPrompt,
      conversationHistory
    );
    logger.info("Profile2 response completed", {
      length: profile2Response.length,
      content: profile2Response.substring(0, 50),
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
      profile1Response: profile1Response || "No response generated",
      profile2Response: profile2Response || "No response generated",
      tokensUsed: {
        profile1: Math.ceil((profile1Response || "").length / 4),
        profile2: Math.ceil((profile2Response || "").length / 4),
      },
    };

    logger.info("Sending response", responseData);
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
    const systemPrompt = buildDebatePrompt(profile1, profile2, topic);

    // Build conversation history from previous messages
    const conversationHistory = (messages || [])
      .filter((msg) => msg.role !== "system")
      .map((msg) => ({
        role:
          msg.role === "profile1" || msg.role === "profile2"
            ? "assistant"
            : "user",
        content: msg.content,
      }));

    logger.info("Conversation history built", {
      historyLength: conversationHistory.length,
      lastMessage: conversationHistory[conversationHistory.length - 1]?.content?.substring(0, 50),
    });

    // Generate next response from profile1
    logger.info("Generating profile1 CONTINUE response...");
    const profile1Response = await generateDebateResponse(
      systemPrompt,
      conversationHistory
    );
    logger.info("Profile1 continue response completed", {
      length: profile1Response.length,
      content: profile1Response.substring(0, 50),
    });

    // Generate response from profile2
    logger.info("Generating profile2 CONTINUE response...");
    const updatedHistory = [
      ...conversationHistory,
      { role: "assistant", content: profile1Response },
    ];
    const profile2Response = await generateDebateResponse(
      systemPrompt,
      updatedHistory
    );
    logger.info("Profile2 continue response completed", {
      length: profile2Response.length,
      content: profile2Response.substring(0, 50),
    });

    const tokensUsed = Math.ceil((profile1Response.length + profile2Response.length) / 4);

    await User.updateOne(
      { clerkId: req.auth.userId },
      { $inc: { tokensUsed } }
    );

    logger.info("Debate CONTINUED successfully", {
      tokensUsed,
      profile1Length: profile1Response.length,
      profile2Length: profile2Response.length,
    });

    const responseData = {
      profile1Response: profile1Response || "No response generated",
      profile2Response: profile2Response || "No response generated",
      tokensUsed: {
        profile1: Math.ceil((profile1Response || "").length / 4),
        profile2: Math.ceil((profile2Response || "").length / 4),
      },
    };

    logger.info("Sending continue response", responseData);
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