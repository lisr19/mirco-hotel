<template>
  <div class="main">
    <head-bar title="预定详情"></head-bar>
    <div class="hotel-infor">
      <img :src="roomData.image1" alt="" >
      <div class="hotel-content">
        <p class="type">{{roomData.roomType}}</p>
        <p>床{{roomData.bedScale}} · {{roomData.floor}}层</p>
        <p class="price"><span>￥{{roomData.cancelPrice}}</span>/晚</p>
        <p class="manager" v-if="manager">
          房东：{{manager}}
          <img src="@/assets/icon/renzheng.png" alt="">
        </p>
      </div>
    </div>
    <div class="use-infor">
      <div class="item"  @click="showdateDouble = true">
        <span>日期</span>
        <span>{{startDouble | formatTime('MM月dd日')}}-{{endDouble | formatTime('MM月dd日')}}</span>
      </div>
      <!--<div class="item" @click="showNumBox=true">-->
        <!--<span>房客</span>-->
        <!--<span>{{peopleNumSure}}位</span>-->
      <!--</div>-->
      <div class="item" v-if="showNumBox">
        <RadioGroup v-model="peopleNum" type="button">
          <Radio label="1"></Radio>
          <Radio label="2"></Radio>
          <Radio label="3"></Radio>
          <Radio label="4"></Radio>
          <Radio label="5"></Radio>
        </RadioGroup>
        <Button class="btn sure-btn" type="primary" @click="sureNum">确定</Button>
      </div>
      <div class="item">
        <span>入住人</span>
        <input type="text" placeholder="添加" v-model="linkman">
      </div>
      <div class="item">
        <span>联系电话</span>
        <input  type="text" placeholder="添加" v-model="phone">
      </div>
      <div class="item">
        <span>身份证号</span>
        <input  type="number" placeholder="添加" v-model="idCard">
      </div>
      <div class="notice">
        <p style="display: flex;justify-content: space-between">
          <span>预定须知</span>
          <span @click="isSelect=!isSelect">
            <em class="icon" v-if="!isSelect"></em>
            <img class="icon-select" v-else src="@/assets/icon/select2x.png" alt="">
          </span>
        </p>
        <div v-if="this.rulesData.length">
          <h1 v-for="(item,index) in rulesData" :key="index">{{item.rulesType.name}}:<p>{{item.content}}</p></h1>
        </div>
        <p v-else>勾选表示我已同意此房源不适合婴幼儿(2岁以内)入住，不允许携带宠物，不允许举办派对和</p>
      </div>
    </div>
    <div class="footer" v-show="hideshow">
      <span class="price">
        <!--<em>￥{{price}}</em>/晚-->
        <em >￥{{totalPrice}}</em> / 共{{days}}晚
      </span>
      <Button class="btn" type="primary" @click="openPay">下一步</Button>
    </div>
    <date :showCalendar.sync='showdateDouble' maxDate="3m" :options="dateOptionsDouble" :roomId="roomId" @changeDate="changeDateDouble"></date>
  </div>
</template>

<script>
  import headBar from '@/components/header/head-bar'
  import footBar from '@/components/footer/foot-bar'
  import date from "@/components/datepicker/datePicker";
  import {addOrder} from "@/lib/API/comment";
  import {getUserDate} from "@/lib/API/login-enroll";
  import {getVacantRoom} from "@/lib/API/room";

