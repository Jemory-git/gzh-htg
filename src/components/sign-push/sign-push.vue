<template>
	<div class="sign-push">
		<div class="student-info">
			<img :src="info.childInfo.avatar" class="student-avatar" v-if="showself && info.childInfo.avatar" @error="showself = false">
			<img src="../../common/image/ic_default_head.png" class="student-avatar" v-else>
			<div class="student-desc">
				<h3 class="student-name">
					<span class="mr-14">{{info.childInfo.name}}</span>
					<span>{{info.childInfo.orgName}}</span>
				</h3>
				<div class="student-text">
					<span class="mr-14">{{info.childInfo.school}}</span>
					<span>{{info.childInfo.grade}}{{info.childInfo.class}}</span>
				</div>
			</div>
		</div>
		<div class="sign-info">
			<h3 class="text">
				签到时间:
				<span class="text-right">{{info.signInfo.signTime}}</span>
			</h3>
			<h3 class="text">
				签到类型:
				<span class="text-right">{{info.signInfo.typeofSign}}</span>
			</h3>
		</div>
		<img :src="info.signInfo.signAvatar" alt="" class="qiandao-photo" v-if="info.signInfo.signAvatar && !imgErrBoo" @error="imgErr(imgErrBoo = true)">
		<a :href="url" class="button">查看更多</a>
	</div>
</template>

<script>
import { Base64 } from "common/js/base64";
import { urlParse } from "common/js/url_parse";

export default {
  data() {
    return {
      info: {},
      url: "",
      showself: true,
      imgErrBoo: false,
    };
  },

  methods: {
    parse() {
      var base = new Base64();
      var page = "sign_in";
      var base64Str = urlParse().params;
      var result = base.decode(base64Str);
      result = JSON.parse(result);

      console.log(result);
      this.url = this.GLOBAL.URL + `/v1/Login/weixinAuth?thePage=${page}&childId=${result.childId}`;

      this.info = result;
    }
  },

  created() {
    this.parse();
  }
};
</script>

<style lang="less" scoped>
.sign-push {
  z-index: 999;
  position: relative;
  min-height: 100vh;
  background: #fff;
}

.student-info {
  display: flex;
  height: 3.75rem;
  margin-bottom: 0.5rem;
  background: #fff;
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

.sign-info {
  padding: 0.7rem;
  line-height: 1.4rem;
  background: #fff;

  .text {
    margin-bottom: 0.5rem;
    font-size: 1rem;
    font-weight: 700;
  }

  .text-right {
    font-size: 1rem;
    font-weight: 400;
    color: #333;
  }
}

.qiandao-photo {
  display: block;
  width: 75%;
  margin: 0 auto;
}

.button {
  display: block;
  margin: 1rem 0.65rem 0;
  height: 2.5rem;
  line-height: 2.5rem;
  text-align: center;
  font-size: 0.9rem;
  font-weight: 700;
  color: #fff;
  background: #76ccf6;
}
</style>