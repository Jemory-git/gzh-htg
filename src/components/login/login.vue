<template>
	<div class="login" ref="login" id="screenHeight">
		<div class="container">
			<div class="logo-wrapper">
				<div class="logo-content">
					<img src="./logo.png" class="logo">
				</div>
			</div>
			<div class="login-wrapper" ref="loginWrapper">
				<div class="input-content">
					<img src="./user.png" class="icon">
					<input type="text" placeholder="请输入用户名" class="input" v-model="username" maxlength="11" ref="user" @blur="blurIpt" @focus="focusIpt">
					<img src="./delete.png" class="delete" v-show="username" @click="emptyUser">
				</div>
				<div class="input-content">
					<img src="./password.png" class="icon">
					<input type="password" placeholder="请输入密码" class="input" v-model="pwd" ref="pwd" @blur="blurIpt" @focus="focusIpt">
					<img src="./delete.png" class="delete" v-show="pwd" @click="emptyPwd">
				</div>
				<div class="content">
					<div class="code-login" @click="codeLogin">验证码登录</div>
					<div class="forget" @click="retrievePwd">忘记密码</div>
				</div>
				<div class="login-button" @click="login">登 录</div>
			</div>
		</div>
		<tips :text="tipsText" ref="tips"></tips>
		<result-tip :text="resultTip" :result="result" ref="resultTip"></result-tip>
		<confirm ref="confirm" text="该账号已经绑定是否替换" @confirm="bind"></confirm>
	</div>
</template>
<script type="text/javascript">

import Tips from 'base/tips/tips';
import ResultTip from 'base/result-tip/result-tip';
import Confirm from 'base/confirm/confirm';
import {mapGetters, mapMutations} from 'vuex';

export default {
	components: {
		Tips,
		ResultTip,
		Confirm
	},

	data() {
		return {
			username: '',
			pwd: '',
			tipsText: '请输入用户名和密码',
			resultTip: '登录失败',
			result: 1
		}
	},

	computed: {
		...mapGetters([
			'user',
			'params'
		])
	},

	methods: {
		focusIpt() {
			const u = navigator.userAgent;
			const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
			const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

			if(isAndroid) {
				window.addEventListener("resize", function() {
					if(document.activeElement.tagName=="INPUT" || document.activeElement.tagName=="TEXTAREA") {
						window.setTimeout(function() {
							document.activeElement.scrollIntoViewIfNeeded();
						},0);
					}
				})
			}else if(isiOS) {
				let str = u.toLowerCase();
				let ver = str.match(/cpu iphone os (.*?) like mac os/)[1].replace(/_/g,".");
				let oc = ver.split('.')[0];
				if(oc > 10){
					// ios11 不做处理
					return true;
				}else{
					this.timer = setInterval(function() {
						document.body.scrollTop = document.body.scrollHeight/2;
					}, 100);
				}
			}
		},

		blurIpt() {
			if(this.timer) {
				clearInterval(this.timer);
			}
		},

		emptyUser() {
			this.username = "";
			this.$refs.user.focus();
		},

		emptyPwd() {
			this.pwd = "";
			this.$refs.pwd.focus();
		},

		codeLogin() {
			this.$router.push({
				name:'code_login'
			})
		},

		retrievePwd() {
			this.$router.push({
				name: 'forget_pwd'
			})
		},

		bind() {
			const bindData = new FormData();
			bindData.append('userId', this.user.parentId);
			bindData.append('token', this.user.parent_token);

			this.$http.post(this.GLOBAL.URL+ '/v1/User/userBandingWeixin', bindData)
			.then((response) => {
				response = response.body;
				if(response.errcode === this.GLOBAL.ERR_CODE) {
					this.setResultTip({show: true, text: '绑定成功', result: 0});
					setTimeout(() => {
						this.$router.push('/change');
					}, 1500)
				}
			})
			.catch((e) => {
				this.setResultTip({show: true, text: '登录失败', result: 1});
			})
		},

		checkLogin() {
			const userData = new FormData();
			userData.append('userName', this.username);
			userData.append('password', this.pwd);
			userData.append('code', this.params.code);

			this.$http.post(this.GLOBAL.URL + '/V1/Login/checkLogin', userData)
			.then((response) => {
				response = response.body;
				if(response.errcode === this.GLOBAL.ERR_CODE) {
					this.setUser(response.data);
					if(response.data.status === 0) {
						this.$router.push('/change');
					}else if(response.data.status === 1){
						this.$refs.confirm.show();
					}
				}else {
					this.setResultTip({show: true, text: response.errmsg, result: 1});
				}
			})
			.catch((e) => {
				this.$refs.resultTip.show();
			})
		},

		login() {
			if(!this.username || !this.pwd) {
				this.$refs.tips.show();
				return;
			}
			this.$refs.tips.hide();
			this.checkLogin();
		},

		...mapMutations({
			setUser: 'SET_USER',
			setUserInfo: 'SET_USER_INFO',
			setResultTip: 'SET_RESULT_TIP'
		})
	}
}

</script>
<style scoped lang="less">
.login {
	z-index: 99;
	position: absolute;
	left: 0;
	bottom: 0;
	width: 100%;
	height: 100%;
	overflow: auto;
	background-color: #fff;
}

.container {
	position: relative;
}

.logo-wrapper {
	position: relative;
	width: 100%;
	height: 12.5rem;
	background: url('./logo-bg.png') no-repeat;
	background-size: 100% 100%;

	.logo-content {
		position: absolute;
		left: 50%;
		top: 7.3rem;
		transform: translateX(-50%);
		width: 5.25rem;
		height: 5.25rem;
		text-align: center;
		background: #fff;
		border-radius: 50%;
	}

	.logo {
		width: 3.4rem;
		margin: 0.45rem 0;
	}
}

.login-wrapper {
	padding: 2.4rem 3.35rem 0;
	box-sizing: border-box;
	background: #fff;

	.input-content {
		position: relative;
		width: 100%;
		padding: 0.35rem 0 0.35rem 0.2rem;
		margin-top: 1.1rem;
		box-sizing: border-box;
		border-bottom: 1px solid #c1c1c1;

		.icon {
			width: 1.0rem;
			height: 1.0rem;
			margin-right: 1.0rem;
			vertical-align: bottom;
		}

		.input {
			width: 8rem;
			font-size: 0.8rem;
			color: #333;
			background: transparent;
		}

		.delete {
			position: absolute;
			right: 0;
			top: 50%;
			transform: translateY(-50%);
			width: 0.8rem;
			height: 0.8rem;
			border-radius: 50%;
		}
	}

	.content {
		width: 100%;
		margin: 1.25rem 0 1.75rem;
		font-size: 0.7rem;
		color: #d0d0d0;

		.code-login {
			display: inline-block;
		}

		.forget {
			float: right;
		}
	}
}

.login-button {
	margin: 0 .65rem;
	height: 2rem;
	line-height: 2rem;
	text-align: center;
	font-size: .8rem;
	font-weight: 700;
	color: #fff;
	background: #ffcd31;
	border-radius: 1rem;
}

</style>
