<template>
  <div class="main">
    <head-bar title="付款"></head-bar>
    <div class="hotel-infor">
      <img :src="roomData.image1" alt="" >
      <div class="hotel-content">
        <p class="type">{{roomData.roomType}}</p>
        <p class="desc">{{roomData.bedScale}}</p>
        <p class="date">{{startDouble | formatTime('MM月dd日')}}-{{endDouble | formatTime('MM月dd日')}}</p>
        <p class="price">{{roomData.cancelPrice}}<span>元</span> <em> / 晚</em></p>
      </div>
    </div>
    <div class="pay-type">
      <div class="item">
        <div>
          <img src="@/assets/icon/zfb.png" alt="">
          <span>支付宝</span>
        </div>
        <Icon type="ios-arrow-forward" />
      </div>
    </div>
    <div class="pay-detail">
      <p>
        <span>¥{{roomData.cancelPrice}} x {{days}}晚</span>
        <span>¥{{totalPrice}}</span>
      </p>
      <p>
        <span>服务费</span>
        <span>0</span>
      </p>
      <!--<p>-->
        <!--<span>#活动优惠券</span>-->
        <!--<span>￥30</span>-->
      <!--</p>-->
      <p class="total-price">
        <span>总价</span>
        <span>¥{{totalPrice}}</span>
      </p>
    </div>
    <div class="notice">
      我同意
      <a href="">房屋守则</a>,
      <a href="">取消政策</a>,和
      <a href="">房客退款政策房屋守则</a>,
      我也同意支付以下所示的总金额（含服务费）
    </div>
    <button class="btn" @click="openPay">预定确认·￥{{totalPrice}}</button>
  </div>
</template>

<script>
  import {updataRoomOrder} from "@/lib/API/order";
  import headBar from '@/components/header/head-bar'
  import {getOrderList} from "@/lib/API/order";

export default {
    components:{
      headBar,
    },
    data(){
        return{
          totalPrice:230,
          orderData:{}
        }
    },
    created(){
      this.userID = localStorage.getItem('MicroHotelUserData').split(',')[0]
      if(this.$route.query.orderId){
        this.orderId = this.$route.query.orderId
      }
      this.orderType = this.$route.query.orderType
      console.log(this.orderType)
      this.rq = this.$route.query
      this.roomData = this.rq.roomData
      this.totalPrice = this.rq.totalPrice
      this.days = this.rq.days
      this.startDouble = this.rq.startDouble
      this.endDouble = this.rq.endDouble
    },
    mounted(){
    },
    methods: {
      async openPay(){
        // this.$router.push({path:'/pay-success',query:{orderId:this.orderId,orderType:this.orderType}})
        let res = await updataRoomOrder({
          id:this.orderId,
          status:1,
        })
        if(res.code===200){
          this.$router.push({path:'/pay-success',query:{orderId:this.orderId,orderType:this.orderType}})
          console.log(this.orderType);
        }
        // this.$router.push({path:'/pay-success',query:{orderId:this.orderId}})
      },
      // 获取订单列表
      async getOrderList(){
        let res = await getOrderList({
          userId:Number(this.userID),
        });
        if(res.code===200){
          console.log(res)
          this.orderData = res.data.list[0]
          this.orderId = this.orderData.orderId
        }
      },
    }
}
</script>

<style lang="less" scoped>
.main{
  padding: 90px 40px;
  .hotel-infor{
    margin: 36px 0;
    display: flex;
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
        font-size:28px;
        font-family:PingFangSC-Medium;
        font-weight:500;
        color:rgba(51,51,51,1);
        line-height:40px;
      }
      .desc{
        margin-top: 10px;
        font-size:24px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(51,51,51,1);
        line-height:34px;
      }
      .price{
        font-size:32px;
        font-family:PingFangSC-Semibold;
        font-weight:600;
        color:rgba(217,47,47,1);
        line-height:44px;
        margin-top: 8px;
        span{
          font-weight:400;
          font-size:26px;
        }
        em{
          font-weight:400;
          font-size:26px;
          color: #555555;
        }
      }
    }
  }
  .pay-type{
    .item{
      width:670px;
      height: 88px;
      border-bottom:solid #D4D4D4FF 1px; /*no*/
      border-top:solid #D4D4D4FF 1px; /*no*/
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size:24px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:rgba(51,51,51,1);
      line-height:34px;
      i{
        color: #999999FF;
        font-size: 45px;
      }
      >div{
        display: flex;
        align-items: center;
        img{
          width:48px;
          height:48px;
          margin-right: 52px;
        }
      }
    }
  }
  .pay-detail{
    font-size:28px;
    font-family:PingFangSC-Regular;
    font-weight:400;
    color:rgba(51,51,51,1);
    line-height:40px;
    padding: 36px 0 98px;
    >p{
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
    }
    .total-price{
      font-size:32px;
      font-family:PingFangSC-Semibold;
      font-weight:600;
      color:rgba(51,51,51,1);
      line-height:44px;
    }
  }
  .notice{
    font-size:28px;
    font-family:PingFangSC-Regular;
    font-weight:400;
    color:rgba(51,51,51,1);
    line-height:40px;
    border-bottom:solid #D4D4D4FF 1px; /*no*/
    border-top:solid #D4D4D4FF 1px; /*no*/
    padding: 36px 0;
    text-align: left;
    a{
      text-decoration:underline;
      color: #626BFDFF;
    }
  }
  .btn{
    width:670px;
    height:90px;
    background:rgba(98,140,253,1);
    border-radius:6px;
    font-size:32px;
    font-family:PingFangSC-Semibold;
    font-weight:600;
    color:rgba(255,255,255,1);
    line-height:44px;
    border: none;
    margin-top: 250px;
  }
}
</style>

