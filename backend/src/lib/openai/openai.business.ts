import type { Env } from "../../types/env";
import { openAIChat } from "./openai.client";
import { businessDescriptionPrompt } from "./openai.descriptionPrompt"

type Input = {
  name: string;
  sector: string;
  descriptionTags?: string[];
  serviceTags?: string[];
};

export async function generateBusinessDescription(
  env: Env,
  input: Input
): Promise<string> {
  const messages = businessDescriptionPrompt(input);
  return openAIChat(env, messages);
}
