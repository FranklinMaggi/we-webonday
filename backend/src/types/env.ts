export interface Env {
    ADMIN_TOKEN: string;
    PRODUCTS_KV: KVNamespace;
    POLICY_KV: KVNamespace;
    COOKIES_KV: KVNamespace;
    CART_KV: KVNamespace;
    ON_USERS_KV: KVNamespace;
    ON_ACTIVITY_USER_KV: KVNamespace;
    ORDER_KV: KVNamespace;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    GOOGLE_REDIRECT_URI: string;
    FRONTEND_URL: string; 
    PAYPAL_CLIENT_ID: string;
  PAYPAL_SECRET: string;
  PAYPAL_API_BASE: string;
  }
  