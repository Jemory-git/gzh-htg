<template>
	<transition name="fade">
		<div class="result-wrapper" v-show="isShow">
			<div class="result-content">
				<img :src="getIcon" class="icon">
				<p class="tip">{{text}}</p>
			</div>
		</div>
	</transition>
</template>

<script type="text/javascript">
	import successIcon from './success.png';
	import failIcon from './fail.png';

	import {mapMutations} from 'vuex';

	export default {
		props: {
			// 文字提示
			text: {
				type: String,
				default: '已发送'
			},
			// 是否显示
			isShow: {
				type: Boolean,
				default: false
			},
			// 0 表示成功的结果 1表示失败的结果
			result: {
				type: Number,
				default: -1
			},
			// 显示时长
			duration: {
				type: Number,
				default: 1500
			}
		},

		computed: {
			getIcon() {
				return this.result === 0 ? successIcon : failIcon;
			}
		},

		methods: {
			show() {
				this.timer = setTimeout(() => {
					this.setResultTip({show: false, text: '', result: this.result});
				}, this.duration);
			},

			...mapMutations({
				setResultTip: 'SET_RESULT_TIP'
			})
		},

		watch: {
			isShow: function(show) {
				if(show) {
					this.show();
				}
			}
		}
	}
</script>

<style scoped lang="less">
	.result-wrapper {
		z-index: 999;
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		&.fade-enter-active {
			animation: confirm-fadein 0.4s;
		}

		.result-content {
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
			min-width: 5rem;
			max-width: 7.5rem;
			min-height: 4rem;
			padding: 0.7rem;
			text-align: center;
			background: rgba(0, 0, 0, 0.5);
			border-radius: 0.8rem;
		}

		.icon {
			width: 2rem;
			height: 2rem;
		}

		.tip {
			margin-top: 0.5rem;
			font-size: 0.8rem;
			color: #fff;
			line-height: 1rem;
		}
	}

	@keyframes confirm-fadein {
		0% {
			opacity: 0;
		}

		100% {
			opacity: 1;
		}
	}

</style>