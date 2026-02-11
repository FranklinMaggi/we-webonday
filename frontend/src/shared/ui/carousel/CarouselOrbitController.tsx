import React, { useEffect, useState, useMemo } from "react";

type Props = {
  children: React.ReactNode;
  onChange?: (id: string) => void;
  className?: string;
  selectId?: string | null;
};

export function CarouselOrbit({
  children,
  onChange,
  className,
  selectId,
}: Props) {
  const items = useMemo(
    () => React.Children.toArray(children),
    [children]
  );

  const length = items.length;
  const [position, setPosition] = useState(0);

  function normalize(i: number) {
    if (length === 0) return 0;
    return ((i % length) + length) % length;
  }

  function move(delta: number) {
    setPosition((prev) => normalize(prev + delta));
  }

  // Sync external selectedId
  useEffect(() => {
    if (!selectId) return;

    const index = items.findIndex(
      (child: any) =>
        child?.props?.solution?.id === selectId
    );

    if (index !== -1) setPosition(index);
  }, [selectId, items]);

  // Notify parent
  useEffect(() => {
    const child: any = items[position];
    const id = child?.props?.solution?.id;
    if (id) onChange?.(id);
  }, [position]);

  // Keyboard
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      if (e.key === "ArrowRight") move(1);
      if (e.key === "ArrowLeft") move(-1);
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div className={`carousel-orbit ${className ?? ""}`}>
      {items.map((child: any, i) => {
        let diff = i - position;

        if (diff > length / 2) diff -= length;
        if (diff < -length / 2) diff += length;

        return React.cloneElement(child, {
          key: i,
          style: {
            ...getStyle(diff),
          },
          dataPos: getPosition(diff),
          onSelect: () => setPosition(i),
        });
      })}
    </div>
  );
}


/* Helpers */

function getPosition(diff: number) {
  if (diff === 0) return "center";
  if (diff === 1) return "right";
  if (diff === -1) return "left";
  return "idle";
}

function getStyle(diff: number): React.CSSProperties {
    const spacing = 420;
    const rotate = 28;
    const depth = 500;
    const scaleCenter = 1.1;
    const scaleSide = 0.8;
  
    return {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: `
        translate(-50%, -50%)
        translateX(${diff * spacing}px)
        translateZ(${diff === 0 ? depth : -200}px)
        rotateY(${diff * -rotate}deg)
        scale(${diff === 0 ? scaleCenter : scaleSide})
      `,
      zIndex: 100 - Math.abs(diff),
    };
  }
  