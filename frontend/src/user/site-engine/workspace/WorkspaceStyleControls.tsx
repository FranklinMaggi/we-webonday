// ======================================================
// FE || WORKSPACE PREVIEW — STYLE CONTROLS
// ======================================================
//
// RUOLO:
// - Consentire esplorazione stile / palette / font
// - SOLO contesto workspace
//
// INVARIANTI:
// - NON parte del sito pubblico
// - NON modifica layout
// ======================================================

type Props = {
styleId: string;
paletteId: string;
};

export function WorkspaceStyleControls({
styleId,
paletteId,
}: Props) {
return (
    <section className="workspace-controls">
    <div className="workspace-controls__inner">
        <h4>Stile del sito</h4>

        {/* === STYLE === */}
        <div className="workspace-controls__group">
        <label>Stile</label>
        <button>🎲 Random</button>
        <button className="is-active">
            {styleId}
        </button>
        </div>

        {/* === PALETTE === */}
        <div className="workspace-controls__group">
        <label>Palette colori</label>
        <button>🎲 Random</button>
        <button className="is-active">
            {paletteId}
        </button>
        </div>

        {/* === FONT (FUTURO) === */}
        <div className="workspace-controls__group">
        <label>Font</label>
        <button disabled>In arrivo</button>
        </div>
    </div>
    </section>
);
}
