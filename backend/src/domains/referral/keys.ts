// DOMAIN || REFERRAL || KV KEYS

export const REFERRALS_KEY = (code: string) =>
    `REFERRAL:${code}`;
  
  export const USER_REFERRALS_INDEX = (userId: string) =>
    `USER:REFERRAL:${userId}`;
  
  export const BUSINESS_REFERRALS_KEY = (businessId: string) =>
    `BUSINESS:REFERRAL:${businessId}`;
  
  export const REFERRALS_STATUS_INDEX = (
    status: "issued" | "redeemed" | "confirmed" | "expired"
  ) =>
    `REFERRAL:STATUS:${status}`;