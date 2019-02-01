<template>
    <div class="wrapper" @click="closeXialakuang">
        <div class="div1">
            <img class="logo" src="../../common/image/htg-logo.png" alt="">
        </div>
        <div class="div2"></div>
        <div class="div3">
            <div class="area-input">
                <div class="sheng-div" @click="closeList($event, 'sheng-ul')">
                    <span class="sheng-outer" @click.stop="openList($event, 'sheng-ul')">
                        <span class="sheng" ref="sheng">省</span><i class="arrow"></i>
                    </span>
                    <ul class="sheng-ul" @click="select($event, 'sheng')">
                        <li class="li" v-for="item in shengArr" :key="item" :data-number="item.snumber">
                            {{item.sname}}
                        </li>
                    </ul>
                </div>
                <div class="shi-div" @click="closeList($event, 'shi-ul')">
                    <span class="shi-outer" @click.stop="openList($event, 'shi-ul')">
                        <span class="shi" ref="shi">市</span><i class="arrow"></i>
                    </span>
                    <ul class="shi-ul" @click="select($event, 'shi')">
                        <li class="li" v-for="item in shiArr" :key="item" :data-number="item.snumber">
                             {{item.sname}}
                        </li>
                    </ul>
                </div>
                <div class="qu-div" @click="closeList($event, 'qu-ul')">
                    <span class="qu-outer" @click.stop="openList($event, 'qu-ul')">
                        <span class="qu" ref="qu">区</span><i class="arrow"></i>
                    </span>
                    <ul class="qu-ul" @click="select($event, 'qu')">
                        <li class="li" v-for="item in quArr" :key="item" :data-number="item.snumber">
                             {{item.sname}}
                        </li>
                    </ul>
                </div>
                <div class="confirm-div" @click="search"></div>
            </div>
            <div class="result-div">
                <ul class="ul">
                    <li class="li">
                        <p class="name">机构名称：</p>
                        <p class="adress">地址：</p>
                        <p class="ren">联系人：</p>
                        <p class="phone">联系电话：</p>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import cityData from "../../../static/js/city.js";

export default {
  data() {
    return {
      shengArr: ["河北", "福建", "广东", "福建", "广东", "福建", "广东"],
      shiArr: ["厦门", "泉州", "晋江", "泉州", "晋江", "泉州", "晋江"],
      quArr: ["思明", "湖里", "海沧", "湖里", "海沧", "湖里", "海沧"],
      shengNumber: "",
      shiNumber: "",
      shengName: "",
      shiName: ""
    };
  },
  methods: {
    openList(e, m) {
      $("." + m).height(200);
    },
    closeList(e, m) {
      $("." + m).height(0);
    },
    assignShengArr() {
      // 处理省对象为数组
      let shengObj = cityData[86];
      let arr = [];
      let sNumber = Object.keys(shengObj);
      sNumber.forEach((c, i) => {
        arr[i] = {
          snumber: c,
          sname: shengObj[c]
        };
      });
      this.shengArr = arr;
    },
    assignShiArr() {
      // 处理市对象为数组
      let shengObj = cityData[this.shengNumber];
      let arr = [];
      let sNumber = Object.keys(shengObj);
      sNumber.forEach((c, i) => {
        arr[i] = {
          snumber: c,
          sname: shengObj[c]
        };
      });
      this.shiArr = arr;
    },
    assignQuArr() {
      // 处理区对象为数组
      let shiObj = cityData[this.shiNumber];
      let arr = [];
      let sNumber = Object.keys(shiObj);
      sNumber.forEach((c, i) => {
        arr[i] = {
          snumber: c,
          sname: shiObj[c]
        };
      });
      this.quArr = arr;
      console.log(shiObj);
      
    },
    confirmSheng(e) {
      // 选择省
      let el = e.target;
      this.shengNumber = el.dataset.number;
      this.shengName = el.innerText;

      // 填充市选框
      this.assignShiArr();
    },
    confirmShi(e) {
      // 确认市
      let el = e.target;
      this.shiNumber = el.dataset.number;
      this.shiName = el.innerText;

      // 填充市选框
      this.assignQuArr();
    },
    confirmQu(e) {
      // 确认区
      let el = e.target;
      this.quNumber = el.dataset.number;
      this.quName = el.innerText;
    },
    closeXialakuang() {
      $(".sheng-ul").height(0);
      $(".shi-ul").height(0);
      $(".qu-ul").height(0);
    },
    select(e, m) {
      let result = e.target.innerText;
      $("." + m).text(result);
      switch (m) {
        case "sheng":
          this.confirmSheng(e);
          $(".shi").text('市');
          $(".qu").text('区');
          break;
        case "shi":
          this.confirmShi(e);
          $(".qu").text('区');
          break;
        case "qu":
          this.confirmQu(e);
          break;

        default:
          console.log(m);
          break;
      }
    },
    search() {
      if (this.$refs.sheng.innerText === "省") {
        this.promptBox.autoHide("请选择省份");
        return;
      }
      if (this.$refs.shi.innerText === "市") {
        this.promptBox.autoHide("请选择城市");
        return;
      }
      if (this.$refs.qu.innerText === "区") {
        this.promptBox.autoHide("请选择区域");
        return;
      }
    }
  },
  mounted() {
    this.assignShengArr();
  }
};
</script>

