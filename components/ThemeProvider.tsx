'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  isDark: true,
  toggleTheme: () => {},
  setTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 1. Check localStorage first
    const stored = (localStorage.getItem('userscope-theme') || localStorage.getItem('spectra-theme')) as Theme | null;
    if (stored === 'dark' || stored === 'light') {
      setThemeState(stored);
      applyTheme(stored);
    } else {
      // 2. Fallback to OS preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initial = prefersDark ? 'dark' : 'light';
      setThemeState(initial);
      applyTheme(initial);
    }
    setMounted(true);

    // 3. Listen to system preference changes if no manual preference stored
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = (e: MediaQueryListEvent) => {
      const storedPref = localStorage.getItem('userscope-theme') || localStorage.getItem('spectra-theme');
      if (!storedPref) {
        const next = e.matches ? 'dark' : 'light';
        setThemeState(next);
        applyTheme(next);
      }
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, []);

  const applyTheme = (t: Theme, withTransition: boolean = true) => {
    const root = document.documentElement;

    const mutateDom = () => {
      if (t === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    if (withTransition && typeof document !== 'undefined') {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // 1. Native View Transitions API (Chrome 111+, Safari 18+)
      if (!prefersReducedMotion && 'startViewTransition' in document) {
        try {
          const transition = (document as any).startViewTransition(() => {
            mutateDom();
          });
          // Catch and ignore AbortError if user clicks rapidly or skips transition
          if (transition && typeof transition.ready?.catch === 'function') {
            transition.ready.catch(() => {});
          }
          if (transition && typeof transition.finished?.catch === 'function') {
            transition.finished.catch(() => {});
          }
        } catch {
          mutateDom();
        }
        return;
      }

      // 2. Smooth CSS transition class fallback
      root.classList.add('theme-transitioning');
      mutateDom();
      setTimeout(() => {
        root.classList.remove('theme-transitioning');
      }, 450);
      return;
    }

    mutateDom();
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('userscope-theme', newTheme);
    applyTheme(newTheme, true);
  };

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark: theme === 'dark', toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
