

const AntIcon = ({ className = "w-16 h-16" }: { className?: string }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={className}
      fill="currentColor"
    >
      {/* Ant body */}
      <ellipse cx="50" cy="65" rx="8" ry="20" />
      {/* Ant head */}
      <circle cx="50" cy="35" r="12" />
      {/* Ant thorax */}
      <ellipse cx="50" cy="50" rx="6" ry="8" />
      
      {/* Legs */}
      <line x1="42" y1="45" x2="35" y2="55" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="42" y1="52" x2="30" y2="58" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="42" y1="59" x2="35" y2="70" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      
      <line x1="58" y1="45" x2="65" y2="55" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="58" y1="52" x2="70" y2="58" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="58" y1="59" x2="65" y2="70" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      
      {/* Antennae */}
      <line x1="45" y1="28" x2="40" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="55" y1="28" x2="60" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="40" cy="20" r="2" />
      <circle cx="60" cy="20" r="2" />
    </svg>
  );
};

export default AntIcon;