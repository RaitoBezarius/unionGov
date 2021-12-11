import { FC } from 'react';
import { AppProps } from 'next/app';
import { wrapper } from '../redux/store';
import { ThemeProvider } from '@material-ui/core';
import Navigation from '../navigation';
import theme from '../theme';
import '../index.css';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';

axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN'
axios.defaults.xsrfCookieName = 'csrftoken'

const WrappedApp: FC<AppProps> = ({ Component, pageProps }) => (
  <ThemeProvider theme={theme}>
    <Navigation>
      <Component {...pageProps} />
    </Navigation>
  </ThemeProvider>
);

export default wrapper.withRedux(WrappedApp);
