<template>
  <div class="indebt-body">
    <div class="top-box">
      <h1 v-if="orderNull">暂无订单</h1>
      <h1 v-else>订单</h1>
    </div>
    <div class="not-data" v-if="orderNull">
      <img src="@/assets/icon/null-icon.png" alt="">
    </div>
    <div class="have-data" v-else>
      <div class="type-box">
        <h1 @click="typeOnClick('')" :class="{active:orderStatus === ''}">全部订单</h1>
        <h1 @click="typeOnClick(0)" :class="{active:orderStatus === 0}">待付款</h1>
        <h1 @click="typeOnClick(1)" :class="{active:orderStatus === 1}">待入住</h1>
        <h1 @click="typeOnClick(3)" :class="{active:orderStatus === 3}">待评价</h1>
        <h1 @click="typeOnClick(4)" :class="{active:orderStatus === 4}">已完成</h1>
      </div>
      <ul class="order-box">
        <li v-for="(item,index) in orderList" :key="index"  @click="openOrderDetail(item)">
          <img v-if="item.orderType === 1" class="type-icon" src="@/assets/icon/hotel-icon.png" alt="">
          <img v-if="item.orderType === 2" class="type-icon" src="@/assets/icon/minsu-icon.png" alt="">
          <img v-if="item.orderType === 3" class="type-icon" src="@/assets/icon/conference.png" alt="">
          <!--<img v-if="!item.generalOrder" class="type-icon" src="@/assets/icon/taxi-icon.png" alt="">-->
          <p class="product-name">{{item.room[0].hotelName}}</p>
          <p class="status" v-if="item.status===0">待付款</p>
          <p class="status" v-else-if="item.status===1">待入住</p>
          <p class="status" v-else-if="item.status===2">入住中</p>
          <p class="status" v-else-if="item.status===3">待评价</p>
          <p class="status" v-else-if="item.status===4">已完成</p>
          <p class="status" v-else-if="item.status===5">已取消</p>
          <div class="dividing"></div>
          <ul class="general-order-details">
            <img class="hotel-logo" :src="item.room[0].hotelImage1" alt="">
            <li v-if="item.status === 0">下单时间：{{item.orderTime}}</li>
            <li v-else >有效期至：{{item.endTime.slice(0,10)}}</li>
            <li>房型：{{item.room[0].type}}</li>
            <li>总价：¥{{item.totalPrice}}</li>
          </ul>
          <div class="buts-box">
            <button v-if="item.status===3||item.status===4||item.status===5" @click.stop="openHotelDetail(item.room[0].hotelId,item.orderType)">再次预约</button>
            <button v-if="item.status===0" class="unfinished" @click.stop='goPay(item,index)'>去付款</button>
            <button v-if="item.status===1||item.status===2" class="unfinished">待入住</button>
            <button v-if="item.status===3">写评价</button>
          </div>
          <img @click.stop="openIndoorMap(item.room[0].hotelId)" v-if="item.status===1||item.status===2" class="hotel-map" src="@/assets/icon/hotel-map.png" alt="">
        </li>
	      <img class="null-icon" src="@/assets/icon/null-icon.png" alt=" " v-if="!listLength">
        <p @click="moreOrder" class="more-order-but" v-else-if="listLength===10">
          {{moreButText}}
        </p>
         <p  class="more-order-but" v-else>没有更多订单了</p>
        <!-- 网约车 -->
        <!-- <li @click="openOrderDetail(6)" class="taxi-order" idNum=''>
            <img class="type-icon" src="" alt="">
            <p class="product-name">约车</p>
            <p class="status">已完成</p>
            <div class="dividing"></div>
            <ul v-if="false" class="general-order-details">
                <img class="hotel-logo" src="general-order-details" alt="">
                <li>有效期至：{{'unknown'}}</li>
                <li>房型：{{'unknown'}}</li>
                <li v-if="false">配置：{{'unknown'}}</li>
                <li>总价：¥{{'unknown'}}</li>
            </ul>
            <ul v-else class="taxi-order-details">
                <img src="" alt="">
                <img src="" alt="">
                <img src="" alt="">
                <li>{{'时间'}}</li>
                <li>{{'出发地'}}</li>
                <li>{{'目的地'}}</li>
            </ul>
            <div v-if="false" class="buts-box">
                <button v-if="true">再次预约</button>
                <button v-if="true">写评价</button>
                <button v-if="false" class="unfinished">{{ButText[1]}}</button>
            </div>
        </li> -->
      </ul>
    </div>
  </div>
