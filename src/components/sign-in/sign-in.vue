<template>
	<scroll class="sign-in" :data="signList" :pullup="pullup" @scrollToEnd="loadMore" id="maxHeight">
		<div>
			<div class="student-basic clearfix">
				<h1 class="basic-header">{{currentChild.orgName}}-{{currentChild.school}}</h1>
				<div class="student-info">
					<img :src="currentChild.avatar" class="student-avatar" v-if="showself && currentChild.avatar" @error="showself = false">
					<img src="../../common/image/ic_default_head.png" class="student-avatar" v-else>
					<div class="student-desc">
						<h3 class="student-name">{{currentChild.name}}</h3>
						<div class="student-text">
							<span class="mr-14">{{currentChild.school}}</span>
							<span> {{currentChild.grade}} {{currentChild.class}}
							</span>
						</div>
					</div>
				</div>
				<div class="integral">
					<div class="integral-item">
						本月签到 :
						<span>{{signInfo.signCount}}</span>
					</div>
					<div class="integral-item">
						缺勤 :
						<span>{{signInfo.absentCount}}</span>
					</div>
					<div class="integral-item">
						请假 :
						<span>{{signInfo.leaveCount}}</span>
					</div>
				</div>
			</div>
			<div class="timetag">
				<img :src="icon" class="icon">
				<span class="text">考勤记录</span>
			</div>
			<ul class="t-records" v-show="hasResult">
				<li class="item" v-for="(item, index1) in signList" :key="item">
					<div class="sign" v-show="item.leave === 0">
						<span class="time">{{item.theDate}}</span>
						<span v-if="item.type == 1">午托</span>
						<span v-if="item.type == 2">晚托</span>
						<div class="mark"></div>
					</div>
					<div class="sign" v-show="item.leave === 0">
						<span class="sign-l">校门口：</span>
						<span class="sign-r" v-if="item.transfertime ===0">未签到</span>
						<span class="sign-r" v-else>{{item.transfertime * 1000 | formatDate}}</span>
						<div class="sign-icon" v-for="(picObj,index) in item.picList" :key="index">
								<img class="img this-img-need-grow" src="picObj.pic_url" v-if="picObj.sign_type == 1" :data-index1="index1" :data-index2="index">
						</div>
					</div>
					<div class="sign" v-show="item.leave === 0">
						<span class="sign-l">机构内：</span>
						<span class="sign-r" v-if="item.entertime === 0">未签到</span>
						<span class="sign-r" v-else>{{item.entertime * 1000 | formatDate}}</span>
						<div class="sign-icon" v-for="(picObj, index) in item.picList" :key="index">
								<img class="img this-img-need-grow" :src="picObj.pic_url" v-if="picObj.sign_type == 2" :data-index1="index1" :data-index2="index">
						</div>
					</div>
					<div class="sign border-none" v-show="item.leave === 0">
						<span class="sign-l">签退：</span>
						<span class="sign-r" v-if="item.signofftime === 0">未签退</span>
						<span class="sign-r" v-else>{{item.signofftime * 1000 | formatDate}}</span>
						<div class="sign-icon" v-for="(picObj, index) in item.picList" :key="index">
								<img class="img this-img-need-grow" :src="picObj.pic_url" v-if="picObj.sign_type == 3" :data-index1="index1" :data-index2="index">
						</div>
					</div>
					<div class="sign border-none" v-show="item.leave === 1">
						<span class="time">{{item.theDate}}</span>
						<span v-if="item.type == 1">午托</span>
						<span v-else>晚托</span>
						<span class="leave">请假</span>
						<div class="mark"></div>
					</div>
				</li>
				<loading v-show="hasMore && hasResult"></loading>
			</ul>
			<no-result v-show="!hasResult"></no-result>
		</div>
	</scroll>
</template>
<script type="text/javascript">
import icon from "./icon_attendance.png";

import Scroll from "base/scroll/scroll";
import Loading from "base/loading/loading";
import NoResult from "components/no-result/no-result";
import { formatDate } from "../../common/js/date.js";
import { mapGetters, mapMutations } from "vuex";
import { maxHeightMixin } from "common/js/mixin";

