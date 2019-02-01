<template>
	<transition name='slide' mode='out-in'>
		<div class="licence slide-to-left">
			<ul class="licence-list clearfix" v-if="hasResult">
				<li class="licence-item" v-for="img in licences" :key="img">
					<img :src="img" class="lice-img">
				</li>
			</ul>
			<no-result v-else></no-result>
			<div class="loading-container" v-show="!licences.length">
				<loading></loading>
			</div>
		</div>
	</transition>
</template>
<script type="text/javascript">
	import Loading from 'base/loading/loading';
	import NoResult from 'components/no-result/no-result';
	import {mapGetters, mapMutations} from 'vuex';

export default {
	components: {
		Loading,
		NoResult
	},

	computed: {
		...mapGetters([
			'user'
		])
	},

	data() {
		return {
			campus_id: -1,
			licences: [],
			hasResult: true
		}
	},

	methods: {
		back() {
			this.$router.push({name: 'campus'});
		},

		getLicenceInfo() {
			const userData = new FormData();
			userData.append('userId', this.user.parentId);
			userData.append('token', this.user.parent_token);

			this.$http.post(this.GLOBAL.URL + '/V1/Campus/getCampusInfo', userData)
			.then((response) => {
				response = response.body;
				if(response.errcode === this.GLOBAL.ERR_CODE) {
					this.licences = response.data.licenceInfo;
					if(this.licences.length === 0) {
						this.hasResult = false;
					}
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
		this.getLicenceInfo();
	}
}

</script>
<style scoped lang="less">
	.licence {
		z-index: 99;
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		min-height: 100%;
		background: #fff;
	}

	.slide-to-left {
		&.slide-enter-active,
		&.slide-leave-active {
			transition: all 0.5s;
			transform: translateX(0);
		}

		&.slide-enter,
		&.slide-leave-to {
			transform: translateX(100%);
		}
	}

	.loading-container {
		position: absolute;
		width: 100%;
		top: 50%;
		transform: translateY(-50%);
	}

.licence-list {
	padding: 0.65rem;
	box-sizing: border-box;

	.licence-item {
		float: left;
		width: 8.2rem;
		height: 5.5rem;
		margin: 0 0.65rem 0.65rem 0;
		box-shadow: 3px 3px 5px #ccc;

		&:nth-child(2n) {
			margin-right: 0;
		}

		.lice-img {
			width: 100%;
			height: 100%;
		}
	}
}

</style>
