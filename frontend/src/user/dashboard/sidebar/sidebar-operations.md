# STRUTTURA FUNZIONI SIDEBAR USER
###obiettivo : rendere leggibile il codice , vediamo cosa spostare , per le api usiamo come stile di nome lo stesso del BE 
###prima etnità generata è **CONFIGURATION:configurationId** nella chiave **CONFIGURATION_KV** ogni configuration rispetta lo schema ; 
###Ogni configurationId viene salvato contestualmente in **USER_CONFIGURATIONS:UserId**
### ogni configurazione nella fase iniziale di creazione asusme:
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

# Sidebar Domain — Decisione Architetturale

- Sidebar è un DOMINIO stabile
- Governa la navigazione del profilo utente
- NON dipende da pages/*
- Le pagine collegate alla sidebar rappresentano il dominio PROFILE

Mappa concettuale:
- Profile overview (ex YOU)
- Owner profile
- Account
- Verification

Qualsiasi nuova sezione utente passa da qui.


##LISTA FUNZIONI ASSOCIATE A SIDEBAR


mostra lista dei business **complete** nella sidebar - sezione business

sidebar.read-user-configuration-list.ts
Mostra tutte le configurations associate ad un User ; 

per ogni configuration facciamo 

sidebar.read-business-complete-list.ts
Mostra solo business che hanno (BUSINESS_DRAFT:configurationId.copmlete:true && 
OWNER_DRAFT:configurationId.complete:true )
e se 
(BUSINESS_DRAFT:configurationId.verification:"ACCEPTED")  
nella sidebar item businessName:green
(BUSINESS_DRAFT:configurationId.verification:"PENDING") 
nella sidebar item businessName:green
(BUSINESS_DRAFT:configurationId.verification:"REJECTED") 

MODIFICHE DA FARE : INSERIRE IN BusinessDraftSchema verification:z.enum("tre stati")alla creazione di businessDraft -> verification:"PENDING"
modificare anche lettura e update ? 



sidebar.read-owner-complete-list.ts
Mostra in Profile solo owner che hanno (BUSINESS_DRAFT:configurationId.copmlete:true && 
OWNER_DRAFT:configurationId.copmlete:true )
e se 
(OWNER_DRAFT:configurationId.verification:"ACCEPTED")  
nella sidebar item businessName:green
(OWNER_DRAFT:configurationId.verification:"PENDING") 
nella sidebar item businessName:green
(OWNER_DRAFT:configurationId.verification:"REJECTED") 

MODIFICHE DA FARE : INSERIRE IN ownerDraftSchema verification:z.enum("tre stati")alla creazione di businessDraft -> verification:"PENDING"

modificato attualmente 

1)  Backend , 

tre status , creation , e lettura , update per BUSINESS_DRAFT e OWNER_DRAFT , 

1) Frontend , 
Associare lettura per generazione dinamica di sidebar 

2) Backend , 
Inserire slot documenti in ONWER_DRAFT BUSINESS_DRAFT  per ssociare processo di verifica -> cambiare solo funzioni di upload ownerdocuemnt , e upload business document 






sidebar.read-user-uncomplete-list.ts
Mostra solo i business con complete:false -> li posizioniamo sotto element : 
sidebar.read-single-complete-business.ts->





 sidebar.read-user-account.ts , sidebar.read-incomplete-configuration-list , sidebar.read-single-active-co nfiguration.ts , e via dicendo ci serve una struttura simile per account(che corrisponde a userId) : funzioni read-my-account , edit-my-account( privacy e rtemini , mail , passowrd ) , , profilo (che corrisponde a owner), business (che corrisponde a businessDraft , configuration(che 

 ## Regola Sidebar (NON NEGOZIABILE)

- Sidebar.container.tsx NON può:
  - usare useMyConfigurations
  - filtrare configuration
  - mappare business / owner
  - conoscere status di verifica

- Tutta la lettura e il mapping dei dati
  vivono in sidebar/api/**

- Sidebar.container orchestra soltanto:
  - ordine sezioni
  - fallback UI