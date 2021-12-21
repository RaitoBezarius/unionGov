import { FunctionComponent, useEffect, useMemo } from 'react';
import { shallowEqual } from 'react-redux';
import Component from '../components/Government';
import { AppDispatch, wrapper } from '../redux/store';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchAllCandidates } from '../redux/Candidates/effects';
import { fetchAllPositions } from '../redux/Positions/effects';
import { allPositionIdsSelector } from '../redux/Positions/selectors';
import { fetchGovernmentById } from '../redux/Government/effects';
import { setCandidateAction } from '../redux/Government/reducer';
import { GovernmentState } from '../redux/Government/state';
import { useRouter } from 'next/router';
import { GetStaticProps, GetStaticPaths } from 'next';
import endpoints from '../api/endpoints.config';
import { ParsedUrlQuery } from 'querystring';

const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_BASE_URL ?? '';
const mkPermanentUrl = (id?: string) => (id ? `${baseUrl}/${id}` : baseUrl);
const mkThumbnailUrl = (id?: string) =>
  id ? `${endpoints.ApiBaseUrl}/thumbnail/${id}` : '';

interface IParams extends ParsedUrlQuery {
  id: string;
}

interface ConfigRef {
  id: number;
};

interface GovernmentProps {
  hydrated?: boolean;
};

async function loadGovernmentData (dispatch: AppDispatch, id?: string) {
  await dispatch(fetchAllPositions());
  await dispatch(fetchAllCandidates());

  if (id) {
    const numberId = +id;
    const res: any = await dispatch(fetchGovernmentById(numberId));
    const newGovernement: GovernmentState = res?.payload;
    if (newGovernement) {
      Object.entries(newGovernement).forEach(([position, candidate]) => {
        dispatch(
          setCandidateAction({ candidateId: candidate, positionId: position })
        );
      });
    }
  }
}

export const getStaticProps: GetStaticProps = wrapper.getStaticProps(
  store => async ({ params }) => {
    await loadGovernmentData(store.dispatch, (params as IParams).id);
    return { props: { hydrated: true } };
  }
);

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const res = await fetch(`${endpoints.ApiBaseUrl}/api/configRefs/`);
    const configs = await res.json();

    return {
      paths: configs.map(({ id }: ConfigRef) => ({ params: { id: id.toString() } })),
      fallback: true
    };
  } catch (Exception) {
    console.log('getStaticPaths: could not fetch current config refs');
    return { paths: [], fallback: true };
  }
}

/** Government screen entry */
const Government: FunctionComponent<GovernmentProps> = ({ hydrated }) => {
  const positionIds = useAppSelector(allPositionIdsSelector, shallowEqual);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params: { id: string } = (router.query as IParams);

  const items = useMemo(() => positionIds.map(positionId => ({ positionId })), [
    positionIds
  ]);

  useEffect(() => {
    if (!hydrated) loadGovernmentData(dispatch, params.id);
  }, [params.id]);

  return (
    <Component
      items={items}
      thumbnailURL={mkThumbnailUrl(params.id)}
      permanentURL={mkPermanentUrl(params.id)}
      noShare
    />
  );
};

export default Government;
