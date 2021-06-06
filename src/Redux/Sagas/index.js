import { all, fork } from 'redux-saga/effects';
import { watchSetUserInfo,watchSetToken,watchSetPincode,watchgetAllAddress,watchUpdateBallance} from './auth';
export default function* rootSaga() {
	yield all([
		// auth
		fork(watchSetUserInfo),
		fork(watchSetToken),
		fork(watchSetPincode),
		fork(watchgetAllAddress),
		fork(watchUpdateBallance),
	]);
}