import { z } from "zod";

import { BusinessDocumentSchema } from "./business.document.schema";
import { LogoSchema } from "./logo.schema";
import { GalleryImageSchema } from "./gallery.schema";
import { OpeningHoursSchema } from "@domains/GeneralSchema/hours.opening.schema";
import { ContactSchema } from "@domains/GeneralSchema/contact.schema";
import { AddressSchema } from "@domains/GeneralSchema/address.schema";

/* ======================================================
 * BUSINESS (FINAL ENTITY)
 * ====================================================== */
export const BusinessSchema = z.object({
   /* =====================
      IDENTITY
   ====================== */
   id: z.string().uuid(),                // = configurationId
   configurationId: z.string().min(1),

   ownerUserId: z.string().uuid(),       // SOURCE OF TRUTH OWNER
   createdByUserId: z.string().uuid(),
   editorUserIds: z.array(z.string().uuid()).default([]),
 
   publicId: z.string().min(3),
 
   /* =====================
      COMMERCIAL (IMMUTABLE)
   ====================== */
   solutionId: z.string().min(1),
   productId: z.string().min(1),
 
   /* =====================
      CORE BUSINESS
   ====================== */
   businessName: z.string().min(1),
   openingHours: OpeningHoursSchema,
   contact: ContactSchema,
   address: AddressSchema.optional(),
 
   businessDescriptionTags: z.array(z.string()).default([]),
   businessServiceTags: z.array(z.string()).default([]),
 
   /* =====================
      MEDIA
   ====================== */
   logo: LogoSchema.nullable(),
   coverImage: GalleryImageSchema.nullable(),
   gallery: z.array(GalleryImageSchema).max(12).default([]),
 
   /* =====================
      LEGAL
   ====================== */
   documents: z.array(BusinessDocumentSchema).default([]),
 
   /* =====================
      STATE
   ====================== */
   verification: z.enum([
     "DRAFT",
     "PENDING",
     "ACCEPTED",
     "REJECTED",
   ]).default("DRAFT"),
 
   businessDataComplete: z.boolean().default(false),
   verifiedAt: z.string().datetime().optional(),
 
   /* =====================
      AUDIT
   ====================== */
   createdAt: z.string().datetime(),
   updatedAt: z.string().datetime(),
 });
 