<template>
	<transition name="slide">
		<div class="wrapper">
			<video class="video" 
				poster="" controls playsInline autoplay
				:src="source"
			>
			</video>
		</div>
	</transition>
</template>

<script type="text/javascript">
	import {mapGetters, mapMutations} from 'vuex';

	export default {
		data() {
			return {
				source: ''
			}
		},

		computed: {
			...mapGetters([
				'user',
				'video'
			])
		},

		methods: {
			getSource() {
				const getData = new FormData();
				getData.append('userId', this.user.parentId);
				getData.append('token', this.user.parent_token);
				getData.append('type', this.video.deviceType);
				getData.append('deviceSerial', this.video.deviceSerial);
				getData.append('channelNo', this.video.chan_no);

				this.$http.post(this.GLOBAL.URL + '/v1/Device/getVideoUrl',getData)
				.then((response) => {
					response = response.body;
					if(response.errcode === this.GLOBAL.ERR_CODE) {
						this.source = response.data.videoUrl;
					}else if(response.errcode === 400003) {
						this.setResultTip({show: true, text: '登录已过期', result: 1});
						setTimeout(() => {
							this.relogin();
						}, 2000);
					}
				})
				.catch((e) => {
					this.setResultTip({show: true, text: '数据加载失败', result: 1});
				})
			},

			...mapMutations({
				setResultTip: 'SET_RESULT_TIP'
			})
		},

		created() {
			if(!this.video.chan_no) {
				this.$router.push('/monitor');
				return;
			}
			this.getSource();
		}
	}
</script>

<style scoped lang="less">
	.wrapper {
		z-index: 99;
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;
		background: #fff;
	}

	.video{
		width: 100%;
		height: 100%;
	}

	.slide-enter-active,
	.slide-leave-active {
		transition: all .4s;
	}

	.slide-enter,
	.slide-leave-to {
		transform: translate3d(100%, 0, 0);
	}
</style>