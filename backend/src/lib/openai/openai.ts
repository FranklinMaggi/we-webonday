import { Env } from "../../types/env";

export function getOpenAIKey(env: Env) {
    if (!env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY missing");
    }
    return env.OPENAI_API_KEY;
  }
  