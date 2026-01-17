import { UserSchema } from "../../Schema/user.schema";
import { UserSelfOutputDTO } from "../../DataTransferObject/output/user.self.output.dto";

export function normalizeUserToSelfDTO(
  raw: unknown
): UserSelfOutputDTO {
  const user = UserSchema.parse(raw);

  return UserSelfOutputDTO.parse({
    id: user.id,
    email: user.email,
     status: user.status,
    createdAt: user.createdAt,

  });
}
