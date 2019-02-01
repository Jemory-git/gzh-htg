<template>
	<div class="loading">
		<img class="loading-gif" src="./loading.gif">
		<p class="desc">{{title}}</p>
	</div>
</template>

<script>
	export default {
		props: {
			title: {
				type: String,
				default: '正在载入...'
			}
		}
	}
</script>

<style scoped lang="less">

	.loading {
		width: 100%;
		text-align: center;

		.loading-gif {
			width: 1.2rem;
			height: 1.2rem;
		}

		.desc {
			line-height: 1.0rem;
			font-size: 0.5rem;
			color: rgba(255, 255, 255, 0.5);
		}
	}
</style>