"use client";

export function ZephAvatar() {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      {/* Background */}
      <defs>
        <linearGradient id="zeph-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1a1408" />
          <stop offset="100%" stopColor="#0d0a04" />
        </linearGradient>
        <linearGradient id="zeph-helmet" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8a034" />
          <stop offset="100%" stopColor="#c17a1a" />
        </linearGradient>
        <linearGradient id="zeph-visor" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2a1f0a" />
          <stop offset="40%" stopColor="#e8a03440" />
          <stop offset="100%" stopColor="#1a1408" />
        </linearGradient>
      </defs>
      <rect width="120" height="120" rx="16" fill="url(#zeph-bg)" />

      {/* Stars */}
      <circle cx="15" cy="15" r="1" fill="#e8a034" opacity="0.4" />
      <circle cx="100" cy="20" r="1.2" fill="#e8a034" opacity="0.3" />
      <circle cx="25" cy="95" r="0.8" fill="#e8a034" opacity="0.5" />
      <circle cx="105" cy="85" r="1" fill="#e8a034" opacity="0.3" />

      {/* Helmet outer */}
      <ellipse cx="60" cy="55" rx="32" ry="35" fill="url(#zeph-helmet)" opacity="0.9" />
      {/* Helmet inner dark */}
      <ellipse cx="60" cy="55" rx="28" ry="31" fill="#0d0a04" />
      {/* Visor reflection */}
      <ellipse cx="60" cy="52" rx="24" ry="24" fill="url(#zeph-visor)" />

      {/* Face - simple */}
      <circle cx="52" cy="48" r="3" fill="#e8a034" opacity="0.8" /> {/* left eye */}
      <circle cx="68" cy="48" r="3" fill="#e8a034" opacity="0.8" /> {/* right eye */}
      {/* Smile */}
      <path d="M50 58 Q60 66 70 58" stroke="#e8a034" strokeWidth="2" fill="none" opacity="0.7" strokeLinecap="round" />

      {/* Antenna */}
      <line x1="60" y1="20" x2="60" y2="10" stroke="#e8a034" strokeWidth="2" opacity="0.6" />
      <circle cx="60" cy="8" r="3" fill="#e8a034" opacity="0.8" />

      {/* Suit collar */}
      <path d="M35 85 Q60 78 85 85 L90 120 L30 120 Z" fill="#1a1408" stroke="#e8a03420" strokeWidth="1" />
      {/* Suit detail lines */}
      <line x1="60" y1="82" x2="60" y2="110" stroke="#e8a034" strokeWidth="1" opacity="0.15" />
      <circle cx="60" cy="90" r="2" fill="#e8a034" opacity="0.3" />
    </svg>
  );
}

export function RikuAvatar() {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      <defs>
        <linearGradient id="riku-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1a0808" />
          <stop offset="100%" stopColor="#0d0404" />
        </linearGradient>
        <linearGradient id="riku-helmet" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e85d4a" />
          <stop offset="100%" stopColor="#b33a2a" />
        </linearGradient>
      </defs>
      <rect width="120" height="120" rx="16" fill="url(#riku-bg)" />

      {/* Stars */}
      <circle cx="20" cy="12" r="1" fill="#e85d4a" opacity="0.3" />
      <circle cx="95" cy="18" r="1" fill="#e85d4a" opacity="0.4" />
      <circle cx="108" cy="90" r="0.8" fill="#e85d4a" opacity="0.3" />

      {/* Chef hat */}
      <ellipse cx="60" cy="22" rx="20" ry="12" fill="#f0e6d8" opacity="0.9" />
      <rect x="42" y="22" width="36" height="14" rx="2" fill="#f0e6d8" opacity="0.85" />

      {/* Helmet outer */}
      <ellipse cx="60" cy="55" rx="30" ry="32" fill="url(#riku-helmet)" opacity="0.9" />
      <ellipse cx="60" cy="55" rx="26" ry="28" fill="#0d0404" />

      {/* Visor */}
      <ellipse cx="60" cy="52" rx="22" ry="22" fill="#1a080830" />

      {/* Face */}
      <circle cx="52" cy="47" r="3" fill="#e85d4a" opacity="0.8" />
      <circle cx="68" cy="47" r="3" fill="#e85d4a" opacity="0.8" />
      {/* Confident grin */}
      <path d="M48 58 Q60 68 72 58" stroke="#e85d4a" strokeWidth="2.5" fill="none" opacity="0.7" strokeLinecap="round" />

      {/* Mustache */}
      <path d="M50 54 Q55 57 60 54 Q65 57 70 54" stroke="#e85d4a" strokeWidth="1.5" fill="none" opacity="0.5" />

      {/* Suit with apron */}
      <path d="M35 82 Q60 76 85 82 L90 120 L30 120 Z" fill="#1a0808" stroke="#e85d4a20" strokeWidth="1" />
      {/* Apron */}
      <path d="M45 85 L45 115 L75 115 L75 85 Q60 80 45 85" fill="#f0e6d815" stroke="#e85d4a20" strokeWidth="1" />
      {/* Utensil icon */}
      <line x1="58" y1="95" x2="58" y2="108" stroke="#e85d4a" strokeWidth="1.5" opacity="0.3" strokeLinecap="round" />
      <line x1="62" y1="95" x2="62" y2="108" stroke="#e85d4a" strokeWidth="1.5" opacity="0.3" strokeLinecap="round" />
      <circle cx="58" cy="93" r="2" fill="none" stroke="#e85d4a" strokeWidth="1" opacity="0.3" />
    </svg>
  );
}

