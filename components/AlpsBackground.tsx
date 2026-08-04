export default function AlpsBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
    >
      <svg
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full opacity-[0.08]"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* sky */}
        <rect x="0" y="0" width="1600" height="900" fill="#3E7CB1" />

        {/* sun */}
        <circle cx="1220" cy="190" r="70" fill="#E8A23D" />

        {/* far mountain layer */}
        <path
          d="M0,520 L120,430 L230,500 L360,360 L470,470 L620,320 L760,470 L880,380
             L1010,500 L1150,400 L1290,510 L1420,410 L1600,500 L1600,900 L0,900 Z"
          fill="#7B93A8"
        />

        {/* mid mountain layer, snow-capped */}
        <path
          d="M0,650 L150,520 L280,610 L420,470 L520,560 L660,410 L800,600
             L930,480 L1080,620 L1220,500 L1360,630 L1500,540 L1600,600 L1600,900 L0,900 Z"
          fill="#234669"
        />
        <path
          d="M420,470 L455,510 L480,485 L520,560 L470,530 L440,505 Z"
          fill="#EAF1F6"
        />
        <path d="M660,410 L695,455 L720,430 L800,600 L730,540 L690,470 Z" fill="#EAF1F6" />
        <path d="M1220,500 L1255,540 L1280,515 L1360,630 L1290,570 L1250,530 Z" fill="#EAF1F6" />

        {/* near mountain layer, darkest */}
        <path
          d="M0,780 L200,650 L340,760 L500,620 L650,740 L820,600 L1000,760
             L1180,630 L1360,770 L1600,660 L1600,900 L0,900 Z"
          fill="#16233A"
        />

        {/* paraglider canopy */}
        <g transform="translate(980,300) rotate(-6)">
          <path
            d="M-160,0 C-140,-58 -60,-84 0,-84 C60,-84 140,-58 160,0
               C120,-14 60,-24 0,-24 C-60,-24 -120,-14 -160,0 Z"
            fill="#16233A"
          />
          <path d="M-120,-6 C-90,-36 -40,-56 0,-56" stroke="#EAF1F6" strokeWidth="3" fill="none" opacity="0.5" />
          <path d="M120,-6 C90,-36 40,-56 0,-56" stroke="#EAF1F6" strokeWidth="3" fill="none" opacity="0.5" />
          {/* lines */}
          <line x1="-120" y1="-4" x2="-18" y2="150" stroke="#16233A" strokeWidth="2" />
          <line x1="120" y1="-4" x2="18" y2="150" stroke="#16233A" strokeWidth="2" />
          <line x1="0" y1="-20" x2="0" y2="150" stroke="#16233A" strokeWidth="2" />
          {/* pilot */}
          <circle cx="0" cy="164" r="10" fill="#16233A" />
          <rect x="-7" y="174" width="14" height="26" rx="6" fill="#16233A" />
        </g>
      </svg>
    </div>
  );
}
