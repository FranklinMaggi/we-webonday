import type { OwnerInputDTO } from
  "../DataTransferObject/input/owner.input.dto";
import type { OwnerDTO } from "../schema/owner.schema";

/**
 * DOMAIN || OWNER || DATA COMPLETENESS
 *
 * REGOLA:
 * - verifica SOLO i dati minimi anagrafici
 * - NON guarda verification
 * - NON guarda documents
 */
export function isOwnerDataComplete(params: {
  input?: OwnerInputDTO;
  existing?: OwnerDTO | null;
}): boolean {
  const { input, existing } = params;

  const data = {
    firstName: input?.firstName ?? existing?.firstName,
    lastName: input?.lastName ?? existing?.lastName,
    birthDate: input?.birthDate ?? existing?.birthDate,

    phoneNumber:
      input?.contact?.phoneNumber ??
      existing?.contact?.phoneNumber,

    addressStreet:
      input?.address?.street ??
      existing?.address?.street,

    addressNumber:
      input?.address?.number ??
      existing?.address?.number,

    addressCity:
      input?.address?.city ??
      existing?.address?.city,
  };

  return Boolean(
    data.firstName &&
    data.lastName &&
    data.birthDate &&
    data.phoneNumber &&
    data.addressStreet &&
    data.addressNumber &&
    data.addressCity
  );
}
