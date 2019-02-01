<template>
	<div class="code-login">
		<div class="input-wrapper">
			<div class="tel-wrapper">
				<span class="text">请输入手机号码：</span>
				<input type="number" class="tel" v-model="tel" ref="tel" @blur="blur" v-focus>
				<img src="./delete.png" class="delete" v-show="tel" @click="emptyTel">
			</div>
			<div class="code-wrapper">
				<input type="text" class="code" placeholder="请输入校验码" v-model="code" ref="code">
				<img src="./delete.png" class="delete-code" v-show="code" @click="emptyCode">
				<div class="send-code" :class="{disabled:!canSend}" @click="sendCode" 
				ref="sendCode">{{html}}</div>
			</div>
		</div>
		<div class="button" :class="{button_disabled:code.length != 6}" @click="login">确认登录</div>
		<tips :text="tipsText" ref="tips"></tips>
		<confirm ref="confirm" text="该账号已经绑定是否替换" @confirm="bind"></confirm>
	</div>
</template>

<script>
	import {mapGetters, mapMutations} from 'vuex';
	import Tips from 'base/tips/tips';
	import Confirm from 'base/confirm/confirm';

	export default {
		components: {
			Tips,
			Confirm
		},

		data() {
			return {
				tel:'',
				code: '',
				loginData:{},
				html: "发送校验码",
				tipsText: '请输入有效的手机号码',
				canSend: true
			}
		},

		computed: {
			...mapGetters([
				'params',
				'user'
			])
		},

		methods: {
			emptyTel() {
				this.tel = "";
				this.$refs.tel.focus();
			},

			emptyCode() {
				this.code = "";
				this.$refs.code.focus();
			},

			blur() {
				if(!this.testTel()) {
					this.tipsText = '请输入有效的手机号码';
					this.$refs.tips.show();
				}else {
					this.$refs.tips.hide();
				}
			},

			sendCode(){
				if(!this.testTel()){
					return;
				}
				if(this.canSend) {
					this.canSend = false;
					let i = 59;
					const codeData = new FormData();
					codeData.append('phone', this.tel);

					this.$http.post(this.GLOBAL.URL + '/v1/Message/sendSm', codeData)
					.then((response) => {
						response = response.body;
						if(response.errcode === this.GLOBAL.ERR_CODE) {
							this.setResultTip({show: true, text: '验证码已发送', result: 0});
						}else if(response.errcode == 400001) {
							this.tipsText = response.errmsg;
							this.$refs.tips.show();
							this.html = "发送验证码";
							clearInterval(this.countDown);
							this.canSend = true;
						}
					})

					// 为了点击之后没有一秒的延迟 需先在定时器外边改变html的值
					this.html = "重新发送("+(i < 10 ? '0'+i: i) +"S)";
					this.countDown = setInterval(() => {
						i--;
						this.html = "重新发送("+(i < 10 ? '0'+i: i) +"S)";
						if(i == 0) {
							this.html = "发送验证码";
							clearInterval(this.countDown);
							this.canSend = true;
						}
					},1000);

				}
			},

			login() {
				if(!this.tel || !this.code) {
					this.tipsText = '手机号码或登录码不能为空';
					this.$refs.tips.show();
					return;
				}
				this.$refs.tips.hide();
				clearInterval(this.countDown);
				this.canSend = true;
				this.html = "发送验证码";
				this.setLogin(true);

				// TODO: 后端验证用户信息 登录成功 跳转到孩子列表
				const loginData = new FormData();
				loginData.append('phone', this.tel);
				loginData.append('verifyCode', this.code);
				loginData.append('code', this.params.code);

				this.$http.post(this.GLOBAL.URL + '/v1/Login/verifyCodeLogin', loginData)
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

			testTel() {
				let reg = /^((13[0-9])|(14[4-8])|(15([0-3]|[5-9]))|(166)|(17[0|8])|(18[0-9]|(19[8|9])))\d{8}$/;
				let result = reg.test(this.tel)
				return result;
			},

			...mapMutations({
				setLogin: 'SET_LOGIN_STATE',
				setUser: 'SET_USER',
				setResultTip: 'SET_RESULT_TIP'
			})
		},

		destoryed() {
			clearInterval(this.countDown);
		}
	}
</script>

<style scoped lang="less">
	.code-login {
		z-index: 99;
		position: relative;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		overflow: hidden;
		background: #fff;
	}

	.input-wrapper {
		padding: 0.75rem 1.5rem 0;

		.tel-wrapper {
			position: relative;
			margin-top: 1.5rem;
			padding: 0.3rem 0;
			font-size: 0.75rem;
			color: #adadad;
			border-bottom: 1px solid #adadad;
			border-radius: 0;
		}

		.tel {
			width: 8rem;
		}


		.delete {
			position: absolute;
			right: 0;
			bottom: 0.3rem;
			width: 0.8rem;
			height: 0.8rem;
			border-radius: 50%;
		}

		.code-wrapper {
			position: relative;
			display: flex;
		}

		.code {
			width: 7rem;
			margin-top: 1.5rem;
			padding: 0.3rem 2rem 0.3rem 0;
			font-size: 0.75rem;
			color: #adadad;
			border-bottom: 1px solid #adadad;
			border-radius: 0;

			&::placeholder {
				color: #adadad;
			}
		}

		.delete-code {
			position: absolute;
			left: 7.5rem;
			bottom: 0.8rem;
			width: 0.8rem;
			height: 0.8rem;
			border-radius: 50%;
		}

		.send-code {
			flex: 1;
			width: 6rem;
			height: 3.1rem;
			line-height: 3.1rem;
			text-align: center;
			font-size: 0.75rem;
			color: #fff;
			background: #ffcd31;
		}

		.disabled {
			background: #adadad;
		}
	}

	.button {
		width: 5.25rem;
		height: 2.0rem;
		margin: 1.5rem auto 0;
		line-height: 2.0rem;
		text-align: center;
		font-size: 0.75rem;
		color: #333;
		background: #ffcd31;
		border-radius: 1rem;
	}

	.button_disabled {
		color: #ffcd31;
		background: #333;
	}
</style>