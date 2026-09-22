type IconProps = React.SVGProps<SVGSVGElement>;

export function SearchIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" strokeLinecap="round" />
    </svg>
  );
}

export function HeartIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path
        d="M12 20s-7-4.35-9.5-8.5C.8 8.2 2.2 4.5 6 4c2.1-.28 3.7.9 6 3 2.3-2.1 3.9-3.28 6-3 3.8.5 5.2 4.2 3.5 7.5C19 15.65 12 20 12 20Z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function UserIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6" strokeLinecap="round" />
    </svg>
  );
}

export function CoinIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 15.5c.5.7 1.3 1 2.5 1s2-.6 2-1.6c0-2.4-4.5-1.2-4.5-3.7 0-1 .8-1.6 2-1.6s2 .3 2.5 1" strokeLinecap="round" />
      <path d="M12 7v1.2M12 15.8V17" strokeLinecap="round" />
    </svg>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MapPinIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z" strokeLinejoin="round" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

export function CupIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <path d="M6 3h9l-1 11a3.5 3.5 0 0 1-3.5 3.2h-0a3.5 3.5 0 0 1-3.5-3.2L6 3Z" strokeLinejoin="round" />
      <path d="M15 6h2a2 2 0 0 1 0 4h-2.3" />
      <path d="M7 20h7" strokeLinecap="round" />
    </svg>
  );
}

export function WineIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <path d="M7 3h10l-1 6a4 4 0 0 1-8 0L7 3Z" strokeLinejoin="round" />
      <path d="M12 13v6M8.5 20h7" strokeLinecap="round" />
    </svg>
  );
}

export function BeerIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <path d="M6 8h9v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8Z" strokeLinejoin="round" />
      <path d="M15 9h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2" />
      <path d="M8 8V5h5v3" strokeLinejoin="round" />
    </svg>
  );
}

export function CocktailIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <path d="M4 4h16l-7 8v6M12 12 4 4M9 20h6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ListIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" strokeLinecap="round" />
    </svg>
  );
}

export function MapIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z" strokeLinejoin="round" />
      <path d="M9 4v14M15 6v14" />
    </svg>
  );
}

export function StoreIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M4 9h16l-1-5H5L4 9Z" strokeLinejoin="round" />
      <path d="M4 9v10h16V9M9 19v-6h6v6" strokeLinejoin="round" />
    </svg>
  );
}

export function BellIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M6 9a6 6 0 1 1 12 0c0 3.5 1 5 1.5 6H4.5C5 14 6 12.5 6 9Z" strokeLinejoin="round" />
      <path d="M10 19a2 2 0 0 0 4 0" strokeLinecap="round" />
    </svg>
  );
}

export function ClipboardIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" strokeLinecap="round" />
      <path d="M8 11h8M8 15h5" strokeLinecap="round" />
    </svg>
  );
}

export function ShareIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="6" r="2.5" />
      <circle cx="18" cy="18" r="2.5" />
      <path d="m8.2 10.8 7.6-4.2M8.2 13.2l7.6 4.2" strokeLinecap="round" />
    </svg>
  );
}

export function UsersIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c.8-3.2 3-5 6-5s5.2 1.8 6 5" strokeLinecap="round" />
      <path d="M16 4.2a3 3 0 0 1 0 5.6" strokeLinecap="round" />
      <path d="M21 19.5c-.6-2.6-1.8-4-3.5-4.7" strokeLinecap="round" />
    </svg>
  );
}

export function GlobeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.5 4 6 4 9s-1.5 6.5-4 9c-2.5-2.5-4-6-4-9s1.5-6.5 4-9Z" />
    </svg>
  );
}
