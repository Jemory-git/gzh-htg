<template>
	<scroll class="wrapper recipes" :data="recipes" ref="recipes" :pullup="pullup" @scrollToEnd="loadMore" id="maxHeight">
		<div>
			<ul class="wrapper-list" v-if="hasResult">
				<li class="wrapper-item" v-for="(item, index1) in recipes" :key="item">
					<div class="user">
						<div class="user-avatar">
							<img :src="item.avatar" v-if="showself && item.avatar" @error="showself = false">
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
						<li class="pic-item" v-for="(pic, index2) in item.images" :key="pic">
							<img :src="pic" class="pic this-img-need-grow" :data-index1="index1" :data-index2="index2">
						</li>
					</ul>
					<div class="shijian">
						<span class="value" :class="{'wancan':item.type == 2, 'wucan':item.type == 1}">{{item.type == 2 ? '晚餐' : '午餐'}}</span>
					</div>
				</li>
				<loading v-show="hasMore && recipes.length > 0"></loading>
			</ul>
			<no-result v-else></no-result>
		</div>
	</scroll>
</template>

<script>
	import Scroll from 'base/scroll/scroll';
	import Loading from 'base/loading/loading';
	import NoResult from 'components/no-result/no-result';
	import {formatDate} from '../../common/js/date.js';
	import {mapGetters, mapMutations} from 'vuex';
	import {maxHeightMixin} from 'common/js/mixin';

	import praise_img from './ic_praise.png';

	export default {
		mixins: [maxHeightMixin],
		components: {
			Scroll,
			Loading,
			NoResult
		},

		data(){
			return {
				praise_img: praise_img,
				recipes: [],
				currentPage: 1,
				pageSize: 10,
				pullup: true,
				hasMore: true,
				hasResult: true,
				showself: true
			};
		},

		computed: {
			...mapGetters([
				'user'
			])
		},

		methods: {
			getCookList() {
				const cookData = new FormData();
				cookData.append('userId', this.user.parentId);
				cookData.append('token', this.user.parent_token);
				cookData.append('current_page', this.currentPage);
				cookData.append('page_count', this.pageSize);

				this.$http.post(this.GLOBAL.URL + '/V1/Index/getCookList', cookData)
				.then((response) => {
					response = response.body;
					if(response.errcode === this.GLOBAL.ERR_CODE) {
						if(response.data.cookList.length < this.pageSize) {
							this.hasMore = false;
						}
						this.recipes = this.recipes.concat(response.data.cookList);
              			this.eventHub.$emit('imgsrcgot');
						if(this.recipes.length === 0) {
							this.hasResult = false;
						}
					}else if(response.errcode === 400003) {
						setTimeout(() => {
							this.relogin();
						}, 1500);
					}
				})
			},

			loadMore() {
				if(this.hasMore) {
					++this.currentPage;
					this.getCookList();
				}
			}
		},

		filters:{
			formatDate(time) {
				let date = new Date(time);
				return formatDate(date,'YYYY-MM-DD hh:mm');
			}
		},

		created(){
			this.getCookList();
		}
	}
</script>

<style scoped lang="less">
	.wrapper {
		width: 100%;
		height: 100%;
		overflow: hidden;
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
		// padding-bottom: 2.5rem;
		background: #fff;

		.wrapper-item {
			padding-bottom: 0.5rem;
			border-bottom: 1px solid #f0f0f0;
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
			box-sizing: border-box;
			margin: 0 0.65rem;

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
</style>
