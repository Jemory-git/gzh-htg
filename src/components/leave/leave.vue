<template>
	<div class="leave">
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
		</div>

		<div class="tab">
			<div class="tab-item" :class="{'tab-active': type === 0}" @click="selectType(0)">请假</div>
			<div class="tab-item" :class="{'tab-active': type === 1}" @click="selectType(1)">取消请假</div>
		</div>
		<div v-show="type === 0">
			<div class="time-select">
				<div class="title">请选择请假日期</div>
				<div class="item">
					<span>开始时间</span>
					<input class="start-time" type="text" id="starttime" name="starttime" readonly="readonly" placeholder="选择开始日期" data-date-format="yyyy-mm-dd" ref="beginTime">
				</div>
				<div class="item">
					<span>结束时间</span>
					<input class="end-time" type="text" id="endtime" name="endtime" readonly="readonly" placeholder="选择结束日期" data-date-format="yyyy-mm-dd" ref="overTime">
				</div>
			</div>
			<div class="confirm" @click="askForLeave">确定</div>
			<tips :text="tipsText" ref="tips"></tips>
		</div>

		<div v-show="type === 1">
			<div class="list-Wrapper" ref="BScrollWrapper" id="leaveHook">
				<ul class="leave-lsit">
					<li class="leave-item" v-for="item in leaves" :key="item.leaveId">
						<label :for="item.leaveId" class = "label-wrapper">
							<input type="checkbox" class="checkbox" :id="item.leaveId" :value="item.leaveId" v-model="selected" ref="checkbox">
							<div class='checkbox-icon'>
								<img :src="check" class="check">
							</div>
							<div class="date">日期: {{item.date}}</div>
							<img :src="item.type == 1 ? noon : night" class="type-img">
						</label>
					</li>
				</ul>
				<no-result v-show="leaves.length === 0"></no-result>
			</div>

			<div class="tab tab-fixed">
				<input id="all" type="checkbox" v-model="selectAll" style="display:none">
				<label for="all" class="tab-item border-right" v-if="selected.length !=0 && selected.length == leaves.length">取消全选</label>
				<label for="all" class="tab-item border-right" v-else>全部选择</label>
				<div class="tab-item" @click="confirm">确定</div>
			</div>
		</div>

		<loading class="waiting" v-show="leaving" :title="title"></loading>
	</div>
</template>

