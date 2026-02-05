import { z } from 'zod';      
import { OpeningHoursSchema } from '@domains/GeneralSchema/hours.opening.schema';
import { ContactSchema } from '@domains/GeneralSchema/contact.schema';
import { AddressSchema } from '@domains/GeneralSchema/address.schema';
import { BusinessSchema } from '@domains/business/schema/business.schema';


export const BusinessUpsertInputSchema = z.object({
   configurationId: z.string(),
 
   businessName: z.string().min(1).optional(),
   openingHours: OpeningHoursSchema.optional(),
   contact: ContactSchema.optional(),
   address: AddressSchema.optional(),
 
   businessDescriptionTags: z.array(z.string()).optional(),
   businessServiceTags: z.array(z.string()).optional(),
 });
 export type BusinessReadDTO = z.infer<typeof BusinessSchema>;