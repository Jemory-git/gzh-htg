<template>
	<div class="wrapper">
	<scroll class="scroll" :data="records" :pullup="pullup" @scrollToEnd="loadMore" id="screenHeight">
		<div>
			<ul class="wrapper-list" v-if="hasResult">
				<li class="wrapper-item" v-for="item in records" :key="item">
					<div class="top">
						<img :src="top_img" class="top-img">
					</div>
					<div class="user">
						<div class="user-avator">
							<img :src="item.avatar" v-if="showself && item.avatar" @error="showself = false">
							<img src="../../common/image/ic_default_head.png" v-else>
						</div>
						<div class="content">
							<div class="user-name">{{item.name}}</div>
							<div class="date">
								<span>{{item.recordtime * 1000 | formatDate}}</span>
							</div>
						</div>
					</div>
					<div class="text">{{item.twitter}}</div>
					<ul :class="[{'pic-list': item.files.length > 2},{'pic-list-2': item.files.length == 2},{'pic-list-1': item.files.length == 1}]" v-show="item.files.length > 0">
						<li class="pic-item" v-for="pic in item.files" :key="pic">
							<img v-lazy="pic" class="pic">
						</li>
					</ul>
					<div class="show-com">
						<img :src="com_img" class="com-img" @click.stop="showDialog(item)">
					</div>
					<ul class="com-list" v-show="item.commentList.length">
						<li class="com-item" v-for="comment in item.commentList" :key="comment" @click.stop="reply(comment, item)">
							<div class="commenter">
								<span class="name">{{comment.name}}</span>
								<span v-show="comment.toName">回复</span>
								<span class="name" v-show="comment.toName">{{comment.toName}}</span>
								<span>:</span>
							</div>
							<span class="comment">{{comment.content}}</span>
						</li>
					</ul>
				</li>
				<loading v-show="hasMore"></loading>
			</ul>
			<no-result v-else></no-result>
		</div>
	</scroll>
	<dialog-input :placeholder="placeholder" ref="dialog" @comment="commitComment" @blur="blurInput"></dialog-input>
	<confirm ref="confirm" text="是否删除该评论" @confirm="deleteComments"></confirm>
	</div>
</template>

