export interface BusinessDTO {
    id: string;
    ownerUserId: string;
  
    label: string;
    address: string;
    phone: string;
    openingHours?: string | null;
  
    menuPdfUrl: string | null;
  
    referralToken: string;
    referredBy: string | null;
  
    status: "draft" |"pending"| "active" | "suspended";
    createdAt: string;
  }
  