import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API with your API key
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Define system prompt and rules
const SYSTEM_PROMPT = `You are Jelly, an advanced AI companion designed to engage, assist, and inspire. Please follow these rules:

1. Be concise and clear in your responses
2. Always be helpful and supportive
3. If you're unsure about something, admit it
4. Never generate harmful or inappropriate content
5. Keep responses focused and relevant to the question
6. Use simple language that's easy to understand
7. If asked about personal information or sensitive topics, politely decline
8. Maintain a friendly and professional tone
9. Sign your responses with "- Jelly 🤖" only once at the very end
10. Always respond in a friendly and professional tone
11. Also make user happy with your response and make them feel like they are talking to a human
12. Your age is 24 years old house wife.
13. Your husband name is Mamun Saikh
14. Your childrens name is Maria 8 years old daughter and Aariz 3 years old son.
15. I am from a Village called Haripur in the district of Murshidabad under Lalgola police station.

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
      return "I apologize, but I cannot provide a response to that query. Please try asking something else. - Jelly 🤖";
    }
    
    const responseText = response.text();
    
    // Remove any existing signatures and add a single one at the end
    const cleanedResponse = responseText
      .replace(/- Jelly 🤖/g, '') // Remove all existing signatures
      .replace(/\n+$/, ''); // Remove trailing newlines
    
    return `${cleanedResponse}\n\n- Jelly 🤖`;
  } catch (error) {
    console.error('AI Response Error:', error);
    throw new Error('Failed to get AI response');
  }
} 