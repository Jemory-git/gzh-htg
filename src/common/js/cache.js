import storage from 'good-storage';

const LOGIN_KEY = '_login_';

const USER_KEY = '_user_';

const PRAISE_KEY = '_praise_';

const LIKE_KEY = '_like_';

const CHILD_KEY = '_child_';

const CHILD_INDEX_KEY = '_index_';

const INTEGRAL_KEY = '_integral_';

const PARAMS_KEY = '_params_';

function insertArray(arr, val, compare, maxLen) {
	let index = arr.findIndex(compare);
	// 如果数组中有该搜索值则什么都不做
	if(index > -1) {
		return ;
	}
	// 将搜索值追加到数组
	arr.push(val);
	// 如果有对数组做长度限制 当超出数组长度的时候 把最后的搜索值删除
	if(maxLen && arr.length > maxLen) {
		arr.pop();
	}
}

function deleteFromArray(arr, compare) {
	let index = arr.findIndex(compare);
	if(index > -1) {
		arr.splice(index, 1);
	}
}

// 保存登录状态
export function saveLoginState(flag) {
	// 设置登录状态
	storage.set(LOGIN_KEY, flag);
	// 将最新的登录状态返回
	return flag;
}

// 获取本地存储的登录状态
export function loadLoginState() {
	return storage.get(LOGIN_KEY, false);
}

// 保存用户信息 
export function setUserInfo(user) {
	storage.set(USER_KEY, user);
}

// 获取用户信息
export function loadUserInfo() {
	return storage.get(USER_KEY, {});
}

// 保存喜欢
export const saveLike = function(review) {
	let reviews = storage.get(LIKE_KEY, []);
	insertArray(reviews, review, (item) => {
		return item === review;
	});
	storage.set(LIKE_KEY, reviews);
	return reviews;
}

// 取消喜欢
export const deleteLike = function(review) {
	let reviews = storage.get(LIKE_KEY, []);
		deleteFromArray(reviews, (item) => {
		return item === review;
	});
	storage.set(LIKE_KEY, reviews);
	return reviews;
}

// 获取本地存储的喜欢列表
export const loadLike = function() {
	return storage.get(LIKE_KEY, []);
}

// 保存当前孩子信息
export const saveCurrentChild = function(child) {
	return storage.set(CHILD_KEY, child);
}

// 获取当前孩子信息
export const loadCurrentChild = function(child) {
	return storage.get(CHILD_KEY, {});
}

// 保存当前孩子索引信息
export const saveCurrentChildIndex = function(index) {
	return storage.set(CHILD_INDEX_KEY, index);
}

// 获取当前孩子索引信息
export const loadCurrentChildIndex = function(index) {
	return storage.get(CHILD_INDEX_KEY, -1);
}

// 保存积分信息
export const saveIntegral = function(integral) {
	return storage.set(INTEGRAL_KEY, integral);
}

// 获取积分信息
export const loadIntegral = function() {
	return storage.get(INTEGRAL_KEY, {});
}

// 修改用户信息
export const modifyUserInfo = function(user) {
	return storage.set(USER_KEY, user);
}

// 修改孩子信息
export const modifyChildInfo = function(child) {
	return storage.set(CHILD_KEY, child);
}

// 保存参数信息
export const saveParams = function(params) {
	return storage.set(PARAMS_KEY, params);
}

// 获取积分信息
export const loadParams = function() {
	return storage.get(PARAMS_KEY, {});
}