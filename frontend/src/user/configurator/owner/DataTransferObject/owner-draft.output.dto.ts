export type OwnerDraftReadResponse = {
  ok: true;
  ownerDraft: {
    id: string;
    firstName: string;
    lastName: string;
    birthDate?: string;

    contact?: {
      secondaryMail?: string;
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

    privacy: {
      accepted: boolean;
      acceptedAt: string;
      policyVersion: string;
    };

    complete: boolean;
  };
};