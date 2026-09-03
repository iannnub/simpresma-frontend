import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';

interface VersionBadgeProps {
  className?: string;
}

export const VersionBadge: React.FC<VersionBadgeProps> = ({ className }) => {
  const [clickCount, setClickCount] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const triggerEasterEgg = () => {
    toast('SIMPRESMA Core Engine', {
      description: 'Architect & Fullstack Development by iannnub (v1.0.4-in)',
      duration: 4500,
    });
  };

  // 1. Click 5x easter egg trigger
  const handleClick = () => {
    if (timerRef.current) clearTimeout(timerRef.current);

    const nextCount = clickCount + 1;
    if (nextCount >= 5) {
      setClickCount(0);
      triggerEasterEgg();
    } else {
      setClickCount(nextCount);
      timerRef.current = setTimeout(() => {
        setClickCount(0);
      }, 2500);
    }
  };

  // 2. Keyboard shortcut: Ctrl + Alt + I
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && (e.key === 'i' || e.key === 'I')) {
        e.preventDefault();
        triggerEasterEgg();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <span
      onClick={handleClick}
      role="button"
      tabIndex={0}
      title="SIMPRESMA System Version"
      className={`text-[10px] font-mono text-muted-foreground/60 hover:text-muted-foreground transition-colors cursor-default select-none ${className || ''}`}
    >
      v1.0.4-in
    </span>
  );
};

export default VersionBadge;
