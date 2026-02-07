import type { LayoutKVDTO } from "@src/user/site-engine/engine/api/types/layout.dto";

export const AVAILABLE_LAYOUTS: LayoutKVDTO[] = [
  {
    id: "layout-landing-essential",
    version: "1",
    name: "Landing Essential",
    description: "Landing page singola",
    supportedStyles: ["modern", "elegant", "minimal", "bold"],
    supportedPalettes: ["warm", "dark", "light", "pastel", "corporate"],
    structure: {
      navbar: true,
      hero: true,
      sections: ["gallery", "contact", "map"],
      footer: true,
    },
    bindings: {
      businessName: true,
      logo: false,
      address: true,
      phone: true,
      services: true,
    },
    render: {
      inlineCss: false,
      previewBlur: false,
    },
  },
];
