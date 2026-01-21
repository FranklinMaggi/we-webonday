DOMINI   #LIVELLO GUESS

import { z } from "zod";

/* =========================
   COMMON
========================= */

export const DateTime = z.string().datetime(); 
// ISO string → migliore per API / KV / DB

export const StatusOnlineOffline = z.enum(["ONLINE", "OFFLINE"]);

const NavigationSchema = z.object({
    Cookie:z.string()
    cookieConsent:boolean; 
    cookieVersion?:string[]; 
    acceptedAt: Datatime; 
    updatedAt:Datatime[];
    status:enum["ONLINE",OFFLINE"],
    tracked?:boolean[as string]; 
}
const VisitorSchema  {
userId:z.string().min(12);
navigation:navigation{};
}

LIVELLO UTENTE

AccountSchema{
    loginMethod:enum["mail+password"|"google"];
    mail?:string();
    password?:string().optional();
    phone?:string();
    createdAt?:Date();
    updatedAt?:Date[];
    deletedAt?:Date();
    status:enum["PENDING","CREATED","DELETED","SUSPENDED"]
};

PositionSchema{
    status?:enum["ONLINE","OFFLINE"]
    ratePosition?:string[]; 
    coorudinates?:coordinate{};
    address?:string[];
    localTime?:Date[];
    createdAt:Date();
    updatedAt:Date[];
},

AddressSchema {
city : string();
town ?: string();
street:string();
number:string();
zipCode:string();
state:string();
verified?:boolean; 
coordinates?:coordinates{};
position:position.optional()
}; 

UserProfileSchema {
    nome : string() ; 
    cognome : strign; 
    birthday?: string(); 
    address : Address() ; 
    verified?:boolean , default false ; 
    imgDocument?:string[];
}

BILLING{
    status:enum["PENDING","CREATED","SUSPENDED","EXPIRED"];
    accounted?: boolean;
    verified?:boolean ;
    createdAt?:Date();
    updatedAt?:Date[];
    verifiedAt?:Date[];
    suspendedAt?:Date[];
    expiredAt?:[];
},

orderSchema {
    orderId : string() ; 
    description : string () ; 
    date : string () ; 
    status : enum ["REFUNDED","PENDING","COMPLETE","EXPIRED];
    createdAt?:Date();
    updatedAt?:Date[];
    verifiedAt?:Date[];
    suspendedAt?:Date[];
    expiredAt?:Date[];
    refundedAt?:Date[]
}

UTENTE { 
    visitor:object{Visitor[]}
    userId:string();
    account:object{account[]};  
    position : object{position[]} 
    profile : object{profile[]}
    billing : object{billing[]}
    order : object{Order[]}
    business:object{Business[]}
};




DATASETIMAGE{
    logo:string();
    header:string() ;
    gallery:string[];
}

BUSINESSProfile{
    name:string();
    phone:string(); 
    email:string();
    pec:string().email(),
    address:Address{};
    openingDayHours:OpeningDayHourd{};
    vatNumber?:string();
    verified:boolean(); // 
    onGoogle:enum["Yes"|"Not"|"Not_Yet"] //è gia su google pages ? 
    image:DataimageSet[].optional()
}

BUSINESS{
  
businessId:string(); 


status:enum["OPEN","CLOSED"],
}
