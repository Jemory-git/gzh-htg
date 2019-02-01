<template>
	<transition name="slide">
		<scroll class="scroll" :data="habits">
			<div class="wrapper">
				<div class="banner">
					<div class="banner-top"></div>
					<img src="./title.png" class="banner-title">
					<div class="perches"></div>
				</div>
				<div class="line"></div>
				<div class="child">
					<img src="./img_04.png" class="background">
					<img :src="currentChild.avatar" class="child-avatar" v-if="showself && currentChild.avatar" @error="showself = false">
					<img src="../../common/image/ic_default_head.png" class="child-avatar" v-else>
					<div class="name">{{currentChild.name}}</div>
					<img src="./img_05.png" class="shadow">
				</div>
				<div class="integral-wrapper">
					<div class="total-integral">总积分 {{childInfo.totalIntegral}} 分</div>
				</div>
				<ul class="habits">
					<li class="habit" v-for="habit in habits" :key="habit">
						<img :src="getIcon(habit.type)" class="icon" />
						<span class="text">{{habit.integral}}分</span>
					</li>
				</ul>
				<div class="brush-pot">
					<img src="./img_11.png" class="img">
				</div>
			</div>
		</scroll>
	</transition>
</template>

<script type="text/javascript">
	import Scroll from 'base/scroll/scroll';
	import {mapGetters, mapMutations} from 'vuex';

	import habit_1 from './img_06.png';
	import habit_2 from './img_09.png';
	import habit_3 from './img_08.png';
	import habit_4 from './img_07.png';
	import habit_5 from './img_10.png';

	export default {
		components: {
			Scroll
		},

		data() {
			return {
				childInfo: {},
				habits: [],
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
			getIcon(type) {
				if(type === 1) {
					return habit_1;
				}
				if(type === 2) {
					return habit_2;
				}
				if(type === 3) {
					return habit_3;
				}
				if(type === 4) {
					return habit_4;
				}
				if(type === 5) {
					return habit_5;
				}
			},

			getCommentIntegralInfo() {
				const userData = new FormData();
				userData.append('userId', this.user.parentId);
				userData.append('token', this.user.parent_token);

				this.$http.post(this.GLOBAL.URL + '/v1/Integral/getCommentIntegralInfo',userData)
				.then((response) => {
					response = response.body;
					if(response.errcode === this.GLOBAL.ERR_CODE) {
						this.childInfo = response.data;
						this.habits = response.data.list;
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
			this.getCommentIntegralInfo();
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

.banner {
	text-align: center;
	background: #fff;

	.banner-top {
		height: 1.25rem;
		background: #ff6e32;
	}

	.banner-title {
		z-index: 1;
		position: relative;
		width: 9.25rem;
		height: 2.5rem;
		margin: 0.4rem 0 0;
	}

	.perches {
		position: relative;
		bottom: 1.1rem;
		height: 0.5rem;
		background: #ededed;
	}
}

.line {
	height: 0.2rem;
	margin-bottom: 0.2rem;
	background: #f9e2b1;
}

.child {
	position: relative;
	width: 100%;
	height: 8.2rem;
	background: #fff;

	.background {
		width: 100%;
		height: 100%;
		background: #f9e2b1;
	}

	.child-avatar {
		position: absolute;
		left: 50%;
		top: 30%;
		transform: translate(-50%, -50%);
		width: 2.75rem;
		height: 2.75rem;
		border: 0.2rem solid #e8c37d;
		border-radius: 50%;
	}

	.name {
		position: absolute;
		left: 50%;
		top: 60%;
		transform: translate(-50%, 0);
		font-size: 0.8rem;
		color: #000;
	}

	.shadow {
		position: absolute;
		left: 50%;
		top: 75%;
		transform: translate(-50%, 0);
		width: 6.3rem;
		height: 0.3rem;
	}
}

.integral-wrapper {
	padding: 0.4rem 0 1.2rem;
	background: #fff;
}

.total-integral {
	width: 12.4rem;
	height: 1.6rem;
	line-height: 1.6rem;
	margin: 0 auto;
	font-size: 0.9rem;
	color: #000;
	text-align: center;
	background: #c4e5fb;
	border: 0.2rem solid #daeffd;
	border-radius: 0.8rem;
}

.habits {
	display: flex;
	flex-flow: row wrap;
	padding-bottom: 1.2rem;
	background: #fff;

	.habit {
		width: 50%;
		height: 3.5rem;
		padding: 0 0.8rem;
		box-sizing: border-box;
		line-height: 3.5rem;
		border-bottom: 1px solid #ededed;
	}

	.icon {
		float: left;
		width: 4.9rem;
		height: 1.9rem;
		margin: 0.8rem 0.5rem 0 0;
	}

	.text {
		font-size: 0.75rem;
		color: #000;
	}
}

.brush-pot {
	position: absolute;
	right: 1rem;
	bottom: 0;
	width: 3.6rem;
	height: 4.5rem;

	.img {
		width: 100%;
		height: 100%;
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