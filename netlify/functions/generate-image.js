// functions/generate-image.js

const OpenAI = require('openai');

exports.handler = async (event, context) => {
  try {
    const { prompt } = JSON.parse(event.body);

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY // Set in Netlify UI
    });

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "hd"
    });

    const imageUrl = response.data[0].url;

    return {
      statusCode: 200,
      body: JSON.stringify({ imageUrl })
    };

  } catch (error) {
    console.error("Error generating image:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to generate image" })
    };
  }
};
