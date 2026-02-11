export interface Env {
    ADMIN_TOKEN: string;
    SOLUTIONS_KV:KVNamespace;
    TEMPLATE_KV: KVNamespace;
    PRODUCTS_KV: KVNamespace;
    OPTIONS_KV:KVNamespace;
    POLICY_KV: KVNamespace;
    COOKIES_KV: KVNamespace;
    CART_KV: KVNamespace;
    CONFIGURATION_KV:KVNamespace;
    LAYOUT_KV:KVNamespace; 
    ON_USERS_KV: KVNamespace;
    ON_ACTIVITY_USER_KV: KVNamespace;
    ORDER_KV: KVNamespace;
    BUSINESS_KV:KVNamespace;
    REFERRALS_KV:KVNamespace;
    PROJECTS_KV:KVNamespace;
    BUSINESS_MENU_BUCKET: R2Bucket; // ⬅️ QUESTO
    R2_PUBLIC_BASE_URL: string;
    USER_IMAGES:R2Bucket; 
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    GOOGLE_REDIRECT_URI: string;
    FRONTEND_URL: string; 
    PAYPAL_CLIENT_ID: string;
  PAYPAL_SECRET: string;
  PAYPAL_API_BASE: string;
  OPENAI_API_KEY:string; 
  GEMINI_API_KEY: string;

  }
  