<style lang="less" scoped>
.wrapper {
  width: 100%;
  background-color: #fff;

  .div1 {
    width: 100%;
    padding: 1rem;

    .logo {
      height: 3rem;
    }
  }

  .div2 {
    height: 0.3rem;
    margin: 0.5rem 0;
    background: linear-gradient(to right, #f1c850, #f19a9a);
  }

  .div3 {
    min-height: calc(100vh - 6.3rem);

    .area-input {
      display: flex;
      align-items: center;
      height: 3rem;
      border-bottom: solid 1px #e4e4e4;
      padding-right: 0.5rem;

      .sheng-div,
      .shi-div,
      .qu-div {
        flex-grow: 1;
        width: 30%;
        height: 2rem;
      }

      .confirm-div {
        flex-grow: 0;
        width: 2rem;
        height: 2rem;
        background-image: url(../../common/image/sousuo.png);
        background-repeat: no-repeat;
        background-position: center;
        background-size: 80% 80%;
        background-color: #e64340;
      }

      .sheng-outer,
      .shi-outer,
      .qu-outer {
        display: block;
        position: relative;
        width: 100%;
        height: 100%;
        text-align: center;
        line-height: 2rem;
        color: #333;

        .sheng,
        .shi,
        .qu {
          display: block;
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .arrow {
          position: absolute;
          display: block;
          height: 1rem;
          width: 1rem;
          bottom: 0;
          left: 50%;
          transform: translate3d(-50%, 50%, 0);
          background-image: url(../../common/image/arrow-xia.png);
          background-repeat: no-repeat;
          background-position: center;
          background-size: 60% 60%;
        }
      }

      .sheng-ul,
      .shi-ul,
      .qu-ul {
        height: 0;
        overflow: hidden;
        transition: all 0.2s ease-out;
        background-color: #f8fefe;
        overflow-y: scroll;

        .li {
          padding: 0.5rem 0;
          text-align: center;
          border-bottom: solid 1px #f6f3d9;
        }
      }
    }
  }

  .result-div {
    padding: 1rem;

    .ul {
      color: #888;

      .li {
        border-bottom: solid 1px rgb(217, 218, 209);

        .name {
          color: #e64340;
        }

        .name,
        .adress,
        .ren,
        .phone {
          font-size: 0.8rem;
          padding: 0.25rem 0;
        }
        .adress,
        .ren,
        .phone {
          padding-left: 0.5rem;
        }
      }
    }
  }
}
</style>
