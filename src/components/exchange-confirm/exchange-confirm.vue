<template>
	<transition name="confirm-fade">
		<div class="confirm" v-show="showFlag" @click.stop>
			<div class="confirm-wrapper">
				<div class="confirm-content">
					<div class="detail">
						<p class="user">{{user.name}}先生</p>
						<p class="text">您确定要为 <span class="sign-blue">{{currentChild.name}}</span> 兑换该礼品吗？</p>
						<div class="goods">
							<img :src="gift.giftPic" class="img">
							<p class="name">{{gift.giftName}}</p>
							<div class="need-integral">积分 <span class="sign-blue">{{gift.giftIntegral}}分</span></div>
							<div class="surplus-integral">兑换后剩余积分 <span class="sign-red">{{surplusIntegral}}分</span></div>
						</div>
					</div>
					<div class="operate">
						<div class="operate-btn left" @click="cancel">取消</div>
						<div class="operate-btn" @click="confirm">确定</div>
					</div>
				</div>
			</div>
		</div>
	</transition>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from "vuex";
export default {
  props: {
    gift: {
      type: Object,
      default: {}
    }
  },

  data() {
    return {
      showFlag: false
    };
  },

  computed: {
    surplusIntegral() {
      return this.integral.totalIntegral - this.gift.giftIntegral;
    },

    ...mapGetters(["user", "currentChild", "integral"])
  },

  methods: {
    show() {
      this.showFlag = true;
    },

    hide() {
      this.showFlag = false;
    },

    cancel() {
      this.hide();
      this.$emit("cancel");
    },

    confirm() {
      this.hide();
      this.$emit("confirm", this.gift);
    }
  }
};
</script>

<style scoped lang="less">
.confirm {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 998;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);

  &.confirm-fade-enter-active {
    animation: confirm-fadein 0.3s;

    .confirm-content {
      animation: confirm-zoom 0.3s;
    }
  }

  .confirm-wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 999;

    .confirm-content {
      width: 13.5rem;
      border-radius: 0.65rem;
      background: #fff;
    }

    .detail {
      padding: 1rem 0.7rem;
      font-size: 0.7rem;
    }

    .user {
      color: #333;
    }

    .text {
      margin: 0.4rem 0 1rem;
      line-height: 1rem;
      font-size: 0.7rem;
    }

    .sign-blue {
      font-size: 0.75rem;
      color: #1c48ee;
    }

    .sign-red {
      font-size: 0.75rem;
      color: #ea1c1c;
    }

    .operate {
      display: flex;
      align-items: center;
      text-align: center;
      font-size: 0.8rem;
      color: #0599d1;

      .operate-btn {
        flex: 1;
        line-height: 1.1rem;
        padding: 0.5rem 0;
        border-top: 1px solid rgba(0, 0, 0, 0.3);

        &.left {
          border-right: 1px solid rgba(0, 0, 0, 0.3);
        }
      }
    }
  }

  .goods {
    .img {
      width: 3.65rem;
      height: 2.65rem;
      margin-right: 0.6rem;
      vertical-align: middle;
    }

    .name {
      display: inline-block;
      width: 7.35rem;
      font-size: 0.6rem;
      line-height: 1.4;
      color: #666;
    }

    .need-integral {
      margin-top: 0.5rem;
      font-size: 0.7rem;
      line-height: 1rem;
      color: #666;
    }

    .surplus-integral {
      font-size: 0.7rem;
      line-height: 1rem;
      color: #666;
    }
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