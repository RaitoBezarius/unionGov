import { Button, Typography, Dialog, DialogTitle } from '@material-ui/core';
import { CSSProperties, FunctionComponent, memo } from 'react';
import { FacebookShareButton, LinkedinShareButton, TwitterShareButton, FacebookIcon, LinkedinIcon, TwitterIcon } from 'react-share';
import theme from '../../theme';

const SHARE_TITLE = 'Partagez votre gouvernement idéal !';
const SHARE_HASHTAGS = ['PrimairePopulaire', 'PlusBelleLaPolitique', '2022AvecVous'];
const SHARE_MESSAGE = 'La #démocratie ce n\'est pas seulement un président : signez l\'appel de la #PrimairePopulaire #PlusBelleLaPolitique #2022AvecVous';
const SHARE_TWITTER_ACCOUNT = 'PrimairePop';

export type Props = {
  isDisabled?: boolean;
  /** The number of positions still waiting for a user-candidate */
  missingPositionCount?: number;
  onShare: () => void;
  isOpen : boolean;
  setIsOpen: any;
  shareLink: string;
  onCopy: () => void;
}

type Styles = {
  separator: CSSProperties;
  shareIcon: CSSProperties;
  shareIconDisabled: CSSProperties;
};

const styles: Styles = {
  separator: {
    height: 0.5,
    backgroundColor: theme.palette.divider,
    width: '100%'
  },
  shareIcon: {
    fontSize: 26,
    color: theme.palette.secondary.main
  },
  shareIconDisabled: {
    fontSize: 26,
    color: theme.palette.grey[400]
  }
};

const ShareButton: FunctionComponent<Props> = memo(
  ({ isDisabled = false, missingPositionCount, onShare, isOpen, setIsOpen, shareLink, onCopy }) => (
    <div className="container">
      <div className="row mx-4">
        <Button
          className="flex-fill text-center align-items-center justify-content-center d-flex"
          disabled={isDisabled}
          variant="outlined"
          size="large"
          color="primary"
          onClick={onShare}
          endIcon={
            <i
              className="pl-2 bi-share m-auto"
              style={styles[isDisabled ? 'shareIconDisabled' : 'shareIcon']}
            />
          }
        >
          Partager
        </Button>
      </div>
      {!!missingPositionCount && <div className="row mx-4 mt-2">
        <Typography className="flex-fill pr-2" variant="caption" color="primary">
          Encore {missingPositionCount} poste(s) à attribuer !
        </Typography>
      </div>}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <DialogTitle>Envoies ce lien à tes amis pour partager ton gouvernement idéal!</DialogTitle>
        <Typography className="flex-fill text-center align-items-center justify-content-center d-flex" color="secondary">
          {shareLink}
        </Typography>
        <div className="row mx-auto pb-4 pt-4">
          <Button variant="contained" color="primary" onClick={onCopy}>
            Copier le lien
          </Button>
          <FacebookShareButton url={'github.com'} quote={`${SHARE_TITLE}\n${SHARE_MESSAGE}`} hashtag={`#${SHARE_HASHTAGS[0]}`}>
            <FacebookIcon size={32} round />
          </FacebookShareButton>
          <LinkedinShareButton title={SHARE_TITLE} summary={SHARE_MESSAGE} source={shareLink} url={'github.com'}>
            <LinkedinIcon size={32} round />
          </LinkedinShareButton>
          <TwitterShareButton title={`${SHARE_TITLE}\n${SHARE_MESSAGE}`} via={SHARE_TWITTER_ACCOUNT} related={[SHARE_TWITTER_ACCOUNT]} url={shareLink}>
            <TwitterIcon size={32} round />
          </TwitterShareButton>
        </div>
      </Dialog>
    </div>
  )
);
ShareButton.displayName = 'ShareButton';

export default ShareButton;
