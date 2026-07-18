export const CartIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="9" cy="21" r="1.5" fill="currentColor" />
    <circle cx="18" cy="21" r="1.5" fill="currentColor" />
    <path d="M3 3 H5 L7 16 H19 L21 8 H7"
      stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PlusIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 5 V19 M5 12 H19"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

export const TrashIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M3 6 H21 M8 6 V4 a1 1 0 0 1 1 -1 h6 a1 1 0 0 1 1 1 V6"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M5 6 L6 20 a1 1 0 0 0 1 1 h10 a1 1 0 0 0 1 -1 L19 6"
      stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <path d="M10 11 V17 M14 11 V17"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const EditIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M4 20 H8 L19 9 L15 5 L4 16 V20 Z"
      stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <path d="M14 6 L18 10"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const SearchIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="11" cy="11" r="7"
      stroke="currentColor" strokeWidth="2" />
    <path d="M16 16 L21 21"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const SparkleIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 3 L13.5 9 L19.5 10.5 L13.5 12 L12 18 L10.5 12 L4.5 10.5 L10.5 9 Z"
      fill="currentColor" />
    <circle cx="19" cy="5" r="1.5" fill="currentColor" />
    <circle cx="5" cy="19" r="1" fill="currentColor" />
  </svg>
);

export const CheckIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M5 12 L10 17 L20 7"
      stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PriceIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <text x="12" y="17" textAnchor="middle"
      fontSize="16" fontWeight="700" fill="currentColor">$</text>
  </svg>
);

export const LocationIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 22 C7 16 4 12 4 9 a8 8 0 1 1 16 0 c0 3 -3 7 -8 13 Z"
      stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <circle cx="12" cy="9" r="3"
      stroke="currentColor" strokeWidth="2" />
  </svg>
);

export const ClockIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9"
      stroke="currentColor" strokeWidth="2" />
    <path d="M12 7 V12 L15.5 14"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);