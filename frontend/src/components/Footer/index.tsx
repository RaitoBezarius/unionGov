import { Link, Typography } from '@material-ui/core';
import NextLink from 'next/link';
import { CSSProperties, FunctionComponent, memo } from 'react';
import theme from '../../theme';
import { EmptyRecord } from '../../types';

type Styles = {
  container: CSSProperties;
};

const styles: Styles = {
  container: {
    backgroundColor: theme.palette.grey[50]
  }
};

const Footer: FunctionComponent<EmptyRecord> = memo(() => (
  <footer style={styles.container}>
    <div className="py-4 px-5 border-top">
      <Typography align="justify">
        Ce site est un projet parallèle à la{' '}
        <Link rel="noopener" href="https://primairepopulaire.fr/">
          Primaire Populaire
        </Link>.
      </Typography>

      <Typography align="justify">
        <NextLink href='/credits'>Mentions légales</NextLink>
      </Typography>

      <Typography align="justify">
        Les contributions (en code !) pour ce site sont les bienvenues, voir le{' '}
        <Link rel="noopener" href="https://github.com/RaitoBezarius/unionGov">
          dépôt GitHub
        </Link>{' '}
         associé.
      </Typography>
    </div>
  </footer>
));
Footer.displayName = 'Footer';

export default Footer;
