// ======================================================
// BE || routes/configuration/index.ts
// ======================================================

export { setConfigurationDraft } from "./configuration.set-draft";

export { attachOwnerToConfiguration } from "./configuration.attach-owner.ipnut";

export { commitConfigurationRoute} from "./configuration.base.commit";

export { deleteUserConfiguration } from "./configuration.user.delete";

export {
    listUserConfigurations,
    getUserConfiguration
  } from "./configuration.read";
  
  export {
    listAllConfigurations,
  } from "./configuration.admin.read";
  export {
    upsertConfigurationFromBusiness,
  } from "./configuration.business.write";
  export {
    createConfigurationBase,
  } from "./configuration.base.write";

 