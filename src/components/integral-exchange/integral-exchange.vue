<template>
<transition name="slide">
	<scroll class="scroll" :pullup="pullup" @scrollToEnd="loadMore" :data="gifts">
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
				<div class="exchange">
					<h3 class="title">礼品兑换</h3>
				</div>
			</div>
			<ul class="list" v-if="hasResult">
				<li class="item" v-for="(gift, index) in gifts" :key="gift">
					<img :src="gift.giftPic" class="img">
					<p class="text">{{gift.giftName}}</p>
					<div class="need-integral">积分 <span class="sign">{{gift.giftIntegral}}分</span></div>
					<div class="clearfix">
						<div class="stock">库存{{gift.count}}件</div>
					</div>
					<div class="button" :class="{disabled: isExchangeAble(gift, index)}" @click="exchangeGift(gift, index)">兑换</div>
				</li>
				<loading v-show="hasMore"></loading>
			</ul>
			<no-result v-else></no-result>
		</div>
		<exchange-confirm ref="exchangeConfirm" :gift="gift" @confirm="exchange"></exchange-confirm>
	</scroll>
</transition>
</template>

<script type="text/javascript">
	import Scroll from 'base/scroll/scroll';
	import Loading from 'base/loading/loading';
	import NoResult from 'components/no-result/no-result';
	import ExchangeConfirm from 'components/exchange-confirm/exchange-confirm';
	import {mapGetters, mapMutations} from 'vuex';

	export default {
		components: {
			Scroll,
			Loading,
			ExchangeConfirm,
			NoResult
		},

		data() {
			return {
				currentPage: 1,
				pageSize: 10,
				pullup: true,
				hasMore: true,
				gift:{},
				gifts:[],
				exchangeable: [],
				hasResult: true,
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
			isExchangeAble(gift, index) {
				if(gift.status === -1 || gift.status === -2 || gift.giftIntegral > this.integral.totalIntegral) {
					this.exchangeable[index] = true;
					return true;
				}
			},

			exchangeGift(gift, index) {
				if(this.exchangeable[index]) {
					return;
				}
				this.gift = gift;
				this.$refs.exchangeConfirm.show();
			},

			exchange(gift) {
				const exchangeData = new FormData();
				exchangeData.append('userId', this.user.parentId);
				exchangeData.append('token', this.user.parent_token);
				exchangeData.append('giftId', gift.giftId);

				this.$http.post(this.GLOBAL.URL + '/V1/Integral/commitExchange', exchangeData)
				.then((response) => {
					response = response.body;
					if(response.errcode === this.GLOBAL.ERR_CODE) {
						this.setResultTip({show: true, text: '兑换成功', result: 0});
						this.gifts = [];
						this.getGiftPage();
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

			loadMore() {
				if(this.hasMore) {
					++this.currentPage;
					this.getGiftPage();
				}
			},

			getGiftPage() {
				const userData = new FormData();
				userData.append('userId', this.user.parentId);
				userData.append('token', this.user.parent_token);
				userData.append('current_page', this.currentPage);
				userData.append('page_count', this.pageSize);

				this.$http.post(this.GLOBAL.URL + '/V1/Integral/integralGiftPage', userData)
				.then((response) => {
					response = response.body;
					if(response.errcode === this.GLOBAL.ERR_CODE) {
						if(response.data.giftList.list.length < this.pageSize) {
							this.hasMore = false;
						}
						this.gifts = this.gifts.concat(response.data.giftList.list);
						if(this.gifts.length === 0) {
							this.hasResult = false;
						}
						this.setIntegral(response.data.integralInfo);
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
				setIntegral: 'SET_INTEGRAL',
				setResultTip: 'SET_RESULT_TIP'
			})
		},

		created() {
			this.getGiftPage();
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
	background: #f5f5f5;
}

.student-basic {
	background: #fff;
}

.student-info {
	display: flex;
	height: 3.75rem;

	.student-avatar {
		width: 3.05rem;
		height: 3.05rem;
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
		width: 14rem;
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

.exchange {
	margin-top: 0.75rem;

	.title {
		padding: 0.75rem 0;
		font-size: 0.75rem;
		text-align: center;
		background: #feb774;
	}
}

.list {
	display: flex;
	flex-flow: row wrap;
	margin: 0 0.35rem;

	.item {
		width: 48.5%;
		padding: 0.3rem;
		margin: 0.7rem 0.45rem 0 0;
		box-sizing: border-box;
		background: #fff;

		&:nth-child(2n) {
			margin-right: 0;
		}

		.img {
			width: 100%;
			height: 6.5rem;
		}

		.text {
			margin-top: 0.25rem;
			line-height: 1rem;
			font-size: 0.7rem;
			color: #333;
		}

		.need-integral {
			margin-top: 0.8rem;
			font-size: 0.75rem;
			color: #666;
		}

		.sign {
			font-size: 0.8rem;
			font-weight: 700;
			color: #1c7dea;
		}

		.stock {
			float: right;
			margin-top: 0.6rem;
			font-size: 0.7rem;
			color: #666;
		}

		.button {
			width: 6.4rem;
			height: 1.5rem;
			line-height: 1.5rem;
			margin: 0.6rem auto;
			font-size: 0.75rem;
			color: #fff;
			text-align: center;
			background: #ff6d33;
			border-radius: 0.25rem;
		}

		.disabled {
			background: #c4c4c4;
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