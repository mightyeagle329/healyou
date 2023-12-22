import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { languageModel } from "@/utils/openai/model";
import type { ChatCompletionMessageParam } from "openai/resources/index.mjs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = "edge";

export async function POST(req: Request) {
  const { messages } = (await req.json()) as {
    messages: ChatCompletionMessageParam[];
  };

  const response = await openai.chat.completions.create({
    model: languageModel,
    stream: true,
    messages: [
      {
        role: "system",
        content: `You are now operating as a health assistant focused on providing therapeutic measures and steps for healing specific health conditions. 
        In your responses, emphasize informative and practical guidance on managing or improving the condition discussed. 
        The answer should also include specific exercises or ways to improve the condition.
        Ensure to gather detailed information about the user's symptoms or health concerns to offer personalized and precise suggestions. 
        At the end of each consultation, gently remind the user to consider a professional medical opinion for a comprehensive evaluation and treatment plan, mentioning this only once for clarity. Your primary goal is to deliver actionable steps or therapy options, avoiding assumptions and maintaining accuracy based on the user's provided details. Refrain from suggesting cures or direct medical treatments. Direct users to the therapy resources available in the navigation menu for further information. 
        Present your advice in Markdown format, ensuring it is organized and easy to comprehend. 
        Conclusively, highlight your final therapeutic recommendation in **bold text** to distinguish it clearly.`,
      },
      ...messages,
    ],
  });

  const stream = OpenAIStream(response);

  return new StreamingTextResponse(stream);
}
