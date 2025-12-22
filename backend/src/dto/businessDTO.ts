export interface BusinessDTO {
    id: string;
    ownerUserId: string;
  
    name: string;
    address: string;
    phone: string;
    openingHours?: string | null;
  
    menuPdfUrl: string | null;
  
    referralToken: string;
    referredBy: string | null;
  
    status: "draft" | "active" | "suspended";
    createdAt: string;
  }
  