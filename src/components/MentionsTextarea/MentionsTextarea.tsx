import { useCallback, useRef, useState } from 'react';
import { SuggestionList } from '../SuggestionList/SuggestionList';
import s from './MentionsTextarea.module.scss';
import { getCaretCoordinates } from '../../utils/getCaretCoordinates';

const data = [
  'Andrew',
  'Bob',
  'Carol',
  'Dave',
  'Eve',
  'Frank',
  'George',
  'Harry',
  'Ivy',
  'Jack',
  'Kate',
  'Larry',
  'Mary',
  'Nancy',
  'Oscar',
  'Paul',
  'Quincy',
  'Rudy',
  'Sally',
  'Tom',
  'Ulysses',
  'Victor',
  'Walter',
  'Xavier',
  'Yvonne',
  'Zachary',
].sort();

export const MentionsTextarea: React.FC = () => {
  const [value, setValue] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [listPosition, setListPosition] = useState({ top: 0, left: 0 });
  const [activeIndex, setActiveIndex] = useState(0);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const finishSuggestion = useCallback(() => {
    setSuggestions([]);
    setIsStarted(false);
    setActiveIndex(0);
  }, []);

  const paste = useCallback(
    (suggestion: string) => {
      setValue((value) => {
        const caretIndex = textareaRef.current?.selectionStart || value.length;
        const textBeforeCaret = value.slice(0, caretIndex);
        const atIndex = textBeforeCaret.lastIndexOf('@');
        const newCaretIndex = atIndex + suggestion.length;
        setTimeout(() =>
          textareaRef.current?.setSelectionRange(newCaretIndex, newCaretIndex),
        );
        return value.slice(0, atIndex) + suggestion + value.slice(caretIndex);
      });
      finishSuggestion();
      textareaRef.current?.focus();
    },
    [finishSuggestion],
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === '@') {
        setIsStarted(true);
        setListPosition(getCaretCoordinates(textareaRef.current!));
      }

      if (suggestions.length) {
        if (e.key === 'Enter') {
          paste(suggestions[activeIndex]);
          setActiveIndex(0);
          e.preventDefault();
        }
        if (e.key === 'ArrowDown') {
          setActiveIndex((index) => (index + 1) % suggestions.length);
          e.preventDefault();
        }
        if (e.key === 'ArrowUp') {
          setActiveIndex(
            (index) => (index - 1 + suggestions.length) % suggestions.length,
          );
          e.preventDefault();
        }
        if (e.key === 'Escape') {
          finishSuggestion();
          e.preventDefault();
        }
      }
    },
    [suggestions, paste, activeIndex, finishSuggestion],
  );

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      setValue(value);

      if (!value.includes('@')) {
        finishSuggestion();
      } else if (isStarted && textareaRef.current) {
        const startIndex = value.lastIndexOf('@') + 1;
        const caretIndex = textareaRef.current.selectionStart;
        const nameText = value.slice(startIndex, caretIndex);
        setSuggestions(
          data.filter((name) =>
            name.toLowerCase().includes(nameText.toLowerCase()),
          ),
        );
        setActiveIndex(0);
      }
    },
    [finishSuggestion, isStarted],
  );

  const onBlur = useCallback(
    (e: React.FocusEvent<HTMLTextAreaElement>) => {
      if (!wrapperRef.current?.contains(e.relatedTarget)) {
        finishSuggestion();
      }
    },
    [finishSuggestion],
  );

  return (
    <div className={s.wrapper} ref={wrapperRef}>
      <textarea
        className={s.textarea}
        ref={textareaRef}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
      ></textarea>

      {isStarted && (
        <SuggestionList
          position={listPosition}
          suggestions={suggestions}
          activeIndex={activeIndex}
          onSelect={paste}
        />
      )}
    </div>
  );
};
