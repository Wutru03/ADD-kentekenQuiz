/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

export const Colors = {
  light: {
    text: '#22303C',
    background: '#F5F2EC',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
    card: '#FFFFFF',
    badge: '#2E7D5B',
    badgeText: '#FFFFFF',
    error: '#B3261E',
  },
  dark: {
    text: '#F2F4F5',
    background: '#171A1D',
    backgroundElement: '#282E33',
    backgroundSelected: '#3A4248',
    textSecondary: '#B4BDC4',
    card: '#202529',
    badge: '#347A59',
    badgeText: '#FFFFFF',
    error: '#FF8A80',
  },
} as const;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radius = { s: 8, m: 12, l: 16 } as const;

// Colours the template used as loose hex codes.
export const Brand = { splash: '#208AEF' } as const;
