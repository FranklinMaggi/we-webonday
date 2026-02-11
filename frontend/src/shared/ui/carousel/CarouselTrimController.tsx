        import React, { useEffect, useMemo, useState ,useRef} from "react";


        type Props = {
        children: React.ReactNode;
        selectedId?: string | null;
        onChange?: (id: string| null) => void;
        className?: string;
        };

        export function CarouselTrimController({
        children,
        selectedId,
        onChange,
        className,
        }: Props) {
        const rootRef = useRef<HTMLDivElement>(null);
        
        const isLocked = Boolean(selectedId);
            const items = useMemo(
            () => React.Children.toArray(children) as React.ReactElement[],
            [children]
        );

        const ids = useMemo(() => {
            return items.map((child: any) =>
            child?.props?.solution?.id ??
            child?.props?.model?.id ??
            child?.props?.["data-id"]
            );
        }, [items]);

        const length = items.length;
        const [index, setIndex] = useState(0);

        /* ================= NORMALIZE CICLICO ================= */

        function normalize(i: number) {
            if (length === 0) return 0;
            return ((i % length) + length) % length;
        }

        /* ================= SYNC ESTERNO ================= */
        useEffect(() => {
            if (!selectedId) return;
        
            const externalIndex = ids.findIndex((id) => id === selectedId);
        
            if (externalIndex !== -1 && externalIndex !== index) {
            setIndex(externalIndex);
            }
        }, [selectedId, ids]);


        /* ================= TRACKPAD / MOUSE WHEEL ================= */

        useEffect(() => {
            const root = rootRef.current;
            if (!root) return;
        
            let locked = false;
        
            function handleWheel(e: WheelEvent) {
            if (isLocked) return
                if (locked) return;
        
            const horizontal = Math.abs(e.deltaX);
            const vertical = Math.abs(e.deltaY);
        
            // prendiamo il movimento dominante
            const delta =
                horizontal > vertical ? e.deltaX : e.deltaY;
        
            if (Math.abs(delta) < 15) return;
        
            locked = true;
        
            if (delta > 0) {
                setIndex((prev) => normalize(prev + 1));
            } else {
                setIndex((prev) => normalize(prev - 1));
            }
        
            setTimeout(() => {
                locked = false;
            }, 220);
            }
        
            window.addEventListener("wheel", handleWheel, { passive: false });
        
            return () => {
            window.removeEventListener("wheel", handleWheel);
            };
        }, [length , isLocked]);
        
        /* ================= TOUCH SWIPE ================= */

        useEffect(() => {
            const root = rootRef.current;
            if (!root) return;
        
            let startX = 0;
            let deltaX = 0;
        
            function onTouchStart(e: TouchEvent) {
            startX = e.touches[0].clientX;
            }
        
            function onTouchMove(e: TouchEvent) {
            deltaX = e.touches[0].clientX - startX;
            }
        
            function onTouchEnd() {
                if(isLocked) return;
            if (Math.abs(deltaX) > 50) {
                if (deltaX < 0) {
                setIndex((prev) => normalize(prev + 1));
                } else {
                setIndex((prev) => normalize(prev - 1));
                }
            }
        
            deltaX = 0;
            }
        
            root.addEventListener("touchstart", onTouchStart);
            root.addEventListener("touchmove", onTouchMove);
            root.addEventListener("touchend", onTouchEnd);
        
            return () => {
            root.removeEventListener("touchstart", onTouchStart);
            root.removeEventListener("touchmove", onTouchMove);
            root.removeEventListener("touchend", onTouchEnd);
            };
        }, [length,isLocked]);
        
        /* ================= KEYBOARD ================= */

        useEffect(() => {
            function handleKey(e: KeyboardEvent) {
                if(isLocked) return;
            const tag = (e.target as HTMLElement)?.tagName;
            if (tag === "INPUT" || tag === "TEXTAREA") return;

            if (e.key === "ArrowRight") {
                setIndex((prev) => normalize(prev + 1));
            }

            if (e.key === "ArrowLeft") {
                setIndex((prev) => normalize(prev - 1));
            }
            }

            window.addEventListener("keydown", handleKey);
            return () => window.removeEventListener("keydown", handleKey);
        }, [length , isLocked]);



        /* ================= BACKGROUND UPDATE ================= */

        useEffect(() => {
            const root = rootRef.current;
            if (!root) return;
        
            const cards = root.querySelectorAll<HTMLElement>(".carousel-card");
            const current = cards[index];
            if (!current) return;
        
            const img = current.querySelector("img");
        
            if (img instanceof HTMLImageElement && img.src) {
            root.style.setProperty("--carousel-bg", `url(${img.src})`);
            }
        }, [index]);
        

        return (
            <div ref={rootRef} className={`carousel trim-test ${className ?? ""}`}>
            <div className="carousel__track">
                {items.map((child, i) => {
                const diffRaw = i - index;

                // distanza ciclica più corta
                let diff = diffRaw;
                if (diff > length / 2) diff -= length;
                if (diff < -length / 2) diff += length;

                const pos = getPosition(diff);
                const stack = 100 - Math.min(99, Math.abs(diff) * 10);

                const id = ids[i];

            return (
                <div
                    key={id ?? i}
                    className={`carousel-card ${id === selectedId ? "is-selected" : ""}`}
                    data-id={id}
                    data-pos={pos}
                    style={{ "--stack-z": stack } as React.CSSProperties}
                    onClick={() => {
                    if (!id) return;
                
                    if (id === selectedId) {
                        onChange?.(null); // toggle off
                        return;
                    }
                
                    onChange?.(id); // seleziona
                    }}
                >
                    {child}
                </div>
                );
                
            })}
            </div>
            </div>
        );
        }

        /* ================= POSITION LOGIC ================= */

        function getPosition(diff: number) {
        if (diff === 0) return "center";
        if (diff === -1) return "left";
        if (diff === 1) return "right";
        if (diff === -2) return "far-left";
        if (diff === 2) return "far-right";
        if (diff < -2) return "deep-left";
        if (diff > 2) return "deep-right";
        return "idle";
        
        }
