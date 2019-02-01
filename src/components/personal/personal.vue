<template>
	<transition name='slide' mode='out-in'>
		<div class="personal slide-to-left">
			<ul class="info-wrapper">
				<li class="info">
					<img :src="user_icon" class="icon">
					<div class="text">
						<input type="text" v-model="userInfo.childName" class="input">
					</div>
				</li>
				<li class="info">
					<img :src="gender_icon" class="icon">
					<div class="text">
						<select v-model="userInfo.sex">
							<option :value="userInfo.sex" class="option">{{getGender}}</option>
							<option value="1" class="option" v-if="userInfo.sex == 2">男</option>
							<option value="2" class="option" v-else>女</option>
						</select>
					</div>
				</li>
			</ul>
			<div class="comfirm" @click = "modifyUser">确定</div>
		</div>
	</transition>
</template>
<script type="text/javascript">
import user_icon from './ic_name.png';
import gender_icon from './ic_gender.png';

import {mapGetters, mapMutations} from 'vuex';

export default {
	data() {
		return {
			user_icon: user_icon,
			gender_icon: gender_icon,
			userInfo: {}
		}
	},

	computed: {
		getGender() {
			return this.userInfo.sex == 2 ? '女' : '男';
		},

		...mapGetters([
			'user',
			'currentChild'
		])
	},

	methods: {
		getChildInfo() {
			const userData = new FormData();
			userData.append('userId', this.user.parentId);
			userData.append('token', this.user.parent_token);

			this.$http.post(this.GLOBAL.URL + '/V1/User/getChildData', userData).then((response) => {
				response = response.body;
				if (response.errcode == this.GLOBAL.ERR_CODE) {
					this.userInfo = response.data;
				}else if(response.errcode === 400003) {
					this.setResultTip({show: true, text: '登录已过期', result: 1});
					setTimeout(() => {
						this.relogin();
					}, 2000);
				}
			})
		},

		modifyUser() {
			const modifyData = new FormData();
			modifyData.append('userId', this.user.parentId);
			modifyData.append('token', this.user.parent_token);
			modifyData.append('childName', this.userInfo.childName);
			modifyData.append('sex', this.userInfo.sex);
			// modifyData.append('idNum', this.userInfo.idNum);
			modifyData.append('idNum', 123456789987456321);

			this.$http.post(this.GLOBAL.URL + '/V1/User/editChildInfo', modifyData)
			.then((response) => {
				response = response.body;
				if(response.errcode === this.GLOBAL.ERR_CODE) {
					this.setResultTip({show: true, text: '修改成功', result: 0});
					const modifyInfo = {
						'name': this.userInfo.childName,
						'sex': this.userInfo.sex
					};
					this.modifyCurrentChildInfo(modifyInfo);
				}else if(response.errcode === 400003) {
					this.setResultTip({show: true, text: 'token已失效', result: 1});
					setTimeout(() => {
						this.relogin();
					}, 2000);
				}
			})
			.catch((e) => {
				this.setResultTip({show: true, text: '修改失败', result: 0});
			})
		},

		...mapMutations({
			'modifyCurrentChildInfo': 'SET_CHILD_INFO',
			setResultTip: 'SET_RESULT_TIP'
		})
	},

	created() {
		this.getChildInfo();
	}
}

</script>
<style scoped lang="less">
.personal {
	z-index: 99;
	position: relative;
	min-height: 100%;
	background: #f0f0f0;
}

.slide-to-left {
	&.slide-enter-active,
	&.slide-leave-active {
		transition: all 0.3s;
		transform: translateX(0);
	}

	&.slide-enter,
	&.slide-leave-to {
		transform: translateX(100%);
	}
}

.info-wrapper {
	width: 100%;
	padding: 1rem 0.65rem 0.65rem 0.65rem;
	box-sizing: border-box;

	.info {
		width: 17.5rem;
		height: 2.5rem;
		line-height: 2.5rem;
		font-size: 0;
		background: #fff;
		border-bottom: 1px solid #f0f0f0;
		overflow: hidden;

		&:last-child {
			border-bottom: none;
		}

		.icon {
			width: 1.55rem;
			height: 1.55rem;
			margin: 0.5rem 0.65rem;
			vertical-align: top;
			border-radius: 50%;
		}

		.text {
			display: inline-block;
			width: 12rem;
			font-size: 0.9rem;
			color: #333;
			overflow: hidden;
		}

		.input {
			width: 12rem;
		}
	}
}

select {
	/*Chrome和Firefox里面的边框是不一样的，所以复写了一下*/
	border: none; // 清除点击时的高亮边框
	outline: none;

	/*很关键：将默认的select选择框样式清除*/
	appearance: none;
	-moz-appearance: none;
	-webkit-appearance: none;

	width: 100%;
	box-sizing: border-box;
	font-size: 0.9rem;
	color: #333;
	background: transparent;
}




/*清除ie的默认选择框样式清除，隐藏下拉箭头*/

select::-ms-expand {
	display: none;
}

.comfirm {
	width: 17.5rem;
	height: 2.5rem;
	margin: 0 .65rem;
	line-height: 2.5rem;
	text-align: center;
	font-size: .9rem;
	font-weight: 700;
	color: #fff;
	background: #76ccf6;
}

</style>
