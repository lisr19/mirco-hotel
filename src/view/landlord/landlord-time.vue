<template>
    <div class="set-time-body">
      <head-bar></head-bar>
        <div class="page-name">
            <div></div>
            <h1>设置可订状态</h1>
        </div>
        <div class="set-area">
            <h1>可订时间段</h1>
            <h2>当天预订截止时间</h2>
            <!--<input type="text" v-model="nowOrderTime" placeholder="00:00" >-->
            <TimePicker v-model="nowOrderTime" format="HH:mm" placeholder="00:00" style="width: 92%;margin-bottom: 24px;"></TimePicker>
            <h2>未来的预订</h2>
            <DatePicker v-model="futureOrderTime" type="date" placeholder="所有未来的日期" style="width: 92%;margin-bottom: 24px;"></DatePicker>
            <h1>入住</h1>
            <h2>最早入住时间</h2>
            <TimePicker v-model="fastestTime" format="HH:mm" placeholder="00:00" style="width: 92%;margin-bottom: 24px;"></TimePicker>
            <h2>最晚入住时间</h2>
            <TimePicker v-model='farthestTime' format="HH:mm" placeholder="00:00" style="width: 92%;margin-bottom: 24px;"></TimePicker>
            <h2>最晚退房时间</h2>
            <TimePicker v-model='checkOutTime' format="HH:mm" placeholder="00:00" style="width: 92%;margin-bottom: 24px;"></TimePicker>
            <h1>住宿天数</h1>
            <h2>最少入住天数</h2>
            <Input v-model='leastDay' placeholder="0" type="number" style="width: 92%;margin-bottom: 24px;"/>
            <h2>最长住宿晚数</h2>
            <Input v-model='mostDay' placeholder="0" type="number" style="width: 92%;margin-bottom: 24px;"/>
            <div @click="updateRoomRules" class="next-step-but" v-if="updata">保存修改并进行下一步</div>
            <div @click="addRoomRules" class="next-step-but" v-else>保存并进行下一步</div>
            <div style='width: 1px; height: 1px;'></div>
        </div>
    </div>
</template>

<script>
  import headBar from '@/components/header/head-bar'
  import {addRoomRules} from "@/lib/API/landlord";
export default {
  components: {
    headBar,
  },
    data(){
        return{
            updata:false,
            // 可订时间段
            nowOrderTime:'',
            futureOrderTime:null,
            // 入住
            fastestTime:'',
            farthestTime:'',
            checkOutTime:'',
            // 住宿天数
            leastDay:'',
            mostDay:'',
            butlock:false,
            content:'', //规则内容
        }
    },
    created(){
      if(this.$route.query.updata){
          this.updata = this.$route.query.updata;
      }
      this.roomId = this.$route.query.roomId
    },
    methods:{
      // 添加房间规则
      async addRoomRules(){
        let params = {
          roomId:this.roomId,
          // roomId:22,
          ruleType:1,
          content: '当天预订截止时间:'+ this.nowOrderTime+'；'+ '未来的预订:'+this.futureOrderTime +'；'+ '最早入住时间:'+this.fastestTime+'；'+
          '最晚入住时间:'+ this.farthestTime +'；'+'最晚退房时间:'+this.checkOutTime +'；'+'最少入住天数:'+this.leastDay +'；'+'最长住宿晚数:'+this.mostDay,
          // content:this.content,
          flag:1
        }
        // console.log(params);
        let res = await addRoomRules(params)
        if(res.code === 200){
          console.log('添加房间规则成功');
          this.$router.push({name:'landlord-condition',query:{roomId:this.roomId,updata:this.updata}});
        }
      },
      updateRoomRules(){
        this.$router.push({name:'landlord-condition',query:{roomId:this.roomId,updata:this.updata}});
        // this.$router.back()
      }
    }
}
</script>

