<template>
	<transition name="slide" mode="out-in">
		<div class="env-pic-wrapper slide-to-left">
<!-- 	<scroll class="scroll" :data="envList" v-if="hasResult" :pullup="pullup" @scrollToEnd="loadMore">
				<div class="container">
					<ul class="env-list" ref="waterfall">
						<li class="env-item" v-for="(item, index) in envList" ref="li">
							<img class="env-img" v-lazy="item">
						</li>
					</ul>
					<loading v-show="hasMore" class="mt-20"></loading>
				</div>
			</scroll> -->
			<vue-waterfall-easy
				v-if="hasResult"
				ref="waterfall"
				:imgsArr="envList"
				@scrollReachBottom="loadMore"
				:reachBottomDistance="50"
			>
				<div slot="waterfall-over" class="no-more">没有更多图片</div>
			</vue-waterfall-easy>
			<no-result v-else></no-result>
		</div>
	</transition>
</template>
<script type="text/javascript">
import Scroll from 'base/scroll/scroll';
import NoResult from 'components/no-result/no-result';
import {mapGetters, mapMutations} from 'vuex';

import VueWaterfallEasy from 'vue-waterfall-easy'

// const colWidth = 8.4;
// const colNum = 2;
// const gapX = 0.65;
// const gapY = 0.65;

export default {
	components: {
		Scroll,
		NoResult,
		VueWaterfallEasy
	},

	data() {
		return {
			envList: [],
			currentPage: 1,
			pageSize: 5,
			pullup: true,
			hasMore: true,
			hasResult: true
		}
	},

	computed: {
		...mapGetters([
			'user'
		])
	},

	methods: {
		// waterFall(el) {
		// 	let clientWidth = document.documentElement.clientWidth;
		// 	let rem = 20 * (clientWidth / 375);
		// 	let waterfall = el;
		// 	let items = waterfall.children;
		// 	let heightArr = [];

		// 	for(let i = 0; i < items.length; i++) {
		// 		// 第一排的盒子 排列
		// 		if(i < colNum) {
		// 			items[i].style.top = 0;
		// 			items[i].style.left = i * (colWidth + gapX) + 'rem';
		// 			heightArr[i] = items[i].offsetHeight / rem;
		// 		}else {
		// 			// 找最矮的一列
		// 			let minIndex = 0;
		// 			let minHeight = heightArr[minIndex];
		// 			heightArr.forEach((item, index) => {
		// 				if( minHeight > item) {
		// 					minHeight = item;
		// 					minIndex = index;
		// 				}
		// 			})

		// 			// 设置定位
		// 			items[i].style.top = (minHeight + gapY) + 'rem';
		// 			items[i].style.left = minIndex * (colWidth + gapX) + 'rem';

		// 			// 重新记录当前列的高度
		// 			heightArr[minIndex] = minHeight + items[i].offsetHeight / rem + gapY;
		// 		} 	//else

		// 		// 设置大容器的高度 撑开页面
		// 		let maxHeight = heightArr[0];
		// 		heightArr.forEach((item, index) => {
		// 			if( maxHeight < item) {
		// 				maxHeight = item;
		// 			}
		// 		});
		// 		waterfall.style.height = maxHeight + 'rem';
		// 	}
		// },

		getEnvPicList() {
			const envData = new FormData();
			envData.append('userId', this.user.parentId);
			envData.append('token', this.user.parent_token);
			envData.append('current_page', this.currentPage);
			envData.append('page_count', this.pageSize);

			this.$http.post(this.GLOBAL.URL + '/v1/Campus/getEnvPicList', envData)
			.then((response) => {
				response = response.body;
				if (response.errcode === this.GLOBAL.ERR_CODE) {
					if(response.data.envList.length < this.pageSize) {
						this.hasMore = false;
					}
					this.envList = this.envList.concat(this.objArr(response.data.envList));
					if(this.envList.length === 0) {
						this.hasResult = false;
					}
				}else if(response.errcode === 400003) {
					this.setResultTip({show: true, text: '登录已过期', result: 1});
					setTimeout(() => {
						this.relogin();
					}, 2000);
				}
			});
		},

		objArr(arr) {
			let tempArr = [];
			arr.forEach((item) => {
				tempArr.push({
					src: item,
					link: ''
				})
			})
			return tempArr;
		},

		loadMore() {
			if(this.hasMore) {
				++this.currentPage;
				this.getEnvPicList();
			}else {
				this.$refs.waterfall.waterfallOver();
			}
		},

		...mapMutations({
			setResultTip: 'SET_RESULT_TIP'
		})
	},

	created() {
		this.getEnvPicList();
	}
}

</script>
<style scoped lang="less">
.env-pic-wrapper {
	z-index: 99;
	position: fixed;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	background: #fff;
}

	.loading-container {
		position: absolute;
		width: 100%;
		top: 50%;
		transform: translateY(-50%);
	}

.scroll {
	height: 100%;
	overflow: hidden;
}

.no-more {
	padding: 0.5rem 0;
	font-size: 1.0rem;
}

.slide-to-left {
	&.slide-enter-active,
	&.slide-leave-active {
		transition: all 0.3s;
		transform: translateX(0);
	}

	&.slide-enter,
	&.slide-leave-to {
		transform: translateX(100%);
	}
}

.container {
	// padding: 0.65rem;
}

.mt-20 {
	margin-top: 1.0rem;
}

.env-list {
	position: relative;
	min-height: 100%;

	.env-item {
		position: absolute;
		left: 0;
		top: 0;
		width: 8.2rem;
		margin: 0 0.65rem 0.65rem 0;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);;

		&:nth-child(2n) {
			margin-right: 0;
		}

	}
}

		.env-img {
			display: block;
			width: 100%;
		}

</style>
