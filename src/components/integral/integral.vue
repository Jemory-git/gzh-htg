<template>
	<scroll class="scroll">
		<div class="wrapper">
			<div class="student-basic clearfix" v-if="Object.keys(currentChild).length > 0">
				<div class="student-info" @click="detail">
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
				<div class="exchange clearfix" @click="showExchange">
					<span class="text">积分兑换</span>
					<img src="./ic.png" class="icon">
				</div>
			</div>
			<div class="radar-wrapper">
				<div class="echarts-wrapper" ref="myCharts">
					<echarts :data="radarData"></echarts>
				</div>
				<div class="more-wrapper" @click="showHistory">
					<div class="more">积分历史</div>
				</div>
			</div>
			<div class="ranking-wrapper">
				<h3 class="title">校区前五名</h3>
				<table cellspacing="0" class="ranking">
					<tr class="thead">
						<th class="th-1">排名</th>
						<th class="th-2">姓名</th>
						<th class="th-3">班级</th>
						<th class="th-4">积分</th>
					</tr>
					<tr class="tbody" v-for="(student, index) in rank" :key="index">
						<td>{{index + 1}}</td>
						<td>{{student.name}}</td>
						<td>{{student.grade}}{{student.class}}</td>
						<td class="number">{{student.totalIntegral}}</td>
					</tr>
				</table>
				<div class="more-wrapper" @click="gotoRank">
					<div class="more">查看更多</div>
				</div>
			</div>
			<div class="tip-wrapper" v-show="integral.monthRankings > 5">
				<p class="tip">
					您目前积分<span class="sign">{{integral.totalIntegral}}</span>分, 在该校排名<span class="sign">第{{integral.monthRankings}}名</span>! 加油~努力冲进前五名哦
				</p>
			</div>
		</div>
	</scroll>
</template>

<script type="text/javascript">
	import Scroll from 'base/scroll/scroll';
	import IntegralHistory from 'components/integral-history/integral-history';
	import {mapGetters, mapMutations} from 'vuex';

	import Echarts from 'base/echarts/echarts';

	export default {
		components: {
			Scroll,
			IntegralHistory,
			Echarts
		},

		data() {
			return {
				rank: [],
				radarData: [],
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
			detail() {
				this.$router.push({
					name: 'integral_detail'
				})
			},

			showExchange() {
				this.$router.push({
					name: 'integral_exchange'
				})
			},

			showHistory() {
				this.$router.push({
					name: 'integral_history'
				})
			},

			gotoRank() {
				this.$router.push({
					name: 'integral_rank'
				})
			},

			getIntegralInfo() {
				const userData = new FormData();
				userData.append('userId', this.user.parentId);
				userData.append('token', this.user.parent_token);

				this.$http.post(this.GLOBAL.URL + '/V1/Integral/getChildIntegralInfo', userData)
				.then((response) => {
					response = response.body;
					if(response.errcode === this.GLOBAL.ERR_CODE) {
						this.rank = response.data.rankingsList;
						this.radarData = response.data.picValueList;
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

		mounted() {

		},

		created() {
			this.getIntegralInfo();
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
	background: #e6e6e6;
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
	padding: 0.9rem;
	margin-bottom: 0.3rem;
	text-align: reight;
	background: #fff;

	.icon {
		float: right;
		width: 0.9rem;
		height: 0.9rem;
		vertical-align: middle;
	}

	.text {
		float: right;
		margin-left: 0.3rem;
		font-size: 0.9rem;
		color: #88afed;
	}
}

.radar-wrapper {
	margin: 0.5rem 0;
	background: #fff;
}

.more-wrapper {
	padding: 2.0rem 0;

	.more {
		width: 6.75rem;
		height: 1.75rem;
		line-height: 1.75rem;
		margin: 0 auto;
		font-size: 0.75rem;
		color: #fff;
		text-align: center;
		background: #c4c4c4;
		border-radius: 0.25rem;
	}
}

.ranking-wrapper {
	background: #fff;

	.title {
		padding: 0.75rem 0;
		font-size: 0.8rem;
		text-align: center;
		background: #feb774;
	}

	.ranking {
		.thead {
			background: #fdecd8;

			th {
				padding: 0.5rem 0;
				font-size: 0.75rem;
				text-align: center;
			}

			.th-1 {
				width: 3.0rem;
			}

			.th-2 {
				width: 3.75rem;
			}

			.th-3 {
				width: 7.25rem;
			}

			.th-4 {
				width: 4.75rem;
			}
		}

		.tbody {
			height: 2.4rem;
			line-height: 2.4rem;
			font-size: 0.75rem;
			text-align: center;
			background: #fff;

			td {
				white-space: nowrap;
			}

			.number {
				text-align: center;
				color: #be8360;
			}
		}
	}
}


.tip-wrapper {
	padding: 0.65rem;
	background: #fdecd8;

	.tip {
		line-height: 1.0rem;
		font-size: 0.8rem;
	}

	.sign {
		color: #be8360;
	}
}
</style>