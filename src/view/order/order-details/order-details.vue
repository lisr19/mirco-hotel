<template>
    <div class="details-body">
        <!-- 头部 -->
        <Header :title='pageName' ></Header>
        <div class="details-box">
          <div class="btn-home" @click="openBluetoothAdapter">
            室内导航
          </div>
            <img class="hotel-logo" :src="order.imgLogo" alt="">
            <h1 class="hotel-name">{{order.name}}</h1>
            <h1 class="hotel-describe">【{{order.hotelName}}】 {{order.bedScale}}</h1>
            <h1 class="hotel-date">{{order.startTime}}至{{order.endTime}}</h1>
            <!-- if判断是否是公寓或者民宿 -->
            <h1 v-if="this.orderType==1||this.orderType==2" class="hotel-price">
                <p>{{order.totalPrice}}元</p>
                <p>¥{{order.price}}/晚</p>
            </h1>
            <!-- if判断是否是会议室 -->
            <h1 v-else class="office-price">
                <p>{{order.price}}元</p>
                <p>/小时</p>
            </h1>
        </div>
        <!-- if判断是否是会议室 -->
        <div v-if="this.orderType==3||this.orderType==4" class="office-price-details">
            <p>在线支付</p>
            <p>¥{{'1200'}}</p>
            <p @click="onClickOpenDetails()">费用明细</p>
            <i></i>
            <div class="price-details-box">
                <div @click="onClickCloseDetails()" class="close-box"></div>
                <div class="office-price-details-box">
                    <div class="office-total-prices">
                        <h2>总价</h2>
                        <h2>¥{{'1200'}}</h2>
                    </div>
                    <div>
                        <h2>会议室</h2>
                        <h2>¥{{'200'}}/小时</h2>
                    </div>
                    <div>
                        <h2>2019-02-24 不含服务费</h2>
                        <h2>{{'3'}} X ¥{{'200'}}</h2>
                    </div>
                    <i></i>
                    <p>配套服务费</p>
                    <div>
                        <h2>{{'幻灯机'}}</h2>
                        <h2>
                            <span v-if="false">{{'NaN'}} X </span>
                            ¥{{'100'}}/{{'台'}}
                        </h2>
                    </div>
                    <div>
                        <h2>{{'美式咖啡'}}</h2>
                        <h2>
                            <span v-if="true">{{'3'}} X </span>
                            ¥{{'20'}}/{{'杯'}}
                        </h2>
                    </div>
                    <div>
                        <h2>{{'乌龙茶'}}</h2>
                        <h2>
                            <span v-if="true">{{'2'}} X </span>
                            ¥{{'20'}}/{{'杯'}}
                        </h2>
                    </div>
                    <div>
                        <h2>{{'液晶屏幕'}}</h2>
                        <h2>
                            <span v-if="false">{{'NaN'}} X </span>
                            ¥{{'100'}}/{{'台'}}
                        </h2>
                    </div>
                </div>
            </div>
        </div>
        <!-- 房间使用状态 -->
        <!-- if判断房间是否已被使用 -->
        <div v-if="orderStatus===0" class="order-stayus" @click="goPay()">
            {{'去付款'}}
        </div>
        <div v-if="orderStatus===1" class="order-stayus">
            {{'未入住'}}
        </div>
         <!--会议室参会人管理按钮-->
         <!--if判断是否是会议室并是否是未开始使用-->
        <div v-if="false" class="office-manage">
            <span>
                <img src="@/assets/img/meeting.png" alt="">
                会议管理
            </span>
        </div>
        <!-- 订单评分 -->
        <!-- if判断是否已使用 -->
        <div v-if="(this.orderStatus==2||this.orderStatus==3||this.orderStatus==4)&&order.evaluation.length" class="order-mark">
            <div>
                <!-- if判断是否已评分(未评分为true) -->
                <Rate v-if="order.evaluation.length" disabled v-model="order.evaluation[0].grade"/>
                <Rate v-else disabled v-model="upDataMark"/>
                <!-- if判断是否已评分(未评分为true) -->
                <p @click="openMark()" v-if="this.orderStatus==2||this.orderStatus==3" style="color: #999999;">去评价</p>
                <p v-else style="color: #628CFD;">{{order.evaluation[0].grade}}分</p>
            </div>
            <div class="mark-box">
                <div>
                    <Rate v-model="upDataMark"/>
                    <p style="color: #628CFD;">{{upDataMark}}分</p>
                    <Input v-model="upDataMarkText" type="textarea" :autosize="{minRows:5,maxRows: 10}" placeholder="请输入评语" />
                    <button @click="closeMark()">取消</button>
                    <button @click="postComment()">确认</button>
                </div>
            </div>
        </div>
        <!-- 再次预约按钮 -->
        <!-- if判断是否已使用 -->
        <div v-if="orderStatus===2||orderStatus===3||orderStatus===4" class="again-buy" @click="openHotelDetail(order.room.hotelId)">
            再次预定
        </div>
        <!-- 用户订单信息 -->
        <div class="user-order-details">
            <i></i>
            <div>
                <h1>订单信息</h1>
                <ul>
                    <li><p>入住人</p>{{order.linkman}}</li>
                    <li><p>手机号</p>{{order.phone}}</li>
                    <li><p>订单号</p>{{order.orderNum}}</li>
                    <li><p>下单时间</p>{{order.orderTime}}</li>
                </ul>
            </div>
        </div>
        <!-- 商家信息 -->
        <div class="hotel-details">
            <i></i>
            <div>
                <h1>商家信息</h1>
                <h2>{{order.hotelName}}</h2>
                <h3 @click="getHotelLocation()"><img src="@/assets/img/gps.png" alt="">{{order.hotelAddress}}</h3>
                <div @click="callHotel()" class="hotel-phone"></div>
                <div @click.stop="closeChoice()" class="choice-window">
                    <div class="choice-box">
                        <div @click="sendMessage()" class="message">
                            <img src="@/assets/icon/news-active.png" alt="">
                            <h4>发送消息</h4>
                        </div>
                        <div @click="callPhone()" class="phone">
                            <img src="@/assets/img/phone.png" alt="">
                            <h4>拨打电话</h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div id="AMap">
            <!-- <AMap ref='map'></AMap> -->
            <iframe :src="mapURL" frameborder="0" ></iframe>
        </div>

        <!-- 取消订单按钮 -->
        <!-- if判断订单是否已使用 -->
        <div class="cancel-order" v-if="orderStatus===1||orderStatus===2" @click="cancelOrder()">取消订单</div>
    </div>
