const ICONS = {
  cart: (
    <>
      <circle cx="9" cy="21" r="1.5" fill="currentColor" />
      <circle cx="18" cy="21" r="1.5" fill="currentColor" />
      <path d="M3 3 H5 L7 16 H19 L21 8 H7"
        stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </>
  ),
  chef: (
    <>
      <path d="M6 14 V20 a2 2 0 0 0 2 2 h8 a2 2 0 0 0 2 -2 V14"
        stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M12 14 V8 M9 8 a3 3 0 0 1 6 0 v3 a3 3 0 0 1 -6 0 Z"
        stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M6 8 a3 3 0 1 1 6 0 v3"
        stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M18 8 a3 3 0 1 0 -6 0 v3"
        stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
    </>
  ),
  plant: (
    <>
      <path d="M12 22 V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 12 C12 8 8 6 4 8 C4 12 8 14 12 12 Z"
        fill="currentColor" opacity="0.7" />
      <path d="M12 12 C12 8 16 6 20 8 C20 12 16 14 12 12 Z"
        fill="currentColor" opacity="0.7" />
      <path d="M12 14 C12 10 9 8 6 9 C6 13 9 15 12 14 Z"
        fill="currentColor" />
      <path d="M12 14 C12 10 15 8 18 9 C18 13 15 15 12 14 Z"
        fill="currentColor" />
      <path d="M8 22 H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  tools: (
    <>
      <path d="M14 6 L18 2 L22 6 L18 10 Z"
        stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round" />
      <path d="M14 6 L4 16 L8 20 L18 10"
        stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round" />
      <circle cx="6" cy="18" r="2" stroke="currentColor" strokeWidth="2" fill="none" />
    </>
  ),
  money: (
    <>
      <rect x="2" y="6" width="20" height="12" rx="2"
        stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M6 9 V15 M18 9 V15"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
};

export function ModuleIcon({ name, size = 24 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      {ICONS[name] || null}
    </svg>
  );
}