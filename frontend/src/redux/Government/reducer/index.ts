import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ApiCandidate, ApiPosition } from '../../../types/api';
import { initialGovernmentState } from '../state';
import { HYDRATE } from 'next-redux-wrapper';

type SetGovernmentCandidate = { candidateId?: ApiCandidate['id']; positionId: ApiPosition['id'] };

const governmentSlice = createSlice({
  name: 'government',
  initialState: initialGovernmentState(),
  reducers: {
    setCandidate: (state, { payload: { positionId, candidateId } }: PayloadAction<SetGovernmentCandidate>): void => {
      if (candidateId) {
        state[positionId] = candidateId;
      } else if (state[positionId]) {
        delete state[positionId];
      }
    }
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return action.payload.government; // Ignore client data until the next action.
    }
  }
})

export const { setCandidate: setCandidateAction } = governmentSlice.actions;

export default governmentSlice
