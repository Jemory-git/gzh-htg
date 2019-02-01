<template>
  <scroll class="index" ref="scroll" id="screenHeight">
    <!-- BScroll容器 -->
    <div class="scroll-div">
      <!-- 轮播图 -->
      <div v-if="Object.keys(banners).length > 0">
        <slider class="index-swiper" ref="sliderhook">
          <div v-for="banner in banners" :key="banner" class="banners">
            <img :src="banner" class="banner" @click="toMingShiKeTang($event, 1)">
          </div>
        </slider>
      </div>
      <!-- 孩子信息 -->
      <div class="student-basic clearfix" v-if="Object.keys(currentChild).length > 0">
        <h1 class="basic-header">{{currentChild.orgName}}-{{currentChild.school}}</h1>
        <router-link class="student-info" :to="{name:'mine'}">
          <img
            :src="currentChild.avatar"
            class="student-avatar"
            v-if="showself && currentChild.avatar"
            @error="showself = false"
          >
          <img src="../../common/image/ic_default_head.png" class="student-avatar" v-else>
          <h3 class="student-name">{{currentChild.name}}</h3>
          <img src="./ic_particulars.png" alt class="student-detail">
        </router-link>
        <div class="integral" @click="gotoIntegral($event)">
          <div id="score01" class="integral-item">
            积分 :
            <span>{{integral.totalIntegral}}</span>
          </div>
          <div id="score02" class="integral-item">
            累计 :
            <span>{{integral.allTotalIntegral}}</span>
          </div>
          <div id="score03" class="integral-item">
            校区排名 :
            <span>{{integral.monthRankings}}</span>
          </div>
          <img src="./ic_more.png" alt="更多信息" class="integral-more">
        </div>
      </div>
      <!-- 功能列表 -->
      <ul class="student-record clearfix">
        <li class="record-item" v-for="item in record" :key="item">
          <router-link :to="{path:item.url}">
            <img :src="item.imgUrl" class="item-img" :alt="item.title" ref="icon">
            <div class="item-text">
              <p class="item-text-title" v-html="item.title"></p>
              <p class="item-text-cont" v-html="item.text"></p>
            </div>
          </router-link>
        </li>
        <li class="record-item">
          <div @click="getGeneUrl">
            <img :src="gene.imgUrl" class="item-img" :alt="gene.title">
            <div class="item-text">
              <p class="item-text-title" v-html="gene.title"></p>
              <p class="item-text-cont" v-html="gene.text"></p>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="loading-container" v-show="!currentChild">
      <loading></loading>
    </div>
    <div class="cover-guanggao" v-if="showCoverGuanggao">
      <img class="img" src="./cover-guanggao.png" alt @click="toMingShiKeTang($event, 2)">
      <img class="shutdown" src="./sd.png" alt @click="shutdownCoverGuanggao">
    </div>
  </scroll>
</template>

<script>
import Slider from "base/slider/slider";
import Scroll from "base/scroll/scroll";
import Loading from "base/loading/loading";

import { param } from "common/js/url_parse";
import { mapGetters, mapMutations } from "vuex";
import { screenHeightMixin } from "common/js/mixin";

import record_1 from "./ic_1.png";
import record_2 from "./ic_2.png";
import record_3 from "./ic_3.png";
import record_4 from "./ic_4.png";
import record_5 from "./ic_5.png";
import record_6 from "./ic_6.png";
import record_7 from "./ic_ommentsmall.png";