export default {
    components:{
      headBar,
      footBar,
      date
    },
    watch:{
      endDouble(curVal,oldVal){
        if(curVal!==oldVal){
          this.endDouble = curVal
          this.DateDiff(this.endDouble,this.startDouble)
        }
      },
      startDouble(curVal,oldVal){
        if(curVal!==oldVal){
          this.startDouble = curVal
          this.DateDiff(this.endDouble,this.startDouble)
        }
      },
      showHeight() {
        if(this.docmHeight > this.showHeight){
          this.hideshow=false
        }else{
          this.hideshow=true
        }
      }
  },
    computed:{
      totalPrice(){
        return this.cancelPrice * this.days;
      },
    },
    data(){
        return{
          docmHeight: document.documentElement.clientHeight,  //默认屏幕高度
          showHeight: document.documentElement.clientHeight,   //实时屏幕高度
          hideshow:true,  //显示或者隐藏footer
          numList:[
            {
              value:1
            },
            {
              value:2
            },
            {
              value:3
            },
            {
              value:4
            }
          ],
          showNumBox:false,
          peopleNum:1,
          peopleNumSure:1,
          linkman:null, //联系人
          phone:null, //联系电话
          idCard:null,//身份证
          days:1,
          disabledSingle: true,
          isSelect:true,
          manager:false,
          startDate:null,
          endDate:null,
          cancelPrice:null,
          content:null,//提示内容
          showdateDouble: false,
          dateOptionsDouble: {
            maxDate: "3m", // 月份跨度
            isDoubleCheck: true,
            startDate: this.$route.query.startDate,
            endDate: this.$route.query.endDate,
          },
          startDouble:this.$route.query.startDate,
          endDouble:this.$route.query.endDate,
          roomId:this.$route.query.roomData.id,
        }
    },
    created(){
      this.userID = localStorage.getItem('MicroHotelUserData').split(',')[0];
      this.rq = this.$route.query
      this.rulesData = this.rq.rules
      this.roomData = this.rq.roomData
      this.roomId = this.rq.roomData.id
      this.cancelPrice = this.rq.roomData.cancelPrice
      this.days = this.DateDiff(this.endDouble,this.startDouble)
      this.getUserDate()
    },
    activated(){
      this.rq = this.$route.query
      if(this.roomId = this.rq.roomData.id||this.startDouble!=this.rq.startDate||this.endDouble!=this.rq.endDate){
        this.roomData = this.rq.roomData
        this.rulesData = this.rq.rules
        this.roomId = this.rq.roomData.id
        this.price = this.rq.roomData.price
        this.startDouble = this.rq.startDate
        this.endDouble = this.rq.endDate
        this.cancelPrice = this.rq.roomData.cancelPrice
        this.days = this.DateDiff(this.endDouble,this.startDouble)
      }
    },
    mounted() {
      window.onresize = ()=>{
        return(()=>{
          this.showHeight = document.body.clientHeight;
        })()
      }
    },
    methods: {
      //获取个人信息
      async getUserDate(params){
        let res = await getUserDate({id:this.userID})
        if(res.code === 200){
          this.myData = res.data.list[0]
          this.linkman = this.myData.name
          this.phone = this.myData.phone
          this.idCard = this.myData.idNumber
        }
      },
      //查询空房
      async getVacantRoom(params){
        let res = await getVacantRoom(params)
        if(res.code === 200){
        }
      },
      //下订单
      async addOrder(params){
        let res = await addOrder(params)
        if(res.code === 200){
          this.orderId = res.data
          this.$router.push({path:'/pay',query:{orderId:this.orderId,days:this.days,totalPrice:this.totalPrice,roomData:this.roomData,startDouble:this.startDouble,endDouble:this.endDouble}})
        }else if(res.code === 400){
          console.log(res.message);
          this.$toast('暂无可预订的房间')
        }
      },
      openPay(){
        let params = {
          userId:this.userID,
          roomId:this.roomId,
          startTime:this.startDouble + ' 12:00:00',
          endTime: this.endDouble + ' 12:00:00',
          livingPeriod: this.days,
          linkman:this.linkman,
          phone:this.phone,
          totalPrice:this.totalPrice,
        }
        if(this.linkman===null){
          this.$toast('入住人不能为空')
          return
        }
        if(this.phone===null){
          this.$toast('联系电话不能为空')
          return
        }
        if(!this.isSelect){
          this.$toast('未同意预订须知')
          return
        }
        this.addOrder(params)
        // this.$router.push({path:'/pay',query:{days:this.days,totalPrice:this.totalPrice,roomData:this.roomData,startDouble:this.startDouble,endDouble:this.endDouble}})
      },
      changeDateDouble(start, end) {
        this.startDouble = start;
        this.endDouble = end;
      },
      sureNum(){
        this.showNumBox = false
        this.peopleNumSure = this.peopleNum
      },
      DateDiff(sDate1,  sDate2){
        var  aDate,  oDate1,  oDate2,  iDays
        aDate  =  sDate1.split("-")
        oDate1  =  new  Date(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0])
        aDate  =  sDate2.split("-")
        oDate2  =  new  Date(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0])
        iDays  =  parseInt(Math.abs(oDate1  -  oDate2)  /  1000  /  60  /  60  /24)
        this.days = iDays
        return  iDays
      }
    }
}
</script>

