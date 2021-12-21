import { Typography } from '@material-ui/core';
import { FunctionComponent, memo } from 'react';
// import Image from 'next/image';
// import SlotImage from './candidate-slot.png';

export type Props = {
  websiteUrl?: string;
  imageUrl: string;
  label: string;
};

// TODO: put slot image behind the image of the candidate, using positive rel + zindex.
/** Displays a candidate list item */
const CandidateItem: FunctionComponent<Props> = memo(({ imageUrl, label, websiteUrl }) => (
  <li className="flex-fill list-group-item d-flex justify-content-between align-items-center">
    <Typography className="col-10">
      {websiteUrl ? (<a href={websiteUrl}>{label}</a>) : label}
    </Typography>
    <img className="col-2" src={imageUrl} alt={label} />
    {/* <Image src={SlotImage} alt='Hexagone jaune pour accueillir les images de candidats' layout='responsive' className="" /> */}
  </li>
));
CandidateItem.displayName = 'CandidateItem';

export default CandidateItem;
