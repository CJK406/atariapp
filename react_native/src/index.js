/**
 * @format
 */

import React from 'react';
import { Root } from 'native-base';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import configureStore from './Redux/Store';
import { setStore as setAPIStore } from './Api/base';
import MainApp from './Main';

import 'react-native-gesture-handler';

const initialState = {};
const { store, persistor } = configureStore(initialState);
setAPIStore(store)

export default class App extends React.Component {
  render() {
    return (
			<Root>
				<Provider store={store}>
					<PersistGate loading={null} persistor={persistor}>
						<MainApp />
					</PersistGate>
				</Provider>
			</Root>
    );
  }
}
