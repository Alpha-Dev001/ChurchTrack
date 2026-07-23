import React from "react";

interface SalleHubLogoProps {
  className?: string;
  /** Icon size in pixels (default 20) */
  size?: number;
  title?: string;
}

/**
 * SalleHub brand mark — classical parish hall with arched portal
 * and a central hub node (venue + connection).
 */
export default function SalleHubLogo({
  className = "",
  size = 20,
  title = "SalleHub"
}: SalleHubLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      {/* Solid hall + arched doorway cutout */}
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 2.2 29.2 13.8h-3.4V29.6H6.2V13.8H2.8L16 2.2Zm0 12.2c-2.55 0-4.4 1.85-4.4 4.35V29.6h8.8V18.75c0-2.5-1.85-4.35-4.4-4.35Z"
      />
      {/* Hub node at the arch crown */}
      <circle cx="16" cy="18.75" r="1.7" fill="currentColor" />
    </svg>
  );
}
