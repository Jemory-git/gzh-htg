<template>
	<scroll class="campus" id="screenHeight" ref="scroll">
		<div class="scroll-div">
			<!-- 轮播图 -->
			<div v-if="banners.length > 0">
				<slider class="campus-swiper" ref="sliderhook">
					<div v-for="banner in banners" :key="banner">
						<img :src="banner" class="banner">
					</div>
				</slider>
			</div>
			<div class="campus-swiper" v-else>
				<img src="./ic_lunbo.png" class="banner">
			</div>
			<!--校区-->
			<div class="school-wrapper">
				<!-- 校区介绍 -->
				<div class="school-name">
					{{campusInfo.orgName}}-{{campusInfo.school}}
				</div>
				<div class="school-desc">
					<div class="desc-l">校区介绍</div>
					<div class="desc-r">{{campusInfo.shopIntroduce}}</div>
				</div>
				<div class="school-desc">
					<div class="desc-l">地址详情</div>
					<div class="desc-r">{{campusInfo.address}}</div>
				</div>
				<!--教学师资-->
				<div class="teachers clearfix" v-show="teachers.length > 0">
					<div class="text">
						教学师资
						<span class="more" @click="allTeachers">更多</span>
					</div>
					<ul class="teacher-list">
						<li class="teacher-item" v-for="teacher in teachers" :key="teacher">
							<img :src="teacher.avatar" class="teacher-avator" v-if="showself && teacher.avatar" @error="showself = false">
							<img src="../../common/image/ic_default_head.png" class="teacher-avator" v-else>
							<p class="name">{{teacher.teacherName}}</p>
						</li>
					</ul>
				</div>
				<!--机构环境-->
				<div class="environment clearfix">
					<div class="left" @click="morePic">
						<p class="text"><span class="count">{{campusInfo.envCount}}</span>张</p>
						<p class="org-name">{{campusInfo.orgName}}</p>
						<p>机构环境</p>
					</div>
					<ul class="pics clearfix">
						<li class="pic-item" v-for="(item, i) in envInfo" :key="item">
							<img :src="item" class="pic-width this-img-need-grow" :data-index1="0" :data-index2="i">
						</li>
					</ul>
				</div>
				<!--机构许可证-->
				<div class="licence-wrapper clearfix" v-show="licenceInfo.length > 0">
					<h3 class="header" @click="showLicence">机构许可证</h3>
					<ul class="licence-list">
						<li class="licence-item" v-for="(url, index) in licenceInfo" :key="url">
							<img :src="url" class="licence-img this-img-need-grow" :data-index1="1" :data-index2="index">
						</li>
					</ul>
				</div>
			</div>
		</div>
	</scroll>
</template>

<script type="text/javascript">
import Scroll from "base/scroll/scroll";
import Slider from "base/slider/slider";
import { mapGetters, mapMutations } from "vuex";
import { screenHeightMixin } from "common/js/mixin";

