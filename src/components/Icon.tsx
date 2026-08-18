import type { CSSProperties } from "react";
import type { IconName } from "@/types/conversation";

interface IconProps {
  name: IconName;
  className?: string;
  style?: CSSProperties;
}

const strokeProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function Icon({ name, className, style }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <g {...strokeProps}>
        {renderPaths(name)}
      </g>
    </svg>
  );
}

function renderPaths(name: IconName) {
  switch (name) {
    case "person":
      return (
        <>
          <circle cx="12" cy="8.2" r="3.4" />
          <path d="M5.2 19.4c1.2-3.4 3.9-5.1 6.8-5.1s5.6 1.7 6.8 5.1" />
        </>
      );
    case "briefcase":
      return (
        <>
          <rect x="3.5" y="7.5" width="17" height="11.5" rx="2.2" />
          <path d="M8.3 7.5V6a2 2 0 0 1 2-2h3.4a2 2 0 0 1 2 2v1.5" />
          <path d="M3.5 12.5h17" />
        </>
      );
    case "layers":
      return (
        <>
          <path d="M12 3.6 20.5 8 12 12.4 3.5 8Z" />
          <path d="m4.5 12 7.5 4 7.5-4" />
          <path d="m4.5 16 7.5 4 7.5-4" />
        </>
      );
    case "spark":
      return (
        <>
          <path d="M12 3.5c.5 3.6 2.4 5.5 6 6-3.6.5-5.5 2.4-6 6-.5-3.6-2.4-5.5-6-6 3.6-.5 5.5-2.4 6-6Z" />
        </>
      );
    case "mail":
      return (
        <>
          <rect x="3.5" y="5.5" width="17" height="13" rx="2.2" />
          <path d="m4.2 6.5 7.8 6.4 7.8-6.4" />
        </>
      );
    case "dots":
      return (
        <>
          <circle cx="6" cy="12" r="1.15" fill="currentColor" stroke="none" />
          <circle cx="12" cy="12" r="1.15" fill="currentColor" stroke="none" />
          <circle cx="18" cy="12" r="1.15" fill="currentColor" stroke="none" />
        </>
      );
    case "arrow-left":
      return (
        <>
          <path d="M19 12H5" />
          <path d="m11 6-6 6 6 6" />
        </>
      );
    case "arrow-right":
      return (
        <>
          <path d="M5 12h14" />
          <path d="m13 6 6 6-6 6" />
        </>
      );
    case "chevron-right":
      return <path d="m9 5 7 7-7 7" />;
    case "close":
      return (
        <>
          <path d="m6 6 12 12" />
          <path d="m18 6-12 12" />
        </>
      );
    case "send":
      return (
        <>
          <path d="M12 19V6" />
          <path d="m6 11.5 6-6 6 6" />
        </>
      );
    case "link":
      return (
        <>
          <path d="M9.5 14.5 14.5 9.5" />
          <path d="M11 7.2 12.6 5.6a3.4 3.4 0 1 1 4.8 4.8L15.8 12" />
          <path d="M13 16.8 11.4 18.4a3.4 3.4 0 1 1-4.8-4.8L8.2 12" />
        </>
      );
    case "play":
      return <path d="M8.5 6.2v11.6l9.5-5.8Z" strokeLinejoin="round" />;
    case "github":
      return (
        <path d="M12 3.4a8.6 8.6 0 0 0-2.7 16.8c.4.1.6-.2.6-.4v-1.6c-2.4.5-2.9-1.1-2.9-1.1-.4-1-1-1.3-1-1.3-.8-.5.1-.5.1-.5.9.1 1.4.9 1.4.9.8 1.4 2.1 1 2.6.7.1-.6.3-1 .6-1.2-1.9-.2-4-1-4-4.2 0-.9.3-1.7.9-2.3-.1-.2-.4-1.1.1-2.3 0 0 .7-.2 2.4.9a8.2 8.2 0 0 1 4.4 0c1.7-1.1 2.4-.9 2.4-.9.5 1.2.2 2.1.1 2.3.6.6.9 1.4.9 2.3 0 3.2-2.1 4-4 4.2.3.3.6.8.6 1.7v2.5c0 .2.2.5.6.4A8.6 8.6 0 0 0 12 3.4Z" />
      );
    case "linkedin":
      return (
        <>
          <rect x="4" y="4" width="16" height="16" rx="3" />
          <path d="M8.2 10.4v6" />
          <circle cx="8.2" cy="7.7" r="0.2" fill="currentColor" />
          <path d="M11.6 16.4v-3.5c0-1.4 2.9-2 3.6-.6.1.3.2.7.2 1.1v3" />
        </>
      );
    case "x":
      return (
        <>
          <path d="m5.5 5.5 13 13" />
          <path d="m18.5 5.5-13 13" />
        </>
      );
    case "compass":
      return (
        <>
          <circle cx="12" cy="12" r="8.5" />
          <path d="m14.6 9.4-1.8 4.4-4.4 1.8 1.8-4.4Z" strokeLinejoin="round" />
        </>
      );
    case "cap":
      return (
        <>
          <path d="M12 4.8 21 9l-9 4.2L3 9Z" strokeLinejoin="round" />
          <path d="M7.3 11.2v4.1c0 1.4 2.1 2.5 4.7 2.5s4.7-1.1 4.7-2.5v-4.1" />
          <path d="M21 9v5.4" />
        </>
      );
    case "flag":
      return (
        <>
          <path d="M6 20V4.6" />
          <path d="M6 5.2c1.7-1.1 3.4-1.1 5.1 0s3.4 1.1 5.1 0v7.6c-1.7 1.1-3.4 1.1-5.1 0s-3.4-1.1-5.1 0Z" strokeLinejoin="round" />
        </>
      );
    case "refresh":
      return (
        <>
          <path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3" />
          <path d="M19.9 4.9v4.4h-4.4" />
        </>
      );
    case "users":
      return (
        <>
          <circle cx="8.8" cy="9.2" r="2.9" />
          <path d="M3.6 19c.9-2.9 2.7-4.3 5.2-4.3s4.3 1.4 5.2 4.3" />
          <path d="M15.2 7.1c1.3.3 2.2 1.4 2.2 2.9s-.9 2.6-2.2 2.9" />
          <path d="M15.9 14.8c1.9.5 3.2 1.9 3.9 4.2" />
        </>
      );
  }
}
