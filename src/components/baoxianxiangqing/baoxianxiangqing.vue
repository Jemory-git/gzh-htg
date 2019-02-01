<template>
	<transition name='slide' mode='out-in'>
        <Scroll class="scroll">
            <div class="wrapper">
                    <div class="haizixinxi">
                        <h3>学生信息</h3>
                        <p><span>姓名：</span><span>{{haiziObj.name}}</span></p>
                        <p><span>身份证：</span><span>{{haiziObj.ID_number}}</span></p>
                        <p><span>保单号：</span><span>{{haiziObj.insurance_id}}</span></p>
                        <p><span>紧急联系人：</span><span>{{haiziObj.urgent_name}}</span></p>
                        <p><span>紧急联系人号码：</span><span>{{haiziObj.urgent_tel}}</span></p>
                    </div>
                    <div class="lipeiliucheng">
                        <!-- <h3>理赔流程</h3>
                        <img class="img" src="./baoxianliucheng.png" alt=""> -->
                    </div>
                    <div class="lipeicailiao">
                        <div class="cailiao">
                            <h3>理赔基础材料</h3>
                            <p>1、索赔申请书（含详细事故经过）</p>
                            <p>2、索赔清单（损失清单），含事故照片</p>
                            <p>3、收款方银行卡账号及开户行信息</p>
                        </div>
                        <div class="cailiao">
                            <h3>人伤索赔材料</h3>
                            <p>1、伤者身份证正反面复印件</p>
                            <p>2、病历（门、急诊病历，入、出院病历）</p>
                            <p>3、医疗费用票据</p>
                            <p>4、涉及死亡案件，需提供死亡证明</p>
                        </div>
                    </div>
                    <div class="xuexiaodeyiwu">
                        <h3>学校的义务和权益维护</h3>
                        <p>1、学校应保证教学设施设备符合安全标准，竭力消除安全隐患。善学校管理制度，加强对学生的安全教育</p>
                        <p>2、学生发生伤害事故后应立即采取救治措施并通知学生家长，对判断属于校（园）方责任保险责任的事故应及时按照理赔流程向保险公司报案</p>
                        <p>3、必要时应及时就事故现场拍照取证，向周围的学生老师调查 问询，做好笔录。如发生死亡事故拨打110</p>
                    </div>
                    <div class="wenxintishi">
                        <h3>温馨提示</h3>
                        <div class="item">
                            <p>一、报案要及时，积极与保险公司理赔人员沟通</p>
                            <p>1、学校应尽早报案、查勘现场、采集相关保险单证。</p>
                            <p>2、学校应在保险公司同意的情况下，与学生家长达成调解协议，避免校方的赔偿金额得不到赔偿。</p>
                        </div>
                        <div class="item">
                            <p>二、发生诉讼，学校要及时告知保险公司，法院调解协议需征得保险公司的同意方可达成调解方案。</p>
                        </div>
                        <div class="item">
                            <p>三、医药费不可得到双重赔付的问题。相关法律规定，保险不能使被保险人取得应获赔付之外的利益，因此医疗费不能既在意外伤害保险又在校（园）方责任险获得赔付。</p>
                        </div>
                        
                    </div>
            </div>
        </Scroll>
	</transition>
</template>

<script>
import Scroll from "base/scroll/scroll";
import { mapGetters } from "vuex";
export default {
  components: {
    Scroll
  },
  data() {
    return {
      haiziObj: {}
    };
  },
  computed: {
    ...mapGetters(["currentChild"])
  },
  methods: {
    getBaoxianXinxi() {
      const postData = new FormData();
      postData.append("student_id", this.currentChild.childId);
      // postData.append("student_id", 7580);

      this.$http
        .post(this.GLOBAL.URL + "/v1/Insurance/get_insurance_info", postData)
        .then(response => {
          response = response.body;
          if (response.errcode === this.GLOBAL.ERR_CODE) {
            this.haiziObj = response.data;
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
    }
  },
  mounted() {
    this.getBaoxianXinxi();
  }
};
</script>

<style lang="less" scoped>
.scroll {
  z-index: 99;
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #fff;
}
.wrapper {
  box-sizing: border-box;
  width: 100%;
  min-height: 100%;
  padding: 1rem;
  color: #333;
  font-size: 1rem;
  line-height: 2rem;

  h3 {
    font-weight: bold;
    font-size: 1rem;
  }
  p {
    padding: 0 0.5rem;
    font-size: 0.8rem;
  }

  // .lipeiliucheng {
  //   width: 100%;

  //   .img {
  //     width: 100%;
  //   }
  // }
}

.slide-enter-active,
.slide-leave-active {
  z-index: 99;
  transition: all 0.3s;
  transform: translateX(0);
}

.slide-enter,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
