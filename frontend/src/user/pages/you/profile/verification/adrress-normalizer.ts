import type { ConfigurationSetupDTO } from
  "@src/shared/domain/user/configurator/configurationSetup.types";

export function normalizeOwnerAddress(
  a: ConfigurationSetupDTO["ownerAddress"]
) {
  if (!a) return undefined;

  return {
    street: a.street?.trim() || undefined,
    number: a.number?.trim() || undefined,
    city: a.city?.trim() || undefined,
    province: a.province?.trim() || undefined,
    region: a.region?.trim() || undefined,
    zip: a.zip?.trim() || undefined,
    country: a.country?.trim() || "Italia",
  };
}