export default {
  mixins: [screenHeightMixin],
  components: {
    Slider,
    Scroll,
    Loading
  },

  data() {
    return {
      substitutionBanner: {},
      record: [
        {
          title: "签到记录",
          text: "实时掌握孩子位置",
          url: "/sign_in",
          imgUrl: record_1
        },
        {
          title: "请个小假",
          text: "了解孩子出勤情况",
          url: "/leave",
          imgUrl: record_2
        },
        {
          title: "校园食谱",
          text: "关注孩子饮食健康",
          url: "/recipes",
          imgUrl: record_3
        },
        {
          title: "校园监控",
          text: "了解孩子校区动态",
          url: "/monitor",
          imgUrl: record_5
        },
        {
          title: "点评情况",
          text: "关注孩子日常表现",
          url: "/daily_review",
          imgUrl: record_7
        }
      ],
      banners: {},
      data: {},
      child: {},
      integral: {},
      gene: { title: "基因检测", text: "了解天赋因材施教", imgUrl: record_6 },
      GENE_URL: "http://wx.icangene.com/haotuoguan_report",
      screenWidth: window.clientWidth,
      showself: true,
      showCoverGuanggao: false
    };
  },

  computed: {
    ...mapGetters(["user", "currentChild"])
  },

  methods: {
    getGeneUrl() {
      const userData = new FormData();
      userData.append("userId", this.user.parentId);
      userData.append("token", this.user.parent_token);

      this.$http
        .post(this.GLOBAL.URL + "/v1/Index/geneDetection", userData)
        .then(response => {
          response = response.body;
          if (response.errcode === this.GLOBAL.ERR_CODE) {
            // 保存参数
            this.data.phone = response.data.phone;
            this.data.code = response.data.code;
            // 转换qs，加到url
            this.GENE_URL +=
              (this.GENE_URL.indexOf("?") < 0 ? "?" : "&") + param(this.data);
            // 跳转
            window.location.href = this.GENE_URL;
          } else if (response.errcode === 400003) {
            this.setResultTip({ show: true, text: "登录已过期", result: 1 });
            setTimeout(() => {
              this.relogin();
            }, 2000);
          }
        })
        .catch(e => {
          this.setResultTip({ show: true, text: "数据加载失败", result: 1 });
        });
    },

    getIndexInfo() {
      const userData = new FormData();
      userData.append("userId", this.user.parentId);
      userData.append("token", this.user.parent_token);

      this.$http
        .post(this.GLOBAL.URL + "/V1/Index/getIndex", userData)
        .then(response => {
          response = response.body;
          if (response.errcode == this.GLOBAL.ERR_CODE) {
            this.banners = response.data.bannerList;
            this.banners =
              Object.keys(this.banners).length > 0
                ? this.banners
                : this.substitutionBanner;
            this.integral = response.data.integralInfo;
            this.setCurrentChild(response.data.childInfo);
            this.setIntegral(this.integral);
          } else if (response.errcode === 400003) {
            this.setResultTip({ show: true, text: "登录已过期", result: 1 });
            setTimeout(() => {
              this.relogin();
            }, 2000);
          }
        });
    },

    toMingShiKeTang(e, type) {
      const userData = new FormData();
      userData.append("parentId", this.user.parentId);
      userData.append("type", type);
      this.$http
        .post(this.GLOBAL.URL + "/V1/Teachercourse/add_parent_info", userData)
        // .post("http://192.168.0.117/online/public/index.php/V1/Teachercourse/add_parent_info", userData)
        .then(response => {
          response = response.body;
          if (response.errcode == this.GLOBAL.ERR_CODE) {
            // 请求成功
            return;
          } else if (response.errcode === 400003) {
            this.setResultTip({ show: true, text: "登录已过期", result: 1 });
            setTimeout(() => {
              this.relogin();
            }, 2000);
          }
        });
      if (type === 1) {
        window.location.assign(
          "https://d.eqxiu.com/s/Lj8vKsQZ?share_level=3&from_user=a7b18a5e-2952-4a1e-8b3a-9c49d803be2b&from_id=e3927127-8cc1-4351-b519-3c720afbc75e&share_time=1542874516710&from=singlemessage&isappinstalled=0"
        );
      }
      if (type === 2) {
        window.location.assign(
          "http://mp.weixin.qq.com/bizmall/malldetail?id=&pid=phmH6sl9Gf0BQEnoZEfZiRDDKJ-Q&biz=MzAwMjc1MzQxNA==&scene=&action=show_detail&showwxpaytitle=1#wechat_redirect"
        );
      }
    },

    shutdownCoverGuanggao() {
      this.showCoverGuanggao = false;
      this.$emit("toogleTab", false);
    },

    gotoIntegral(e) {
      this.$router.push({
        name: "integral"
      });
    },

    ...mapMutations({
      setIntegral: "SET_INTEGRAL",
      setResultTip: "SET_RESULT_TIP",
      setCurrentChild: "SET_CURRENT_CHILD"
    })
  },

  watch: {
    $route(to, from) {
      if (from.path == "/change") {
        this.getIndexInfo();
      }
    }
  },

  created() {
    this.getIndexInfo();
  },

  mounted() {
    // 一天内只弹出一次
    let timejilu = localStorage.getItem("timejilu") || 1543401720309;
    let cTimeStamp = Date.now();
    let oneday = 24 * 60 * 60 * 1000;
    if (cTimeStamp - parseInt(timejilu) > oneday) {
      this.$emit("toogleTab", true);
      this.showCoverGuanggao = true;
      localStorage.setItem("timejilu", cTimeStamp);
    }
  },

  activated() {
    setTimeout(() => {
      if (this.$refs.scroll && this.$refs.sliderhook) {
        this.$refs.scroll.refresh();
        this.$refs.sliderhook.continue();
      }
    }, 20);
  }
};
</script>
<style scoped lang="less">
.index {
  width: 100%;
  overflow: hidden;

  .scroll-div {
    padding-bottom: 2.5rem;
  }
}

