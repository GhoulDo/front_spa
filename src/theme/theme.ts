import { createTheme } from '@mui/material/styles';

// Tema personalizado para la aplicación
const theme = createTheme({
  palette: {
    primary: {
      main: '#8d6e63', // Marrón pardo como color principal
      light: '#be9c91',
      dark: '#5f4339',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#66bb6a', // Verde para acentos
      light: '#98ee99',
      dark: '#338a3e',
      contrastText: '#000000',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    error: {
      main: '#f44336',
    },
    warning: {
      main: '#ff9800',
    },
    info: {
      main: '#2196f3',
    },
    success: {
      main: '#4caf50',
    },
  },
  typography: {
    fontFamily: '"Nunito", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
      color: '#5f4339',
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
    subtitle1: {
      fontSize: '1.2rem',
      color: '#6d4c41',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 25,
          boxShadow: '0px 4px 7px rgba(0, 0, 0, 0.1)',
          padding: '10px 20px',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0px 7px 10px rgba(0, 0, 0, 0.15)',
          },
        },
        containedPrimary: {
          backgroundImage: 'linear-gradient(45deg, #8d6e63 30%, #a1887f 90%)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          margin: '10px 0',
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0px 10px 25px rgba(0, 0, 0, 0.1)',
        },
        elevation1: {
          boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          overflow: 'hidden',
          transition: 'transform 0.3s, box-shadow 0.3s',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0px 12px 30px rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#f5f5f5',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          color: '#5f4339',
        },
      },
    },
  },
});

export default theme;