<script>
	import Scroll from 'base/scroll/scroll';
	import DialogInput from 'base/dialog/dialog';
	import Confirm from 'base/confirm/confirm';
	import Loading from 'base/loading/loading';
	import NoResult from 'components/no-result/no-result';
	import {formatDate} from 'common/js/date.js';
	import {mapGetters, mapMutations} from 'vuex';
	import {screenHeightMixin} from 'common/js/mixin';

	import top_img from "./ic_decoration.png";
	import com_img from "./ic_comments.png";

	export default {
		mixins: [screenHeightMixin],
		components: {
			Scroll,
			DialogInput,
			Confirm,
			Loading,
			NoResult
		},

		data(){
			return {
				top_img: top_img,
				com_img: com_img,
				records: [],
				placeholder: '评论',
				isReply: false,
				currentPage: 1,
				pageSize: 10,
				currentComment: {},
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
			getDynamicList() {
				const data = new FormData();
				data.append('userId', this.user.parentId);
				data.append('token', this.user.parent_token);
				data.append('current_page', this.currentPage);
				data.append('page_count', this.pageSize);

				this.$http.post(this.GLOBAL.URL + '/V1/Dynamic/getDynamicList', data).then((response) => {
					response = response.body;
					if(response.errcode == this.GLOBAL.ERR_CODE) {
						if(response.data.recordList.length < this.pageSize) {
							this.hasMore = false;
						}
						this.records = this.records.concat(response.data.recordList);
						if(this.records.length === 0) {
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

			blurInput() {
				setTimeout(() => {
					this.$refs.dialog.hide();
					this.placeholder = '评论';
				},20)
			},

			showDialog(record) {
				this.$refs.dialog.show(record);
			},

			commitComment(content, record) {
				if(!content.length) {
					this.setResultTip({show: true, text: '评论内容不能为空', result: 1});
					return;
				}
				const commitData = new FormData();
				commitData.append('userId', this.user.parentId);
				commitData.append('token', this.user.parent_token);
				commitData.append('recordId', record.recordId);
				commitData.append('content', content);

				if(this.isReply) {
					commitData.append('toUserId', this.currentComment.userId);
				}

				this.$http.post(this.GLOBAL.URL + '/V1/Dynamic/addComment', commitData)
				.then((response) =>  {
					response = response.body;
					if(response.errcode === this.GLOBAL.ERR_CODE) {
						record.commentList.push(response.data);
						this.placeholder = '评论';
						this.isReply = false;
						this.$refs.dialog.hide();
					}else if(response.errcode === 400003) {
						this.setResultTip({show: true, text: '登录已过期', result: 1});
						setTimeout(() => {
							this.relogin();
						}, 2000);
					}
				})
			},

			reply(comment,record) {
				if(!event._constructed) {
					return;
				}

				if(comment.userId == this.user.parentId) {
					this.$refs.confirm.show(comment, record.commentList);
					return;
				}
				this.currentComment = comment;
				this.placeholder = '回复' + comment.name + ':';
				this.isReply = true;
				this.$refs.dialog.show(record);
			},

			deleteComments(comment,comments) {
				const deleteData = new FormData();
				deleteData.append('userId', this.user.parentId);
				deleteData.append('token', this.user.parent_token);
				deleteData.append('commentId', comment.commentId);

				this.$http.post(this.GLOBAL.URL + '/v1/Dynamic/delComment', deleteData)
				.then((response) => {
					response = response.body;
					if(response.errcode === this.GLOBAL.ERR_CODE) {
						this.setResultTip({show: true, text: '删除成功', result: 0});
						const index = comments.findIndex((item) => {
							return item.commentId === comment.commentId
						})
						comments.splice(index, 1);
					}else if(response.errcode === 400003) {
						this.setResultTip({show: true, text: '登录已过期', result: 1});
						setTimeout(() => {
						this.relogin();
						}, 2000);
					}else {
						this.setResultTip({show: true, text: '删除失败', result: 1});
						this.$refs.ResultTip.show();
					}
				})
			},

			loadMore() {
				if(this.hasMore) {
					++this.currentPage;
					this.getDynamicList();
				}
			},

			...mapMutations({
				setResultTip: 'SET_RESULT_TIP'
			})
		},

		filters:{
			formatDate(time) {
				let date = new Date(time);
				return formatDate(date,'YYYY-MM-DD hh:mm');
			}
		},

		created(){
			this.getDynamicList();
		}
	}
</script>

<style scoped lang="less">
	.wrapper {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
		overflow: hidden; 
		background: #e6e6e6;
	}

	.scroll {
		width: 100%;
		margin-bottom: 2.5rem;
		overflow: hidden;
	}

	.wrapper-list {
		box-sizing: border-box;
		width: 100%;
		background: #fff;

		.top {
			position: relative;
			width: 100%;
			height: 1.2rem;
			margin-bottom: .2rem;
			background: #ededed;
		}

		.top-img {
			position: absolute;
			left: 0;
			top: .8rem;
			width: 100%;
		}

		.user {
			display: flex;
			padding: .8rem .65rem;
		}

		.user-avator {
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
			font-size: .7rem;
			color: #adadad;
		}

		.text {
			padding: 0 .65rem;
			font-size: .75rem;
			line-height: 1.25rem;
			color: #333;
		}

		.pic-list {
			display: flex;
			flex-wrap: wrap;
			width: 100%;
			max-height: 17.4rem;
			padding: .8rem .65rem 0;
			overflow: hidden;

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
			width: 100%;
			padding: .8rem .65rem 0;
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
			width: 17rem;
			height: 15rem;
			padding: .8rem .65rem 0;

			.pic-item {
				width: 17rem;
				height: 15rem;
			}
		}

		.pic {
			width: 100%;
			height: 100%;
		}

		.show-com {
			display: block;
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
			padding: .65rem 1.5rem .65rem .65rem;
			border-top: 2px solid #ebebeb;
		}

		.com-item {
			overflow: hidden;
			width: 100%;
			margin-bottom: .2rem;
			line-height: 1.2rem;
			font-size: 0;
			color:#333;

			.commenter {
				display: inline;
				font-size: .7rem;
			}

			.name {
				color: #134aa0;
			}

			.comment {
				margin-left: 0.5rem;
				font-size: .7rem;
			}
		}
	}
</style>
