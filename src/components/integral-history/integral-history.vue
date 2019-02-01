<template>
<transition name="slide">
	<scroll class="scroll" :pullup="pullup" @scrollToEnd="loadMore" :data="list">
		<div class="wrapper">
			<div class="student-basic clearfix" v-if="Object.keys(currentChild).length > 0">
				<div class="student-info">
					<img :src="currentChild.avatar" class="student-avatar" v-if="showself && currentChild.avatar" @error="showself = false">
					<img src="../../common/image/ic_default_head.png" class="student-avatar" v-else>
					<div class="student-desc">
						<h3 class="student-name">{{currentChild.name}}</h3>
						<div class="student-text">
							<span class="mr-14">{{currentChild.school}}</span>
							<span> {{currentChild.grade}} {{currentChild.class}}</span>
						</div>
					</div>
				</div>
				<div class="integral">
					<div class="integral-item">
						<div class="text">累计积分</div>
						<div class="number">{{integral.allTotalIntegral}}</div>
					</div>
					<div class="integral-item">
						<div class="text">积分</div>
						<div class="number">{{integral.totalIntegral}}</div>
					</div>
					<div class="integral-item">
						<div class="text">月排名</div>
						<div class="number">{{integral.monthRankings}}</div>
					</div>
				</div>
			</div>
			<div class="hisory">
				<h3 class="title">积分历史</h3>
				<ul class="list">
					<li class="item clearfix" v-for="item in list" :key="item">
						<div class="time">
							<div>{{item.appendTime * 1000 | formatDate}}</div>
						</div>
						<img :src="item.giftPic" class="img" v-if="item.giftValue">
						<img src="./ic.png" class="img"  v-else>
						<div class="detail" v-if="item.giftValue">
							<div class="count">-{{Math.abs(item.giftValue)}}</div>
							<div class="text">{{item.giftName}}</div>
						</div>
						<div class="detail" v-else>
							<div class="count">{{item.integral > 0 ? '+'+item.integral: item.integral}}</div>
							<div class="text">{{getText(item.type)}}</div>
						</div>
					</li>
					<loading v-show="hasMore"></loading>
				</ul>
			</div>
		</div>
	</scroll>
</transition>
</template>

<script type="text/javascript">
import Scroll from 'base/scroll/scroll';
import Loading from 'base/loading/loading';
import {mapGetters, mapMutations} from 'vuex';
import {formatDate} from '../../common/js/date.js';

	export default {
		components: {
			Scroll,
			Loading
		},

		data() {
			return {
				currentPage: 1,
				pageSize: 5,
				list: [],
				pullup: true,
				hasMore: true,
				showself: true
			}
		},

		computed: {
			...mapGetters([
				'currentChild',
				'integral',
				'user'
			])
		},

		methods: {
			getHistory() {
				const userData = new FormData();
				userData.append('userId', this.user.parentId);
				userData.append('token', this.user.parent_token);
				userData.append('current_page', this.currentPage);
				userData.append('page_count', this.pageSize);

				this.$http.post(this.GLOBAL.URL + '/V1/Integral/getIntegralHistoryPage', userData)
				.then((response) => {
					response = response.body;
					if(response.errcode === this.GLOBAL.ERR_CODE) {
						if(response.data.integralList.list.length < this.pageSize) {
							this.hasMore = false;
						}
						this.list = this.list.concat(response.data.integralList.list);
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

			getText(type) {
				type = parseInt(type);
				if(type === 1) {
					return '成绩积分卡';
				}
				if(type === 2) {
					return '行为习惯积分卡';
				}
				if(type === 3) {
					return '作业质量积分卡';
				}
				if(type === 4) {
					return '学习习惯积分卡';
				}
				if(type === 5) {
					return '文明礼仪积分卡';
				}
			},

			loadMore() {
				if(this.hasMore) {
					++this.currentPage;
					this.getHistory();
				}
			},

			...mapMutations({
				setIntegral: 'SET_INTEGRAL',
				setResultTip: 'SET_RESULT_TIP'
			})
		},

		filters:{
			formatDate(time) {
				time = parseInt(time);
				let date = new Date(time);
				return formatDate(date,'YYYY-MM-DD hh:mm');
			}
		},

		created() {
			this.getHistory();
		}
	}
</script>

<style scoped lang="less">
.scroll {
	z-index: 99;
	position: relative;
	width: 100%;
	height: 100%;
	overflow: hidden;
	background: #fff;
}

.student-info {
	display: flex;
	height: 3.75rem;

	.student-avatar {
		width: 3.05rem;
		height: 3.05rem;
		// float: left;
		margin: .3rem .65rem 0;
		border-radius: 50%;
	}

	.student-desc {
		flex: 1;
		padding-top: 0.8rem;
		line-height: 1.4;
	}

	.student-name {
		width: 12rem;
		font-size: .9rem;
		font-weight: 500;
		color: #000;
		white-space: nowrap;
		overflow: hidden;
	}

	.student-text {
		width: 12rem;
		font-size: 0;
		color: #000;
		white-space: nowrap;
		overflow: hidden;

		span {
			font-size: .6rem;
		}
	}

	.mr-14 {
		margin-right: .7rem;
	}
}

.integral {
	display: flex;
	height: 3.0rem;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;

	.integral-item {
		flex: 1;
		text-align: center;
		border: 1px solid #eee;
		border-left: none;

		&:last-child {
			border-right: none;
		}

		.text {
			margin-top: 0.7rem;
			font-size: 0.7rem;
		}

		.number {
			margin-top: 0.25rem;
			font-size: 0.6rem;
			color: #be8360;
		}
	}
}

.hisory {
	margin-top: 0.75rem;

	.title {
		padding: 0.75rem 0;
		font-size: 0.75rem;
		text-align: center;
		background: #feb774;
	}

	.item {
		display: flex;
		height: 2.35rem;
		padding: 1.2rem 0;
		border-bottom: 1px solid #eee;

		.time {
			float: left;
			width: 5.0rem;
			line-height: 1.4;
			font-size: 0.6rem;
			color: #a5a5a5;
			text-align: center;
		}

		.img {
			width: 1.85rem;
			height: 1.85rem;
			margin-right: 1.5rem;
		}

		.detail {
			flex: 1;
		}

		.count {
			font-size: 0.9rem;
		}

		.text {
			padding-right: 1.2rem;
			line-height: 0.9rem;
			font-size: 0.7rem;
			color: #666;
		}
	}
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