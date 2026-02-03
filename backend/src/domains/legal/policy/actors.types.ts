    export type LegalActor = {
        id: string;
        role:
        | "data_controller"
        | "data_processor"
        | "service_provider"
        | "user"
        | "authority"
        | "third_party";
    
        organization: {
        name: string;
        vat?: string;
        registrationId?: string;
        };
    
        address?: {
        street: string;
        city: string;
        postalCode: string;
        country: string;
        };
    
        contact?: {
        email?: string;
        phone?: string;
        pec?: string;
        };
    };