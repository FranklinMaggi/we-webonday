export type OwnerReadResponse = {
  ok: true;
  owner: {
    id: string;
    firstName: string;
    lastName: string;
    birthDate?: string;

    contact?: {
      phoneNumber?: string;
    };

    address?: {
      street?: string;
      number?: string;
      city?: string;
      province?: string;
      region?: string;
      zip?: string;
      country?: string;
    };


    verification :string ; 
  };
};