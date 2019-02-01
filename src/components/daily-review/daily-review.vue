<template>
	<scroll class="daily-review" :pullup="pullup" :data="reviews" @scrollToEnd="loadMore" id="maxHeight">
		<div>
			<ul class="wrapper-list" v-if="hasResult">
				<li class="wrapper-item" v-for="(item, index) in reviews" :key="item">
					<div class="user">
						<div class="user-avatar">
							<img :src="item.avatar" v-if="showself && item.avatar" @error="showself = false">
							<img src="../../common/image/ic_default_head.png" v-else>
						</div>
						<div class="content">
							<div class="user-name">{{item.name}}</div>
							<div class="date" v-show="item.publishTime">
								<img :src="timeIcon" class="time-icon">
								<span>{{item.publishTime * 1000 | formatDate}}</span>
							</div>
						</div>
					</div>
					<div class="daily-content" v-if="item.content">{{item.content}}</div>
					<ul :class="[{'pic-list': item.pictures.length > 3},{'pic-list-3': item.pictures.length == 3},{'pic-list-2': item.pictures.length == 2},{'pic-list-1': item.pictures.length == 1}]">
						<li class="pic-item" v-for="pic in item.pictures" :key="pic">
							<img v-lazy="pic" class="pic this-img-need-grow">
						</li>
					</ul>
					<div class="habits">
						<ul class="habits-list clearfix">
							<li v-for="mark in item.markList" class="item" :key="mark">
								<span>{{getText(mark.marker_type)}}</span>
								<img :src="getMarkIcon(mark.marker_number)" class="star-icon">
							</li>
						</ul>
						<div class="habits-botton" v-show="item.integralType > 0 && item.integralType < 6">
							<span>{{getText(item.integralType)}}</span>
							<p class="add-score" v-if="item.integral >= 0">+{{item.integral}}分</p>
							<p class="add-score" v-else>0分</p>
						</div>
					</div>
					<div class="interaction">
						<div class="voice-wrapper" @click="togglePlaying(item, index)">
							<img :src="voiceBoxIcon" class="voice-box">
							<div class="voice">
								<preload ref="preload" class="voice-icon"></preload>
								<span class="text">{{parseInt(item.recordTime) > 0 ? parseInt(item.recordTime) : 0}}s</span>
							</div>
						</div>
<!-- 				<div class="call" v-show="item.toChildList.length > 0">
							<span class="name">@&nbsp;{{join(item.toChildList)}}</span>
						</div> -->
					</div>
					<div class="like-wrapper" >
<!-- 				<div v-show="item.pointList.length > 0">
							<div class="avatars">
								<template v-for="(user, index) in item.pointList">
									<img class="avatar"
										:src="user.avatar"
										:class="[{'avatar-1': index === 1},{'avatar-2': index === 2},{'hidden': index > 2}]"
									>
								</template>
							</div>
							<div class="like-count">{{item.pointList.length}} 人喜欢</div>
						</div> -->
						<div class="like-icon" @click.stop="toggleLike(item, index)">
							<img :src="toggleLikeIcon(item)" class="icon">
						</div>
					</div>
				</li>
				<loading v-show="hasMore"></loading>
			</ul>
			<no-result v-else></no-result>
		</div>
		<audio :src="currentVoice" ref="audio" @play="ready" @error="error" @ended="end"></audio>
	</scroll>
</template>

