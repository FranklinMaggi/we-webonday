    import type { CardModel } from "./card.types";

    type Params = {
    id: string;
    title: string;
    description?: string;
    image?: string;
    selected?: boolean;
    ctaLabel?: string;
    onCtaClick?: () => void;
    };

    export function buildCard(params: Params): CardModel {
    return {
        id: params.id,
        title: params.title,
        description: params.description,
        image: params.image,
        selected: params.selected,
        action: params.ctaLabel
        ? {
            label: params.ctaLabel,
            onClick: params.onCtaClick,
            }
        : undefined,
    };
    }
