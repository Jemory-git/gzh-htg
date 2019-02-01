<template>
	<div class="wrapper">
		<ul class="wrapper-list" v-if="recipes">
			<li class="wrapper-item" v-for="item in recipes" :key="item">
				<div class="user">
					<div class="user-avatar">
						<img :src="item.avatar" v-if="item.avatar" @error="showself = false">
						<img src="../../common/image/ic_default_head.png" v-else>
					</div>
					<div class="content">
						<div class="user-name">{{item.name}}</div>
						<div class="date">
							<span>{{item.theDate}}</span>
						</div>
					</div>
				</div>
				<div class="text" v-if="item.images.length == 0" v-for="i in item.message" :key="i">-- {{i}}</div>
				<div class="text" v-if="item.images.length > 0">{{item.message}}</div>
				<ul :class="[{'pic-list': item.images.length > 2},{'pic-list-2': item.images.length == 2},{'pic-list-1': item.images.length == 1}]">
					<li class="pic-item" v-for="pic in item.images" :key="pic">
						<img :src="pic" class="pic">
					</li>
				</ul>
				<div class="shijian">
					<span class="value" :class="{'wancan':item.type == 2, 'wucan':item.type == 1}">{{item.type == 2 ? '晚餐' : '午餐'}}</span>
				</div>
			</li>
		</ul>
		<a :href="url" class="button">查看更多</a>
	</div>
</template>

<script>
	import {formatDate} from 'common/js/date';
	import {Base64} from 'common/js/base64';
	import {urlParse} from 'common/js/url_parse';

	export default {
		data(){
			return {
				url: '',
				recipes: [],
				showself: true
			};
		},

		methods: {
			parse() {
				var base64Str = urlParse().params;
				var page = 'recipes';
				this.url = this.GLOBAL.URL + `/v1/Login/weixinAuth?thePage=${page}`;
				var base = new Base64();
				var result = base.decode(base64Str);
				result = JSON.parse(result);
				this.recipes.push(result);
				console.log('result',result);
				
			}
		},

		created() {
			this.parse();
		}
	}
</script>

<style scoped lang="less">
	.wrapper {
		z-index: 999;
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;
		background: #fff;
	}

	.recipes {
		z-index: 99;
		position: relative;
		min-height: 100%;
		background: #fff;
	}

	.wrapper-list {
		box-sizing: border-box;
		width: 100%;
		background: #fff;

		.wrapper-item {
			padding-bottom: 0.5rem;
		}

		.user {
			display: flex;
			padding: .8rem 0 0.5rem;
			margin: 0 0.65rem;
		}

		.user-avatar {
				width: 2rem;
				height: 2rem;
				margin-right: .45rem;

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
			min-height: 1rem;
			margin-bottom: .2rem;
			font-size: .9rem;
			color: #333;
		}

		.date {
			padding-top: 0.2rem;
			font-size: .8rem;
			font-weight: lighter;
			color: #adadad;
		}

		.text {
			margin: 0 0.65rem;
			font-size: .75rem;
			line-height: 1.25rem;
			text-indent: 2em;
			color: #333;
		}

		.pic-list {
			display: flex;
			flex-wrap: wrap;
			padding-top: .5rem;
			margin: 0 0.65rem;

			.pic-item {
				width: 5.6rem;
				height: 5.6rem;
				margin: 0 .2rem .2rem 0;

				&:nth-child(3n) {
					margin-right: 0;
				}
			}
		}

		.pic-list-2 {
			display: flex;
			padding-top: .8rem;
			margin: 0 0.65rem;
			box-sizing: border-box;

			.pic-item {
				width: 8.6rem;
				height: 8.6rem;

				&:first-child {
					margin-right: .2rem;
				}
			}
		}

		.pic-list-1 {
			height: 15rem;
			padding-top: .8rem;
			margin: 0 0.65rem;

			.pic-item {
				width: 17rem;
				height: 15rem;
			}
		}

		.shijian{
			display: flex;
			align-items: flex-end;
			height: 2rem;
			padding-bottom: 0.2rem;
			margin: 0 0.65rem;
			

			.value{
				display: block;
				height: 1rem;
				width: 2.3rem;
				text-align: center;
				line-height: 1rem;
				font-size: 0.7rem;
				border-radius: 18px;
			}

			.wancan{
				background-color: #427EF8;
				color: #fff;
			}

			.wucan{
				background-color: #FFCC34;
				color: #444;
			}
		}


		.pic {
			width: 100%;
			height: 100%;
		}

		.show-com {
			position: relative;
			width: 100%;
			height: 2.2rem;

			.com-img {
				position: absolute;
				right: 0;
				bottom: 0;
				width: 1.1rem;
				height: 1rem;
				padding: 0.5rem 1rem;
			}
		}

		.com-list {
			border-top: 2px solid #ebebeb;
		}

		.com-item {
			display: flex;
			margin-bottom: .2rem;
			font-size: .7rem;
			line-height: 1.2rem;
			color:#333;

			.name {
				color: #134aa0;
			}
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