export function NovaAvatar() {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      <defs>
        <linearGradient id="nova-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0e0818" />
          <stop offset="100%" stopColor="#08040d" />
        </linearGradient>
        <linearGradient id="nova-helmet" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9b7ae8" />
          <stop offset="100%" stopColor="#6b4abf" />
        </linearGradient>
        <linearGradient id="nova-visor" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0e0818" />
          <stop offset="50%" stopColor="#9b7ae820" />
          <stop offset="100%" stopColor="#0e0818" />
        </linearGradient>
      </defs>
      <rect width="120" height="120" rx="16" fill="url(#nova-bg)" />

      {/* Stars */}
      <circle cx="18" cy="14" r="1.2" fill="#9b7ae8" opacity="0.4" />
      <circle cx="98" cy="22" r="0.8" fill="#9b7ae8" opacity="0.3" />
      <circle cx="12" cy="100" r="1" fill="#9b7ae8" opacity="0.3" />

      {/* Helmet outer */}
      <ellipse cx="60" cy="52" rx="31" ry="34" fill="url(#nova-helmet)" opacity="0.9" />
      <ellipse cx="60" cy="52" rx="27" ry="30" fill="#08040d" />
      {/* Visor */}
      <ellipse cx="60" cy="50" rx="23" ry="23" fill="url(#nova-visor)" />

      {/* Face */}
      <circle cx="52" cy="46" r="2.5" fill="#9b7ae8" opacity="0.8" />
      <circle cx="68" cy="46" r="2.5" fill="#9b7ae8" opacity="0.8" />
      {/* Eyelashes */}
      <line x1="49" y1="43" x2="50" y2="44" stroke="#9b7ae8" strokeWidth="1" opacity="0.5" />
      <line x1="71" y1="43" x2="70" y2="44" stroke="#9b7ae8" strokeWidth="1" opacity="0.5" />
      {/* Calm smile */}
      <path d="M52 56 Q60 62 68 56" stroke="#9b7ae8" strokeWidth="1.8" fill="none" opacity="0.6" strokeLinecap="round" />

      {/* Hair flowing out of helmet */}
      <path d="M32 45 Q25 55 28 70" stroke="#9b7ae8" strokeWidth="2" fill="none" opacity="0.3" strokeLinecap="round" />
      <path d="M30 42 Q22 52 26 65" stroke="#9b7ae8" strokeWidth="1.5" fill="none" opacity="0.2" strokeLinecap="round" />

      {/* Suit */}
      <path d="M35 82 Q60 76 85 82 L90 120 L30 120 Z" fill="#0e0818" stroke="#9b7ae820" strokeWidth="1" />
      {/* Badge */}
      <rect x="50" y="88" width="20" height="8" rx="2" fill="#9b7ae815" stroke="#9b7ae830" strokeWidth="0.5" />
      <text x="60" y="94" textAnchor="middle" fill="#9b7ae8" fontSize="5" opacity="0.5" fontFamily="monospace">DR</text>
      {/* Rank dots */}
      <circle cx="55" cy="102" r="1.5" fill="#9b7ae8" opacity="0.3" />
      <circle cx="60" cy="102" r="1.5" fill="#9b7ae8" opacity="0.3" />
      <circle cx="65" cy="102" r="1.5" fill="#9b7ae8" opacity="0.3" />
    </svg>
  );
}
