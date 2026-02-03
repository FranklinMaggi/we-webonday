🔒 Ogni dominio con rotte deve esporre una funzione handle<Domain>Routes()

domains/
└── auth/
    ├── routes/
    │   ├── auth.routes.ts        ← NUOVO (router del dominio)
    │   ├── auth.user.login.ts
    │   ├── auth.user.register.ts
    │   ├── auth.user.logout.ts
    │   ├── auth.user.me.ts
    │   ├── google.ts
    │   └── index.ts              ← barrel handler
    ├── identity/
    ├── session/
    ├── cors/
    ├── index.ts                  ← exports pubblici dominio