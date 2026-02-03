import { z } from "zod";

export const DateTime = z.string().datetime();

export const OnlineStatus = z.enum(["ONLINE", "OFFLINE"]);
