<template>
    <div class="wrapper">
        <img src="./logo.png" class="logo" alt="">

        <div v-if="getDataBoo" class="inner-wrapper" @click="showul = false">
            <div class="tishi-div">
                <img src="./tan.png" class="img" alt="">
                <span class="tishi">如需修改带*选项，请与老师联系</span>   
            </div>
            <div class="item">
                <span class="xing">*</span>
                <span class="item-key">姓名</span>
                <span class="item-value">{{studentObj.student_name}}</span>
            </div>
            <div class="item">
                <span class="xing">*</span>
                <span class="item-key">性别</span>
                <span class="item-value">{{xingbieArr[studentObj.sex]}}</span>
            </div>
            <div class="item">
                <span class="xing">*</span>
                <span class="item-key">年级</span>
                <span class="item-value">{{studentObj.grade}}</span>
            </div>
            <div class="item">
                <span class="xing baixing">*</span>
                <span class="item-key">年龄</span>
                <input v-if="studentObj.is_edit === 0" v-focus class="item-value" type="text" v-model="nianling" placeholder="请填写周岁" />
                <span v-else class="item-value">{{studentObj.age}}</span>
            </div>
            <div class="item">
                <span class="xing baixing">*</span>
                <span class="item-key">学校</span>
                <input v-if="studentObj.is_edit === 0" class="item-value" type="text" maxlength="10" v-model="xuexiao"  />
                <span v-else class="item-value">{{studentObj.school}}</span>
            </div>
            <div class="item">
                <span class="xing baixing">*</span>
                <span class="item-key width4rem">身份证号</span>
                <input v-if="studentObj.is_edit === 0" class="item-value maxwidth9rem"  type="text" maxlength="18" v-model="shenfenzheng"  />
                <span v-else class="item-value">{{studentObj.ID_number}}</span>
            </div>
            <div class="item jkzk-item" @click.stop="showul = !showul">
                <span class="xing baixing">*</span>
                <span class="item-key width4rem">健康状况</span>
                <div v-if="studentObj.is_edit === 0" class="jkzk-value maxwidth9rem" >
                  <div class="qingxuanze">
                    <p class="jk-p">{{selectValue}}</p>
                    <ul class="jk-ul" :class="{'showul': showul}" @click="selectJkzk($event)">
                      <li class="jk-li" data-value="好">
                        好
                      </li>
                      <li class="jk-li" data-value="一般">
                        一般
                      </li>
                      <li class="jk-li" data-value="不好">
                        不好
                      </li>
                    </ul>
                  </div>
                </div>
                <span v-else class="item-value">{{ studentObj.healthy_state }}</span>
            </div>
            <div class="item">
                <span class="xing baixing">*</span>
                <span class="item-key">紧急联系人</span>
                <input v-if="studentObj.is_edit === 0" class="item-value maxwidth8rem"  type="text" maxlength="10" v-model="lianxiren"  />
                <span v-else class="item-value">{{studentObj.urgent_name}}</span>
            </div>
            <div class="item">
                <span class="xing baixing">*</span>
                <span class="item-key">紧急联系人号码</span>
                <input v-if="studentObj.is_edit === 0" class="item-value maxwidth6rem" type="text" maxlength="11" v-model="lianxirenhaoma"  />
                <span v-else class="item-value">{{studentObj.urgent_tel}}</span>
            </div>
            <div class="item jtdz">
                <span class="xing baixing">*</span>
                <span class="item-key width4rem">家庭地址</span>
                <input v-if="studentObj.is_edit === 0" class="item-value jtdz-value maxwidth9rem" type="text" maxlength="20" v-model="jiatingdizhi"  />
                <span v-else class="item-value">{{studentObj.home_address}}</span>
            </div>
            <div class="submit" @click="submit" v-if="studentObj.is_edit === 0">
                提交
            </div>
            <img class="fimg" src="./f.png" alt="">
        </div>
        <div v-else class="jiazaishibai" @click="location.reload()">
            数据加载失败！点击刷新页面
        </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      getDataBoo: true,
      showul: false,
      location: window.location,
      studentId: "",
      studentObj: {},
      nianling: "",
      xingbieArr: ["女", "男", "女"],
      xuexiao: "",
      shenfenzheng: "",
      jiankangzhuangkuang: "",
      selectValue: "点击选择",
      lianxiren: "",
      lianxirenhaoma: "",
      jiatingdizhi: ""
    };
  },
  methods: {
    getInfo() {
      let postData = new FormData();
      postData.append("student_infomation_id", this.studentId);
      this.promptBox.loading();
      this.$http
        .post(this.GLOBAL.URL + "/v1/Insurance/get_student_info", postData)
        .then(res => {
          this.promptBox.loaded();
          if (res.body.errcode != 0) {
            // 请求失败
            this.promptBox.prompt(res.body.errmsg);
            this.getDataBoo = false;
            return;
          }

          // 请求成功
          this.studentObj = res.body.data;
          // 年龄
          this.nianling =
            this.studentObj.age === "null" ? "" : this.studentObj.age;
          // 学校
          this.xuexiao =
            this.studentObj.school === "null" ? "" : this.studentObj.school;
          // 身份证
          this.shenfenzheng =
            this.studentObj.ID_number === "null"
              ? ""
              : this.studentObj.ID_number;
          // 健康状况
          this.jiankangzhuangkuang =
            this.studentObj.healthy_state === "null"
              ? ""
              : this.studentObj.healthy_state;
          this.selectValue = this.jiankangzhuangkuang;
          // 联系人
          this.lianxiren =
            this.studentObj.urgent_name === "null"
              ? ""
              : this.studentObj.urgent_name;
          // 联系人号码
          this.lianxirenhaoma =
            this.studentObj.urgent_tel === "null"
              ? ""
              : this.studentObj.urgent_tel;
          // 家庭地址
          this.jiatingdizhi =
            this.studentObj.home_address === "null"
              ? ""
              : this.studentObj.home_address;
        });
    },
    selectJkzk(e) {
      if (e.target.classList.contains("jk-li")) {
        // 保存数据
        this.jiankangzhuangkuang = e.target.dataset.value;
        // 更新视图
        this.selectValue = e.target.innerText;
      }
    },
    submit() {
      let phoneReg = /^((13[0-9])|(14[5,7,9])|(15[^4])|(18[0-9])|(17[0,1,3,5,6,7,8]))\d{8}$/;
      let lianxirenNameReg = /[\u4e00-\u9fa5a-zA-Z]/;
      let nianlingReg = /^\d{1,2}$/;
      if (!nianlingReg.test(this.nianling)) {
        this.promptBox.autoHide("年龄需为一到两位数字", 2000);
        return;
      }
      if (!this.xuexiao) {
        this.promptBox.autoHide("请填写学校");
        return;
      }
      
      let result = this.checkShenfenzheng(this.shenfenzheng);
      if (!result.pass) {
        this.promptBox.autoHide(result.tip);
        return;
      }
      if (!this.jiankangzhuangkuang) {
        this.promptBox.autoHide("请选择健康状况");
        return;
      }
      if (!this.lianxiren) {
        this.promptBox.autoHide("请填写紧急联系人");
        return;
      }
      if (!lianxirenNameReg.test(this.lianxiren)) {
        this.promptBox.autoHide("紧急联系人填写有误");
        return;
      }
      if (!phoneReg.test(this.lianxirenhaoma)) {
        this.promptBox.autoHide("请输入正确手机号");
        return;
      }
      if (!this.jiatingdizhi) {
        this.promptBox.autoHide("请填写家庭地址");
        return;
      }
      this.promptBox.confirm("确认信息无误并提交", () => {
        this.continueSubmit();
      });
    },
    continueSubmit() {
      let postData = new FormData();
      postData.append("student_infomation_id", this.studentId);
      postData.append("age", this.nianling);
      postData.append("school", this.xuexiao);
      postData.append("ID_number", this.shenfenzheng);
      postData.append("healthy_state", this.jiankangzhuangkuang);
      postData.append("urgent_name", this.lianxiren);
      postData.append("urgent_tel", this.lianxirenhaoma);
      postData.append("home_address", this.jiatingdizhi);
      this.promptBox.loading();
      this.$http
        .post(this.GLOBAL.URL + "/v1/Insurance/student_info_submit", postData)
        .then(res => {
          this.promptBox.loaded();
          if (res.body.errcode != 0) {
            res.body.errmsg;
            // 请求失败
            this.promptBox.prompt(res.body.errmsg);
            return;
          }

          // 请求成功, 更新视图
          this.promptBox.autoHide("保存成功");
          // 用新填的数据替换页面的数据，并设置编辑状态为1
          let dataObj = Object.assign(this.studentObj, {
            age: this.nianling,
            school: this.xuexiao,
            ID_number: this.shenfenzheng,
            healthy_state: this.jiankangzhuangkuang,
            urgent_name: this.lianxiren,
            urgent_tel: this.lianxirenhaoma,
            home_address: this.jiatingdizhi,
            is_edit: 1
          });

          this.studentObj = dataObj;
        });
    },
    getQueryString() {
      let qsArr = window.location.search.replace("?", "").split("=");
      this.studentId = qsArr[1];
      // this.studentId = 24351;
    },
    onKeyboardOut() {
      // 安卓机微信中键盘弹出时，滚动页面至当前输入框的位置.苹果机自带此效果。安卓机浏览器自带此效果
      let isAndroid =
        navigator.userAgent.indexOf("Android") > -1 ||
        navigator.userAgent.indexOf("Adr") > -1; //android终端
      if (!isAndroid) {
        return;
      }
      window.onresize = function() {
        if (document.activeElement.tagName == "INPUT") {
          let clientHeight =
            document.documentElement.clientHeight || document.body.clientHeight;
          let elOffsetTop = document.activeElement.offsetTop;
          let elOffsetHeight = document.activeElement.offsetHeight;
          // 目标滚动位置
          let goalPosition = elOffsetTop - clientHeight + elOffsetHeight;
          // 当前滚动位置
          let currentPosition = document.getElementById("app").scrollTop;
          let scrollInterval = setInterval(() => {
            currentPosition += 30;
            if (document.getElementById("app").scrollTop > goalPosition) {
              currentPosition = goalPosition;
              clearInterval(scrollInterval);
            }
            document.getElementById("app").scrollTop = currentPosition;
          }, 20);
        }
      };
    },
    checkShenfenzheng(code) {
      var city = {
        11: "北京",
        12: "天津",
        13: "河北",
        14: "山西",
        15: "内蒙古",
        21: "辽宁",
        22: "吉林",
        23: "黑龙江 ",
        31: "上海",
        32: "江苏",
        33: "浙江",
        34: "安徽",
        35: "福建",
        36: "江西",
        37: "山东",
        41: "河南",
        42: "湖北 ",
        43: "湖南",
        44: "广东",
        45: "广西",
        46: "海南",
        50: "重庆",
        51: "四川",
        52: "贵州",
        53: "云南",
        54: "西藏 ",
        61: "陕西",
        62: "甘肃",
        63: "青海",
        64: "宁夏",
        65: "新疆",
        71: "台湾",
        81: "香港",
        82: "澳门",
        91: "国外 "
      };
      var tip = "";
      var pass = true;
      // 如果香港身份证校验成功，则return身份证校验通过
      if (code && /^([a-z]{1,2}\d{6}\([a-z\d]\))$/i.test(code)) {
        return {
          tip: "香港身份证校验成功",
          pass: true
        };
      }

      // 大陆身份证校验
      if (
        !code ||
        !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(
          code
        )
      ) {
        tip = "身份证号格式错误";
        pass = false;
      } else if (!city[code.substr(0, 2)]) {
        tip = "身份证地址编码错误";
        pass = false;
      } else {
        //18位身份证需要验证最后一位校验位
        if (code.length == 18) {
          code = code.split("");
          //∑(ai×Wi)(mod 11)
          //加权因子
          var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
          //校验位
          var parity = [1, 0, "X", 9, 8, 7, 6, 5, 4, 3, 2];
          var sum = 0;
          var ai = 0;
          var wi = 0;
          for (var i = 0; i < 17; i++) {
            ai = code[i];
            wi = factor[i];
            sum += ai * wi;
          }
          var last = parity[sum % 11];
          if (parity[sum % 11] != code[17]) {
            tip = "身份证校验位错误";
            pass = false;
          }
        }
      }
      // if (!pass) this.promptBox.autoHide(tip);
      return { pass, tip };
    }
  },
  mounted() {
    this.getQueryString();
    this.getInfo();
    this.onKeyboardOut();
  },
  watch: {
    nianling(v) {
      if (parseInt(v)) {
        this.nianling = parseInt(v) > 99 ? 99 : parseInt(v);
      } else {
        this.nianling = "";
      }
    }
  }
};
</script>

