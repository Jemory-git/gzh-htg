<template>
	<scroll class="daily-review">
		<div>
			<ul class="wrapper-list">
				<li class="wrapper-item" v-for="(item, index) in reviews" :key="index">
					<div class="user">
						<div class="user-avatar">
							<img :src="item.avatar" v-if="showself && item.avatar"  @error="showself = false">
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
							<img v-lazy="pic" class="pic">
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
						<div class="voice-wrapper" @click="togglePlaying(item)">
							<img :src="voiceBoxIcon" class="voice-box">
							<div class="voice">
								<preload ref="preload" class="voice-icon"></preload>
								<span class="text">{{parseInt(item.recordTime) > 0 ? parseInt(item.recordTime) : 0}}s</span>
							</div>
						</div>
						<div class="call" v-show="item.toChildList.length > 0">
							<span class="name">@&nbsp;{{join(item.toChildList)}}</span>
						</div>
					</div>
					<div class="remind" v-show="item.daily_remind">
						<img src="./remind.png" alt="" class="icon"/>
						<h3 class="title">今日提醒</h3>
						<p class="text" v-html="item.daily_remind">
						</p>
					</div>
					<div class="feedback" v-if="item.feedbackInfo && !item.feedbackInfo.feedbackContent">
						<img src="./pen.png" alt="" class="icon"/>
						<h3 class="title">
							<span class="name">{{item.feedbackInfo.studentName}}</span>家长反馈
						</h3>
						<p class="text">{{item.feedbackInfo.feedbackContent}}</p>
						<ul v-show="item.feedbackInfo.feedbackFiles.length" class="feedback-list clearfix">
							<li v-for="img in item.feedbackInfo.feedbackFiles" class="item" :key="img">
								<img :src="img" alt="" class="img"/>
							</li>
						</ul>
					</div>
					<audio :src="item.recordUrl" ref="audio"></audio>
				</li>
			</ul>
			<a :href="url" class="button">查看更多</a>
		</div>
	</scroll>
</template>

<script type="text/javascript">
	import Scroll from 'base/scroll/scroll';
	import {formatDate} from '../../common/js/date.js';
	import Preload from 'base/preload/preload';

	import {Base64} from 'common/js/base64';
	import {urlParse} from 'common/js/url_parse';

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
		components: {
			Scroll,
			Preload,
		},

		data() {
			return {
				reviews: [],
				timeIcon: timeIcon,
				voiceBoxIcon: voiceBoxIcon,
				likeIcon: likeIcon,
				likeNormalIcon: likeNormalIcon,
				likesAvatar:[],
				isPlaying: false,
				showself: true
			}
		},

		methods: {
			togglePlaying(item) {
				if(item.recordUrl == null || !parseInt(item.recordTime) == 0) {
					return;
				}
				if(this.isPlaying) {
					this.pause();
				}else {
					this.play();
				}
			},

			play() {
				this.$refs.preload.play();
				this.$refs.audio.play();
			},

			pause() {
				this.$refs.preload.stop();
				this.$refs.audio.pause();
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

			parse() {
				var base64Str = urlParse().params;
				var page = 'course_review';
				this.url = this.GLOBAL.URL + `/v1/Login/weixinAuth?thePage=${page}`;
				var base = new Base64();
				var result = base.decode(base64Str);
				result = JSON.parse(result);
				this.reviews.push(result);
			}
		},

		filters:{
			formatDate(time) {
				let date = new Date(time);
				return formatDate(date,'YYYY-MM-DD hh:mm');
			}
		},

		created() {
			this.parse();
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
		background: #fff;
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
				right: 2rem;
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

	.publish-icon {
		position: absolute;
		right: -0.5rem;
		top: 50%;
		transform: translateY(-50%);
		width: 1.6rem;
		height: 1.35rem;
		padding: 1rem;

		.icon {
			width: 1.6rem;
			height: 1.35rem;
		}
	}

	.remind {
		margin: 1.25rem 0;
		padding: 0 0.85rem;

		.title {
			display: inline-block;
			margin-bottom: 0.5rem;
			font-size: 0.75rem;
			color: #333;
		}

		.icon {
			width: 0.9rem;
			height: 1.2rem;
			transform: translateY(0.1rem);
		}

		.text {
			font-size: 0.75rem;
			color: #adadad;
		}
	}

	.feedback {
		margin-bottom: 1.25rem;
		padding: 0 0.85rem;

		.title {
			display: inline-block;
			margin-bottom: 0.5rem;
			font-size: 0.75rem;
			color: #333;
		}

		.icon {
			width: 0.75rem;
			height: 0.75rem;
			transform: translateY(0.1rem);
		}

		.text {
			font-size: 0.75rem;
			color: #adadad;
		}

		.name {
			color: #ffa333;
		}
	}



	.feedback-list {
		margin-top: 0.8rem;

		.item {
			float: left;
			width: 2.75rem;
			height: 2.75rem;
			margin: 0 0.5rem 0.5rem 0;

			&:nth-child(5n) {
				margin-right: 0;
			}
		}

		.img {
			width: 100%;
			height: 100%;
			border-radius: 0.3rem;
		}
	}

	.button {
		display: block;
		margin: 1rem .65rem 0;
		height: 2.5rem;
		line-height: 2.5rem;
		text-align: center;
		font-size: .9rem;
		font-weight: 700;
		color: #fff;
		background: #76ccf6;
	}
</style>