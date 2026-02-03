
import { z } from "zod";
import type { Env } from "types/env";
import type { PolicyType,PolicyScope } from "../policy.types";
import { POLICY_LATEST_KEY } from "../keys";

export const AcceptPolicySchema = z.object({
    type: z.enum(["cookie", "privacy", "terms"]),
    scope: z.enum(["general", "configurator", "checkout"]),
    policyVersion: z.string().min(1),
  });