<script type="text/javascript">
	import Scroll from 'base/scroll/scroll';
	import {formatDate} from '../../common/js/date.js';
	import Preload from 'base/preload/preload';
	import Loading from 'base/loading/loading';
	import NoResult from 'components/no-result/no-result';
	import {mapGetters, mapMutations} from 'vuex';
	import {maxHeightMixin} from 'common/js/mixin';

	import timeIcon from './ic_time.png';
	import oneIcon from './ic_starone.png';
	import twoIcon from './ic_startwo.png';
	import threeIcon from './ic_starthree.png';
	import fourIcon from './ic_starfour@3x.png';
	import fiveIcon from './ic_starfive.png';
	import voiceBoxIcon from './ic_voicebox.png';
	import likeIcon from './ic_love.png';
	import likeNormalIcon from './ic_lovenormal.png';

	export default {
		mixins: [maxHeightMixin],
		components: {
			Scroll,
			Preload,
			Loading,
			NoResult,
		},

		data() {
			return {
				reviews: [],
				timeIcon: timeIcon,
				voiceBoxIcon: voiceBoxIcon,
				likeIcon: likeIcon,
				likeNormalIcon: likeNormalIcon,
				voiceReady: false,
				currentIndex: -1,
				likesAvatar:[],
				currentPage: 1,
				pageSize: 3,
				pullup: true,
				hasMore: true,
				hasResult: true,
				showself: true
			}
		},

		computed: {
			...mapGetters([
					'voicePlaying',
					'currentVoice',
					'likeList',
					'user'
				])
		},

		methods: {
			getData() {
				const Data = new FormData();
				Data.append('userId', this.user.parentId);
				Data.append('token', this.user.parent_token);
				Data.append('current_page', this.currentPage);
				Data.append('page_count', this.pageSize);


				this.$http.post(this.GLOBAL.URL + '/v1/Comment/everydayCommentList', Data)
				.then((response) => {
					response = response.body;
					if(response.errcode === this.GLOBAL.ERR_CODE) {
						if(response.data.everyDayCommentList.length < this.pageSize) {
							this.hasMore = false;
						}
						this.reviews = this.reviews.concat(response.data.everyDayCommentList);
						this.eventHub.$emit('imgsrcgot');
						if(this.reviews.length === 0) {
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

			loadMore() {
				if(this.hasMore) {
					++this.currentPage;
					this.getData();
				}
			},

			ready() {
				this.voiceReady = true;
			},

			error() {
				this.voiceReady = true;
			},

			end() {
				this.pause();
				this.voiceReady = false;
			},

			toggleLike(item, index) {
				const likeData = new FormData();
				likeData.append('userId', this.user.parentId);
				likeData.append('token', this.user.parent_token);
				likeData.append('commentId', item.commentId);

				const userInfo = {
					'name': this.user.name,
					'avatar': this.user.avatar,
					'userId': this.user.parentId
				};

				if(this.isLike(item.pointList, this.user.parentId)) {
					likeData.append('type', 1);
					this.$http.post(this.GLOBAL.URL + '/v1/Comment/setCommentPoint', likeData)
					.then((response) => {
						response = response.body;
						if(response.errcode === this.GLOBAL.ERR_CODE) {
							item.pointList.pop(userInfo);
						}else if(response.errcode === 400008) {
							this.setResultTip({show: true, text: '操作过于频繁', result: 1});
						}
					})
				}else {
					likeData.append('type', 0);
					this.$http.post(this.GLOBAL.URL + '/v1/Comment/setCommentPoint', likeData)
					.then((response) => {
						response = response.body;
						if(response.errcode === this.GLOBAL.ERR_CODE) {
							item.pointList.push(userInfo);
						}else if(response.errcode === 400008) {
							this.setResultTip({show: true, text: '操作过于频繁', result: 1});
						}
					})
				}
			},

			toggleLikeIcon(item) {
				if(this.isLike(item.pointList, this.user.parentId)) {
					return likeIcon;
				}
				return likeNormalIcon;
			},

			isLike(likeList, userId) {
				let index = likeList.findIndex((item) => {
					return item.userId == userId;
				})
				return index > -1;
			},

			togglePlaying(item, index) {
				this.voiceReady = true;
				this.currentIndex = index;
				if(item.recordUrl !== null) {
					this.setCurrentVoice(item.recordUrl);
				}
				if(!this.voiceReady) {
					return;
				}
				if(!parseInt(item.recordTime)) {
					return;
				}
				if(!this.voicePlaying) {
					this.play();
				}else {
					this.pause();
				}
			},

			play() {
				this.setVoicePlaying(true);
				this.$refs.preload[this.currentIndex].play();
			},

			pause() {
				this.setVoicePlaying(false);
				this.$refs.preload[this.currentIndex].stop();
				this.$refs.audio.currentTime = 0;
			},

			join(array) {
				if(array.length > 0 ) {
					let list = [];
					array.forEach((item) => {
						list.push(item.childName);
					})
					return list.join('、');
				}
			},

			getText(type) {
				type = parseInt(type);
				if(type === 1) {
					return '生活习惯';
				}
				if(type === 2) {
					return '行为习惯';
				}
				if(type === 3) {
					return '作业质量';
				}
				if(type === 4) {
					return '学习习惯';
				}
				if(type === 5) {
					return '文明礼仪';
				}
			},

			getMarkIcon(type) {
				type = parseInt(type);
				if(type === 1) {
					return oneIcon;
				}
				if(type === 2) {
					return twoIcon;
				}
				if(type === 3) {
					return threeIcon;
				}
				if(type === 4) {
					return fourIcon;
				}
				if(type === 5) {
					return fiveIcon;
				}
			},

			...mapMutations({
				setVoicePlaying: 'SET_VOICE_PLAYING',
				setCurrentVoice: 'SET_CURRENT_VOICE',
				setLikeList: 'SET_LIKE_LIST',
				setResultTip: 'SET_RESULT_TIP'
			})
		},

		filters:{
			formatDate(time) {
				let date = new Date(time);
				return formatDate(date,'YYYY-MM-DD hh:mm');
			}
		},

		watch: {
			currentVoice(newVoice, oldVoice) {
				// 播放的不是同一段语音时
				if(newVoice !== oldVoice) {
					let index = this.reviews.findIndex((item) => {
						return item.record === oldVoice;
					});
					if(index > -1) {
						this.$refs.preload[index].stop();
					}
				}
			},

			voicePlaying(playing) {
				if(playing) {
					setTimeout(() => {
						this.$refs.audio.play();
					}, 20)
				}else {
					this.$refs.audio.pause();
				}
			}
		},

		created(){
			this.getData();
		}
	}
</script>

<style scoped lang="less">
	.daily-review {
		z-index: 99;
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;
		background: #e6e6e6;
	}

	.wrapper-list {
		box-sizing: border-box;
		width: 100%;
		background: #e6e6e6;

		.wrapper-item {
			padding: 0 .65rem;
			margin-bottom: 0.5rem;
			background: #fff;
		}

		.daily-content {
			font-size: .75rem;
			line-height: 1.25rem;
			color: #333;
		}

		.user {
			display: flex;
			padding-top: .8rem;
			margin-bottom: 0.5rem;
		}

		.user-avatar {
				width: 2rem;
				height: 2rem;
				margin-right: .5rem;

				img {
					width: 2rem;
					height: 2rem;
					border-radius: 50%;
				}
		}

		.content {
			flex: 1;
		}

		.user-name {
			padding: 0.2rem 0;
			font-size: .8rem;
			color: #333;
		}

		.date {
			font-size: 0.65rem;
			color: #c0c0c0;

			.time-icon {
				width: 0.65rem;
				height: 0.65rem;
				vertical-align: top;
			}
		}

		.pic-list {
			display: flex;
			flex-wrap: wrap;
			width: 100%;
			max-height: 8.8rem;
			padding-top: .5rem;
			overflow: hidden;

			.pic-item {
				width: 4.3rem;
				height: 4.35rem;
				margin: 0 .05rem .05rem 0;

				&:nth-child(4n) {
					margin-right: 0;
				}
			}
		}

		.pic-list-3 {
			display: flex;
			width: 100%;
			padding-top: .5rem;
			box-sizing: border-box;

			.pic-item {
				width: 5.75rem;
				height: 6.0rem;
				margin-right: 0.1rem;

				&:last-child {
					margin-right: 0;
				}
			}
		}

		.pic-list-2 {
			display: flex;
			width: 100%;
			padding-top: .5rem;
			box-sizing: border-box;

			.pic-item {
				width: 8.65rem;
				height: 8.95rem;

				&:first-child {
					margin-right: .1rem;
				}
			}
		}

		.pic-list-1 {
			width: 10.75rem;
			height: 13.5rem;
			padding-top: .5rem;

			.pic-item {
				width: 10.75rem;
				height: 13.5rem;
			}
		}

		.pic {
			width: 100%;
			height: 100%;
		}

		.habits {
			padding: 0.65rem 0;

			.habits-list {
				display: inline-block;
				width: 12.1rem;
			}

			.item {
				float: left;
				margin-bottom: 0.4rem;
				font-size: 0.6rem;
				color: #333;
			}

			.star-icon {
				width: 0.8rem;
				height: 0.75rem;
				margin: 0 0.4rem 0 0.25rem;
				vertical-align: bottom;
			}
		}

		.habits-botton {
			float: right;
			width: 4.25rem;
			padding: 0.25rem;
			text-align: center;
			font-size: 0.6rem;
			color: #333;
			background: #ffcc34;
			border-radius: 0.25rem;

			.add-score {
				margin-top: 0.25rem;
				color: #f00;
			}
		}

		.interaction {
			padding-bottom: 1.5rem;

			.voice-wrapper {
				display: inline-block;
				position: relative;
				width: 4.7rem;
				height: 1.6rem;
				vertical-align: bottom;
			}

			.voice-box {
				width: 100%;
				height: 100%;
			}

			.voice {
				position: absolute;
				left: 0;
				top: 0;
				width: 100%;
				height: 1.6rem;
				line-height: 1.4rem;
				text-align: center;

				.voice-icon {
					width: 0.7rem;
					height: 1.0rem;
					margin-right: 0.2rem;
					vertical-align: middle;
				}

				.text {
					font-size: 0.6rem;
					color: #fff;
				}
			}

			.call {
				display: inline-block;
				width: 10rem;
				margin-left: 0.4rem;
				font-size: 0.7rem;
				line-height: 1.4rem;
				color: #ffa234;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
		}

		.like-wrapper {
			position: relative;
			height: 3.0rem;
			padding: 0.75rem 0 0.7rem;
			border-top: 1px solid #f4f4f4;
			box-sizing: border-box;

			.avatars {
				position: relative;
				width: 3.0rem;
				margin-right: 0.6rem;
			}

			.avatar {
				position: absolute;
				width: 1.35rem;
				height: 1.35rem;
				left: 0;
				top: 0;
				border: 0.1rem solid #fff;
				border-radius: 50%;
			}

			.avatar-1 {
				transform: translateX(50%);
			}

			.avatar-2 {
				transform: translateX(100%);
			}

			.hidden {
				display: none;
			}

			.like-count {
				position: absolute;
				left: 3.5rem;
				top: 50%;
				transform: translateY(-50%);
				font-size: 0.7rem;
				color: #616161;
			}

			.like-icon {
				position: absolute;
				right: 0rem;
				top: 50%;
				transform: translateY(-50%);
				width: 1.2rem;
				height: 1.0rem;
				padding: 1rem;

				.icon {
					width: 1.2rem;
					height: 1.0rem;
				}
			}
		}
	}
</style>