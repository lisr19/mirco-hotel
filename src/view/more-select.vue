<template>
  <div class="main">
    <!--更多筛选-->
    <div class="more-select" v-if="moreSelect">
      <div class="bar">
        <Icon type="ios-arrow-back" @click="$router.back()"/>
        <span @click="clear">重置</span>
      </div>
      <div class="content">
        <h2>价格范围(元)</h2>
        <input type="number" v-model="cancelPrice" placeholder="100"><span>—</span><input type="number" v-model="price" placeholder="300">
        <h2>酒店房型</h2>
        <ul>
          <li v-for=" (item,index) in typeList" :class="{active:curType===index}" @click="chageType(item,index)" v-model="roomType">{{item.name}}</li>
        </ul>
        <h2>可入住人数</h2>
        <input type="number" v-model="availableAdult" placeholder="2" style="width: 100%">
      </div>
      <Button class="btn" type="primary" @click="optRoom">开始筛选</Button>
    </div>
    <head-bar v-else></head-bar>
    <div class="room-items" v-if="roomList.length">
      <div class="item" v-for="item in roomList" @click="openRoomDetail(item)">
        <img :src="item.image1" alt="">
        <div class="desc">
          <p class="name">{{item.roomType}}</p>
          <div class="address">【{{item.hotel.hotelName}}】 {{item.hotel.hotelAddress}}</div>
          <div class="price">
            <span class="discount">￥{{item.cancelPrice}}</span>
            <!--<span class="duration"> / {{item.dura}}</span>-->
          </div>
        </div>
      </div>
    </div>
    <h1 class="more-but" v-else>暂无房间数据</h1>
  </div>
</template>

<script>
  import headBar from '@/components/header/head-bar'
  import {getRoomList1} from "@/lib/API/room";
  export default {
    components:{
      headBar
    },
    beforeRouteLeave(to,from,next){
      if(to.path == '/room-detail'){
        from.meta.keepAlive = true;
      }else{
        from.meta.keepAlive = false ;
      }
      next()
    },
    data() {
      return {
        moreSelect:true, //更多筛选
        curType:-1,
        curSer:-1,
        typeList:[ //房型列表
          {
            name:'大床房'
          },
          {
            name:'双床房'
          },
          {
            name:'单人间'
          },
          {
            name:'双人间'
          },
        ],
        roomList:[],// 房间搜索列表
        roomType:'', //房间类型
        availableAdult:'', //可住人数
        cancelPrice:'',//最低价格
        price:'',//最高价格
      }
    },
    created() {
    },
    methods: {
      //搜索获取房间列表
      async getRoomList1(){
        let params ={}
        if(this.roomType){
          params.type = this.roomType
        }
        if(this.availableAdult){
          params.availableAdult = this.availableAdult
        }
        if(this.cancelPrice){
          params.cancelPrice = this.cancelPrice
        }
        if(this.price){
          params.price = this.price
        }
        if(this.cancelPrice&&this.price&&(this.cancelPrice>this.price)){
         this.$toast('请填写正确的价格范围')
         return false
        }
        let res = await getRoomList1(params)
        if(res.code === 200){
          this.roomList = res.data.list
          this.page=res.data.pageNum
          this.pages = res.data.pages
          this.total = res.data.total
          this.moreSelect = false
        }
      },
      chageType(item,index){
        this.curType =index
        this.roomType =item.name
      },
      //打开房间详情
      openRoomDetail(item){
        this.$router.push({name:'room-detail',query: {roomData:item,roomid:item.id},params:{hotelName:item.hotel.hotelName,hotelAddress:item.hotel.hotelAddress}})
      },
      //重置
      clear(){
        this.curType=-1
        this.roomType=''
        this.cancelPrice = ''
        this.price = ''
        this.availableAdult = ''
      },
      optRoom(){
        this.getRoomList1()
        this.moreSelect = false
      }
    }
  }
</script>

<style lang="less" scoped>
  .main {
    background:#FAFAFCFF;
    height: 100%;
    position: relative;
    .room-items{
      padding-top: 120px;
      .more-but{
        width: 100%;
        height: 100px;
        padding-bottom: 50px;
      }
      .item{
        width:670px;
        margin: 0 auto 80px;
        background:rgba(255,255,255,1);
        border-radius:20px;
        overflow: hidden;
        img{
          height:348px;
          width: 100%;
          background:rgba(181,181,181,1);
          display: block;
        }
        .desc{
          text-align: left;
          padding: 18px 28px 20px;
          font-family:PingFangSC-Semibold;
          color:rgba(51,51,51,1);
          font-weight:600;
          .name{
            font-size:24px;
            line-height:34px;
          }
          .address{
            font-size:32px;
            line-height:44px;
            margin: 8px 0 20px;
          }
          .price{
            span{
              font-size:28px;
              font-family:PingFangSC-Regular;
              font-weight:400;
              color:rgba(102,102,102,1);
              line-height:40px;
            }
            .discount{
              font-family:PingFangSC-Medium;
              font-weight:600;
              color:rgba(217,47,47,1);
            }
          }
          .score{
            margin-top: 4px;
            .num{
              font-size:22px;
              font-family:PingFangSC-Regular;
              font-weight:400;
              color:rgba(102,102,102,1);
              line-height:32px;
            }
          }
        }
      }
    }
    .more-select{
      text-align: left;
      position: absolute;
      top: 0;
      background:rgba(248,249,251,1);
      width: 100%;
      height: 100%;
      padding: 0 40px;
      .bar{
        width: 100%;
        height:90px;
        line-height:90px;
        font-size:28px;
        font-family:PingFangSC-Medium;
        color:rgba(51,51,51,1);
        font-weight:600;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .ivu-icon-ios-arrow-back{
          font-weight: 500;
          font-size: 54px;
          color: #333333;
          display: inline-block;
          margin-left: -20px;
        }
      }
      h2{
        font-size:36px;
        font-family:PingFangSC-Medium;
        font-weight:600;
        color:rgba(51,51,51,1);
        line-height:50px;
        margin: 60px 0 30px;
      }
      .content{
        input{
          width:160px;
          height:80px;
          background:rgba(234,234,234,1);
          border-radius:10px;
          border: none;
          font-size:28px;
          font-family:PingFangSC-Regular;
          font-weight:400;
          color:rgba(98,140,253,1);
          padding: 0 20px;
        }
        span{
          margin: 34px;
        }
        ul{
          width: 102%;
          li{
            width:160px;
            height:80px;
            background:rgba(234,234,234,1);
            border-radius:10px;
            display: inline-block;
            font-size:28px;
            font-family:PingFangSC-Regular;
            font-weight:400;
            color:rgba(102,102,102,1);
            text-align: center;
            line-height: 80px;
            margin:0 10px 10px 0;
          }
          .active{
            background:rgba(255,255,255,1);
            border:2px solid rgba(98,140,253,1);
            color:rgba(98,140,253,1);
          }
        }
      }
      .btn{
        width:670px;
        height:90px;
        background:rgba(98,140,253,1);
        border-radius:6px;
        margin-top: 380px;
        font-size:32px;
        font-family:PingFangSC-Semibold;
        font-weight:600;
        color:rgba(255,255,255,1);
      }
    }
  }
</style>