<script type="text/javascript">
	import jquery from '../../common/js/jquery_3.1.1.js';
	import {mobiscroll} from '../../common/js/mobiscroll.min.zh.js';
	import '../../common/css/mobiscroll.min.css';

	import BScroll from 'better-scroll';
	import Tips from 'base/tips/tips';
	import NoResult from 'components/no-result/no-result';
	import Loading from 'base/loading/loading';
	import { formatDate } from '../../common/js/date.js';
	import {mapGetters, mapMutations} from 'vuex';

	import noon from './ic_afternoon.png';
	import night from './ic_night.png';
	import check from './icon_yuan.png';

	export default {
		components: {
			Tips,
			NoResult,
			Loading
		},

		data(){
			return {
				type: 0,
				noon: noon,
				night: night,
				check: check,
				checkall: false,
				checked: true,
				selected: [],
				leaves: [],
				tipsText: '',
				leaving: false,
				title: '请假中...',
				showself: true
			};
		},

		computed: {
			selectAll: {
				get: function () {
					return this.leaves ? this.selected.length == this.leaves.length : false;
				},

				set: function (value) {
					var selected = [];
					if (value) {
						this.leaves.forEach(function (item) {
							selected.push(item.leaveId);
						});
						this.$refs.checkbox.checked = true;
					}
					this.selected = selected;
				}
			},

			...mapGetters([
				'currentChild',
				'user'
			])
		},

		methods: {
			// 初始化滚动
			_initScroll(){
				if(!this.scroll){
					this.scroll = new BScroll(this.$refs.BScrollWrapper,{
						click:true
					});
				} else {
					this.scroll.refresh();
				}
			},

			selectType(type) {
				this.type = type;
			},

			startTime(el){
				let now = new Date();
				now = new Date(now.getFullYear(), now.getMonth(), now.getDate());
				let max = new Date(now.getFullYear() + 3, now.getMonth(), now.getDate());
				this.instance1 = mobiscroll.date(el, {
					lang: 'zh',
					theme: 'ios',
					display: 'bottom',
					headerText: '选择开始时间',
					min: now,
					max: max,
					minWidth: 50,
					dateFormat: 'yy-mm-dd',
					dateWheels: 'yy mm dd',
					showLabel: true,
					dateOrder: 'yymmdd'
				});
			},

			endTime(el){
				let now = new Date(),
					max = new Date(now.getFullYear() + 3, now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds());
				this.instance2 = mobiscroll.date(el, {
					lang: 'zh',
					theme: 'ios',
					display: 'bottom',
					headerText: '选择结束时间',
					min: now,
					max: max,
					minWidth: 50,
					dateFormat: 'yy-mm-dd',
					dateWheels: 'yy mm dd',
					showLabel: true
				});
			},

			askForLeave() {
				this.beginTime = this.$refs.beginTime.value;
				this.overTime = this.$refs.overTime.value;

				const timeData = new FormData();
				timeData.append('userId', this.user.parentId);
				timeData.append('token', this.user.parent_token);
				timeData.append('start_date', this.beginTime);
				timeData.append('end_date', this.overTime);

				this.$http.post(this.GLOBAL.URL + '/V1/Leave/commitLeave', timeData)
				.then((response) => {
					response = response.body;
					if(response.errcode === this.GLOBAL.ERR_CODE) {
						this.beginTime = this.$refs.beginTime.value = '';
						this.overTime = this.$refs.overTime.value = '';
						this.$refs.tips.hide();
						this.setResultTip({show: true, text: '请假成功', result: 0});
						this.getLeaveList();
					}else if(response.errcode === 400001 || response.errcode === 400010) {
						this.tipsText = response.errmsg;
						this.$refs.tips.show();
					}else if(response.errcode === 400003) {
						this.setResultTip({show: true, text: '登录已过期', result: 1});
						setTimeout(() => {
							this.relogin();
						}, 2000);
					}
				})
			},

			getLeaveList() {
				const userData = new FormData();
				userData.append('userId', this.user.parentId);
				userData.append('token', this.user.parent_token);
				this.$http.post(this.GLOBAL.URL + '/V1/Leave/getLeaveList', userData)
				.then((response) => {
					response = response.body;
					if (response.errcode == this.GLOBAL.ERR_CODE) {
						this.leaves = response.data;
					}else if(response.errcode === 400003) {
						this.setResultTip({show: true, text: '登录已过期', result: 1});
						setTimeout(() => {
							this.relogin();
						}, 2000);
					}
				})
			},

			cancelLeave() {
				const leaveIds = this.selected.join(',');
				const leaveData = new FormData();
				leaveData.append('userId', this.user.parentId);
				leaveData.append('token', this.user.parent_token);
				leaveData.append('leaveIds', leaveIds);

				this.$http.post(this.GLOBAL.URL + '/v1/Leave/cancelLeave', leaveData)
				.then((response) => {
					response = response.body;
					if (response.errcode === this.GLOBAL.ERR_CODE) {
						this.selected = [];
						this.setResultTip({show: true, text: '取消请假成功', result: 0});
						this.getLeaveList();
					}else if(response.errcode === 400003) {
						this.setResultTip({show: true, text: '登录已过期', result: 1});
						setTimeout(() => {
							this.relogin();
						}, 2000);
					}else {
						this.setResultTip({show: true, text: response.errmsg, result: 1});
					}
				})
			},

			confirm() {
				this.cancelLeave();
			},

			...mapMutations({
				setResultTip: 'SET_RESULT_TIP'
			})
		},

		watch: {
			type: function(val, oldval) {
				if(val === 1) {
					this.$nextTick(() => {
						this._initScroll();
					});
				}
			}
		},

		filters: {
			formatDate(time) {
				let date = new Date(time);
				return formatDate(date, 'YYYY-MM-DD');
			}
		},

		created() {
			this.getLeaveList();
		},

		mounted(){
			this.startTime('#starttime');
			this.endTime('#endtime');
			const isiOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
			const wechatInfo = navigator.userAgent.match(/MicroMessenger\/([\d\.]+)/i);
			const wechatVersion = wechatInfo ? wechatInfo[1] : '0';
			if(isiOS && wechatVersion >= '6.6.7') {
				document.getElementById('leaveHook').style.height = 19 + 'rem';
			}
		},
		destroyed() {
			this.instance1.hide();
			this.instance2.hide();
		}
	}
