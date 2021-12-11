import AppBar from '@material-ui/core/AppBar';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { NextLinkComposed } from '../components/Link';
import { FunctionComponent } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Candidates from '../pages/candidates';
import Government from '../pages/government';
import { withRouter, NextRouter } from 'next/router';

interface WithRouterProps {
  router: NextRouter;
};

function a11yProps (index: any) {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`
  };
}

const TABS = [
  { label: 'gouvernement', ...a11yProps(0), to: '/' },
  { label: 'personnalités', ...a11yProps(1), to: '/candidates' }
];

const Navigation: FunctionComponent<WithRouterProps> = ({ router, children }) => (
  <div className="flex-fill">
    <AppBar position="static">
      <Header />
      <Tabs
        value={router.pathname === '/candidates' ? 1 : 0}
        variant="fullWidth"
        scrollButtons="auto"
        aria-label="scrollable auto tabs example"
      >
        {TABS.map((props) => (
          <Tab key={`nav-tab-${props.label}`} component={NextLinkComposed} {...props} />
        ))}
      </Tabs>
    </AppBar>
    <div className="container-fluid min-vh-100">
      {children}
    </div>
    <div className="mt-4">
      <Footer />
    </div>
  </div>
);

export default withRouter(Navigation);
