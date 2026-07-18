import './Avatar.css';

const sizes = { small: 'avatar--sm', medium: 'avatar--md', large: 'avatar--lg' };

const colors = [
  { bg: '#deebff', text: '#0747a6' },
  { bg: '#abf5d1', text: '#006644' },
  { bg: '#fff0b3', text: '#974f0c' },
  { bg: '#ffbdad', text: '#bf2600' },
  { bg: '#eae6ff', text: '#403294' },
  { bg: '#b3d4ff', text: '#0747a6' },
];

function pickColor(seed) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

export function Avatar({ name = '', src, size = 'medium', status }) {
  const color = pickColor(name || 'U');
  const sizeClass = sizes[size];

  if (src) {
    return (
      <div className={`avatar ${sizeClass}`}>
        <img src={src} alt={name} />
        {status && <span className={`avatar__status avatar__status--${status}`} />}
      </div>
    );
  }

  return (
    <div
      className={`avatar ${sizeClass} avatar--initials`}
      style={{ background: color.bg, color: color.text }}
      aria-label={name}
    >
      <span>{initials(name)}</span>
      {status && <span className={`avatar__status avatar__status--${status}`} />}
    </div>
  );
}