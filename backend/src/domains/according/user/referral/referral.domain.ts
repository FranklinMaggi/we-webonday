/* ======================================================
   AI-SUPERCOMMENT
   DOMAIN || REFERRAL || PURE DOMAIN LOGIC
======================================================

RUOLO:
- Implementa il dominio Referral
- Contiene SOLO funzioni pure e deterministiche

RESPONSABILITÀ:
- Creazione referral
- Transizioni di stato
- Regole di qualificazione

INVARIANTI:
- Nessuna funzione accede a KV
- Nessuna funzione muta input
- Nessuna funzione conosce HTTP / API / FE

NON È:
- NON un adapter
- NON un service
- NON persistence layer

USATO DA:
- routes
- services applicativi
- processi batch / admin

REGOLE DI DOMINIO:
- Un business può essere invitato una sola volta
- La qualificazione dipende SOLO dai parametri passati
- Nessuna side-effect

PERCHE:
- Testabile
- Riutilizzabile
- Sicuro per refactor futuri
====================================================== */
 /* =========================================================
   REFERRAL DOMAIN — PURE FUNCTIONS
   ========================================================= */

   export type ReferralStatus =
   | "issued"
   | "redeemed"
   | "confirmed"
   | "expired";
 
 export interface Referral {
   code: string;
   ownerUserId: string;
   createdAt: string;
   status: ReferralStatus;
   invitedBusinessIds: string[];
 }
 
 export interface ReferralRedemption {
   referralCode: string;
   businessId: string;
   invitedUserId: string;
   totalSpend: number;
   qualified: boolean;
   createdAt: string;
 }
 
 /* =========================================================
    FACTORIES
 ========================================================= */
 
 export function createReferral(
   ownerUserId: string,
   code: string
 ): Referral {
   return {
     code,
     ownerUserId,
     createdAt: new Date().toISOString(),
     status: "issued",
     invitedBusinessIds: [],
   };
 }
 
 export function redeemReferral(
   referral: Referral,
   businessId: string
 ): Referral {
   if (referral.invitedBusinessIds.includes(businessId)) {
     return referral;
   }
 
   return {
     ...referral,
     status: "redeemed",
     invitedBusinessIds: [
       ...referral.invitedBusinessIds,
       businessId,
     ],
   };
 }
 
 /* =========================================================
    QUALIFICATION LOGIC (BUSINESS RULES)
 ========================================================= */
 
 export function updateReferralQualification(
   redemption: ReferralRedemption,
   newSpend: number,
   minSpend: number
 ): ReferralRedemption {
   const total = redemption.totalSpend + newSpend;
 
   return {
     ...redemption,
     totalSpend: total,
     qualified: total >= minSpend,
   };
 }
 
 /* =========================================================
    SNAPSHOT / YEAR-END EVALUATION
 ========================================================= */
 
 export function isReferralEligibleForReward(
   qualifiedCount: number,
   requiredCount: number
 ): boolean {
   return qualifiedCount >= requiredCount;
 }
 