export default {
  mixins: [screenHeightMixin],
  components: {
    Scroll,
    Slider
  },

  data() {
    return {
      campusInfo: {},
      banners: [],
      teachers: [],
      envInfo: [],
      licenceInfo: [],
      showself: true
    };
  },

  computed: {
    ...mapGetters(["user", "currentChild"])
  },

  watch: {
    currentChild(current, prev) {
      this.getCampusInfo();
    }
  },

  methods: {
    getCampusInfo() {
      const userData = new FormData();
      userData.append("userId", this.user.parentId);
      userData.append("token", this.user.parent_token);

      this.$http
        .post(this.GLOBAL.URL + "/V1/Campus/getCampusInfo", userData)
        .then(response => {
          response = response.body;
          if (response.errcode === this.GLOBAL.ERR_CODE) {
            this.campusInfo = response.data;
            this.banners = this.campusInfo.bannerList;
            this.teachers = this.campusInfo.teacherList;
            this.envInfo = this.campusInfo.envInfo;
            this.licenceInfo = this.campusInfo.licenceInfo;

            
						this.eventHub.$emit('imgsrcgot');
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

    getFiveTeacher() {
      for (let i = 0; i < 5; i++) {
        this.teachers.push(this.campus.teachers[i]);
      }
    },

    allTeachers() {
      this.$router.push({
        name: "teacher_intro"
      });
    },

    showLicence() {
      this.$router.push({
        name: "licence"
      });
    },

    morePic() {
      this.$router.push({
        name: "env_pic"
      });
    },

    ...mapMutations({
      setResultTip: "SET_RESULT_TIP"
    })
  },

  created() {
    // this.getCampusInfo();
  },

  activated() {
    this.getCampusInfo();
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
.campus {
  width: 100%;
  overflow: hidden;
  background: #fff;

  .scroll-div {
    padding-bottom: 2.5rem;
  }
}

.campus-swiper {
  height: 9.5rem;

  .banner {
    display: block;
    width: 100vw;
    height: 9.5rem;
  }
}

.slider /deep/ .dots {
  position: absolute;
  right: 0;
  left: 0;
  bottom: 0.6rem;
  text-align: center;
  font-size: 0;

  .dot {
    display: inline-block;
    margin: 0 0.2rem;
    width: 0.6rem;
    height: 0.6rem;
    background: url("./ic_square1.png");
    background-size: 0.6rem 0.6rem;
  }

  .active {
    width: 0.6rem;
    height: 0.6rem;
    background: url("./ic_square.png");
    background-size: 0.6rem 0.6rem;
  }
}

.school-wrapper {
  overflow: hidden;
  background: #fff;
}

.school-name {
  width: 100%;
  height: 3.2rem;
  padding: 0 0.5rem;
  line-height: 3.2rem;
  box-sizing: border-box;
  overflow: hidden;
  text-align: center;
  font-size: 0.9rem;
  color: #333;
  border-bottom: 1px solid #eee;
}

.school-desc {
  display: flex;
  padding: 0.6rem 0 0.8rem;
  font-size: 0;
  color: #333;
  border-bottom: 1px solid #eee;

  .desc-l,
  .desc-r {
    display: inline-block;
    font-size: 0.75rem;
  }

  .desc-l {
    width: 5.5rem;
    line-height: 1.4rem;
    text-align: center;
  }

  .desc-r {
    flex: 1;
    line-height: 1.4rem;
    padding-right: 0.65rem;
    overflow: hidden;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    word-break: break-all;
    display: -webkit-box;
    text-overflow: ellipsis;
  }
}

.teachers {
  .text {
    position: relative;
    height: 2.5rem;
    padding-left: 1.3rem;
    line-height: 2.5rem;
    font-size: 0.75rem;
    color: #333;
  }

  .more {
    position: absolute;
    right: 0;
    top: 0;
    padding: 0 0.9rem;
  }
}

.teacher-list {
  height: 5rem;
  padding: 0 0.6rem;
  margin-bottom: 0.6rem;
  overflow: hidden;

  .teacher-item {
    float: left;
    width: 3.5rem;
    padding: 0.6rem 0;
    text-align: center;

    &:nth-child(5) {
      margin-right: 0;
    }
  }

  .teacher-avator {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
  }

  .name {
    margin-top: 0.65rem;
    font-size: 0.65rem;
    color: #333;
  }
}

.environment {
  display: flex;
  width: 100%;
  height: 7rem;

  .left {
    box-sizing: border-box;
    float: left;
    width: 6.5rem;
    height: 7rem;
    line-height: 1.5rem;
    padding: 1.6rem 0 0 1.3rem;
    font-size: 0.75rem;
    color: #fff;
    background: #6198d3;
  }

  .text {
    font-size: 0.6rem;
  }

  .org-name {
    width: 4.5rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .count {
    margin-right: 0.3rem;
    font-size: 1.5rem;
    vertical-align: text-bottom;
  }

  .pics {
    flex: 1;
    float: left;
    height: 7rem;
    overflow: hidden;
    background: #f1f1f1;
  }

  .pic-item {
    float: left;
    width: 3.4rem;
    height: 3.45rem;
    margin: 0 0.1rem 0.1rem 0;

    &:nth-child(4n-3) {
      width: 5.15rem;
      height: 3.45rem;
    }
  }

  .pic-width {
    width: 100%;
    height: 100%;
  }
}

.licence-wrapper {
  .header {
    width: 100%;
    height: 2.5rem;
    padding-left: 1.3rem;
    line-height: 2.5rem;
    font-size: 0.75rem #333;
    font-weight: 400;
    color: #333;
  }

  .licence-list {
    padding: 0.2rem;
  }

  .licence-item {
    float: left;
    width: 5.8rem;
    height: 4.7rem;
    margin: 0 0.2rem 0.2rem 0;

    &:nth-child(3n) {
      margin-right: 0;
    }
  }

  .licence-img {
    width: 5.8rem;
    height: 4.7rem;
  }
}
</style>
