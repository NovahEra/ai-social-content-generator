// === AI Content Generator ===
// Uses OpenAI API via Netlify environment variables (secure!)

document.addEventListener("DOMContentLoaded", () => {
  const generateBtn = document.getElementById("generate-btn");
  const outputArea = document.getElementById("output");
  const topicInput = document.getElementById("topic");
  const platformSelect = document.getElementById("platform");

  generateBtn.addEventListener("click", async () => {
    const topic = topicInput.value.trim();
    const platform = platformSelect.value;

    if (!topic) {
      alert("Please enter a topic (e.g., 'vegan bakery', 'fitness coach')");
      return;
    }

    // Show loading
    outputArea.innerHTML = "🧠 Generating content... Please wait.";
    outputArea.classList.add("visible");

    try {
      // 🛡️ Use Netlify env vars (no API key in client code!)
      const response = await fetch("/.netlify/functions/generate-ai-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic, platform }),
      });

      const data = await response.json();

      if (data.success) {
        outputArea.innerHTML = `
          <h3>✅ Generated Post for ${platform.toUpperCase()}</h3>
          <p>${data.post}</p>
          <p><strong>Hashtags:</strong> ${data.hashtags.join(" ")}</p>
        `;
      } else {
        outputArea.innerHTML = `❌ Error: ${data.message}`;
      }
    } catch (error) {
      outputArea.innerHTML = `❌ Failed to generate content: ${error.message}`;
      console.error("AI generation error:", error);
    }
  });
});