</script>

<style scoped lang="less">
	.leave {
		z-index: 99;
		position: relative;
		min-height: 100%;
		background: #e6e6e6;
	}

	.waiting {
		box-sizing: border-box;
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		padding-top: 50%;
		background: rgba(0, 0, 0, 0.8);
	}

	.student-basic {
		box-sizing: border-box;
		width: 100%;
		background: #fff;
	}

.student-info {
	position: relative;
	display: block;
	height: 3.75rem;
	border-bottom: 1px solid #f0f0f0;

	.student-avatar {
		width: 3.05rem;
		height: 3.05rem;
		float: left;
		margin: .3rem 0.65rem 0 1.3rem;
		border-radius: 50%;
	}

	.student-desc {
		padding-top: 0.5rem;
		line-height: 1.4rem;
	}

	.student-name {
		font-size: .9rem;
		font-weight: 500;
		color: #000;
	}

	.student-text {
		white-space: nowrap;
		overflow: hidden;
		font-size: .6rem;
		color: #000;
	}

	.mr-14 {
		margin-right: .7rem;
	}
}

	.tab {
		display: flex;
		width: 100%;
		height: 2.5rem;
		line-height: 2.5rem;
		font-size: .75rem;
		color: #333;
		text-align: center;
		background: #fff;
		border-top: 1px solid #f0f0f0;

		.tab-item{
			flex: 1;
			font-weight: 700;
		}

		.tab-active {
			color: #fff;
			background: #76ccf6;
		}
	}

	.time-select {
		width: 17.4rem;
		margin: .65rem;
		overflow: hidden;
		background: #fff;

		.title {
			width: 100%;
			height: 2.5rem;
			line-height: 2.5rem;
			text-align: center;
			font-size: .9rem;
			color: #333;
		}

		.item {
			width: 100%;
			height: 2.5rem;
			padding:0 1.1rem 0 1.9rem;
			box-sizing: border-box;
			line-height: 2.5rem;
			font-size: .75rem;
			color: #333;
			border-top: 1px solid #f0f0f0;
		}

		.start-time,
		.end-time {
			float: right;
			margin-top: .8rem;
			text-align: right;

			&::placeholder {
				font-size: .75rem;
				color: #adadad;
			}
		}
	}

	.confirm {
		margin: 0 .65rem;
		height: 2.5rem;
		line-height: 2.5rem;
		text-align: center;
		font-size: .9rem;
		font-weight: 700;
		color: #fff;
		background: #76ccf6;
	}

	.list-Wrapper {
		position: relative;
		height: 20.8rem;
		overflow: hidden;
	}

	.leave-lsit {
		// padding: 0 0.65rem 0.65rem 0.65rem;
		padding: 0.65rem;

		.leave-item {
			position: relative;
			height: 2.5rem;
			line-height: 2.5rem;
			margin-bottom: 0.65rem;
			font-size: 0;
			background: #fff;
		}

		.date {
			display: inline-block;
			font-size: 0.9rem;
			color: #333;
		}
		
		.type-img {
			position: absolute;
			right: 0;
			bottom: 0;
			width: 1.65rem;
		}
	}

	.tab-fixed {
		z-index: 999;
		position: fixed;
		left: 0;
		bottom: 0;
	}

	.border-right {
		border-right: 1px solid #f0f0f0;
	}

	.label-wrapper {
		display: block;
		width: 100%;
		height: 100%;
	}

	.checkbox {
		display: none;
	}

	.checkbox+.checkbox-icon {
		display: inline-block;
		position: relative;
		margin: 0.8rem 1.7rem 0 0.65rem;
		width: 0.9rem;
		height: 0.9rem;
		vertical-align: top;
		border: 1px solid #333;
		border-radius: 50%;
	}

	.check {
		display: none;
		position: absolute;
		left: -0.2rem;
		top: -0.1rem;
		width: 1.25rem;
		height: 1.1rem;
	}

	.checkbox:checked+.checkbox-icon > .check {
		display: block;
	}
</style>