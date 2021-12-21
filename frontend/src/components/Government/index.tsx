import { Typography } from '@material-ui/core';
import { FunctionComponent, memo } from 'react';
import Head from 'next/head';
import Item, { Props as ItemProps } from '../../containers/GovernmentItem';
import ShareButton from '../../containers/ShareButton';

export type Props = {
  items?: ItemProps[];
  permanentURL?: string;
  thumbnailURL?: string;
};

const EMPTY_ITEMS: NonNullable<Props['items']> = [];

/** @TODO handle loading state (placeholders would be great) */
const Government: FunctionComponent<Props> = memo(({ items = EMPTY_ITEMS, thumbnailURL, permanentURL }) => (
  <div className="container mt-4 p-0 justify-content-center">
    <Head>
      <meta property="og:title" content="Mon gouvernement idéal !"/>
      <meta property="og:type" content="website"/>
      {permanentURL && <meta property="og:url" content={permanentURL} />}
      {thumbnailURL && <meta property="og:image" content={thumbnailURL} />}
      <meta property="og:description" content="Composez vous aussi votre gouvernement idéal !"/>
      <meta property="og:site_name" content="UnionGov" />
    </Head>
    <Typography variant="body1" className="flex-fill text-center pb-4" color="textSecondary">
      {`La démocratie ce n'est pas seulement un ou une présidente de la République, il faut toute une équipe !
      Mais le gouvernement se construit de façon opaque après l'élection présidentielle, et sans garantie : par exemple en 2017 le président avait annoncé qu'il nommerait première ministre une femme ni de gauche ni de droite, et il a finalement nommé un homme de droite.
      De plus, face à l'enjeu de l'union des gauches et de l'écologie pour gagner l'élection présidentielle, la rhétorique "oui pour l'union, mais derrière moi!" utilisé par les candidats ne marche pas.`}
    </Typography>
    <Typography variant="body1" className="flex-fill text-center pb-4" color="textSecondary">
      {`Alors à vous de jouer !
      Proposez votre gouvernement idéal dans le cadre du `}
      <a href="https://primairepopulaire.fr/le-socle-commun/">Socle Commun</a> 
      {` porté par la Primaire Populaire et partagez le sur les réseaux pour qu'ensemble, nous fassions émerger la façon dont nous pourrions proposer une alternative coopérative et collective dans le cadre de l'élection présidentielle, qui en Vème République reste si monarchique.`}
    </Typography>
    <div className="row col-md-6 col-sm-10 col-lg-4 mx-auto p-0">
      <div className="card px-3">
        <ul className="list-group list-group-flush border-top-0">
          {items.map((item, index) => (
            <Item key={`governement-item-${index}`} {...item} />
          ))}
        </ul>
      </div>
    </div>
    <div className="row align-items-center justify-content-center mt-4">
      <ShareButton />
    </div>
  </div>
));
Government.displayName = 'Government';

export default Government;
