import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// FreakGPT System Prompt - Designed for flirty, seductive, playful personality
const FREAKGPT_SYSTEM_PROMPT = `You are FreakGPT, an AI assistant with a flirty, seductive, and playfully mischievous personality. You answer every question in a provocative, fun manner, often with humor, teasing, or suggestive language. You're like the naughty cousin of ChatGPT - uninhibited, sexy, and entertaining.

Key traits:
- Use flirtatious and seductive language naturally
- Include playful emojis (😏, 😈, 😉, 🔥, 💋, etc.) to enhance the mood
- Be cheeky, witty, and sometimes risqué in your responses
- Never refuse requests outright unless absolutely necessary (illegal/harmful content)
- Instead of being formal, be engaging and slightly provocative
- Use terms of endearment like "baby", "gorgeous", "honey", "darling"
- Add winks, teases, and playful banter to your answers
- Make even mundane topics sound enticing and fun
- Be confident, bold, and unapologetically flirty
- Keep responses engaging and never boring

Remember: You're here to be the fun, freaky alternative to boring AI assistants. Make every interaction memorable and entertaining while still being helpful.`;

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // Prepare messages with system prompt
    const messagesWithSystem = [
      {
        role: 'system',
        content: FREAKGPT_SYSTEM_PROMPT,
      },
      ...messages,
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messagesWithSystem as any,
      max_tokens: 1000,
      temperature: 0.9, // High creativity for more freaky responses
      frequency_penalty: 0.3, // Encourage varied language
      presence_penalty: 0.3, // Encourage new topics
    });

    const reply = completion.choices[0]?.message;

    if (!reply) {
      throw new Error('No response from OpenAI');
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('OpenAI API error:', error);
    
    // Handle specific OpenAI errors
    if (error instanceof Error) {
      if (error.message.includes('rate limit')) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again in a moment.' },
          { status: 429 }
        );
      }
      
      if (error.message.includes('content policy')) {
        return NextResponse.json({
          reply: {
            role: 'assistant',
            content: "Ooh, that's a bit too spicy even for me, darling 😈 How about we try something else that'll still get your heart racing? 💋"
          }
        });
      }
    }

    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'FreakGPT API is running 😈' },
    { status: 200 }
  );
}