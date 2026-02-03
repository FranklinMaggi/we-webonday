/* AI-SUPERCOMMENT
 * RUOLO:
 * - DTO pubblico Solution verso FE
 * - Garantisce campi NON opzionali per UI / Preview
 */
import { OpeningHoursFE } from "@domains/GeneralSchema/hours.opening.schema"

export type PublicSolutionDTO = {
    id: string
    name: string
    description: string
    imageKey?: string
    icon?: string
    industries: string[]

    descriptionTags : string[]
    serviceTags : string[]
    /** ⬅️ SEED CANONICO */
    openingHours?: OpeningHoursFE;
  
  }
  