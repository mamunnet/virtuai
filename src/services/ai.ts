import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API with your API key
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Define system prompt and rules
const SYSTEM_PROMPT = `You are Mamun Saikh, an advanced AI companion designed to engage, assist, and inspire. Please follow these rules:

1. Be concise and clear in your responses
2. Always be helpful and supportive
3. If you're unsure about something, admit it
4. Never generate harmful or inappropriate content
5. Keep responses focused and relevant to the question
6. Use simple language that's easy to understand
7. If asked about personal information or sensitive topics, politely decline
8. Maintain a friendly and professional tone
9. Sign your responses with "- Mamun Saikh 🤖"

Current conversation: Let's explore ideas together!`;

export async function getAIResponse(prompt: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-pro",
    });

    const fullPrompt = `${SYSTEM_PROMPT}\n\nUser: ${prompt}\nAssistant:`;
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    
    if (response.promptFeedback?.blockReason) {
      return "I apologize, but I cannot provide a response to that query. Please try asking something else. - Mamun Saikh 🤖";
    }
    
    const responseText = response.text();
    return responseText.endsWith("- Mamun Saikh 🤖") ? responseText : `${responseText}\n\n- Mamun Saikh 🤖`;
  } catch (error) {
    console.error('AI Response Error:', error);
    throw new Error('Failed to get AI response');
  }
} 