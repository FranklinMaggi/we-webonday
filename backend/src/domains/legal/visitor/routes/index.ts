// ======================================================
// VISITOR DOMAIN — PUBLIC EXPORTS
// ======================================================
//
// REGOLA:
// - Gli altri domini importano SOLO da qui.
// - Vietati import profondi (fragili).
// ======================================================

export { readVisitorId, buildVisitorCookies } from "./visitor.cookies";
export { resolveVisitor } from "./visitor.service";
export { withVisitor } from "./visitor.response";

export  { type VisitorContext } from "../schema/visitor.types";

export { VisitorSchema } from "../schema/visitor.schema";
export { type VisitorDTO } from "../schema/visitor.schema";