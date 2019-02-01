import * as types from './mutation-types';
import {saveLoginState, savePraise, saveLike, setUserInfo,
	saveCurrentChild, saveCurrentChildIndex, saveIntegral,
	modifyChildInfo, modifyUserInfo, saveParams} from 'common/js/cache';

const mutations = {
	[types.SET_USER](state, user) {
		state.user = user;
		setUserInfo(user);
	},
	[types.SET_LOGIN_STATE](state, flag) {
		state.loginState = flag;
		// saveLoginState(flag);
	},
	[types.SET_VOICE_PLAYING](state, voicePlaying) {
		state.voicePlaying = voicePlaying;
	},
	[types.SET_CURRENT_VOICE](state, voice) {
		state.currentVoice = voice;
	},
	[types.SET_LIKE_LIST](state, list) {
		state.likeList = list;
	},
	[types.SET_CURRENT_CHILD](state, child) {
		state.currentChild = child;
		saveCurrentChild(child);
	},
	[types.SET_CURRENT_CHILD_INDEX](state, index) {
		state.currentChildIndex = index;
		saveCurrentChildIndex(index);
	},
	[types.SET_INTEGRAL](state, integral) {
		state.integral = integral;
		saveIntegral(integral);
	},
	[types.SET_CHILD_INFO](state, obj) {
		state.currentChild = Object.assign(state.currentChild, obj);
		modifyChildInfo(state.currentChild);
	},
	[types.SET_USER_INFO](state, obj) {
		state.user = Object.assign(state.user, obj);
		modifyUserInfo(state.user);
	},
	[types.SET_RESULT_TIP](state, obj) {
		state.resultTip = obj;
	},
	[types.SET_PARAMS](state, params) {
		state.params = params;
		saveParams(params);
	},
	[types.SET_VIDEO](state, video) {
		state.video = video;
	},
	[types.SET_LOADING](state, flag) {
		state.isLoading = flag;
	},
}

export default mutations;