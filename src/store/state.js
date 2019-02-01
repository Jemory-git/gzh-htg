import {
  loadLoginState,
  loadPraise,
  loadLike,
  loadUserInfo,
  loadCurrentChild,
  loadCurrentChildIndex,
  loadIntegral,
  loadParams
} from 'common/js/cache';

const state = {
  user: loadUserInfo(),
  loginState: loadLoginState(),
  voicePlaying: false,
  currentVoice: '',
  likeList: loadLike(),
  currentChild: loadCurrentChild(),
  currentChildIndex: loadCurrentChildIndex(),
  integral: loadIntegral(),
  resultTip: {},
  params: loadParams(),
  video: {},
  isLoading: false,
}

export default state;