<style lang="less" scoped>
.wrapper {
  box-sizing: border-box;
  min-height: 100vh;
  width: 100vw;
  padding: 1rem 1.5rem 2rem;
  background-size: 100% 140%;
  background-repeat: no-repeat;
  background-image: url("./bg.png");
  letter-spacing: 1px;

  .logo {
    display: block;
    height: 6rem;
    margin: 0 auto;
  }

  .inner-wrapper {
    width: 100%;
    height: 100%;

    .tishi-div {
      display: flex;
      align-items: center;
      height: 2rem;
      border-bottom: 1px solid #f6f6f6;

      .img {
        height: 0.8rem;
      }

      .tishi {
        padding-left: 0.4rem;
        font-size: 0.6rem;
        color: #f63333;
      }
    }
    .item + .item {
      border-top: 1px solid #f6f6f6;
    }
    .item {
      display: flex;
      align-items: center;
      width: 90%;
      height: 2.5rem;
      margin: 0 auto;

      .xing {
        padding: 0.3rem 0.5rem 0 0;
        color: #f63333;
      }
      .baixing {
        color: #fff;
      }

      .item-key {
        padding: 0.5rem 0;
        white-space: nowrap;
        font-size: 0.8rem;
        color: #424242;
      }

      .item-value {
        flex-grow: 1;
        padding: 0.5rem;
        margin-left: 0.5rem;
        font-size: 0.7rem;
        color: #6e6e6e;
      }

      .jtdz-value {
        padding-top: 0.6rem;
      }

      .width4rem {
        width: 4rem;
      }

      .maxwidth9rem {
        max-width: 9rem;
      }
      .maxwidth8rem {
        max-width: 8rem;
      }
      .maxwidth6rem {
        max-width: 6rem;
      }

      .nowrap {
        white-space: nowrap;
      }
    }

    .jkzk-item {
      z-index: 20;
      .jkzk-value {
        box-sizing: border-box;
        height: 100%;
        width: 5rem;
        font-size: 0.7rem;
        color: #6e6e6e;

        .qingxuanze {
          position: relative;
          height: 100%;
          text-align: center;

          .jk-p {
            height: 100%;
            line-height: 2.5rem;
            font-weight: 100;
            color: #2f2d2d;
          }

          .jk-ul {
            position: absolute;
            top: 90%;
            left: 0;
            width: 100%;
            height: 0rem;
            background-color: #f7f7f7;
            transition: all 0.3s ease-out;
            z-index: 10;
            overflow: hidden;

            .jk-li {
              box-sizing: border-box;
              width: 80%;
              margin: 0 auto;
              padding: 0.5rem;
              border-bottom: #cecece 1px solid;
            }
          }
          .showul {
            height: 5.3rem;
          }
        }
      }
    }
    .jtdz {
      align-items: flex-start;
      height: 7rem;
      line-height: 1.1rem;

      .item-value {
        white-space: normal;
      }
    }

    .submit {
      width: 10rem;
      height: 3rem;
      margin: 0 auto 2rem;
      line-height: 3rem;
      text-align: center;
      background-color: #ffcc34;
    }

    .fimg {
      display: block;
      width: 60%;
      margin: 0rem auto;
    }
  }

  .jiazaishibai {
    text-align: center;
    padding: 5rem 0;
    font-size: 0.8rem;
    color: #6e6e6e;
  }
}
</style>
