<template>
	<div class="monitor">
		<div class="header">
			<div class="user" v-if="Object.keys(currentChild).length > 0">
				<img class="avatar" :src="currentChild.avatar" v-if="showself && currentChild.avatar" @error="showself = false">
				<img class="avatar" src="../../common/image/ic_default_head.png" v-else>
				<span class="name">{{currentChild.name}}</span>
			</div>
			<div class="dymanic">
				<img class="icon" src="./ic_monitoring.png">
				<span class="text">实时监控</span>
			</div>
		</div>
		<loading class="loading" v-show="showLoading"></loading>
		<ul class="devices" v-if="hasResult">
			<li v-for="device in devices" :key="device">
				<ul class="view-list clearfix"
					v-if="device.list.length > 0">
					<li class="view-item" @click="playVideo(device, view)" v-for="view in device.list" :key="view">
						<div class="view">
							<img :src="view.capture" class="img" v-if="device.device_type === 'ez' && view.capture">
							<img :src="'data:image/png;base64,' + view.capture" class="img" v-else-if="device.device_type === 'nvr' && view.capture">
							<img src="./ic_jiankong.png" class="img" v-else>
						</div>
						<div class="shadow"></div>
						<div class="text">{{view.name}}</div>
					</li>
				</ul>
			</li>
		</ul>
		<no-result v-else></no-result>
	</div>
</template>

<script type="text/javascript">
	import NoResult from 'components/no-result/no-result';
	import Loading from 'base/loading/loading';
	import {mapGetters, mapMutations} from 'vuex';
	import {formatDate} from 'common/js/date.js';

	export default {
		components: {
			NoResult,
			Loading
		},

		data(){
			return {
				devices: [],
				hasResult: true,
				showLoading: true,
				showself: true
			}
		},

		computed: {
			...mapGetters([
				'currentChild',
				'user'
			])
		},

		methods: {
			getDeviceConfig() {
				const Data = new FormData();
				Data.append('userId', this.user.parentId);
				Data.append('token', this.user.parent_token);

				this.$http.post(this.GLOBAL.URL + '/v1/Device/getDeviceConfig', Data)
				.then((response) => {
					response = response.body;
					if(response.errcode === this.GLOBAL.ERR_CODE) {
						this.showLoading = false;
						this.devices = response.data;
						this.devices.forEach((item1) => {
							if(item1.state === 0) {
								return;
							}
							const getImgData = new FormData();
							getImgData.append('userId', this.user.parentId);
							getImgData.append('token', this.user.parent_token);
							getImgData.append('type', item1.device_type);
							getImgData.append('deviceSerial', item1.device_serial);

							if (typeof item1.list === 'object') {
								// NVR情况下是对象，转成数组
								item1.list = Object.values(item1.list);
							}

							item1.list.forEach((item2) => {
								if(item2.state === 0) {
									return;
								}

								let flag = false;
								let time = new Date();
								time = formatDate(time,'hh:mm');

								if(item2.openTime != null && item2.openTime.length > 0) {
									item2.openTime.forEach((item3) => {
										if(item3.start_time < time && time < item3.end_time) {
											flag = true;
										}
									})
								}else {
									flag = true;
								}

								if(!flag) {
									return;
								}

								getImgData.append('channelNo', item2.chan_no);
								this.$http.post(this.GLOBAL.URL + '/v1/Device/getCapture', getImgData)
								.then((response) => {
									response = response.body;
									if(response.errcode === this.GLOBAL.ERR_CODE) {
										item2.capture = response.data.capture;
									}
								})
								// .catch((e) => {
								// 	this.setResultTip({show: true, text: '获取失败', result: 1});
								// })
							})
						})
						if(this.devices.length === 0) {
							this.hasResult = false;
						}
					}else if(response.errcode === 400003) {
						this.setResultTip({show: true, text: '登录已过期', result: 1});
						setTimeout(() => {
							this.relogin();
						}, 2000);
					}
				})
			},

			playVideo(device, view) {
				if(device.state === 0) {
					this.setResultTip({show: true, text: '监控已离线', result: 1});
					return;
				}
				if(view.state === 0 ) {
					this.setResultTip({show: true, text: '监控已离线', result: 1});
					return;
				}
				let flag = false;
				let time = new Date();
				time = formatDate(time,'hh:mm');

				if(view.openTime != null && view.openTime.length > 0) {
					view.openTime.forEach((item) => {
						if(item.start_time < time && time < item.end_time) {
							flag = true;
						}
					})
				}else {
					flag = true;
				}

				if(flag) {
					const obj = {
						deviceType: device.device_type,
						deviceSerial: device.device_serial
					}
					Object.assign(view, obj);
					this.setVideo(view);
					this.$router.push({
						name: 'video'
					});
				}else {
					this.setResultTip({show: true, text: '不在开放时间', result: 1});
				}
			},

			...mapMutations({
				setResultTip: 'SET_RESULT_TIP',
				setVideo: 'SET_VIDEO'
			})
		},

		created(){
			this.getDeviceConfig();
		}
	}
</script>

<style scoped lang="less">
	.monitor {
		z-index: 99;
		position: relative;
		min-height: 100%;
		background: #e6e6e6;
	}

	.loading {
		margin-top: 7.0rem;
	}

	.header {
		position: relative;
		width: 100%;
		height: 3.75rem;
		line-height: 3.75rem;
		font-size: 0;
		background: #fff;
		border-bottom: 2px solid #f0f0f0;

		.user {
			display: inline-block;

			.avatar {
				width: 3.0rem;
				height: 3.0rem;
				margin: 0.4rem 0.65rem 0 1.3rem;
				vertical-align: top;
				border-radius: 50%;
			}

			.name {
				display: inline-block;
				width: 9rem;
				font-size: 0.9rem;
				color: #333;
				white-space: nowrap;
				overflow: hidden;
			}
		}

		.dymanic {
			position: absolute;
			top: 0;
			right: 0.65rem;
			height: 100%;


			.icon {
				height: 0.9rem;
				margin: -0.55rem 0.45rem 0 0;
				vertical-align: middle;
			}

			.text {
				font-size: 0.65rem;
				color: #a2abe9;
			}
		}
	}

	.devices {
		width: 100%;
	}

	.view-list {
		width: 100%;
		padding: 0.65rem 0.8rem;
		box-sizing: border-box;
		background: #fff;

		.view-item {
			float: left;
			width: 5.35rem;
			margin: 0 0.5rem 0.5rem 0;
			text-align: center;

			&:nth-child(3n) {
				margin-right: 0;
			}

			.view {
				width: 100%;
				height: 5.0rem;
				margin-bottom: 0.25rem;

				img {
					width: 100%;
					height: 100%;
				}
			}
			
			.shadow {
				width: 100%;
				height: .5rem;
				background-image: url('./ic_shadow.png');
				background-position: -0.5rem 0;
				box-shadow: 0 .1rem .1rem #eee inset;
			}

			.text {
				padding: 0.2rem 0 .65rem;
				font-size: 0.75rem;
				color: #333;
			}
		}
	}
</style>