</template>

<script>
import {getRoomOrderDetail,getMeetingOrderList,delRoomOrder,delMeetingOrder,updataRoomOrder,updataMeetingOrder} from "@/lib/API/order";
import {postNewCommen,getCommentList} from "@/lib/API/comment";
// import AMap from '@/components/AMap/AMap'
import Header from '@/components/header/head-bar'
export default {
    name:'order-details',
    components:{
        Header,
    },
    data(){
        return{
            mapURL:'',
            pageName:'订单详情', //页面名称

            orderId:0,    // 订单ID
            orderType:0,  // 订单类型
            orderStatus:0,// 订单状态

            detailsBox:{},// 会议室费用详情
            markBox:{},   // 订单评分输入框
            AMapBox:{},   // 地图框
            mapLock:true,
            loadingMapLock:true,
            upDataMark:0,       // 用户提交的分数
            upDataMarkText:'',  // 用户提交的评语
            TypeText:['【酒店】','【民宿】','【酒店会议室】','【其他会议室】'],
            userId:'',
            order:{},
            promptMessage:'此酒店没有位置信息'
        }
    },
    created(){
      this.orderId =this.$route.query.orderId
      if(this.$route.query.orderType){
        this.orderType=this.$route.query.orderType
      }
      let rp = this.$route.params
      this.orderItem = rp.orderItem
      if(this.orderItem&&this.orderItem.room[0].contactPhone1){
        console.log('酒店电话');
        this.hotelPhone = this.orderItem.room[0].contactPhone1
      }
      // if(this.$route.query.updata&& this.$route.query.updata==true){
      //   console.log(11);
      //   // this.getRoomOrderDetail({id:this.orderId})
      // }
      this.getRoomOrderDetail({id:this.orderId})
    },
    mounted(){
      this.detailsBox = document.getElementsByClassName('price-details-box')[0];
      this.markBox = document.getElementsByClassName('mark-box');
    },
    activated(){
      if(this.orderId!=this.$route.query.orderId){
        this.orderId = this.$route.query.orderId
        if(this.$route.query.orderType){
          this.orderType=this.$route.query.orderType
          this.getRoomOrderDetail({id:this.orderId})
        }
        this.getRoomOrderDetail({id:this.orderId})
      }
    },
    methods:{
      //监听设备更新
      listenerBeacons(){
        let that= this
        plus.ibeacon.startBeaconDiscovery({
          success:function(){
            plus.ibeacon.onBeaconUpdate(function(e){
              var beacons = e.beacons;
              var uuids = null;
              for(var i in beacons){
                if(uuids){
                  uuids += ', '+beacons[i].uuid;
                }else{
                  uuids = beacons[i].uuid;
                }
              }
              plus.nativeUI.alert('Beacons updated: '+uuids);
            });
          },
          failed: function(e){
            // that.startBeaconDiscovery()
            plus.nativeUI.alert('start error: '+JSON.stringify(e));
          }
        });
      },
      //打开蓝牙
      openBluetoothAdapter(){
        plus.bluetooth.openBluetoothAdapter({
          success:(e)=>{
            this.titleNViewWebview()
            // console.log('open success: '+JSON.stringify(e));
          },
          fail:(e)=>{
            // console.log('open failed: '+JSON.stringify(e));
            console.log('已打开蓝牙');
            this.startBeaconDiscovery()
          }
        });
      },
      startBeaconDiscovery(){
        let that= this
        plus.ibeacon.startBeaconDiscovery({
          success:function(){
            // plus.nativeUI.alert('start success');
            that.titleNViewWebview()
          },
          fail:function(e){
            console.log('start error: '+JSON.stringify(e))
            // that.titleNViewWebview()
            // plus.nativeUI.alert('start error: '+JSON.stringify(e));
            // that.titleNViewWebview()
          }
        });
      },
      plusReady(){
        // plus.webview.show(w); // 显示窗口
        plus.webview.open('https://location.seeklane.com/seeklane/mb/index.html?appCode=zdsyl','室内导航')
      },
      titleNViewWebview() {
        var webview = null;
        webview = plus.webview.create('https://location.seeklane.com/seeklane/mb/index.html?appCode=zdsyl', '室内导航',
          {'titleNView':{style:'transparent',backgroundColor:'#FFFFFF','titleText':'室内定位','titleColor':'#000000',
              autoBackButton:true, 'backButtonAutoControl':'close'
            }})
        webview.addEventListener('close', function(){
          webview=null;
        });
        webview.addEventListener('titleUpdate', function(){
          webview.show();
        });
      },
        // 去付款
        goPay(){
          let roomData = {
            roomType:this.order.name,
            bedScale:this.order.bedScale,
            cancelPrice:this.order.price,
            image1:this.order.imgLogo,
          }
          this.days = this.DateDiff(this.order.endTime,this.order.startTime)
          this.$router.push({path:'/pay',
              query:{days:this.days,orderId:this.orderId,totalPrice:this.order.totalPrice,
              roomData:roomData,startDouble:this.order.startTime,endDouble:this.order.endTime,orderType:this.orderType}
          })
        },
        // 获取订单详情
        async getRoomOrderDetail(params){
            let res = await getRoomOrderDetail(params)
            if(res.code===200){
                let datas = res.data
                this.order = datas
                this.order.evaluation = this.$route.query.evaluation
                this.orderStatus = datas.status
                this.order.imgLogo = datas.hotel.image1
                this.order.name = datas.room.roomType
                this.order.bedScale = datas.room.bedScale
                // this.order.describe = datas.room.otherInfo
                this.order.price = datas.room.cancelPrice
                this.order.totalPrice = datas.totalPrice
                this.order.userName = datas.linkman;
                this.order.userPhone = datas.phone;
                this.order.startTime = datas.startTime.slice(0,10)
                this.order.endTime = datas.endTime.slice(0,10)
                this.order.orderTime = datas.addTime.slice(0,10)
                this.order.hotelName = datas.hotel.name
                this.order.hotelAddress = datas.hotel.address
                let orderNum = datas.addTime.split(' ')[0].split('-').join('');
                for(let i=0;i<(11-(this.orderId+'').length);i++){
                  orderNum+=0;
                }
                this.order.orderNum = orderNum+this.orderId;
                // this.$refs.map.position = [datas.hotel.longitude,datas.hotel.latitude];
                if(this.order.hotel.latitude){
                    this.mapURL = '#/amap/'+this.order.hotel.longitude+'|'+this.order.hotel.latitude;
                }
                if(datas.hotel.managerUsername){
                    this.landlordData = {
                        id:datas.hotel.managerId,
                        logoUrl:datas.hotel.managerAvatat,
                        name:datas.hotel.managerUsername
                    }
                }
                console.log(this.order)
            }
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
        // 用户提交评价
        async postComment(){
            console.log(localStorage.getItem('MicroHotelUserData').split(',')[0],this.orderId,this.upDataMarkText,this.upDataMark,this.orderType)
            let res = await postNewCommen({
                orderId: this.orderId,
                evaluateTime:(new Date)+'',
                userId:localStorage.getItem('MicroHotelUserData').split(',')[0],
                content:this.upDataMarkText,
                grade:this.upDataMark,
                flag:Number(this.orderType),
            });
            if(res.code===200){
                this.finishOrder()
            }
        },
        async finishOrder(){
            let res = await updataRoomOrder({id:this.orderId, status:4})
            if(res.code===200){
                this.$router.back()
            }
        },
        // 取消订单
        async cancelOrder(){
          let res = await updataRoomOrder({id:this.orderId, status:5})
          if(res.code===200){
            this.$toast('取消成功')
            this.$route.params.callback && this.$route.params.callback()
            setTimeout(()=>{
              this.$router.back()
            },300)
          }
        },
        // 会议室费用详情
        onClickOpenDetails(){
            this.detailsBox.style.bottom="0%";
        },
        onClickCloseDetails(){
            this.detailsBox.style.bottom="-100%";
        },
        // 评价输入框
        openMark(){
            this.markBox[0].style.height='100%';
        },
        closeMark(){
            this.markBox[0].style.height='0%';
        },
        // 点击商家地址
        getHotelLocation(){
            this.AMapBox = document.getElementById('AMap');
            if(this.order.hotel.longitude){
                if(this.mapLock){
                    this.AMapBox.style=('height: 300px;margin-bottom: 40px;');
                    this.mapLock = false;
                }else{
                    this.AMapBox.style=('');
                    this.mapLock = true;
                }
            }else{
                console.log(this.promptMessage);
                this.$toast(this.promptMessage)
            }
        },
        //  点击商家电话号码
        callHotel(){
          if(this.orderType==2){
            this.openChoice()
          }else{
            this.callPhone()
          }
        },
        // 打开、关闭选着联系房东方法
        openChoice(){
            let choiceBox = document.getElementsByClassName('choice-window')[0];
            choiceBox.style.height = '100%';
        },
        closeChoice(){
            let choiceBox = document.getElementsByClassName('choice-window')[0];
            choiceBox.style.height = '0%';
        },
        // 打电话、发送消息
        callPhone(){
            if(this.hotelPhone){
                window.location.href = 'tel:' + this.hotelPhone
            }else {
                this.$toast('无联系电话')
            }
        },
        sendMessage(){
                if(this.landlordData){
                    this.$router.push({
                    path: '/chat',
                    query: this.landlordData
                    })
                    let params = {
                    id: this.landlordData.id
                    }
                    this.$store.dispatch('clearTip', params)
                }else{
                    this.$toast('非正常房源')
                }
            },
        // 再次预订
        openHotelDetail(hotelId){
          let types = ''
          if(this.orderType===1){
            types = '酒店'
          }else{
            types = '民宿'
          }
          this.$router.push({path: 'hotel-detail',query:{hotelid:hotelId,seekType:types}})
        }
    },
}
</script>

<style lang="less" scoped>
    .details-body{
        float: left;
        min-height: 93%;
        margin-top: 90px;
        background:rgba(248,249,251,1);
      position: relative;
      .btn-home{
        position: absolute;
        right: 20px;
       bottom: 20px;
        width: 150px;
        height: 60px;
        line-height: 60px;
        color: #ffffff;
        background: #628CFD;
        border-radius: 8px;
      }
        // height: 100%;
        >.details-box{
            margin: 0 auto;
            width: 750px;
            height: 282px;
            position: relative;
            >.hotel-logo{
                display: block;
                width: 176px;
                height: 176px;
                border-radius:10px;
                background: rgba(216,216,216,1);
                position: absolute;
                top: 36px;
                left: 40px;
            }
            >h1{
                position: absolute;
                left: 236px;
                max-width: 474px;
                text-align: left;
                font-family:PingFangSC-Semibold;
            }
            >.hotel-name{
                height:50px;
                font-size:36px;
                // font-weight:500;
                color:rgba(51,51,51,1);
                line-height:50px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                top: 36px;
                font-family:PingFangSC-Semibold;
            }
            >.hotel-describe{
                height: 68px;
                font-size: 24px;
                font-weight: 400;
                color:rgba(51,51,51,1);
                line-height:34px;
                top: 88px;
                display: -webkit-box;
                overflow: hidden;
                text-overflow: ellipsis;
                word-break: break-all;
                -webkit-box-orient: vertical;
                -webkit-line-clamp:2;
                font-family:PingFangSC-Semibold;
            }
            >.hotel-date{
                height: 34px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                font-size:24px;
                font-weight:400;
                color:rgba(51,51,51,1);
                line-height:34px;
                top: 160px;
                font-family:PingFangSC-Semibold;
            }
            >.hotel-price{
                height: 44px;
                top: 198px;
                >p{
                    float: left;
                    margin: 0 10px;
                    font-family:PingFangSC-Semibold;
                }
                >p:nth-of-type(1){
                    font-size: 32px;
                    color: #D92F2F;
                    font-weight:600;
                    line-height:44px;
                    margin-left: 0;
                }
                >p:nth-of-type(2){
                    font-size:24px;
                    font-weight:400;
                    color:rgba(181,181,181,1);
                    line-height:44px;
                }
            }
            >.office-price{
                height: 44px;
                top: 198px;
                >p{
                    float: left;
                    margin: 0 4px;
                    font-family:PingFangSC-Semibold;
                }
                >p:nth-of-type(1){
                    font-size: 32px;
                    color: #333333;
                    font-weight:600;
                    line-height:44px;
                    margin-left: 0;
                }
                >p:nth-of-type(2){
                    font-size:24px;
                    font-weight:400;
                    color:#666666;
                    line-height:44px;
                }
            }
        }
        >.office-price-details{
            width: 100%;
            height: 76px;
            background: rgba(255,255,255,1);
            position: relative;
            margin-bottom: 30px;
            >p{
                font-size: 28px;
                height: 76px;
                line-height: 76px;
                position: absolute;
                top:0px;
                font-family:PingFangSC-Semibold;
            }
            >p:nth-of-type(1){
                font-weight:400;
                color:rgba(102,102,102,1);
                left: 40px;
            }
            >p:nth-of-type(2){
                font-size: 32px;
                color: #D92F2F;
                left: 232px;
            }
            >p:nth-of-type(3){
                color: #628CFD;
                right: 84px;
            }
            >i{
                width: 20px;
                height: 20px;
                border: 2px solid #628CFD;
                border-left: 0;
                border-bottom: 0;
                transform: rotate(45deg);
                position: absolute;
                top: 27px;
                right: 40px;
            }
            >.price-details-box{
                position: fixed;
                left: 0;
                bottom: -100%;
                width: 100%;
                height: 100%;
                background: rgba(10,10,10,0.45);
                transition: all .5s;
                overflow: hidden;
                z-index: 90;
                >.close-box{
                    width: 100%;
                    height: 60%;
                    background: transparent;
                }
                >.office-price-details-box{
                    width: 100%;
                    height: 40%;
                    background:rgba(255,255,255,1);
                    border-radius:20px 20px 0px 0px;
                    overflow: scroll;
                    >div{
                        display: flex;
                        justify-content: space-between;
                        width: 90%;
                        margin: 0 auto;
                        color: #888888;
                        font-size: 28px;
                        margin-top: 30px;
                        h2{
                            font-weight:400;
                            font-family:PingFangSC-Semibold;
                        }
                    }
                    >.office-total-prices{
                        width: 100%;
                        height: 90px;
                        border-bottom: 2px solid #D4D4D4;
                        >h2{
                            height: 90px;
                            padding: 0 40px;
                            font-size: 28px;
                            font-weight:400;
                            color:rgba(51,51,51,1);
                            line-height: 90px;
                            font-family:PingFangSC-Semibold;
                        }
                    }
                    >div:nth-of-type(2){
                        width: 90%;
                        height: 40px;
                        margin: 0 auto;
                        margin-top: 30px;
                        >h2{
                            font-size: 28px;
                            font-weight:400;
                            color:rgba(72,72,72,1);
                            line-height:40px;
                            font-family:PingFangSC-Semibold;
                        }
                    }
                    >i{
                        display: block;
                        width: 90%;
                        height: 4px;
                        margin: 0 auto;
                        margin-top: 30px;
                        background: #D4D4D4;
                    }
                    >p{
                        width: 90%;
                        height: 40px;
                        font-size:28px;
                        font-weight:400;
                        color:rgba(72,72,72,1);
                        line-height:40px;
                        text-align: left;
                        margin: 0 auto;
                        margin-top: 30px;
                        font-family:PingFangSC-Semibold;
                    }
                }
            }
        }
        >.order-stayus{
            width: 89.33%;
            height: 90px;
            margin: 0 auto;
            margin-bottom: 28px;
            background:rgba(255,255,255,1);
            border-radius:6px;
            font-size:32px;
            font-weight:600;
            color:rgba(98,140,253,1);
            line-height:90px;
            font-family:PingFangSC-Semibold;
        }
        >.office-manage{
            width: 89.33%;
            height: 90px;
            margin: 0 auto;
            margin-bottom: 30px;
            background:rgba(255,255,255,1);
            border-radius:6px;
            font-size: 32px;
            font-weight: 600;
            color:rgba(1,68,187,1);
            line-height:90px;
            font-family:PingFangSC-Semibold;
            >span{
                >img{
                    float: left;
                    margin-top: 24px;
                    margin-left: 0;
                    display: block;
                    width: 54px;
                    height: 36px;
                }
                width: 212px;
                margin: 0 auto;
                display: block;
            }
        }
        >.order-mark{
            width: 100%;
            height: 92px;
            background:rgba(255,255,255,1);
            margin-bottom: 32px;
            >div{
                width: 750px;
                height: 92px;
                margin: 0 auto;
                >.ivu-rate{
                    float: left;
                    margin-left: 44px;
                }
                >p{
                    height: 92px;
                    line-height: 92px;
                    font-size: 32px;
                    font-weight: 600;
                    float: right;
                    margin-right: 44px;
                    font-family:PingFangSC-Semibold;
                }
            }
            >.mark-box{
                overflow: hidden;
                position: fixed;
                width: 100%;
                height: 0%;
                top: 0;
                left: 0;
                background: rgba(10,10,10,0.45);
                transition: all .5s;
                z-index: 10;
                >div{
                    width: 95%;
                    max-width: 888px;
                    height: 480px;
                    background: rgba(255,255,255,1);
                    position: relative;
                    top: 50%;
                    margin: 0 auto;
                    margin-top: -165px;
                    border-radius:10px;
                    >p{
                        font-size: 32px;
                        font-weight:600;
                        font-family:PingFangSC-Semibold;
                    }
                    >.ivu-input-wrapper{
                        width: 90%;
                        height: 180px;
                        border: 3px solid #D4D4D4;
                        margin: 20px auto;
                        border-radius: 20px;
                        overflow: scroll;
                    }
                    >button{
                        margin: 0 10%;
                        float: left;
                        display: block;
                        width: 30%;
                        height: 90px;
                        outline-style: none;
                        border-radius: 10px;
                        background: #ffffff;
                        color: #628CFD;
                        font-family:PingFangSC-Semibold;
                    }
                    >button:nth-of-type(1){
                        border: 2px solid #628CFD;
                    }
                    >button:nth-of-type(2){
                        border: 2px solid #628CFD;
                    }
                }
            }
        }
        >.again-buy{
            width: 89.33%;
            height: 90px;
            font-size: 32px;
            line-height: 90px;
            color: #628CFD;
            margin: 0 auto;
            margin-bottom: 42px;
            background: #ffffff;
            border-radius:6px;
            font-weight:600;
        }
        >.user-order-details{
            width: 100%;
            height: 330px;
            margin-bottom: 40px;
            background: #ffffff;
            position: relative;
            >i{
                display: block;
                width: 100%;
                height: 2px;
                background: #D4D4D4;
                position: absolute;
                top: 90px;
                left: 0;
            }
            >div{
                width: 100%;
                max-width: 888px;
                height: 330px;
                margin: 0 auto;
                position: relative;
                >h1{
                    width:144px;
                    height:50px;
                    font-size:36px;
                    font-weight:400;
                    color:rgba(51,51,51,1);
                    line-height:50px;
                    position: absolute;
                    left: 5.33%;
                    top: 20px;
                }
                >ul{
                    width: 100%;
                    height: 214px;
                    padding: 18px 0px;
                    position: absolute;
                    left: 0;
                    top: 92px;
                    >li{
                        color:rgba(102,102,102,1);
                        font-size:28px;
                        line-height:40px;
                        font-weight:400;
                        width: 100%;
                        height: 40px;
                        margin: 12px 0;
                        text-align: left;
                        >p{
                            margin-left: 40px;
                            display: inline-block;
                            width: 164px;
                            height: 40px;
                            font-size:28px;
                        }
                    }
                }
            }
        }
        >.hotel-details{
            width: 100%;
            height: 238px;
            background: #ffffff;
            position: relative;
            margin-bottom: 40px;
            >i{
                display: block;
                width: 100%;
                height: 2px;
                position: absolute;
                top: 90px;
                left: 0;
                background: #D4D4D4;
            }
            >div{
                width: 100%;
                max-width: 888px;
                height: 238px;
                margin: 0 auto;
                position: relative;
                >h1{
                    width:144px;
                    height:50px;
                    font-size:36px;
                    font-family:PingFangSC-Regular;
                    font-weight:400;
                    color:rgba(51,51,51,1);
                    line-height:50px;
                    position: absolute;
                    top: 20px;
                    left: 5.33%;
                }
                >h2{
                    width: 76.54%;
                    height: 40px;
                    font-size:28px;
                    font-weight:500;
                    color:rgba(102,102,102,1);
                    line-height:40px;
                    text-align: left;
                    position: absolute;
                    top: 114px;
                    left: 5.33%;
                    white-space: normal;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                >h3{
                    width: 76.54%;
                    height: 40px;
                    position: absolute;
                    top: 170px;
                    left: 5.33%;
                    font-size:24px;
                    color:rgba(163,163,163,1);
                    line-height:40px;
                    text-align: left;
                    white-space: normal;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    >img{
                        width: 28px;
                        height: 32px;
                        margin-right: 16px;
                    }
                }
                >div{
                    width: 134px;
                    height: 56px;
                    border-left: 2px solid #D4D4D4;
                    background: #ffffff url('../../../assets/img/phone.png') no-repeat center center;
                    background-size: contain;
                    position: absolute;
                    right: 0;
                    top: 136px;
                }
                >.choice-window{
                    width: 100%;
                    height: 0%;
                    background: rgba(0, 0, 0, 0.5);
                    position: fixed;
                    top: 0;
                    left: 0;
                    z-index: 100;
                    transition: all .5s;
                    overflow: hidden;
                    >.choice-box{
                        width: 600px;
                        height: 130px;
                        background: #ffffff;
                        border-radius: 10px;
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        margin-left: -300px;
                        >.message{
                            width: 50%;
                            height: 100%;
                            float: left;
                            border-right: 1px solid  rgba(102,102,102,1);
                        }
                        >.phone{
                            width: 50%;
                            height: 100%;
                            float: left;
                            border-left: 1px solid  rgba(102,102,102,1);
                        }
                        >div{
                            img{
                                width: 50px;
                                height: 50px;
                                display: block;
                                float: left;
                                margin: 40px 30px 0 50px;
                            }
                            >h4{
                                float: left;
                                font-size: 30px;
                                margin-top: 40px;
                            }
                        }
                    }
                }
            }
        }
        >.cancel-order{
            width: 670px;
            height: 90px;
            font-size: 32px;
            font-weight:400;
            color:rgba(120,120,120,1);
            line-height:90px;
            margin: 0 auto;
            border-bottom: 56px solid rgba(248,249,251,1);
            background: #ffffff;
            box-sizing: content-box;
        }
        #AMap{
            height: 0px;
            margin-bottom: 0px;
            overflow: hidden;
            transition: all .5s;
            >iframe{
                width: 100%;
                height: 100%;
            }
        }
    }
</style>
<style scoped>
.ivu-rate >>> .ivu-rate-star{
    font-size: 46px;
    line-height: 92px;
}
.ivu-rate >>> .ivu-rate-star-full:before{
    color: #626BFD;
}
.ivu-input-wrapper >>> .ivu-input{
    width: 97%;
    height: 100%;
    border: 0;
    outline-style: none;
}
</style>
