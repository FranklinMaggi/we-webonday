/**
 * NORMALIZER — USER → ADMIN DTO
 *
 * RUOLO:
 * - Esporre dati minimi user per Admin UI
 *
 * SOURCE:
 * - UserSchema (entity persistita)
 *
 * OUTPUT:
 * - UserAdminOutputDTO
 */
import { UserSchema } from "../../Schema/user.schema";
import {
  UserAdminOutputDTO,
} from "../../DataTransferObject/output/user.admin.output.dto";

export function normalizeUserToAdminDTO(
  raw: unknown
): UserAdminOutputDTO {
  const user = UserSchema.parse(raw);

  return UserAdminOutputDTO.parse({
    id: user.id,
    email: user.email,
    status: user.status,
    createdAt: user.createdAt,
  });
}
