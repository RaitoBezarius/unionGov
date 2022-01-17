import { FunctionComponent, useCallback, useState } from 'react';
import Component from '../components/ShareButton';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import useMissingGovernmentPositionCount from '../hooks/use-missing-government-position-count';
import { configSelector } from '../redux/Config/selectors';
import { EmptyRecord } from '../types';
import { shallowEqual } from 'react-redux';
import { governmentSelector } from '../redux/Government/selectors'
import { setGovernmentById } from '../redux/Government/effects';
import { ConfigState } from '../redux/Config/state';
import { GovernmentState } from '../redux/Government/state';
export type Props = {
  shareLink?: string;
};

const mkPrimaryLink = (id: number | undefined) => `${process.env.NEXT_PUBLIC_FRONTEND_BASE_URL}/${id}`

/**
 * ShareButton container
 * Handles what to trigger when the optional Button is clicked on
 */
const ShareButton: FunctionComponent<Props> = (props: Props) => {
  const missingCount = useMissingGovernmentPositionCount();
  const dispatch = useAppDispatch()
  const [isOpen, setIsOpen] = useState(false)
  const [shareLink, setShareLink] = useState('')
  const config: ConfigState = useAppSelector(configSelector, shallowEqual);
  const governement: GovernmentState = useAppSelector(governmentSelector, shallowEqual)
  const { id } = config
  const handleShare = useCallback(() => {
    setIsOpen(!isOpen)
    // Do not reshare already shared governments.
    if (!props.shareLink) {
      dispatch(setGovernmentById({ config, governement }))
      if (id) {
        setShareLink(mkPrimaryLink(id))
      }
    }
  }, [id, governement, isOpen, props.shareLink]);

  const onCopy = useCallback(() => {
    navigator.clipboard.writeText(mkPrimaryLink(id))
  }, [id])

  return (
    <Component
      isDisabled={missingCount !== 0}
      missingPositionCount={missingCount}
      onShare={handleShare}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      shareLink={props.shareLink || shareLink}
      onCopy={onCopy}
    />
  );
};

export default ShareButton;