export default {
  mixins: [maxHeightMixin],
  components: {
    Scroll,
    Loading,
    NoResult
  },

  data() {
    return {
      icon: icon,
      signInfo: {},
      signList: [],
      currentChild:{},
      currentPage: 1,
      pageSize: 10,
      pullup: true,
      hasMore: true,
      hasResult: true,
      showself: true
    };
  },

  filters: {
    formatDate(time) {
      let date = new Date(time);
      return formatDate(date, "hh:mm:ss");
    }
  },

  computed: {
    ...mapGetters(["user"])
  },

  methods: {
    getSignInfo() {
      const signData = new FormData();
      signData.append("userId", this.user.parentId);
      signData.append("token", this.user.parent_token);
      signData.append("current_page", this.currentPage);
      signData.append("page_count", this.pageSize);

      this.$http
        .post(this.GLOBAL.URL + "/V1/Sign/getSignInfo", signData)
        .then(response => {
          response = response.body;
          this.currentChild = response.data.childInfo;
          if (response.errcode == this.GLOBAL.ERR_CODE) {
            this.signInfo = response.data.signInfo;
            if (response.data.signList.length < this.pageSize) {
              this.hasMore = false;
            }
            this.signList = this.signList.concat(response.data.signList);
            this.eventHub.$emit('imgsrcgot');
            if (this.signList.length === 0) {
              this.hasResult = false;
            }
          } else if (response.errcode === 400003) {
            setTimeout(() => {
              this.relogin();
            }, 1500);
          }
        });
    },

    loadMore() {
      if (this.hasMore) {
        ++this.currentPage;
        const signData = new FormData();
        signData.append("userId", this.user.parentId);
        signData.append("token", this.user.parent_token);
        signData.append("current_page", this.currentPage);
        signData.append("page_count", this.pageSize);

        this.$http
          .post(this.GLOBAL.URL + "/V1/Sign/getSignInfo", signData)
          .then(response => {
            response = response.body;
            if (response.errcode == this.GLOBAL.ERR_CODE) {
              if (response.data.signList.length < this.pageSize) {
                this.hasMore = false;
              }
              this.signList = this.signList.concat(response.data.signList);
              this.eventHub.$emit('imgsrcgot');
            } else if (response.errcode === 400003) {
              this.setResultTip({ show: true, text: "登录已过期", result: 1 });
              setTimeout(() => {
                this.relogin();
              }, 2000);
            }
          });
      }
    },

    ...mapMutations({
      setResultTip: "SET_RESULT_TIP"
    })
  },

  created() {
    this.getSignInfo();
  }
};
</script>
<style scoped lang="less">
.sign-in {
  z-index: 99;
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background: #e6e6e6;
}

.student-basic {
  box-sizing: border-box;
  width: 100%;
  margin-bottom: 0.55rem;
  background: #fff;

  .basic-header {
    height: 2.5rem;
    padding: 0 0.5rem;
    line-height: 2.5rem;
    overflow: hidden;
    box-sizing: border-box;
    font-size: 0.9rem;
    font-weight: bold;
    color: #333;
    text-align: center;
    border-bottom: 1px solid #f0f0f0;
  }
}

.student-info {
  position: relative;
  display: block;
  width: 100%;
  height: 3.75rem;
  border-bottom: 1px solid #f0f0f0;

  .student-avatar {
    width: 3.05rem;
    height: 3.05rem;
    float: left;
    margin: 0.3rem 0.65rem 0 1.3rem;
    border-radius: 50%;
  }

  .student-desc {
    padding-top: 0.5rem;
    line-height: 1.4rem;
  }

  .student-name {
    font-size: 0.9rem;
    font-weight: 500;
    color: #000;
  }

  .student-text {
    white-space: nowrap;
    overflow: hidden;
    font-size: 0.6rem;
    color: #000;
  }

  .mr-14 {
    margin-right: 0.7rem;
  }
}

.integral {
  position: relative;
  display: flex;
  height: 2.5rem;
  width: 100%;
  line-height: 2.5rem;
  padding: 0 0.65rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  .integral-item {
    flex: 1;
    font-size: 0.75rem;
    color: #333;
    text-align: center;
  }
}

.timetag {
  width: 100%;
  height: 2.5rem;
  padding-left: 1.3rem;
  margin-top: 0.5rem;
  box-sizing: border-box;
  line-height: 2.5rem;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;

  .icon {
    width: 1.15rem;
    height: 1.15rem;
    margin-top: 0.7rem;
    vertical-align: top;
  }

  .text {
    font-size: 0.75rem;
    font-weight: 700;
    color: #333;
  }
}

.t-records {
  padding-bottom: 1rem;
  margin-top: 0.5rem;

  .item {
    padding: 0 1.25rem 0 0.65rem;
    margin-bottom: 0.5rem;
    background: #fff;
  }

  .sign {
    position: relative;
    height: 2rem;
    padding-left: 0.75rem;
    line-height: 2rem;
    font-size: 0.8rem;
    color: #333;
    border-bottom: 1px solid #f0f0f0;

    .time {
      margin-right: 1.1rem;
    }

    .mark {
      position: absolute;
      left: -0.75rem;
      bottom: 0;
      width: 0.2rem;
      height: 1.4rem;
      background: #fc6565;
    }

    .leave {
      float: right;
    }

    .sign-icon {
      position: absolute;
      right: 2.8rem;
      top: 0.3rem;
      width: 1.4rem;
      height: 1.4rem;

      .img{
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
  }

  .border-none {
    border: none;
  }
}
</style>
