<template>
	<div class="teacher-intro">
	<scroll :data="teachers" :pullup="pullup" class="scroll" @scrollToEnd="loadMore">
		<ul class="teachers" v-show="teachers.length > 0">
			<li class="teacher" v-for="teacher in teachers" :key="teacher">
				<div class="avator">
					<img :src="teacher.avatar" v-if="showself && teacher.avatar" @error="showself = false">
					<img src="../../common/image/ic_default_head.png" v-else>
				</div>
				<div class="desc">
					<h3 class="name">{{teacher.teacherName}}</h3>
					<p class="text">{{teacher.desc}}</p>
				</div>
			</li>
			<loading v-show="hasMore"></loading>
		</ul>
		<no-result v-show="teachers.length === 0"></no-result>
	</scroll>
	</div>
</template>

<script type="text/javascript">
	import Scroll from 'base/scroll/scroll';
	import Loading from 'base/loading/loading';
	import NoResult from 'components/no-result/no-result';
	import {mapGetters, mapMutations} from 'vuex';

	export default {
		components: {
			Scroll,
			Loading,
			NoResult
		},

		data(){
			return {
				teachers:[],
				pullup: true,
				hasMore: true,
				currentPage: 1,
				pageSize: 10,
				showself: true
			}
		},

		computed: {
			...mapGetters([
				'user'
			])
		},

		methods: {
			getTeachers() {
				const teacherData = new FormData();
				teacherData.append('userId', this.user.parentId);
				teacherData.append('token', this.user.parent_token);
				teacherData.append('current_page', this.currentPage);
				teacherData.append('page_count', this.pageSize);

				this.$http.post(this.GLOBAL.URL + '/V1/Campus/getTeacherList', teacherData)
				.then((response) => {
					response = response.body;
					if(response.errcode == this.GLOBAL.ERR_CODE) {
						if(response.data.teacherList.length < this.pageSize) {
							this.hasMore = false;
						}
						this.teachers = this.teachers.concat(response.data.teacherList);
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
					this.getTeachers();
				}
			},

			...mapMutations({
				setResultTip: 'SET_RESULT_TIP'
			})
		},

		created() {
			this.getTeachers();
		}
	}
</script>

<style scoped lang="less">
	.teacher-intro {
		z-index: 99;
		position: fixed;
		width: 100%;
		height: 100%;
		overflow: hidden;
		background: #f0f0f0;

		.scroll {
			height: 100%;
		}
	}

	.teachers {
		width: 100%;
		background: #fff;

		.teacher {
			display: flex;
			width: 100%;
			height: 3.75rem;
			padding: 0.5rem 0.75rem;
			box-sizing: border-box;
			font-size: 0;
			border-bottom: 0.1rem solid #f4f4f4;

			&:last-child {
				border-bottom: none;
			}

			.avator {
				display: inline-block;
				flex: 0 0 2.8rem;
				width: 2.8rem;
				height: 2.8rem;
				margin-right: 0.75rem;
				border-radius: 50%;

				img {
					width: 100%;
					height: 100%;
					border-radius: 50%;
				}
			}

			.desc {
				display: inline-block;
				flex: 1;
				margin-top: 0.45rem;
				overflow: hidden;

				.name {
					line-height: 1.2rem;
					font-size: 0.75rem;
					font-weight: 700;
					color: #333;
				}

				.text {
					line-height: 1rem;
					font-size: 0.7rem;
					color: #cdcdcd;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}
			}
		}
	}
</style>