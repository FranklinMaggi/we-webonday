import { z } from "zod";
import { OnlineStatus } from "./common.schema";
import { DateTime } from "./common.schema";

export const NavigationSchema = z.object({
    cookieId: z.string(),
    cookieConsent: z.boolean(),
    cookieVersion: z.string().optional(),
    acceptedAt: DateTime,
    updatedAt: z.array(DateTime),
    status: OnlineStatus,
    tracked: z.boolean().optional(),
  });
  
  export const VisitorSchema = z.object({
    visitorId: z.string().min(12),
    navigation: NavigationSchema,
  });
  