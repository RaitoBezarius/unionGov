import { createTheme } from '@material-ui/core/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#07737D'
    },
    secondary: {
      main: '#D0B228'
    },
    background: {
      default: '#ffffff'
    },
    action: {
      active: '#ffad84'
    },
    info: {
      main: '#ab3d06'
    }
  }
});

export default theme;
