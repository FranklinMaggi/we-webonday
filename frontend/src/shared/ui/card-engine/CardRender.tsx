    import type { CardModel, CardVariant } from "./card.types";

    type Props = {
    variant: CardVariant;
    model: CardModel;
    onSelect?: (id: string) => void;
    };

    export function CardRenderer({
    variant,
    model,
    onSelect,
    }: Props) {
    return (
        <article
        data-id={model.id}
        className={`wd-card engine-card engine-card--${variant} ${
            model.selected ? "is-selected" : ""
        }`}
        role="button"
        tabIndex={0}
        onClick={() => onSelect?.(model.id)}
        >
        {model.image && (
            <div className="engine-card__media">
            <img
                src={model.image}
                alt={model.title}
                loading="lazy"
            />
            </div>
        )}

        <div className="engine-card__content">
            <h3>{model.title}</h3>

            {model.description && (
            <p>{model.description}</p>
            )}

            {model.action && (
            <span
                className="engine-card__cta"
                onClick={(e) => {
                e.stopPropagation();
                model.action?.onClick?.();
                }}
            >
                {model.action.label}
            </span>
            )}
        </div>
        </article>
    );
    }
