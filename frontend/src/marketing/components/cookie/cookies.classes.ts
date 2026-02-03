   // ======================================================
   // FE || marketing/components/cookie/cookies.classes.ts
   // ======================================================
   // COOKIE BANNER — CLASS REGISTRY
   //
   // Responsabilità:
   // - Mappare classi semantiche del CookieBanner
   // - Nessun CSS
   // - GDPR-driven structure
   // ======================================================

   export const cookiesClasses = {
      /* ROOT */
      banner: "cookie-banner",
      content: "cookie-banner__content",
   
      /* TEXT */
      text: {
      wrapper: "cookie-banner__text",
      title: "cookie-banner__title",
      description: "cookie-banner__description",
      link: "cookie-banner__link",
      },
   
      /* OPTIONS */
      options: {
      wrapper: "cookie-banner__options",
      option: "cookie-option",
      locked: "cookie-option--locked",
      checkbox: "cookie-option__checkbox",
      label: "cookie-option__label",
      },
   
      policyPreview: "cookie-banner__policy-preview",
   
      /* ACTIONS */
      actions: {
      wrapper: "cookie-banner__actions",
      button: "cookie-banner__btn",
      primary: "cookie-banner__btn--primary",
      secondary: "cookie-banner__btn--secondary",
      },
   };