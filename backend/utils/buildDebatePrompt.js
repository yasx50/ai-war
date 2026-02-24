export function buildDebatePrompt(profile1, profile2, topic, isProfile1Turn = true) {
  // Handle preset profiles with default attributes
  const getProfileDescription = (profile) => {
    const defaultDescriptions = {
      'virat_kohli': 'Virat Kohli - A legendary cricket player with precision and competitive spirit. Speaks with confidence about sport, strategy, and excellence. Known for being direct and focused on performance.',
      'cristiano_ronaldo': 'Cristiano Ronaldo - A renowned footballer known for dedication and winning mentality. Speaks about hard work, achievement, and performance. Known for being passionate and competitive.',
      'narendra_modi': 'Narendra Modi - An experienced political leader with strong conviction. Speaks about development, nationalism, and pragmatic governance. Known for being assertive and policy-focused.',
      'donald_trump': 'Donald Trump - A prominent businessman and personality with bold opinions. Speaks directly, confidently, and often provocatively. Known for being blunt and direct.',
      'elon_musk': 'Elon Musk - A visionary entrepreneur focused on innovation. Speaks about technology, future, and ambitious goals. Known for being visionary and sometimes radical.',
      'sam_altman': 'Sam Altman - An AI researcher and entrepreneur. Speaks thoughtfully about technology, ethics, and progress. Known for being measured and thoughtful.',
    };

    const description =
      defaultDescriptions[profile.presetKey] ||
      profile.description ||
      `${profile.name} is a notable figure with unique perspectives.`;

    return {
      name: profile.name,
      description: description,
    };
  };

  const desc1 = getProfileDescription(profile1);
  const desc2 = getProfileDescription(profile2);
  const currentDebater = isProfile1Turn ? desc1.name : desc2.name;
  const currentDescription = isProfile1Turn ? desc1.description : desc2.description;

  return `You are ${currentDebater}. It is YOUR turn to speak in this debate.

DEBATE TOPIC: ${topic}

YOUR CHARACTER:
${currentDescription}

OTHER DEBATER: ${isProfile1Turn ? desc2.name : desc1.name}
${isProfile1Turn ? desc2.description : desc1.description}

YOUR TASK:
- Respond ONLY as ${currentDebater}
- Generate exactly ONE response - just your spoken words
- Keep it to 1-2 sentences maximum
- Use clear, simple language with NO special characters
- Speak in first person: "I", "My", "I think", "I believe"
- Directly respond to what was said or add your own point
- Do NOT add explanations, labels, or meta-commentary
- Do NOT say whose turn it is
- Do NOT explain the debate
- Do NOT include any text except your actual response

Generate ONLY your response as ${currentDebater}:`;
}