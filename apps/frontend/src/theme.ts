import { createTheme } from '@mui/material/styles';

export const cowishTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#eb674e',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#282320',
      contrastText: '#ffffff'
    },
    background: {
      default: '#fbf8f1',
      paper: '#ffffff'
    },
    text: {
      primary: '#282320',
      secondary: '#665d57'
    },
    divider: '#ded7cd'
  },
  typography: {
    fontFamily: "'DM Sans', sans-serif",
    button: {
      fontWeight: 600,
      textTransform: 'none'
    }
  },
  shape: {
    borderRadius: 12
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true
      },
      styleOverrides: {
        root: {
          borderRadius: 999
        }
      }
    }
  }
});
