import {
  createSlice,
  AnyAction
} from '@reduxjs/toolkit';
import { fetchAllPositions } from '../effects';
import { positionsAdapter } from '../state';
import { HYDRATE } from 'next-redux-wrapper';

function isHydrateAction(action: AnyAction) {
  return action.type === HYDRATE;
}

const positionsSlice = createSlice({
  name: 'positions',
  initialState: positionsAdapter.getInitialState({}),
  reducers: {
    upsertMany: positionsAdapter.upsertMany
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllPositions.fulfilled, (state, action) => {
        action.payload && positionsAdapter.upsertMany(state, action.payload);
      })
      .addMatcher(isHydrateAction, (state, action) => {
        return {
          ...state, ...action.payload.positions
        };
      });
  }
});

export default positionsSlice
