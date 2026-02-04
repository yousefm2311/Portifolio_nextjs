'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Theme } from '@/lib/theme';
import { themes } from '@/lib/theme';

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  availableThemes: typeof themes;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export default function ThemeProvider({
  initialTheme,
  children
}: {
  initialTheme: Theme;
  children: React.ReactNode;
}) {
  const fallbackTheme =
    themes.find((item) => item.id === initialTheme)?.id ?? 'neon';
  const [theme, setThemeState] = useState<Theme>(fallbackTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.cookie = `theme=${theme}; path=/; max-age=31536000`;
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      setTheme: setThemeState,
      availableThemes: themes
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
}
