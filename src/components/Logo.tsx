interface LogoProps {
  size?: number;
  className?: string;
}

export const Logo = ({ size = 120, className = "" }: LogoProps) => (
  <svg
    width={size}
    height={size * 0.85}
    className={className}
    viewBox="0 0 200 170"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="roofGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#c27c2a" />
        <stop offset="50%" stopColor="#8a9a3b" />
        <stop offset="100%" stopColor="#5a7a3a" />
      </linearGradient>
      <linearGradient id="houseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#5a8a3a" />
        <stop offset="50%" stopColor="#3a7a5a" />
        <stop offset="100%" stopColor="#2a6a5a" />
      </linearGradient>
      <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3a7a5a" />
        <stop offset="100%" stopColor="#2a8a7a" />
      </linearGradient>
    </defs>
    <path d="M100 15 L35 70 L45 70 L100 25 L155 70 L165 70 Z" fill="url(#roofGrad)" />
    <rect x="140" y="30" width="12" height="30" rx="1" fill="url(#houseGrad)" />
    <path d="M55 68 L55 130 Q55 140 65 140 L90 140 L90 105 L110 105 L110 140 L135 140 Q145 140 145 130 L145 68 Z" fill="url(#houseGrad)" opacity="0.9" />
    <path d="M50 85 Q30 110 50 135 Q70 155 100 145 Q130 155 150 135 Q170 110 150 85" fill="none" stroke="url(#waveGrad)" strokeWidth="8" strokeLinecap="round" opacity="0.6" />
    <path d="M75 125 Q90 110 105 125 Q120 140 135 125" fill="none" stroke="url(#waveGrad)" strokeWidth="6" strokeLinecap="round" opacity="0.7" />
  </svg>
);

export const LogoCompact = ({ size = 40, className = "" }: LogoProps) => (
  <svg
    width={size}
    height={size * 0.85}
    className={className}
    viewBox="0 0 200 170"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="roofGradS" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#c27c2a" />
        <stop offset="100%" stopColor="#5a7a3a" />
      </linearGradient>
      <linearGradient id="houseGradS" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#5a8a3a" />
        <stop offset="100%" stopColor="#2a6a5a" />
      </linearGradient>
    </defs>
    <path d="M100 15 L35 70 L45 70 L100 25 L155 70 L165 70 Z" fill="url(#roofGradS)" />
    <rect x="140" y="30" width="12" height="30" rx="1" fill="url(#houseGradS)" />
    <path d="M55 68 L55 130 Q55 140 65 140 L90 140 L90 105 L110 105 L110 140 L135 140 Q145 140 145 130 L145 68 Z" fill="url(#houseGradS)" opacity="0.9" />
    <path d="M75 125 Q90 110 105 125 Q120 140 135 125" fill="none" stroke="#2a8a7a" strokeWidth="6" strokeLinecap="round" opacity="0.7" />
  </svg>
);