<template>
	<div class="tips-wrapper">
		<div class="tips" v-show="showTips">
			{{text}}
		</div>
	</div>
</template>

<script type="text/javascript">
	export default {
		props: {
			text: {
				type: String,
				default: '请输入有效的手机号码'
			}
		},

		data() {
			return {
				showTips: false
			}
		},

		methods: {
			show() {
				this.showTips = true;
			},
			hide() {
				this.showTips = false;
			}
		}
	}
</script>

<style scoped lang="less">
	.tips-wrapper {
		margin: 0.5rem 0;
		text-align: center;
	}

	.tips {
		font-size: 0.6rem;
		color: #f00;
	}
</style>