<style scoped>
.set-area >>> input{
    height: 68px;
    background: transparent;
    margin-left: 0;
    font-size:32px;
    color: #628CFD;
    border: 0;
}
.set-area >>> .ivu-input-suffix{
    display: none;
}
.set-area >>> .ivu-select-dropdown{
    width: 92%;
}
.set-area >>> .ivu-picker-panel-body{
    width: 100%;
}
.set-area >>> .ivu-time-picker-cells-list{
    width: 50%;
}
.set-area >>> .ivu-time-picker-cells-cell{
    text-align: center;
    font-size: 32px;
    margin-top: 20px;
    padding-left: 0;
}
.set-area >>> .ivu-date-picker-cells{
    width: 100%;
}
.set-area >>> .ivu-date-picker-cells-cell{
    width: 96px;
    height: 32px;
    font-size: 32px;
}
.set-area >>> .ivu-date-picker-cells-cell em{
    width: 96px;
}
.set-area >>> .ivu-date-picker-cells-header{
    width: 100%;
}
.set-area >>> .ivu-date-picker-cells-header span{
    width: 90px;
}
.set-area >>> .ivu-date-picker-cells{
    margin: 0;
}
.set-area >>> .ivu-date-picker-header{
    margin: 0 auto;
    width: 90%;
    height: 64px;
    font-size: 32px;
    line-height: 64px;
}
.set-area >>> .ivu-date-picker-header .ivu-icon-ios-arrow-back{
    display: none;
}
.set-area >>> .ivu-date-picker-header .ivu-icon-ios-arrow-forward{
    display: none;
}
.set-area >>> .ivu-date-picker-header .ivu-icon-ios-arrow-back{
    display: none;
}
.set-area >>> .ivu-input-type{
    border-bottom: 2px solid #D4D4D4;
    /* margin-bottom: 48px; */
}

</style>


<style lang="less" scoped>
.set-time-body{
    width: 100%;
    background:rgba(248,249,251,1);
    .top-box{
        width: 100%;
        height: 80px;
        background:rgba(245,245,245,1);
        position: fixed;
        top: 0;
        left: 0;
        z-index: 10;
        .close-but{
            position: absolute;
            top: 28px;
            left: 40px;
            width: 30px;
            height: 30px;
            >i{
                display: block;
                position: absolute;
                width: 2px;
                height: 30px;
                top: 0;
                left: 50%;
                background: #555555;
            }
            >i:nth-of-type(1){
                transform: rotate(45deg);
            }
            >i:nth-of-type(2){
                transform: rotate(-45deg);
            }
        }
    }
    .page-name{
        width: 288px;
        height: 66px;
        position: absolute;
        top: 128px;
        left: 40px;
        >h1{
            min-width: 6em;
            position: absolute;
            top: 0;
            left: 0;
            font-size:48px;
            font-family:PingFangSC-Semibold;
            font-weight:600;
            color:rgba(51,51,51,1);
            line-height:66px;
        }
        >div{
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 18px;
            background:linear-gradient(90deg,rgba(155,192,255,1) 0%,rgba(98,140,253,1) 100%);
        }
    }
    .set-area{
        padding-top: 294px;
        width: 100%;
        >h1{
            height:50px;
            font-size:36px;
            font-family:PingFangSC-Semibold;
            font-weight:600;
            color:rgba(51,51,51,1);
            line-height:50px;
            margin-left: 40px;
            margin-bottom: 48px;
            text-align: left;
        }
        >h2{
            height:44px;
            font-size:32px;
            font-family:PingFangSC-Regular;
            font-weight:400;
            color:rgba(72,72,72,1);
            line-height:44px;
            text-align: left;
            margin-left: 38px;
            margin-bottom:28px;
        }
    }
    .next-step-but{
        width:450px;
        height:66px;
        background:#628CFD;
        border-radius:4px;
        margin: 46px auto 54px;
        font-size:32px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:#FFFFFF;
        line-height:66px;
    }
}
</style>
