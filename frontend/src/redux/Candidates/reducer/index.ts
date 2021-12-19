import {
  createSlice,
  AnyAction
} from '@reduxjs/toolkit';
import { fetchAllCandidates } from '../effects';
import { candidatesAdapter, initialCandidatesState } from '../state';
import { HYDRATE } from 'next-redux-wrapper';

function isHydrateAction(action: AnyAction) {
  return action.type === HYDRATE;
}

const candidatesSlice = createSlice({
  name: 'candidates',
  initialState: initialCandidatesState(),
  reducers: {
    upsertMany: candidatesAdapter.upsertMany
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllCandidates.fulfilled, (state, action) => {
      action.payload && candidatesAdapter.upsertMany(state, action.payload);
    })
    .addMatcher(isHydrateAction, (state, action) => {
      return {
        ...state, ...action.payload.candidates
      };
    });
  }
})

export default candidatesSlice
