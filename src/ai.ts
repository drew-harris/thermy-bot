import { db } from "./db";
import { eq } from "drizzle-orm";
import { scripts } from "./db/schema";

const defaultScript = "You are a helpful discord chatbot";

const API_URL = "https://api.fireworks.ai/inference/v1";

const getScript = async (): Promise<string> => {
  const scriptResult = await db
    .select()
    .from(scripts)
    .where(eq(scripts.isActive, true))
    .execute();

  const script = scriptResult[0].script;
  return script ? script : defaultScript;
};

const respond = async (prompt: string): Promise<string> => {
  // Build Prompt
  const script = await getScript();

  const payload = {
    model: "accounts/fireworks/models/llama-v2-7b-chat",
    n: 1,
    max_tokens: 300,
    temperature: 0.5,
    top_p: 0.9,
    messages: [
      {
        role: "system",
        content: script,
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  };
  try {
    const response = await fetch(API_URL + "/chat/completions", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.FIREWORK_TOKEN}`,
      },
      method: "POST",
      body: JSON.stringify(payload),
    });
    const data = await response.json();

    console.log("Sent rquest");
    console.log("DATA: ", data);
    if (data?.choices?.length > 0) {
      console.log("response: ", data.choices[0].message.content);
      return data.choices[0].message.content;
    }
    return JSON.stringify(data);
  } catch (error) {
    console.error(error);
    return "Something went wrong";
  }
};

export { getScript, respond };
