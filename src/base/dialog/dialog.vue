<template>
	<div class="dialog-wrapper" ref="dialogWrapper">
		<div class="dialog">
			<input @blur="blurIpt" @focus="focusIpt" class="content" ref="content" :placeholder="placeholder" v-model.trim="content">
			<span class="comment" @click.stop="sendComment(content)">{{send}}</span>
		</div>
	</div>
</template>

<script type="text/javascript">
	export default {
		props: {
			placeholder: {
				type: String,
				default: '评论'
			},
			send: {
				type: String,
				default: '评论'
			}
		},

		data() {
			return {
				content:'',
				comments: []
			}
		},

		methods: {
			show(comments = []) {
				this.comments = comments;
				this.$refs.dialogWrapper.style.bottom = 0;
				this.focus();
			},

			hide() {
				this.$refs.dialogWrapper.style.bottom = '-3rem';
			},

			focus() {
				this.$refs.content.focus();
			},

			sendComment(content) {
				this.$emit('comment', content, this.comments);
				this.content = '';
			},

			// 解决输入法被激活时 底部输入框被遮住问题
			focusIpt() {
				let str = navigator.userAgent.toLowerCase();
				let ver = str.match(/cpu iphone os (.*?) like mac os/)[1].replace(/_/g,".");
				let oc = ver.split('.')[0];
				if(oc > 10){
					// ios11 不做处理
					return true;
				}else{
					this.timer = setInterval(function() {
						document.body.scrollTop = document.body.scrollHeight;
					}, 100);
				}
			},
			
			blurIpt() {
				clearInterval(this.timer);
				this.$emit('blur');
			}
		}
	}
</script>

<style scoped lang="less">
	.dialog-wrapper {
		z-index: 20;
		position: absolute;
		left: 0;
		bottom: -3rem;
		width: 100%;

		.dialog {
			display: flex;
			height: 2rem;
			line-height: 2rem;
			padding: 0.5rem 0 0.5rem 1rem;
			background: #ddd;

			.content {
				flex: 1;
				padding: 0 0.5rem;
				font-size: 0.8rem;
				outline: none;
				background: #fff;
				border: 1px solid #ccc;
				border-radius: .2rem;

				&::placehloder {
					font-size: 0.8rem;
					color: #ccc;
				}
			}

			.comment {
				min-width: 2rem;
				padding: 0 0.5rem ;
				font-size: 0.8rem;
				text-align: center;
			}
		}
	}
</style>