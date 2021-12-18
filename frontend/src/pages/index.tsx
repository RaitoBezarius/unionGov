import { FunctionComponent, useEffect, useMemo } from 'react';
import { shallowEqual } from 'react-redux';
import Component from '../components/Government';
import { AppDispatch, wrapper } from '../redux/store';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchAllCandidates } from '../redux/Candidates/effects';
import { fetchAllPositions } from '../redux/Positions/effects';
import { allPositionIdsSelector } from '../redux/Positions/selectors';
import { EmptyRecord } from '../types';
import { fetchNewConfigRef } from '../redux/Config/effects';
import { GetStaticProps } from 'next';

async function loadGovernmentData (dispatch: AppDispatch) {
  await dispatch(fetchAllPositions());
  await dispatch(fetchAllCandidates());
}

export const getStaticProps: GetStaticProps = wrapper.getStaticProps(
  store => async ({ params }) => {
    await loadGovernmentData(store.dispatch);
    return { props: {} };
  }
);

/** Government screen entry */
const Government: FunctionComponent<EmptyRecord> = () => {
  const positionIds = useAppSelector(allPositionIdsSelector, shallowEqual);
  const dispatch = useAppDispatch();

  const items = useMemo(() => positionIds.map(positionId => ({ positionId })), [
    positionIds
  ]);

  // <=> componentDidMount
  useEffect(() => {
    loadGovernmentData(dispatch);
    dispatch(fetchNewConfigRef());
    // cleanup function called when component is unmounted
    return () => undefined;
  }, []);

  return (
    <Component
      items={items}
    />
  );
};

export default Government;
