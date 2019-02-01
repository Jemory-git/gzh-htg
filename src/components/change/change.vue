<template>
	<transition name='slide' mode='out-in'>
		<scroll class="change slide-to-left" ref="scroll" :data="children" id="maxHeight">
			<div>
				<ul class="change-wrapper" v-if="hasResult">
					<li class="change-item" v-for="(item,index) in children" :key="index"  @click="selectChild(item, index)">
						<input type="checkbox" :value="item.userId" v-model="selected" style="display: none">
						<div class="title">
							<h3 class="title-text">
								<span>{{item.orgName}}</span>
								<span v-show="item.school">- {{item.school}}</span>
							</h3>
							<div class="selected" v-show="currentChildIndex == index">已选</div>
						</div>
						<div class="user">
							<img :src="item.avatar" class="avatar" v-if="showself && item.avatar" @error="showself = false">
							<img src="../../common/image/ic_default_head.png" class="avatar" v-else>
							<span class="name">{{item.name}}</span>
							<img :src="icon_1" class="icon">
						</div>
					</li>
				</ul>
				<no-result v-else></no-result>
			</div>
		</scroll>
	</transition>
</template>
<script type="text/javascript">
import Scroll from "base/scroll/scroll";
import NoResult from "components/no-result/no-result";
import { mapGetters, mapMutations } from "vuex";
import { maxHeightMixin } from "common/js/mixin";

import icon_1 from "./ic_switch.png";
import icon_2 from "./ic_switch_change.png";

export default {
  mixins: [maxHeightMixin],
  components: {
    Scroll,
    NoResult
  },

  data() {
    return {
      icon_1: icon_1,
      icon_2: icon_2,
      children: [],
      selected: [],
      currentPage: 1,
      pageSize: 20,
      hasResult: true,
      showself: true
    };
  },

  computed: {
    ...mapGetters(["user", "currentChildIndex"])
  },

  watch: {
    // 检测那个路由过来，分别给出不同的动画
    $route(to, from) {
      if (from.path == "/login") {
        this.getChildren();
      }
    }
  },

  methods: {
    selectChild(item, index) {
      const childData = new FormData();
      childData.append("userId", this.user.parentId);
      childData.append("token", this.user.parent_token);
      childData.append("childId", item.userId);
      childData.append("orgId", item.orgId);
      childData.append("shopId", item.shopId);

      this.$http
        .post(this.GLOBAL.URL + "/V1/User/getChildInfo", childData)
        .then(response => {
          response = response.body;
          if (response.errcode === this.GLOBAL.ERR_CODE) {
            this.setCurrentChildIndex(index);
            this.setCurrentChild(response.data);
            this.$router.push("/index");
          } else if (response.errcode === 400003) {
            this.setResultTip({ show: true, text: "登录已过期", result: 1 });
            setTimeout(() => {
              this.relogin();
            }, 2000);
          }
        });
    },

    getChildren() {
      const userData = new FormData();
      userData.append("userId", this.user.parentId);
      userData.append("token", this.user.parent_token);
      userData.append("current_page", this.currentPage);
      userData.append("page_count", this.pageSize);

      this.$http
        .post(this.GLOBAL.URL + "/V1/User/getChildList", userData)
        .then(response => {
          response = response.body;
          if (response.errcode == this.GLOBAL.ERR_CODE) {
            this.children = response.data.childList;
            if (this.children.length === 0) {
              this.hasResult = false;
            }
            if (this.user.userId) {
              const index = this.children.findIndex(child => {
                return child.userId == this.user.userId;
              });
              this.setCurrentChildIndex(index);
            }
          } else if (response.errcode === 400003) {
            this.setResultTip({ show: true, text: "登录已过期", result: 1 });
            setTimeout(() => {
              this.relogin();
            }, 2000);
          }
        });
    },

    ...mapMutations({
      setCurrentChild: "SET_CURRENT_CHILD",
      setCurrentChildIndex: "SET_CURRENT_CHILD_INDEX",
      setResultTip: "SET_RESULT_TIP"
    })
  },

  created() {
    this.getChildren();
  }
};
</script>
<style scoped lang="less">
.change {
  z-index: 99;
  position: relative;
  height: 100%;
  overflow: hidden;
  background: #e6e6e6;
}

.slide-to-left {
  &.slide-enter-active,
  &.slide-leave-active {
    transition: all 0.3s;
    transform: translateX(0);
  }

  &.slide-enter,
  &.slide-leave-to {
    transform: translateX(100%);
  }
}

.change-wrapper {
  padding: 0 0.65rem 0.9rem;

  .change-item {
    margin-bottom: 0.9rem;
    background: #fff;

    &:last-child {
      margin-bottom: 0;
    }

    .title {
      position: relative;
    }

    .selected {
      position: absolute;
      right: 0.65rem;
      top: 50%;
      transform: translateY(-50%);
      padding: 0.2rem 0.45rem;
      font-size: 0.6rem;
      color: #fff;
      background: #f66f70;
      border-radius: 0.25rem;
    }

    .title-text {
      height: 2.5rem;
      line-height: 2.5rem;
      padding-right: 3.2rem;
      font-size: 0.9rem;
      color: #333;
      text-align: center;
      border-bottom: 1px solid #f0f0f0;
      overflow: hidden;

      span {
        font-weight: 700;
      }
    }

    .user {
      height: 3.75rem;
      padding: 0.4rem 0 0.4rem 0.65rem;
      line-height: 2.95rem;
      box-sizing: border-box;
      font-size: 0;

      .avatar {
        width: 3rem;
        height: 3rem;
        margin-right: 0.65rem;
        vertical-align: top;
        border-radius: 50%;
      }

      .name {
        font-size: 0.9rem;
        color: #333;
      }

      .icon {
        float: right;
        width: 0.85rem;
        height: 0.85rem;
        padding: 1.05rem;
      }
    }
  }
}
</style>
