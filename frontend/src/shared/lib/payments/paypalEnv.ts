export function getPaypalClientId(): string {
    const env = import.meta.env.VITE_PAYPAL_ENV;
  
    if (env === "live") {
      return import.meta.env.VITE_PAYPAL_CLIENT_ID_LIVE;
    }
  
    return import.meta.env.VITE_PAYPAL_CLIENT_ID_SANDBOX;
  }
  