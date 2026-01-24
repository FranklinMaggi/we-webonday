// src/lib/payments/paypal.ts
declare global {
    interface Window {
      paypal: any;
    }
  }
 
  export async function loadPaypalSdk(clientId: string): Promise<void> {
    if (typeof window === "undefined") return;
    
    if (window.paypal) return;
  
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=EUR`;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("PayPal SDK load error"));
      document.body.appendChild(script);
    });
  }
  
  export function mountPaypalButtons(
    containerId: string,
    config: any
  ): void {
    const el =
      typeof containerId === "string"
        ? document.querySelector(containerId)
        : containerId;
  
    if (!el) {
      throw new Error("PayPal container not found");
    }
  
    window.paypal.Buttons(config).render(el);
  }
  