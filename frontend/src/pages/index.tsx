import { FunctionComponent, useEffect, useMemo } from 'react';
import { shallowEqual } from 'react-redux';
import Component from '../components/Government';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchAllCandidates } from '../redux/Candidates/effects';
import { fetchAllPositions } from '../redux/Positions/effects';
import { allPositionIdsSelector } from '../redux/Positions/selectors';
import { EmptyRecord } from '../types';
import { fetchNewConfigRef } from '../redux/Config/effects';
import { fetchGovernmentById } from '../redux/Government/effects';
import { setCandidateAction } from '../redux/Government/reducer';
import { GovernmentState } from '../redux/Government/state';
import { useRouter } from 'next/router';
import endpoints from '../api/endpoints.config';

const baseUrl = process.env.FRONTEND_BASE_URL ?? '';
const mkPermanentUrl = (id?: string) => id ? `${baseUrl}/${id}` : baseUrl;
const mkThumbnailUrl = (id?: string) => id ? `${endpoints.ApiBaseUrl}/thumbnail/${id}` : '';

/** Government screen entry */
const Government: FunctionComponent<EmptyRecord> = () => {
  const positionIds = useAppSelector(allPositionIdsSelector, shallowEqual);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params: { id?: string } = router.query;

  const items = useMemo(
    () => positionIds.map((positionId) => ({ positionId })),
    [positionIds]
  );

  // <=> componentDidMount
  useEffect(() => {
    dispatch(fetchAllPositions());
    dispatch(fetchAllCandidates());
    dispatch(fetchNewConfigRef())
    if (params?.id) {
      const numberId = Number(params?.id)
      dispatch(fetchGovernmentById(numberId)).then((res: any) => {
        const newGovernement: GovernmentState = res?.payload
        if (newGovernement) {
          Object.entries(newGovernement).forEach(([position, candidate]) => {
            dispatch(setCandidateAction({ candidateId: candidate, positionId: position }));
          })
        }
      })
    }
    // cleanup function called when component is unmounted
    return () => undefined;
  }, [])

  return <Component items={items} thumbnailURL={mkThumbnailUrl(params?.id)} permanentURL={mkPermanentUrl(params?.id)} />;
};

export default Government;