<style scoped>
  .ivu-modal-wrap{
    top:30%;
  }
   .ivu-modal-confirm-body{
      font-size: 30px;
  }
  .use-infor >>> .ivu-select-single .ivu-select-selection{
    font-size:36px;
  }
  .use-infor >>> .ivu-radio-group{
    display: flex;
  }
  .use-infor >>> .ivu-radio-group-button .ivu-radio-wrapper{
    font-size: 36px;
    margin-right: 20px;
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
  }
  .use-infor >>>.ivu-checkbox-wrapper{
    padding-right: 35px;
  }
</style>

<style lang="less" scoped>
.main{
  padding: 90px 0;
  .hotel-infor{
    margin: 36px 0 58px;
    display: flex;
    padding-left: 40px;
    img{
      width:176px;
      height:176px;
      display: block;
      background-color: #cccccc;
    }
    .hotel-content{
      font-size:28px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:rgba(72,72,72,1);
      line-height:40px;
      text-align: left;
      margin-left: 32px;
      .type{
        height:50px;
        font-size:36px;
        font-family:PingFangSC-Medium;
        font-weight:500;
        color:rgba(51,51,51,1);
        line-height:50px;
      }
      .price{
        margin: 10px 0 8px;
        span{
          color: #d92f2f;
        }
      }
      .manager{
        display: flex;
        align-items: center;
        img{
          height: 36px;
          width: auto;
          margin-left: 18px;
        }
      }
    }
  }
  .use-infor{
    padding-left: 40px;
    .item{
      width:670px;
      border-bottom:solid #D4D4D4FF 1px; /*no*/
      display: flex;
      justify-content: space-between;
      padding: 25px 0;
      font-size:36px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:rgba(72,72,72,1);
      span:last-child{
        color:rgba(98,140,253,1);
      }
    }
    .item:first-child{
      border-top:solid #D4D4D4FF 1px; /*no*/
    }
    .notice{
      border-bottom:solid #D4D4D4FF 1px; /*no*/
      font-family:PingFangSC-Regular;
      font-size:36px;
      font-weight:400;
      color:rgba(51,51,51,1);
      line-height:50px;
      text-align: left;
      padding: 25px 40px 25px 0;
      >p:last-child{
        font-size:32px;
        color:rgba(51,51,51,1);
        line-height:44px;
        margin-top: 24px;
      }
      div{
        margin-top: 10px; 
        padding-bottom: 50px;
        h1{
          font-size: 32px;
          >p{
            font-weight: 500;
            margin-top: 0;
          }
        }
      }
      .icon{
        width:46px;
        height:46px;
        border-radius: 50%;
        border: solid #d6d6d6 1px;
        display: block;
      }
      .icon-select{
        width:48px;
        height:48px;
        color: #628CFD;
        display: block;
      }
    }
  }
  .footer{
    height:126px;
    background:rgba(255,255,255,1);
    box-shadow:0px 4px 8px 0px rgba(0,0,0,0.5);
    position: fixed;
    bottom: 0;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 40px;
    .price{
      color: #999999FF;
      font-family:PingFangSC-Medium;
      font-weight:500;
      font-size:28px;
      em{
        font-size:40px;
        font-weight:500;
        color:rgba(217,47,47,1);
      }
    }
    .btn{
      width:208px;
      height:80px;
      background:rgba(98,140,253,1);
      border-radius:8px;
      font-size:32px;
      font-family:PingFangSC-Medium;
      font-weight:500;
      color:rgba(255,255,255,1);
    }
  }
  input{
    border: none;
    text-align: right;
    color: #628cfd;
  }
  input:focus { outline: none; }
  .sure-btn{
    font-size: 28px;
    background: #628cfd;
  }
}
</style>

