<template>
	<div>
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
			<div class="integral" @click="gotoIntegral">
				<div class="integral-item">
					积分 :
					<span>{{integral.totalIntegral}}</span>
				</div>
				<div class="integral-item">
					累计 :
					<span>{{integral.allTotalIntegral}}</span>
				</div>
				<div class="integral-item">
					校区排名 :
					<span>{{integral.monthRankings}}</span>
				</div>
				<img src="./ic_more.png" alt="更多信息" class="integral-more">
			</div>
		</div>
		<ul class="opt-list">
			<li class="opt-item" v-for="opt in options" :key="opt">
				<router-link :to="{name:opt.url}" class="link">
					<img :src="opt.imgUrl" class="opt-img">
					<span class="opt-text">{{opt.text}}</span>
				</router-link>
			</li>
			<li class="opt-item" @click="showExit">
				<img src="./ic_exit.png" height="60" width="60" class="opt-img">
				<span class="opt-text">退出</span>
			</li>
		</ul>
		<transition name="fade">
			<div class="exit-wrapper" v-show="show">
				<div class="exit">
					<div class="content">
						<div class="option header">是否退出当前账号</div>
						<div class="option" @click="logout">是</div>
						<div class="option" @click="hideExit">否</div>
					</div>
				</div>
			</div>
		</transition>
		<router-view></router-view>
	</div>
</template>
<script>
import opt_0 from "./bao.png";
import opt_1 from "./ic_Personal-information.png";
import opt_2 from "./ic_Change-the-password.png";
import opt_3 from "./ic_switch.png";

import { mapGetters, mapMutations } from "vuex";

export default {
  data() {
    return {
      options: [
        { url: "baoxianxiangqing", imgUrl: opt_0, text: "保单号：" },
        { url: "personal", imgUrl: opt_1, text: "修改个人信息" },
        { url: "modify_pwd", imgUrl: opt_2, text: "修改密码" },
        { url: "change", imgUrl: opt_3, text: "切换孩子/机构" }
      ],
      show: false,
      showself: true
    };
  },

  computed: {
    ...mapGetters(["currentChild", "integral", "user"])
  },

  methods: {
    gotoIntegral() {
      this.$router.push({
        name: "integral"
      });
    },

    showExit() {
      this.show = true;
    },

    hideExit() {
      this.show = false;
    },

    logout() {
      const userData = new FormData();
      userData.append("userId", this.user.parentId);
      userData.append("token", this.user.parent_token);

      this.$http
        .post(this.GLOBAL.URL + "/V1/User/logout", userData)
        .then(response => {
          response = response.body;
          if (response.errcode === this.GLOBAL.ERR_CODE) {
            this.setLoginState(false);
            this.hideExit();
            this.relogin();
            this.setUser({});
          } else if (response.errcode === 400003) {
            this.setResultTip({ show: true, text: "登录已过期", result: 1 });
            setTimeout(() => {
              this.relogin();
            }, 2000);
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    getBaoxianXinxi() {
      const postData = new FormData();
      postData.append("student_id", this.currentChild.childId);
      // postData.append("student_id", 7580);

      this.$http
        .post(this.GLOBAL.URL + "/v1/Insurance/get_insurance_info", postData)
        .then(response => {
          response = response.body;
          if (response.errcode === this.GLOBAL.ERR_CODE) {
            // 拿到保单号
            let baodanhao = response.data.insurance_id;
            this.$set(
              this.options[0],
              "text",
              baodanhao ? "保单号：" + baodanhao : "保单号：（暂无）"
            );
            if (!baodanhao) {
              this.$set(this.options[0], "url", "");
            }
          } else if (response.errcode === 400003) {
            this.setResultTip({ show: true, text: "登录已过期", result: 1 });
            setTimeout(() => {
              this.relogin();
            }, 2000);
          }
        })
        .catch(e => {
          console.log(e);
        });
    },

    ...mapMutations({
      setUser: "SET_USER",
      setLoginState: "SET_LOGIN_STATE",
      setResultTip: "SET_RESULT_TIP"
    })
  },
  mounted() {
    console.log(this.currentChild);
    this.getBaoxianXinxi();
  }
};
</script>

<style scoped lang="less">
.student-basic {
  box-sizing: border-box;
  width: 17.4rem;
  margin: 0.55rem 0.6rem;
  background: #fff;
}

.student-info {
  display: flex;
  height: 3.75rem;
  border-bottom: 1px solid #f0f0f0;

  .student-avatar {
    width: 3.05rem;
    height: 3.05rem;
    margin: 0.3rem 0.65rem 0;
    border-radius: 50%;
  }

  .student-desc {
    flex: 1;
    padding-top: 0.8rem;
    line-height: 1.4;
  }

  .student-name {
    width: 12rem;
    font-size: 0.9rem;
    font-weight: 500;
    color: #000;
    white-space: nowrap;
    overflow: hidden;
  }

  .student-text {
    width: 12rem;
    font-size: 0;
    color: #000;
    white-space: nowrap;
    overflow: hidden;

    span {
      font-size: 0.6rem;
    }
  }

  .mr-14 {
    margin-right: 0.7rem;
  }
}

.integral {
  position: relative;
  display: flex;
  height: 2.5rem;
  padding: 0 1.5rem 0 0.65rem;
  line-height: 2.5rem;
  font-size: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  .integral-item {
    flex: 1;
    font-size: 0.75rem;
    color: #333;
    margin-right: 0.5rem;
  }

  .integral-more {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    height: 0.7rem;
    padding: 0.9rem;
  }
}

.opt-list {
  box-sizing: border-box;
  width: 17.4rem;
  margin: 0.65rem 0.6rem;
  background: #fff;

  .opt-item {
    width: 100%;
    height: 2.5rem;
    line-height: 2.5rem;
    font-size: 0;
    border-bottom: 1px solid #f0f0f0;

    &:last-child {
      border: 0;
    }

    &:first-child {
      border-bottom: 0.6rem solid #f0f0f0;
    }
  }

  .opt-img {
    width: 1.5rem;
    height: 1.5rem;
    margin: 0.5rem 0.5rem 0 0.65rem;
    vertical-align: top;
  }

  .link {
    display: block;
    width: 100%;
    height: 1.5rem;
  }

  .opt-text {
    font-size: 0.75rem;
    color: #333;
  }
}

.exit-wrapper {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  &.fade-enter-active {
    animation: confirm-fadein 0.3s;

    .content {
      animation: confirm-zoom 0.3s;
    }
  }

  .exit {
    width: 14rem;
    padding: 0.75rem;
    box-sizing: border-box;
    background: #f0f0f0;
  }

  .option {
    width: 12.45rem;
    height: 2.45rem;
    line-height: 2.45rem;
    font-size: 0.9rem;
    color: #333;
    text-align: center;
    margin-bottom: 0.15rem;
    background: #fff;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .header {
    color: #fff;
    background: #333;
  }
}

@keyframes confirm-fadein {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes confirm-zoom {
  0% {
    transform: scale(0);
  }

  50% {
    transform: scale(1.1);
  }

  100% {
    transform: scale(1);
  }
}
</style>
