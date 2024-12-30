// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import orebiReducer from './orebiSlice';
import authReducer from './authSlice';

// Combine reducers
const rootReducer = combineReducers({
  orebi: orebiReducer,
  auth: authReducer,
});

// Persist configuration
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  // whitelist: ['auth' , 'orebi'], // Specify which reducers to persist
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
