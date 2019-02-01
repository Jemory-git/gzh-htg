import * as types from './mutation-types';

export const updateIsloading = ({commit}, flag) => {
	commit(types.SET_LOADING, flag)
}