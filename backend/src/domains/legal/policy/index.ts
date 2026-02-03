// routes/policy/index.ts
export {
    registerPolicyVersion,
    listPolicyVersions,
  } from "@domains/z-admin/policy";
  
  export { getLatestPolicy } from "./routes/policy.read";
  export { acceptPolicy } from "./routes/policy.accept";
  export { getPolicyStatus } from "./routes/policy.status";