</template>
<script>
  import {getOrderList} from "@/lib/API/order";
  export default {
    name: "order",
    data(){
      return{
        // generalOrder 是否非网约车订单 , orderTpye 订单类型 (酒店房间=1，民宿房间=2，酒店会议室=3，其他会议室=4)
        // orderStatus 订单状态 (0-待付款 1-未出行 2-入住中 3-待评价 4-完成 5-取消)
        // orderClass 订单的class（general-order）
        // orderID 订单ID， orderHotelName 订单酒店的名称 ， hotelPhone 酒店电话
        // orderStatusTxt 订单状态的文字描述 ， hotelImg 订单商品的图片 ， validDate 订单有效时间
        // genre 订单的房型 ， deploy 会议室订单的配置 ， price 订单的价格 ， unfinishedTpyeText 订单未完成时按钮显示的文字内容
        // classList:['general-order','taxi-order'],
        // typeText:['等待付款','待入住','入住中','待评价','已完成','已取消'],
        // butText:['去付款','未入住'],
        types:[],
        listLength:0,
        orderNull:false,
        newOpen:true,
        orderStatus:'',
        userID:'',
        page:1,
        pages:'',
        moreButText:'更多订单',
        orderList:[], //订单列表
      }
    },
    created(){
      this.userID = localStorage.getItem('MicroHotelUserData').split(',')[0];
    },
    mounted(){
      this.getOrderList()
      this.types = document.getElementsByClassName('type-box')[0].getElementsByTagName('h1');
      this.newOpen=false;
    },
    methods:{
      openIndoorMap(id){
        this.$router.push({name:'indoorMap',query:{hotelId:id}})
      },
      // 去付款
      goPay(item){
        let roomData = {
          roomType:item.room[0].type,
          bedScale:item.room[0].bedScale,
          cancelPrice:item.room[0].price,
          image1:item.room[0].hotelImage1,
        }
        this.days = this.DateDiff(item.endTime,item.startTime)
        this.$router.push({path:'/pay',
          query:{days:this.days,orderId:item.orderId,totalPrice:item.totalPrice,
            roomData:roomData,startDouble:item.startTime,endDouble:item.endTime,orderType:item.orderType}
        })
      },
      // 获取订单列表
      async getOrderList(){
        let res = await getOrderList({
          userId:Number(this.userID),
          status:this.orderStatus,
          page:this.page,
        });
        if(res.code===200){
          this.listLength = res.data.list.length
          this.orderList = this.orderList.concat(res.data.list)
          this.pages= res.data.pages
        }
      },
      // 根据订单类型搜索
      typeOnClick(type){
        this.orderStatus =type
        this.moreButText='更多订单'
        this.page=1
        this.orderList = []
        this.getOrderList()
      },
      // 更多订单
      moreOrder(){
        if(this.page>=this.pages){
          this.moreButText='订单见底了'
        }else{
          this.page++;
          this.getOrderList();
        }
      },
      // 打开订单详情
      openOrderDetail(item){
        this.$router.push({ name:'订单详情', params:{orderItem:item,callback:this.callback},query:{orderId:item.orderId,orderType:item.orderType,evaluation:item.evaluation}})
      },
      callback(){
        this.showOrderData = []
        this.getOrderList()
      },
      // 再次预订
      openHotelDetail(ID,type){
        console.log(type);
        let types
        if(type===1){
          types = '酒店'
        }else {
          types = '民宿'
        }
        this.$router.push({path: 'hotel-detail',query:{hotelid:ID,seekType:types}})
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
      },
    }

  }
