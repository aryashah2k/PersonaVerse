import { createTheme, responsiveFontSizes } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Theme {
    status: {
      danger: string;
    };
  }
  interface ThemeOptions {
    status?: {
      danger?: string;
    };
  }
}

let theme = createTheme({
  palette: {
    primary: {
      main: '#6366F1',
      light: '#818CF8',
      dark: '#4F46E5',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#14B8A6',
      light: '#5EEAD4',
      dark: '#0F766E',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#EF4444',
      light: '#FCA5A5',
      dark: '#B91C1C',
    },
    warning: {
      main: '#F59E0B',
      light: '#FCD34D',
      dark: '#B45309',
    },
    info: {
      main: '#3B82F6',
      light: '#93C5FD',
      dark: '#1D4ED8',
    },
    success: {
      main: '#10B981',
      light: '#6EE7B7',
      dark: '#047857',
    },
    grey: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
      A100: '#F3F4F6',
      A200: '#E5E7EB',
      A400: '#9CA3AF',
      A700: '#374151',
    },
    text: {
      primary: '#111827',
      secondary: '#6B7280',
      disabled: '#9CA3AF',
    },
    background: {
      default: '#F9FAFB',
      paper: '#FFFFFF',
    },
    divider: 'rgba(0, 0, 0, 0.08)',
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '3.5rem',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 700,
      fontSize: '3rem',
      lineHeight: 1.2,
    },
    h3: {
      fontWeight: 700,
      fontSize: '2.25rem',
      lineHeight: 1.2,
    },
    h4: {
      fontWeight: 700,
      fontSize: '1.75rem',
      lineHeight: 1.2,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.2,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.2,
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 8,
  },
  // Shadows array must have exactly 25 entries for MUI
  shadows: [
    'none',
    '0px 1px 2px rgba(0, 0, 0, 0.06), 0px 1px 3px rgba(0, 0, 0, 0.1)',
    '0px 1px 5px rgba(0, 0, 0, 0.05), 0px 1px 3px rgba(0, 0, 0, 0.1)',
    '0px 2px 6px rgba(0, 0, 0, 0.04), 0px 2px 4px rgba(0, 0, 0, 0.12)',
    '0px 2px 8px rgba(0, 0, 0, 0.05), 0px 3px 6px rgba(0, 0, 0, 0.1)',
    '0px 4px 12px rgba(0, 0, 0, 0.06), 0px 4px 6px rgba(0, 0, 0, 0.12)',
    '0px 5px 15px rgba(0, 0, 0, 0.08), 0px 5px 8px rgba(0, 0, 0, 0.08)',
    '0px 6px 15px rgba(0, 0, 0, 0.08), 0px 6px 10px rgba(0, 0, 0, 0.12)',
    '0px 8px 18px rgba(0, 0, 0, 0.1), 0px 8px 12px rgba(0, 0, 0, 0.14)',
    '0px 10px 20px rgba(0, 0, 0, 0.1), 0px 10px 14px rgba(0, 0, 0, 0.14)',
    '0px 12px 22px rgba(0, 0, 0, 0.12), 0px 12px 16px rgba(0, 0, 0, 0.16)',
    '0px 14px 24px rgba(0, 0, 0, 0.12), 0px 14px 18px rgba(0, 0, 0, 0.18)',
    '0px 16px 28px rgba(0, 0, 0, 0.14), 0px 16px 20px rgba(0, 0, 0, 0.2)',
    '0px 18px 30px rgba(0, 0, 0, 0.14), 0px 18px 22px rgba(0, 0, 0, 0.22)',
    '0px 20px 32px rgba(0, 0, 0, 0.16), 0px 20px 24px rgba(0, 0, 0, 0.24)',
    '0px 22px 34px rgba(0, 0, 0, 0.16), 0px 22px 26px rgba(0, 0, 0, 0.26)',
    '0px 24px 36px rgba(0, 0, 0, 0.18), 0px 24px 28px rgba(0, 0, 0, 0.28)',
    '0px 26px 38px rgba(0, 0, 0, 0.18), 0px 26px 30px rgba(0, 0, 0, 0.3)',
    '0px 28px 40px rgba(0, 0, 0, 0.2), 0px 28px 32px rgba(0, 0, 0, 0.32)',
    '0px 30px 42px rgba(0, 0, 0, 0.2), 0px 30px 34px rgba(0, 0, 0, 0.34)',
    '0px 32px 44px rgba(0, 0, 0, 0.22), 0px 32px 36px rgba(0, 0, 0, 0.36)',
    '0px 34px 46px rgba(0, 0, 0, 0.22), 0px 34px 38px rgba(0, 0, 0, 0.38)',
    '0px 36px 48px rgba(0, 0, 0, 0.24), 0px 36px 40px rgba(0, 0, 0, 0.4)',
    '0px 38px 50px rgba(0, 0, 0, 0.24), 0px 38px 42px rgba(0, 0, 0, 0.42)',
    '0px 40px 52px rgba(0, 0, 0, 0.26), 0px 40px 44px rgba(0, 0, 0, 0.44)',
  ],
  status: {
    danger: '#EF4444',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontSize: '0.875rem',
          fontWeight: 600,
        },
        contained: {
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 12,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '14px 16px',
        },
        head: {
          fontWeight: 600,
          color: '#374151',
        },
      },
    },
  },
});

theme = responsiveFontSizes(theme);

export default theme;
