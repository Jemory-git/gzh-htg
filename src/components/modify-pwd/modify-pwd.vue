<template>
	<transition name='slide' mode='out-in'>
		<div class="modify-pwd slide-to-left">
			<ul class="info-wrapper">
				<li class="info">
					<div class="text">
						<span class="pwd-text">原密码</span>
						<input type="password" class="pwd" maxlength="20" v-model="oldPwd">
					</div>
				</li>
				<li class="info">
					<div class="text">
						<span class="pwd-text">新密码</span>
						<input type="password" class="pwd" maxlength="20" v-model="newPwd">
					</div>
				</li>
			</ul>
			<div class="comfirm" @click="modifyPwd">确定</div>
			<div class="tip">设置成功后，下次可以直接使用您的手机号和该密码登录账户。</div>
			<tips :text="tipsText" ref="tips"></tips>
		</div>
	</transition>
</template>
<script type="text/javascript">
	import Tips from 'base/tips/tips';
	import {mapGetters, mapMutations} from 'vuex';

	export default {
		components: {
			Tips
		},

		data() {
			return {
				oldPwd: '',
				newPwd: '',
				tipsText: '',
			}
		},

		computed: {
			...mapGetters([
				'user'
			])
		},

		methods: {
			modifyPwd() {
				const pwdData = new FormData();
				pwdData.append('userId', this.user.parentId);
				pwdData.append('token', this.user.parent_token);
				pwdData.append('oldPassword', this.oldPwd);
				pwdData.append('newPassword', this.newPwd);

				this.$http.post(this.GLOBAL.URL + '/v1/User/setPassword', pwdData)
				.then((response) => {
					response = response.body;
					if(response.errcode === this.GLOBAL.ERR_CODE) {
						this.oldPwd = '';
						this.newPwd = '';
						this.$refs.tips.hide();
						this.setResultTip({show: true, text: '修改成功', result: 0});
					}else if(response.errcode === 400001 || response.errcode === 400009) {
						this.tipsText = response.errmsg;
						this.$refs.tips.show();
					}else if(response.errcode === 400003) {
						this.setResultTip({show: true, text: '登录已过期', result: 1});
						setTimeout(() => {
							this.relogin();
						}, 2000);
					}
				})
				.catch((e) => {
					this.setResultTip({show: true, text: '修改失败', result: 1});
				})
			},

			...mapMutations({
				setResultTip: 'SET_RESULT_TIP'
			})
		}
	}

</script>
<style scoped lang="less">
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
.modify-pwd {
	z-index: 99;
	position: relative;
	min-height: 100%;
	overflow: hidden;
	background: #f0f0f0;
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

		&:last-child {
			border-bottom: none;
		}

		.text {
			display: inline-block;
			width: 100%;
			padding-left: 0.65rem;
			font-size: 0.9rem;
			color: #333;
			overflow: hidden;

			.pwd-text {
				margin-right: 0.5rem;
				font-weight: 700;
			}

			.pwd {
				width: 12rem;
				outline: none;
			}
		}
	}
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

.tip {
	padding: 0 0.65rem;
	margin-top: 0.65rem;
	font-size: 0.6rem;
	color: #333;
	text-align: center;
}

</style>
