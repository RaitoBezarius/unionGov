import { Store } from 'redux'
import { configureStore } from '@reduxjs/toolkit'
import candidatesSlice from './Candidates/reducer'
import configSlice from './Config/reducer'
import governmentSlice from './Government/reducer'
import positionsSlice from './Positions/reducer'
import {createWrapper, Context, HYDRATE} from 'next-redux-wrapper';

const makeStore = (context: Context) => configureStore({
  reducer: {
    candidates: candidatesSlice.reducer,
    positions: positionsSlice.reducer,
    government: governmentSlice.reducer,
    config: configSlice.reducer
  }
})

const store = configureStore({
  reducer: {
    candidates: candidatesSlice.reducer,
    positions: positionsSlice.reducer,
    government: governmentSlice.reducer,
    config: configSlice.reducer
  }
});

export type RootState = ReturnType<typeof store.getState>;

export const wrapper = createWrapper<Store<RootState>>(makeStore, {debug: !!process.env.NEXT_PUBLIC_DEBUG_REDUX});

export type AppDispatch = typeof store.dispatch;
