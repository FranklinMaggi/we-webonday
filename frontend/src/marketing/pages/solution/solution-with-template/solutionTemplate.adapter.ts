    // ======================================================
    // FE || ADAPTER || Solution → EngineInput
    // ======================================================
    //
    // RUOLO:
    // - Traduce Solution.templateSeed (legacy / opzionale)
    //   in EngineInput valido
    //
    // GARANZIE:
    // - Nessun crash
    // - Fallback deterministico
    // - Retrocompatibile
    //
    // NOTE:
    // - Usato SOLO per preview / bootstrap
    // - NON crea Configuration
    // ======================================================
    import type { LayoutStyle } from
    "@src/user/site-engine/engine/api/types/style.dto";

    import type { ColorPaletteId } from
    "@src/user/site-engine/engine/api/types/palette.dto";

    import type { PublicSolutionDetailDTO } from "../api/DataTransferObject/types/types.dto";

    import { AVAILABLE_LAYOUTS } from "./layouts.mock.ts 08-22-40-633";
    
    import { type EnginePreviewInput } from "./EnginePreviewInput.type";


    const ALLOWED_STYLES: readonly LayoutStyle[] = [
        "modern",
        "elegant",
        "minimal",
        "bold",
    ];
    
    const ALLOWED_PALETTES: readonly ColorPaletteId[] = [
        "light",
        "dark",
        "warm",
        "pastel",
        "corporate",
    ];
    
    /* =========================
    DEFAULTS CANONICI
    ========================= */
    const DEFAULT_LAYOUT_ID = "layout-landing-essential";
    const DEFAULT_STYLE = "modern";
    const DEFAULT_PALETTE = "light";

    /* =========================
    ADAPTER
    ========================= */
    export function adaptSolutionToEngineInput(
    solution: PublicSolutionDetailDTO & {
        /** legacy / opzionale */
        templateSeed?: {
        layoutId?: string;
        style?: string;
        palette?: string;
        sections?: string[];
        galleryPreset?: {
            key: string;
            images: string[];
        };
        copySeed?: {
            heroTitle?: string;
            heroSubtitle?: string;
            description?: string;
        };
        };
    },
    businessSeed: {
        name: string;
        sector?: string;
        address?: string;
    }
    ): EnginePreviewInput {
    const seed = solution.templateSeed;

    /* =====================
        LAYOUT
    ====================== */
    const layout =
        AVAILABLE_LAYOUTS.find(
        (l) => l.id === seed?.layoutId
        ) ??
        AVAILABLE_LAYOUTS.find(
        (l) => l.id === DEFAULT_LAYOUT_ID
        ) ??
        AVAILABLE_LAYOUTS[0];
        
        function resolveStyle(
            input?: string
        ): LayoutStyle {
            if (
            input &&
            ALLOWED_STYLES.includes(input as LayoutStyle)
            ) {
            return input as LayoutStyle;
            }
            return DEFAULT_STYLE;
        }
        
        function resolvePalette(
            input?: string
        ): ColorPaletteId {
            if (
            input &&
            ALLOWED_PALETTES.includes(input as ColorPaletteId)
            ) {
            return input as ColorPaletteId;
            }
            return DEFAULT_PALETTE;
        }
        
    /* =====================
        STYLE / PALETTE
    ====================== */
    const style = resolveStyle(seed?.style);
    const palette = resolvePalette(seed?.palette);

    /* =====================
        BUSINESS (MINIMA)
    ====================== */
    const business = {
        name: businessSeed.name,
        slug: businessSeed.name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-"),
        sector: businessSeed.sector ?? solution.id,
        address: businessSeed.address ?? "",
        descriptionText:
        seed?.copySeed?.description ??
        solution.description ??
        "",
        openingHours: solution.openingHours,
    };

    /* =====================
        ENGINE INPUT
    ====================== */
    return {
        configurationId: "PREVIEW",

        business,

        layout,

        style,
        palette,

        galleryPreset: seed?.galleryPreset,
        copySeed: seed?.copySeed,
        sectionOrder: seed?.sections,
    };
    }
