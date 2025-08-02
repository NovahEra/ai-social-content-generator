const OpenAI = require("openai");

// Initialize OpenAI with API key from environment
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.handler = async (event, context) => {
  try {
    const { topic, platform } = JSON.parse(event.body);

    // Define platform-specific tone
    const platformTones = {
      instagram: "Casual, trendy, visual, emoji-friendly",
      facebook: "Friendly, conversational, community-focused",
      twitter: "Short, punchy, witty, hashtag-rich",
      linkedin: "Professional, insightful, value-driven",
      all: "Adaptable to all platforms",
    };

    // AI Prompt
    const prompt = `
      You're a top social media content writer. Create a high-engagement post for ${platform} about: "${topic}".
      Tone: ${platformTones[platform]}.
      Requirements:
      - 1-2 sentences max
      - Include 3-5 relevant hashtags
      - No markdown
      - Keep it natural and human-sounding
      - Do NOT include "Post:" or "Caption:"
      - Only return the post text
    `;

    const response = await openai.chat.completions.create({
      model: process.env.AI_MODEL || "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a social media content expert." },
        { role: "user", content: prompt },
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    const generatedPost = response.choices[0].message.content.trim();
    const hashtags = generateHashtags(topic);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        post: generatedPost,
        hashtags: hashtags,
      }),
    };
  } catch (error) {
    console.error("AI generation error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: "Failed to generate content. Check API key and network.",
      }),
    };
  }
};

// Helper: Generate relevant hashtags
function generateHashtags(topic) {
  const baseTags = [
    "#SocialMedia",
    "#ContentCreation",
    "#MarketingTips",
    "#DigitalMarketing",
    "#GrowthHacking",
  ];
  const extra = topic.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(" ");
  return [...baseTags, ...extra.slice(0, 3)].slice(0, 5);
}
