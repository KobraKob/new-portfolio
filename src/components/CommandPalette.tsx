import { useEffect, useRef, useState, useCallback } from 'react';
import { useTheme } from '../app/ThemeProvider';
import { copy } from '../content/copy';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

export function CommandPalette() {
  const { toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const easterEggTriggered = useRef(false);
  const typedBuffer = useRef('');

  const commands = copy.palette.commands.filter(
    (command) => command.action !== 'copy-email' || Boolean(copy.meta.email)
  );

  const filteredCommands = commands.filter(cmd => 
    cmd.label.toLowerCase().includes(query.toLowerCase()) ||
    (cmd.action && cmd.action.toLowerCase().includes(query.toLowerCase()))
  );

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        closePalette();
        break;
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        executeCommand(filteredCommands[selectedIndex]);
        break;
      case 'Tab':
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
        break;
    }
  }, [isOpen, filteredCommands, selectedIndex]);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const isModifier = e.metaKey || e.ctrlKey;
      const isSlash = e.key === '/';
      const isK = e.key.toLowerCase() === 'k';
      
      if ((isModifier && isK) || (!isModifier && isSlash && document.activeElement === document.body)) {
        e.preventDefault();
        openPalette();
      }

      if (isOpen) {
        handleKeyDown(e);
      } else if (!isModifier && e.key.length === 1) {
        typedBuffer.current += e.key.toLowerCase();
        if (typedBuffer.current.includes(copy.palette.easterEggTrigger) && !easterEggTriggered.current) {
          triggerEasterEgg();
          easterEggTriggered.current = true;
        }
        if (typedBuffer.current.length > 20) {
          typedBuffer.current = typedBuffer.current.slice(-20);
        }
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isOpen, handleKeyDown]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const openPalette = () => {
    setQuery('');
    setSelectedIndex(0);
    setIsOpen(true);
    dialogRef.current?.showModal();
  };

  const closePalette = () => {
    setIsOpen(false);
    dialogRef.current?.close();
  };

  const executeCommand = (command: typeof commands[0]) => {
    if (!command) return;

    switch (command.action) {
      case 'toggle-theme':
        toggleTheme();
        break;
      case 'copy-email':
        navigator.clipboard.writeText(copy.meta.email);
        break;
      case 'open-resume':
        window.open('/resume.pdf', '_blank');
        break;
      case 'open-github':
        window.open(copy.meta.github, '_blank');
        break;
      case 'open-linkedin':
        window.open(copy.meta.linkedin, '_blank');
        break;
      default:
        if (command.section) {
          navigate(`/${command.section}`);
        }
    }
    closePalette();
  };

  const triggerEasterEgg = () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 200 20');
    svg.style.cssText = `
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 60px;
      pointer-events: none;
      z-index: 9999;
    `;
    svg.innerHTML = `
      <path 
        d="M10,10 Q20,0 30,10 T50,10 T70,10 T90,10 T110,10 T130,10 T150,10 T170,10 T190,10" 
        stroke="var(--signal)" 
        stroke-width="2" 
        fill="none" 
        stroke-linecap="round"
        stroke-dasharray="200"
        stroke-dashoffset="200"
      >
        <animate 
          attributeName="stroke-dashoffset" 
          from="200" 
          to="0" 
          dur="2s" 
          fill="freeze" 
        />
      </path>
    `;
    document.body.appendChild(svg);
    setTimeout(() => svg.remove(), 2500);
  };

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[10000] w-full max-w-2xl max-h-[70vh] overflow-hidden border-2 border-[var(--rule)] bg-[var(--bg)] transition-theme"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      onClick={(e) => e.target === e.currentTarget && closePalette()}
    >
      <form onSubmit={(e) => { e.preventDefault(); executeCommand(filteredCommands[selectedIndex]); }} className="flex flex-col">
        <div className="flex items-center gap-3 p-4 border-b border-[var(--rule)]">
          <kbd className="font-mono uppercase-tracked text-[var(--fg-muted)] px-2 py-1 bg-[var(--rule)] rounded-sm">
            {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}K
          </kbd>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder={copy.palette.placeholder}
            className="flex-1 bg-transparent border-none outline-none text-[var(--fg)] font-body text-[var(--step-1)] placeholder-[var(--fg-muted)]"
            aria-label="Command palette search"
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <div className="max-h-[50vh] overflow-y-auto p-2">
          {filteredCommands.length === 0 ? (
            <div className="px-4 py-8 text-center text-[var(--fg-muted)]">
              No commands found
            </div>
          ) : (
            <ul role="listbox" aria-label="Available commands">
              {filteredCommands.map((command, index) => (
                <li key={command.id} role="option" aria-selected={index === selectedIndex}>
                  <button
                    type="button"
                    onClick={() => executeCommand(command)}
                    className={cn(
                      'w-full px-4 py-3 text-left flex items-center gap-3 transition-colors',
                      'font-body text-[var(--step-0)]',
                      index === selectedIndex
                        ? 'bg-[var(--rule)] text-[var(--fg)]'
                        : 'hover:bg-[var(--rule)]/50 text-[var(--fg-muted)]'
                    )}
                  >
                    <span className="font-mono uppercase-tracked text-[var(--step--1)] text-[var(--fg-muted)] w-24 shrink-0">
                      {command.section ? `GO ${command.section.toUpperCase()}` : command.action?.toUpperCase() || 'ACTION'}
                    </span>
                    <span>{command.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </form>
    </dialog>
  );
}