.index-swiper {
  height: 8.5rem;

  .banners {
    height: 8.5rem;
    width: 100vw;

    .banner {
      display: block;
      width: 100vw;
      height: 8.5rem;
    }
  }
}

.slider /deep/ .dots {
  font-size: 0;

  .dot {
    display: inline-block;
    width: 0.4rem;
    height: 0.4rem;
    border: 1px solid #fff;
    border-radius: 50%;
  }

  .active {
    display: inline-block;
    width: 0.4rem;
    height: 0.4rem;
    background: #fff;
    border: 1px solid #fff;
    border-radius: 50%;
  }
}

.student-basic {
  box-sizing: border-box;
  margin: 0.55rem 0.6rem;
  background: #fff;

  .basic-header {
    overflow: hidden;
    height: 2.5rem;
    line-height: 2.5rem;
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
  height: 3.75rem;
  line-height: 3.75rem;
  border-bottom: 1px solid #f0f0f0;

  .student-avatar {
    width: 3.05rem;
    height: 3.05rem;
    float: left;
    margin: 0.3rem 0.65rem 0;
    border-radius: 50%;
  }

  .student-name {
    width: 11rem;
    font-size: 0.9rem;
    color: #333;
    white-space: nowrap;
    overflow: hidden;
  }

  .student-detail {
    position: absolute;
    right: 0.65rem;
    top: 50%;
    width: 0.9rem;
    height: 0.9rem;
    margin-top: -0.45rem;
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

.student-record {
  box-sizing: border-box;
  width: 100%;
  padding: 0 0.6rem;
  margin-top: 0.5rem;
}

.record-item {
  float: left;
  width: 8.5rem;
  height: 3.75rem;
  margin-bottom: 0.5rem;
  border-radius: 0.25rem;
  background: #fff;

  .item-img {
    float: left;
    width: 2rem;
    height: 2rem;
    margin: 0.9rem 0.5rem 0 0.9rem;
  }

  .item-text {
    float: left;
    margin-top: 1.05rem;
  }

  .item-text-title {
    margin-bottom: 0.4rem;
    font-size: 0.75rem;
    color: #333;
  }

  .item-text-cont {
    width: 5rem;
    font-size: 0.6rem;
    color: #b7b7b7;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.record-item:nth-child(2n) {
  margin-left: 0.5rem;
}

.loading-container {
  position: absolute;
  width: 100%;
  top: 50%;
  transform: translateY(-50%);
}
.cover-guanggao {
  position: absolute;
  width: 100vw;
  height: 100vh;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #00000050;

  .img {
    width: 80%;
  }

  .shutdown {
    width: 2rem;
  }
}
</style>
