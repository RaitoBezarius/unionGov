import { Typography } from '@material-ui/core';
import { FunctionComponent, memo } from 'react';
import Image from 'next/image';
import SlotImage from './candidate-slot.png';

export type Props = {
  imageUrl: string;
  label: string;
};

// TODO: put slot image behind the image of the candidate, using positive rel + zindex.
/** Displays a candidate list item */
const CandidateItem: FunctionComponent<Props> = memo(({ imageUrl, label }) => (
  <li className="flex-fill list-group-item d-flex justify-content-between align-items-center">
    <Typography className="col-10">{label}</Typography>
    {/* <Image src={SlotImage} alt='Hexagone jaune pour accueillir les images de candidats' layout='responsive' className="" /> */}
  </li>
));
CandidateItem.displayName = 'CandidateItem';

export default CandidateItem;
