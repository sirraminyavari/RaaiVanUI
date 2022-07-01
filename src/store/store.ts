/**
 * Create the store with dynamic reducers
 */

import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  createMigrate,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import storage from 'redux-persist/lib/storage';

import { createInjectorsEnhancer } from 'redux-injectors';
import createSagaMiddleware from 'redux-saga';

import { createReducer } from './reducers';

const MIGRATION_DEBUG = true;

const migrations = {
  18: (previousVersionState) => ({
    ...previousVersionState,
    raaivanVersion: {
      lastUpdate: JSON.stringify(new Date()),
    },
  }),
};

const persistConfig = {
  key: 'Raaivan',
  version: 18,
  storage,
  debug: true,
  stateReconciler: autoMergeLevel2,
  migrate: createMigrate(migrations, { debug: MIGRATION_DEBUG }),
  whitelist: ['theme', 'sidebarItems', 'applications', 'raaivanVersion'],
  blacklist: ['onboarding'],
};

const persistedReducer = persistReducer(persistConfig, createReducer());

//create store
const reduxSagaMonitorOptions = {};
const sagaMiddleware = createSagaMiddleware(reduxSagaMonitorOptions);
const { run: runSaga } = sagaMiddleware;

// Create the store with saga middleware
const middlewares = [sagaMiddleware];

const enhancers = [
  createInjectorsEnhancer({
    createReducer,
    runSaga,
  }),
];

export const store = configureStore({
  reducer: persistedReducer,
  middleware: [
    ...getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
    ...middlewares,
  ],
  devTools: process.env.NODE_ENV !== 'production',
  enhancers,
});
//end of create store

export let persistor = persistStore(store);
