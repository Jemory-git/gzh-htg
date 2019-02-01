<template>
<transition name="slide">
	<scroll class="scroll" :pullup="pullup" :data="ranking" @scrollToEnd="loadMore" id="maxHeight">
		<div class="wrapper">
			<table cellspacing="0" class="ranking" v-if="hasResult">
				<tr class="thead">
					<th width="60" class="th-1">排名</th>
					<th width="75" class="th-2">姓名</th>
					<th width="145" class="th-3">班级</th>
					<th width="95" class="th-4">积分</th>
				</tr>
				<tr class="tbody" v-for="(student, index) in ranking" :key="student">
					<td>{{index + 1}}</td>
					<td>{{student.name}}</td>
					<td>{{student.grade}}{{student.class}}</td>
					<td class="number">{{student.totalIntegral}}</td>
				</tr>
			</table>
			<no-result v-else></no-result>
			<loading v-show="hasMore && hasResult"></loading>
		</div>
	</scroll>
</transition>
</template>

<script type="text/javascript">
import Scroll from 'base/scroll/scroll';
import Loading from 'base/loading/loading';
import NoResult from 'components/no-result/no-result';
import {mapGetters, mapMutations} from 'vuex';
import {maxHeightMixin} from 'common/js/mixin';

	export default {
		mixins: [maxHeightMixin],
		components: {
			Scroll,
			Loading,
			NoResult
		},

		data() {
			return {
				currentPage: 1,
				pageSize: 20,
				pullup: true,
				hasMore: true,
				ranking: [],
				hasResult: true
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
			getRankInfo() {
				const userData = new FormData();
				userData.append('userId', this.user.parentId);
				userData.append('token', this.user.parent_token);
				userData.append('current_page', this.currentPage);
				userData.append('page_count', this.pageSize);

				this.$http.post(this.GLOBAL.URL + '/V1/Integral/getAllMonthIntegralRankings', userData)
				.then((response) => {
					response = response.body;
					if(response.errcode === this.GLOBAL.ERR_CODE) {
						if(response.data.rankingsList.length < this.pageSize) {
							this.hasMore = false;
						}
						this.ranking = this.ranking.concat(response.data.rankingsList);
						if(this.ranking.length === 0) {
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

			loadMore() {
				if(this.hasMore) {
					++this.currentPage;
					this.getRankInfo();
				}
			},

			...mapMutations({
				setIntegral: 'SET_INTEGRAL',
				setResultTip: 'SET_RESULT_TIP'
			})
		},


		created() {
			this.getRankInfo();
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

	.slide-enter-active,
	.slide-leave-active {
		transition: all .4s;
	}

	.slide-enter,
	.slide-leave-to {
		transform: translate3d(100%, 0, 0);
	}
</style>