<template>
	<div class="preload" :class="{playing:playing}">
		<span class="item"></span>
	</div>
</template>

<script type="text/javascript">
	export default {
		data() {
			return {
				playing: false
			}
		},

		methods: {
			play() {
				this.playing = true;
			},
			stop() {
				this.playing = false;
			}
		}
	}
</script>

<style scoped lang="less">
	.preload {
		display: inline-block;
		position: relative;

		.item {
			display: inline-block;
			position: absolute;
			left: 0;
			top: 50%;
			transform: translateY(-50%);
			width: 0.3rem;
			height: 0.3rem;
			background: #aaa;
			border-radius: 50%;

			&::before {
				content: "";
				position:absolute;
				left: 0;
				top: 0.15rem;
				transform: translateY(-50%);
				width: 0.3rem;
				height: 0.6rem;
				border-top:0.15rem solid transparent;
				border-right:0.15rem solid #aaa;
				border-bottom:0.15rem solid transparent;
				border-left:0.15rem solid transparent;
				border-radius: 50%;
			}

			&::after {
				content: "";
				position:absolute;
				left: 0;
				top: 0.15rem;
				transform: translateY(-50%);
				width: 0.6rem;
				height: 0.9rem;
				border-top:0.15rem solid transparent;
				border-right:0.15rem solid #aaa;
				border-bottom:0.15rem solid transparent;
				border-left:0.15rem solid transparent;
				border-radius: 50%;
			}
		}
	}

	.playing {
		.item {
			background: #fff;

			&::before {
				border-right:0.15rem solid #fff;
				animation: preloader 1s infinite linear;
			}

			&::after {
				border-right:0.15rem solid #fff;
				animation: preloader_1 1s 0.25s infinite linear;
			}
		}
	}

	@keyframes preloader {
		0% {
			opacity: 0;
		}
		33% {
			opacity: 1;
		}
		66% {
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}

		@keyframes preloader_1 {
		0% {
			opacity: 0;
		}
		66% {
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}
</style>