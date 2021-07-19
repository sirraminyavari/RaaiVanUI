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
import rootReducer from './reducers/rootReducer';

const MIGRATION_DEBUG = true;

const migrations = {
  13: (previousVersionState) => ({
    ...previousVersionState,
    raaivanVersion: {
      lastUpdate: JSON.stringify(new Date()),
    },
  }),
};

const persistConfig = {
  key: 'Raaivan',
  version: 13,
  storage,
  debug: true,
  stateReconciler: autoMergeLevel2,
  migrate: createMigrate(migrations, { debug: MIGRATION_DEBUG }),
  whitelist: ['theme', 'sidebarItems', 'applications', 'raaivanVersion'],
  blacklist: [],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }),
});

export let persistor = persistStore(store);
