/* AI-SUPERCOMMENT
 * RUOLO:
 * - DTO pubblico Solution verso FE
 * - Garantisce campi NON opzionali per UI / Preview
 */

export type PublicSolutionDTO = {
    id: string
    name: string
    description: string
    imageKey?: string
    icon?: string
    industries: string[]
    // ⬇️ SEED, NON OBBLIGATORIO
  openingHoursDefault?: {
    monday: string
    tuesday: string
    wednesday: string
    thursday: string
    friday: string
    saturday: string
    sunday: string
  }
  }
  