</script>
<style lang="less" scoped>
  *{
    background:rgba(248,249,251,1);
    font-weight: 400;
    margin: 0;
    padding: 0;
  }
  button{
    outline: none;
  }
  .indebt-body{
    min-height: 100%;
    >.top-box{
      position: fixed;
      width: 100%;
      height: 144px;
      z-index: 10;
      top: 0;
      left: 0;
      >h1{
        width: 200px;
        height: 66px;
        font-size:48px;
        font-weight:600;
        color:rgba(72,72,72,1);
        line-height:66px;
        margin-left:40px;
        margin-top: 48px;
        text-align: left;
      }
    }
    >.not-data{
      background: rgba(248,249,251,1);
      width: 750px;
      height: 100%;
      position: absolute;
      >img{
        width: 614px;
        height: auto;
        display: block;
        position: absolute;
        top: 30%;
        left: 50%;
        margin-left: -307px;
      }
    }
    >.have-data{
      width: 100%;
      min-height: 100%;
      >.type-box{
        position: fixed;
        top: 144px;
        left: 0;
        width: 100%;
        height: 62px;
        z-index: 10;
        >h1{
          float: left;
          height:56px;
          font-size:28px;
          font-weight:400;
          color:rgba(102,102,102,1);
          line-height:40px;
          margin-left: 44px;
          border-bottom: 2px solid rgba(100, 141, 255, 0);
          transition: all .3s;
        }
        >.active{
          color: #628CFD;
          border-bottom: 2px solid rgba(100, 141, 255, 1);
        }
      }
      >.order-box{
        width: 100%;
        height: 80%;
        padding-top: 200px;
        padding-bottom: 90px;
        overflow: scroll;
        transition: all .3s;
        >li{
          list-style: none;
          width: 93.07%;
          height: 274px;
          margin: 20px auto;
          border-radius: 20px;
          background: rgba(255, 255, 255, 1);
          position: relative;
          p,ul,ul li{
            background: transparent;
          }
          >.type-icon{
            display: block;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            position: absolute;
            top: 28px;
            left: 14px;
            // background: black;
          }
          >.product-name{
            max-width: 524px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            height: 40px;
            font-size: 28px;
            font-weight: 400;
            color: rgba(51,51,51,1);
            line-height: 40px;
            position: absolute;
            top: 26px;
            left: 62px;

          }
          >.status{
            height: 32px;
            font-size: 22px;
            font-weight: 400;
            color:rgba(98,140,253,1);
            line-height: 32px;
            position: absolute;
            top: 30px;
            right: 14px;
          }
          >.dividing{
            width: 95%;
            height: 2px;
            background: #E8E8E8;
            position: absolute;
            top: 74px;
            left: 50%;
            margin-left: -47.5%;
          }
          >ul{
            width: 544px;
            height: 140px;
            position: absolute;
            top: 94px;
            left: 154px;
            >.hotel-logo{
              display: block;
              width: 112px;
              height: 112px;
              border-radius: 8px;
              position: absolute;
              top: -4px;
              left: -140px;
              // background: black;
            }
            >li{
              height: 32px;
              margin-bottom: 4px;
              font-size: 22px;
              text-align: left;
              color:rgba(102,102,102,1);
              line-height: 32px;
              max-width: 544px;
              white-space: normal;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
          >.buts-box{
            width: 320px;
            height: 48px;
            position: absolute;
            bottom: 16px;
            right: 14px;
            background: transparent;
            >button{
              float: right;
              width: 144px;
              height: 48px;
              margin-left: 16px;
              border-radius: 14px;
              border:1.1px solid #E8E8E8;
              font-size: 24px;
              line-height: 48px;
              color:rgba(127,127,127,1);
              font-weight:500;
              background: transparent;
            }
            >.unfinished{
              border:1.1px solid #628CFD;
              color: #628CFD;
            }
          }
          >.hotel-map{
            display: block;
            position: absolute;
            width: 44px;
            height: 42px;
            top: 130px;
            right: 64px;
          }
        }
        >.taxi-order{
          height: 242px;
          >.taxi-order-details{
            left: 50px;
            >img{
              display: block;
              position: absolute;
              left: -32px;
              width: 16px;
              height: 16px;
              border-radius: 50%;
            }
            >img:nth-of-type(1){
              width: 28px;
              height: 28px;
              background: black;
              top: 0;
            }
            >img:nth-of-type(2){
              top: 50px;
              background: #2EAB8D;
            }
            >img:nth-of-type(3){
              top: 94px;
              background: #FD9153;
            }
            >li{
              padding-left: 5px;
              margin-bottom: 12px;
            }
          }
        }
        >.more-order-but{
          width: 100%;
          height: 100px;
          margin-top: 60px;
          font-size: 36px;
        }
	      .null-icon{
		      width: 90%;
		      margin-top: 150px;
	      }
      }
    }
  }
</style>

