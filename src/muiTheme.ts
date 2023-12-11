import { createTheme } from '@mui/material/styles';

// Import the Nunito Sans font
import '@fontsource/nunito-sans';

const theme = createTheme({
  palette: {
    primary: {
      main: '#ff7400',
    },
    secondary: {
      main: '#f50057',
    },
  },
  typography: {
    fontFamily: 'Nunito Sans, sans-serif',
  },
});

export default theme;
