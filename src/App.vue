<template>
  <div id="app" class="app" ref="app" @click="on_img_grow($event)">
    <tab v-if="!hideTab"></tab>
    <result-tip :text="resultTip.text" :isShow="resultTip.show" :result="resultTip.result"></result-tip>
    <!-- 内容 -->
    <!-- <transition :name="transitionName"> -->
    <router-view v-if="!$route.meta.keepAlive" @toogleTab="toogleTab"></router-view>
    <!-- </transition> -->
    <!-- <transition :name="transitionName"> -->
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" @toogleTab="toogleTab"></router-view>
    </keep-alive>
    <!-- </transition> -->
    <div class="loading-container" v-show="isLoading">
      <loading class="loading"></loading>
    </div>
    <div
      class="growing-img-wrapper"
      ref="scrollwrapper"
      :class="{'show-growing-img-wrapper':showgrowingimgboo}"
      @click.stop="close_img_grow"
    >
      <!-- <img class="loading center" src="./common/image/loading.gif" alt="" v-show="!imgloadedBoo">
      <img class="growing-img center" :src="growing_img_src" alt="" @load="imgloadedBoo = true" v-show="imgloadedBoo" @touchstart="onTouchStart($event)" @touchmove="onTouchMove($event)">-->
      <imgViewer :refreshTimes="times" :turnToImgIndex="turnToImgIndex" @pagexchange="pagexchange"></imgViewer>
    </div>
  </div>
</template>

<script>
import Tab from "./components/tab/tab";
import ResultTip from "base/result-tip/result-tip";
import Loading from "base/loading/loading.vue";
import { mapGetters } from "vuex";

// 图片查看器
import imgViewer from "base/img-viewer/img-viewer.vue";
export default {
  name: "App",
  data() {
    return {
      growing_img_src: "",
      // growed_img_src_arr: [],
      showgrowingimgboo: false,
      imgloadedBoo: false,
      hideTab: false,
      currentIndex1: "",
      times: 0,
      turnToImgIndex: ""
      // transitionName: "slide-left"
    };
  },
  components: {
    Tab,
    ResultTip,
    Loading,
    imgViewer
  },

  computed: {
    ...mapGetters(["resultTip", "isLoading"])
  },

  methods: {
    on_img_grow(e) {
      let target = e.target;
      if (!target.classList.contains("this-img-need-grow")) {
        // 过滤不需要放大的目标
        return;
      }
      let sliderGroup = document.getElementById("slider-group");

      // 如果点击的图片不在当前显示的图片列表中

      if (this.currentIndex1 != target.dataset.index1) {
        console.log("index1", target.dataset.index1);
        console.log("this.currentIndex1", this.currentIndex1);

        this.currentIndex1 = target.dataset.index1;
        // 清空当前列表
        sliderGroup.innerHTML = "";

        // 克隆与该img对象具有相同index1值的所有img对象
        let clonedImgArr = this.allNeededGrowImg[target.dataset.index1].map(
          c => {
            return c.cloneNode();
          }
        );
        clonedImgArr.forEach((c, i) => {
          c.setAttribute(this.data_v, ""); // 加入css作用域属性
          sliderGroup.appendChild(c);
        });

        // 通知图片查看器图片列表更新了
        this.times++;
      }

      // 显示图片查看器
      this.showgrowingimgboo = true;

      // 滚动图片查看器到点击的图片位置
      this.$nextTick(() => {
        this.turnToImgIndex = target.dataset.index2;
        console.log("index2", target.dataset.index2);
      });
    },
    pagexchange(index) {
      // 图片查看器组件发射事件，通知翻页了
      this.turnToImgIndex = "" + index;
    },
    close_img_grow() {
      this.showgrowingimgboo = false;
    },
    toogleTab(m) {
      this.hideTab = m;
    }
  },
  watch: {
    $route(to, from) {
      // 切换页面后，重置弹出框
      this.promptBox.reInit();

      // 关闭放大图
      this.close_img_grow();

      // 重置currentIndex1的值
      this.currentIndex1 = "";

      // 保险单页面隐藏tab
      let ctitle = to.meta.title;
      if (ctitle === "保险单" || ctitle === "机构查询") {
        this.hideTab = true;
      }
    }
  },
  mounted() {
    // 保存当前组件CSS作用域值
    this.data_v = this.$refs.app.attributes[0].name;
  }
};
</script>

<style scoped lang="less" rel="stylesheet/less">
.app {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: #f0f0f0;

  .growing-img-wrapper {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate3d(-50%, -50%, 0) scale(0);
    width: 100vw;
    height: 100vh;
    transition: all 0.2s ease-out;
    background-color: #000;
    overflow: hidden;
    z-index: 1000;

    .growing-img {
      width: 100%;
    }

    .center {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate3d(-50%, -50%, 0);
    }
  }
  .show-growing-img-wrapper {
    transform: translate3d(-50%, -50%, 0) scale(1);
  }

  .loading-container {
    z-index: 999;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgb(255, 255, 255);

    .loading {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }

  // .slide-left-enter-active,
  // .slide-left-leave-active {
  //   position: absolute;
  //   top: 0;
  //   left: 0;
  // }

  // .slide-left-enter-active {
  //   transition: all 0.5s;
  // }

  // .slide-left-leave-active {
  //   transition: all 0.5s;
  // }

  // .slide-left-enter {
  //   transform: translate3d(100%, 0, 0);
  //   opacity: 0;
  // }

  // .slide-left-enter-to {
  //   transform: translate3d(0, 0, 0);
  //   opacity: 1;
  // }

  // .slide-left-leave-to {
  //   opacity: 0;
  // }
}
</style>
