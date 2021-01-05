import { all, fork } from 'redux-saga/effects';
import { watchSignout, watchSetUserInfo,watchSetToken} from './auth';
export default function* rootSaga() {
	yield all([
		// auth
		fork(watchSignout),
		fork(watchSetUserInfo),
		fork(watchSetToken),

	]);
}