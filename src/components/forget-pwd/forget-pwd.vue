<template>
	<div class="forget-pwd">
		<div class="input-wrapper">
			<div class="tel-wrapper">
				<span class="text">请输入手机号码：</span>
				<input type="number" class="tel" v-model="tel" ref="tel" @blur="blur" v-focus>
				<img src="./delete.png" class="delete" v-show="tel" @click="emptyTel">
			</div>
			<div class="code-wrapper">
				<input type="text" class="code" v-model="code" placeholder="请输入校验码" ref="code">
				<img src="./delete.png" class="delete-code" v-show="code" @click="emptyCode">
				<div class="send-code" :class="{disabled:!canSend}" @click="sendCode" ref="sendCode">{{html}}</div>
			</div>
		</div>
		<div class="retrieve">
			<div class="input-wrapper">
				<div class="pwd-wrapper">
					<span class="text">新密码：</span>
					<input type="password" class="pwd"  v-model="newPwd" ref="newPwd" @input="compareComfirmPwd">
					<img src="./delete.png" class="delete" v-show="newPwd" @click="emptyNewPwd">
				</div>
				<div class="pwd-wrapper">
					<span class="text">确认新密码：</span>
					<input type="password" class="pwd" v-model="comfirmPwd" ref="comfirmPwd" @input="compare">
					<img src="./delete.png" class="delete" v-show="comfirmPwd" @click="emptyComfirmPwd">
				</div>
			</div>
			<div class="button" @click="commit">提交</div>
			<tips :text="tipsText" ref="tips"></tips>
		</div>
	</div>
</template>

<script>
	import Tips from 'base/tips/tips';
	import {mapMutations} from 'vuex';

	export default {
		components: {
			Tips
		},

		data() {
			return {
				tel: '',
				code: '',
				loginData: {},
				html: "发送校验码",
				canSend: true,
				tipsText: '请输入有效的手机号码',
				newPwd:"",
				comfirmPwd:"",
			}
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

			emptyNewPwd() {
				this.newPwd = '';
				this.$refs.newPwd.focus();
			},

			emptyComfirmPwd() {
				this.comfirmPwd = '';
				this.$refs.comfirmPwd.focus();
			},

			blur() {
				if(!this.testTel()){
					this.tipsText = '请输入有效的手机号码';
					this.$refs.tips.show();
				}else {
					this.$refs.tips.hide();
				}
			},

			testTel() {
				const reg = /^((13[0-9])|(14[4-8])|(15([0-3]|[5-9]))|(166)|(17[0|8])|(18[0-9]|(19[8|9])))\d{8}$/;
				const result = reg.test(this.tel)
				return result;
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
							console.log(response);
						}else {
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

			compareComfirmPwd() {
				if(!this.comfirmPwd) {
					return;
				}
				this.compare();
			},

			compare() {
				if(this.comfirmPwd !== this.newPwd) {
					this.tipsTextType = 1;
					this.$refs.tips.show();
				}else if(this.comfirmPwd === this.newPwd) {
					this.$refs.tips.hide();
				}
			},

			commit() {
				const findData = new FormData();
				findData.append('phone', this.tel);
				findData.append('verifyCode', this.code);
				findData.append('newPassword', this.newPwd);

				this.$http.post(this.GLOBAL.URL + '/v1/Login/getForgetPassword', findData)
				.then((response) => {
					response = response.body;
					if(response.errcode === this.GLOBAL.ERR_CODE) {
						clearInterval(this.countDown);
						this.tel = '';
						this.code = '';
						this.newPwd = '';
						this.comfirmPwd = '';
						this.setResultTip({show: true, text: response.errmsg, result: 0});
					}else if(response.errcode === 400001) {
						this.setResultTip({show: true, text: response.errmsg, result: 1});
					}
				})
			},

		...mapMutations({
				setResultTip: 'SET_RESULT_TIP'
			})
		},

		destoryed() {
			clearInterval(this.countDown);
		}
	}
</script>

<style scoped lang="less">
	.forget-pwd {
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
		padding: 0 1.5rem 0;

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

		.pwd-wrapper {
			position: relative;
			width: 100%;
			margin-top: 1.5rem;
			padding: 0.3rem 0;
			font-size: 0.75rem;
			color: #adadad;
			border-bottom: 1px solid #adadad;
			border-radius: 0;
		}

		.pwd {
			width: 10rem;
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
			float: right;
			width: 6rem;
			height: 1.5rem;
			margin-top: 1.5rem;
			line-height: 1.5rem;
			text-align: center;
			font-size: 0.75rem;
			color: #fff;
			background: #ffcd31;
			border-radius: 0.4rem;
		}

		.disabled {
			background: #adadad;
		}
	}

	.tip-wrapper {
		height: 1.0rem;
		line-height: 1.0rem;
		margin-top: 0.5rem;
		font-size: 0.7rem;
		color: #f00215;
		text-align: center;
	}

	.button {
		height: 2.0rem;
		margin: 1.5rem 1.5rem 0;
		line-height: 2.0rem;
		text-align: center;
		font-size: 0.75rem;
		color: #ffcd31;
		background: #333;
		border-radius: 1rem;
	}
</style>