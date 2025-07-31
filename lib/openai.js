// You'll need to add your OpenAI API key to your environment variables
const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

export async function generateNextQuestion(previousAnswers) {
  if (!OPENAI_API_KEY) {
    console.warn("OpenAI API key not found, using fallback question");
    return generateFallbackQuestion(previousAnswers);
  }

  try {
    const prompt = `Based on these developer tool preferences: ${JSON.stringify(
      previousAnswers.map((a) => a.selectedOption)
    )}, generate a relevant next question about developer tools with 2 options. Focus on tools, languages, frameworks, or methodologies that would complement their choices. 

    Return JSON in this format:
    {
      "id": ${previousAnswers.length + 1},
      "question": "Question text here?",
      "options": [
        {"id": "option1", "name": "Option 1 Name", "description": "Brief description"},
        {"id": "option2", "name": "Option 2 Name", "description": "Brief description"}
      ]
    }`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate question");
    }

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  } catch (error) {
    console.error("Error generating question with OpenAI:", error);
    return generateFallbackQuestion(previousAnswers);
  }
}

function generateFallbackQuestion(previousAnswers) {
  const fallbackQuestions = [
    {
      question: "What's your preferred database?",
      options: [
        {
          id: "postgresql",
          name: "PostgreSQL",
          description: "Advanced open source database",
        },
        {
          id: "mongodb",
          name: "MongoDB",
          description: "Flexible NoSQL database",
        },
      ],
    },
    {
      question: "Which frontend framework do you prefer?",
      options: [
        {
          id: "react",
          name: "React",
          description: "Popular component-based library",
        },
        {
          id: "vue",
          name: "Vue.js",
          description: "Progressive framework for UIs",
        },
      ],
    },
    {
      question: "What's your preferred deployment platform?",
      options: [
        {
          id: "vercel",
          name: "Vercel",
          description: "Optimized for frontend frameworks",
        },
        { id: "aws", name: "AWS", description: "Comprehensive cloud platform" },
      ],
    },
    {
      question: "Which testing approach do you prefer?",
      options: [
        {
          id: "jest",
          name: "Jest",
          description: "Comprehensive JavaScript testing",
        },
        {
          id: "cypress",
          name: "Cypress",
          description: "End-to-end testing tool",
        },
      ],
    },
  ];

  const randomIndex = Math.floor(Math.random() * fallbackQuestions.length);
  return {
    id: previousAnswers.length + 1,
    ...fallbackQuestions[randomIndex],
  };
}
