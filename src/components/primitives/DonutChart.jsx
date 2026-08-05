export function DonutChart({ percentual = 100, size = 48, strokeWidth = 4 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentual / 100) * circumference;

  // Cor do anel de acordo com a porcentagem
  let strokeColor = '#316441'; // Verde para 100%
  let textColor = '#2E4227';

  if (percentual < 100 && percentual >= 80) {
    strokeColor = '#D97706'; // Laranja para 80-99%
    textColor = '#92400E';
  } else if (percentual < 80 && percentual >= 60) {
    strokeColor = '#B45309'; // Amarelo/Âmbar para 60-79%
    textColor = '#78350F';
  } else if (percentual < 60) {
    strokeColor = '#64748B'; // Cinza para < 60%
    textColor = '#334155';
  }

  return (
    <div
      style={{
        position: 'relative',
        width: `${size}px`,
        height: `${size}px`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Anel de Fundo */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E2E8F0"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Anel de Progresso */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      {/* Texto de Porcentagem no Centro */}
      <span
        style={{
          position: 'absolute',
          fontFamily: 'var(--ff-mono, monospace)',
          fontSize: size > 40 ? '0.72rem' : '0.65rem',
          fontWeight: 700,
          color: textColor,
          lineHeight: 1,
        }}
      >
        {percentual}%
      </span>
    </div>
  );
}
