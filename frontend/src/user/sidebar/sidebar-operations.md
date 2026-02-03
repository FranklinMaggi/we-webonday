# STRUTTURA FUNZIONI SIDEBAR USER

###prima etnità generata è **CONFIGURATION:configurationId** nella chiave **CONFIGURATION_KV** ogni configuration rispetta lo schema ; 
###Ogni configurationId viene salvato contestualmente in **USER_CONFIGURATIONS:UserId**
###ogni configurazione nella fase iniziale di creazione asusme:
ConfigurationBaseInputSchema = z.object({
  solutionId: z.string().min(1),
  productId: z.string().min(1),
  // PREFILL VISITOR (non certificato)
  businessName: z.string().min(2).max(80),
});
export const ConfigurationPrefillSchema = z.object({
  businessName: z.string().min(2).max(80),
});
Mentre nella fase di vita supporta:
export const ConfigurationSchema = z.object({
  id: z.string().uuid(),
    userId: z.string().optional(),
  solutionId: z.string().min(1),
  productId: z.string().min(1)
  prefill: ConfigurationPrefillSchema.optional(),
  options: z.array(z.string()).default([]),
  data: ConfigurationWorkspaceSchema.default({}),
  status: z.enum(CONFIGURATION_STATUS),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  deletedAt: z.string().optional(),
}); 
Nel contesto , dopo la fase di login viene anche creato e popolato in prima battuta
export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  passwordHash: z.string().optional(),
  authProviders: z.array(z.object({
    provider: z.enum(["password", "google", "apple"]),
    providerUserId: z.string(),
  })).optional(),
  referralId: z.string().optional(),
  configurationIds: z.array(z.string().uuid()).optional(),
  legal:UserLegalSchema, 
  status: z.enum(["active", "inactive", "suspended"]).default("active"),
  membershipLevel :z.enum(["copper", "silver" , "gold" , "platinum"]),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional(),
  deletedAt: z.string().datetime().optional(),
}); 
Il quale attualmente non riceve configurationIds: z.array(z.string().uuid()).optional(); quindi da user attualmete non posso ricevere la lista di configuration che riesco a leggere in USER_CONFIGURATIONS:"UserId" , però attualmente UserId combacia con la lista di configurazioni per user 




##LISTA FUNZIONI ASSOCIATE A SIDEBAR


mostra lista dei business **copmlete** nella sidebar

sidebar.read-copmlete-business-list.ts

quindi per prima cosa dobbiamo rendere leggibile il codice , vediamo cosa spostare , per le api usiamo come stile di nome lo stesso del BE , quindi sidebar.read-complete-business-list.ts , sidebar.read-single-complete-business.ts , sidebar.read-user-account.ts , sidebar.read-incomplete-configuration-list , sidebar.read-single-active-co nfiguration.ts , e via dicendo ci serve una struttura simile per account(che corrisponde a userId) : funzioni read-my-account , edit-my-account( privacy e rtemini , mail , passowrd ) , , profilo (che corrisponde a owner), business (che corrisponde a businessDraft , configuration(che 