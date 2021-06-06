import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';

import rootReducer from './Reducers';
import sagas from './Sagas';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['search']
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default function configureStore(initialState = {}) {
  const sagaMiddleware = createSagaMiddleware({});

  const store = createStore(
    persistedReducer,
    initialState,
    applyMiddleware(sagaMiddleware)
  );

  // Extensions
  store.runSaga = sagaMiddleware.run(sagas);
  store.injectedReducers = {}; // Reducer registry
  store.injectedSagas = {}; // Saga registry

  let persistor = persistStore(store);

  return { store, persistor };
}
