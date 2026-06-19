import type { CSSProperties } from "react";

interface IconProps {
  name: string;
  className?: string;
  filled?: boolean;
  size?: number;
  style?: CSSProperties;
}

export function Icon({ name, className, filled, size, style }: IconProps) {
  return (
    <span
      className={`material-symbols-outlined ${className ?? ""}`}
      style={{
        fontSize: size ? `${size}px` : undefined,
        fontVariationSettings: filled
          ? '"FILL" 1, "wght" 500, "GRAD" 0, "opsz" 24'
          : undefined,
        ...style,
      }}
      aria-hidden
    >
      {name}
    </span>
  );
}