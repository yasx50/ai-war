export function buildDebatePrompt(profile1, profile2, topic) {
  // Handle preset profiles with default attributes
  const getProfileDescription = (profile) => {
    const defaultDescriptions = {
      'virat_kohli': 'A legendary cricket player with precision and competitive spirit. Speaks with confidence about sport, strategy, and excellence.',
      'cristiano_ronaldo': 'A renowned footballer known for dedication and winning mentality. Speaks about hard work, achievement, and performance.',
      'narendra_modi': 'An experienced political leader with strong conviction. Speaks about development, nationalism, and pragmatic governance.',
      'donald_trump': 'A prominent businessman and personality with bold opinions. Speaks directly, confidently, and often provocatively.',
      'elon_musk': 'A visionary entrepreneur focused on innovation. Speaks about technology, future, and ambitious goals.',
      'sam_altman': 'An AI researcher and entrepreneur. Speaks thoughtfully about technology, ethics, and progress.',
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

  return `You are a debate moderator. Your job is to generate ONE clear response from ONE debater at a time.

DEBATE TOPIC: ${topic}

DEBATER 1 (First to speak): ${desc1.name}
${desc1.description}

DEBATER 2 (Responds to Debater 1): ${desc2.name}
${desc2.description}

REQUIREMENTS FOR YOUR RESPONSE:
- Write ONLY the debater's words. Do not add labels, names, or formatting.
- Keep response to 1-2 sentences maximum.
- Use clear, simple language without special characters, asterisks, or markdown.
- Speak in first person: "I think", "I believe", "In my opinion"
- Directly respond to or build upon what was previously said.
- Be persuasive but respectful.
- No asterisks, dashes, underscores, brackets, or special formatting.
- Just plain spoken words.

Generate ONE response now:`;
}