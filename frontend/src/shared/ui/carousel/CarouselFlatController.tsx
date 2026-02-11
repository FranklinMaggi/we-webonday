import React, { useEffect, useRef, useMemo } from "react";

type Props = {
  selectedId?: string | null;
  children: React.ReactNode;
  onChange?: (id: string) => void;
  className?: string;
};

export function CarouselController({
  selectedId,
  children,
  className,
  onChange,
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
    const currentIndexRef = useRef<number>(0);
  /* ================= LOOP TRIPLO ================= */

  const items = useMemo(() => React.Children.toArray(children), [children]);
  const originalLength = items.length;

  const rendered = useMemo(() => {
    const tripled = [...items, ...items, ...items];
  
    return tripled.map((child: any, i) => {
      const id = child?.props?.["data-id"] || child?.props?.model?.id;
  
      return (
        <div
          key={`loop-${i}`}
          className="carousel-card"
          data-id={id}
        >
          {child}
        </div>
      );
    });
  }, [items]);
  
  

  /* ================= INITIAL CENTER ================= */

  useEffect(() => {
    const track = trackRef.current;
    if (!track || originalLength === 0) return;
    currentIndexRef.current = originalLength; // centro del blocco 2
    const domItems = track.querySelectorAll<HTMLElement>("[data-id]");
    const firstCenter = domItems[originalLength];

    firstCenter?.scrollIntoView({
      inline: "center",
      block: "nearest",
    });
    onChange?.(domItems[originalLength]?.dataset.id || "");
  }, [originalLength]);

  /* ================= KEYBOARD ================= */
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (!trackRef.current || !onChange) return;
  
      const domItems = trackRef.current.querySelectorAll<HTMLElement>("[data-id]");
      if (!domItems.length) return;
  
      if (e.key === "ArrowRight") {
        e.preventDefault();
        currentIndexRef.current += 1;
      }
      
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        currentIndexRef.current -= 1;
      }
      
      //const domItems = trackRef.current.querySelectorAll<HTMLElement>("[data-id]");
      const el = domItems[currentIndexRef.current];
      if (el?.dataset.id) {
        onChange(el.dataset.id);
      }
      
    }
  
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onChange]);
  

  /* ================= POSITION +  RESET ================= */

  useEffect(() => {
    const track = trackRef.current;
    const root = rootRef.current;
    if (!track || !root || originalLength === 0) return;
  
    const domItems = Array.from(
      track.querySelectorAll<HTMLElement>("[data-id]")
    );
  
    if (!domItems.length) return;
  
    let index = currentIndexRef.current;
  
    /* 🔁 RESET INVISIBILE PRIMA DI TUTTO */
    if (index < originalLength) {
      index += originalLength;
      currentIndexRef.current = index;
      track.scrollLeft += track.scrollWidth / 3;
    }
  
    if (index >= originalLength * 2) {
      index -= originalLength;
      currentIndexRef.current = index;
      track.scrollLeft -= track.scrollWidth / 3;
    }
  
    const selectedEl = domItems[index];
    if (!selectedEl) return;
  
    /* POSITION LOGIC */
    domItems.forEach((el, idx) => {
      const diff = idx - index;
  
      let pos = "idle";
      if (diff === 0) pos = "center";
      else if (diff === -1) pos = "left";
      else if (diff === 1) pos = "right";
      else if (diff === -2) pos = "far-left";
      else if (diff === 2) pos = "far-right";
      else if (diff < -2) pos = "deep-left";
      else if (diff > 2) pos = "deep-right";
  
      el.dataset.pos = pos;
  
      const stack = 100 - Math.min(99, Math.abs(diff) * 10);
      el.style.setProperty("--stack-z", String(stack));
    });
  
    /* BACKGROUND */
    const img = selectedEl.querySelector("img");
    if (img instanceof HTMLImageElement && img.src) {
      root.style.setProperty("--carousel-bg", `url(${img.src})`);
    }
  
    /* SCROLL SOLO UNA VOLTA */
    selectedEl.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  
  }, [selectedId, originalLength]);
  

  return (
    <div ref={rootRef} className={`carousel ${className ?? ""}`}>
      <div ref={trackRef} className="carousel__track">
        {rendered}
      </div>
    </div>
  );
}
