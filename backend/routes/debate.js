// routes/debate.js
router.post('/start', requireAuth, syncUser, async (req, res) => {
  const user = req.dbUser;
  const remainingTokens = user.tokenLimit - user.tokensUsed;
  
  if (remainingTokens <= 0) {
    return res.status(403).json({ 
      error: 'Token limit reached (1000/1000). Upgrade for more.' 
    });
  }
  
  // Build system prompt from profiles
  const systemPrompt = buildDebatePrompt(req.body.profile1, req.body.profile2, req.body.topic);
  
  // Call AI API with max_tokens = remainingTokens
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'system', content: systemPrompt }, ...req.body.messages],
    max_tokens: Math.min(remainingTokens, 500), // cap per turn
    stream: true
  });
  
  // Stream back + count tokens used
  let tokensUsedThisTurn = 0;
  for await (const chunk of response) {
    // stream to client, count tokens
    tokensUsedThisTurn += chunk.usage?.completion_tokens || 0;
    res.write(chunk.choices[0]?.delta?.content || '');
  }
  
  // Update DB
  await User.updateOne(
    { clerkId: req.auth.userId },
    { $inc: { tokensUsed: tokensUsedThisTurn } }
  );
  
  res.end();
});