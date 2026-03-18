import { useEffect, useRef } from 'react';
import s from './SuggestionList.module.scss';

interface SuggestionListProps {
  className?: string;
  position: { top: number; left: number };
  suggestions: string[];
  activeIndex?: number;
  onSelect: (suggestion: string) => void;
}

export const SuggestionList: React.FC<SuggestionListProps> = ({
  className,
  position: { top, left },
  activeIndex,
  suggestions,
  onSelect,
}) => {
  const activeItemRef = useRef<HTMLButtonElement>(null);
  
  useEffect(() => {
    if (activeItemRef.current) {
      activeItemRef.current.scrollIntoView({block: 'nearest'});
    }
  }, [activeIndex]);

  return (
    <ul
      className={s.list + (className ? ' ' + className : '')}
      style={{ transform: `translate(${left}px, ${top + 16}px)` }}
    >
      {suggestions.map((suggestion, index) => (
        <li className={s.item} key={suggestion}>
          <button
            className={s.button + (activeIndex === index ? ' ' + s.active : '')}
            ref={activeIndex === index ? activeItemRef : undefined}
            onClick={() => onSelect(suggestion)}
          >
            {suggestion}
          </button>
        </li>
      ))}
    </ul>
  );
};
