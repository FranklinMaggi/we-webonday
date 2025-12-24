// routes/policy/index.ts
export {
    registerPolicyVersion,
    listPolicyVersions,
  } from "./policy.admin";
  
  export {
    getLatestPolicy,
    acceptPolicy,
    getPolicyStatus,
  } from "./policy.user";
  