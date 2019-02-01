<template>
	<div class="enter"></div>
</template>

<script type="text/javascript">
	import {urlParse} from 'common/js/url_parse';
	import {mapMutations} from 'vuex';
	export default {
		data() {
			return {
				params: {}
			}
		},

		methods: {
			...mapMutations({
				setParams: 'SET_PARAMS',
				setUserInfo: 'SET_USER_INFO',
			})
		},

		mounted() {
			this.params = urlParse();
			this.setUserInfo(this.params);
			if(this.params.state == 1) {
				this.$router.push(`/${this.params.thePage}`);
			}else {
				this.setParams(this.params);
				this.$router.push('/login');
			}
		}
	}
</script>

<style scoped lang="less">
	.enter {
		z-index: 99;
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100vh;
		overflow: hidden;
		background-color: #fff;
	}
</style>