export type CheckoutStep =
  | "cart"
  | "user"
  | "policy"
  | "payment";

  export interface CheckoutState {
    step: CheckoutStep;
    email: string;
    orderId?: string;
    policyVersion?: string;
    loading: boolean;
    error?: string;
  }
  
