<template>
  <div class="main">
    <div class="bar" :class="{fixed:isFixed===true}">
      <span @click="$router.back()">
        <img class="icon" src="@/assets/icon/back.png" alt="" v-if="!isFixed">
        <img class="icon" src="@/assets/icon/back-black.png" alt="" v-else>
      </span>
      <span>
        <img class="icon" src="@/assets/icon/share-black.png" alt="" v-if="isFixed">
        <img class="icon" src="@/assets/icon/share.png" alt="" v-else>
        <template v-if="isFixed">
          <img class="icon" src="@/assets/icon/star2.png" alt="" v-if="isCollect" @click="collectHotel">
          <img class="icon" src="@/assets/icon/star-black.png" alt="" v-else @click="collectHotel">
        </template>
        <template v-else>
          <img class="icon" src="@/assets/icon/star2.png" alt="" v-if="isCollect" @click="collectHotel">
          <img class="icon" src="@/assets/icon/star.png" alt="" v-else @click="collectHotel">
        </template>
      </span>
    </div>
    <div class="banner">
      <swiper class="items" :options="swiperOption" ref="mySwiper">
        <!-- slides -->
        <swiper-slide class="item" v-for="item in hotelImgList" :key="item.index">
          <img :src="item" alt="">
        </swiper-slide>
      </swiper>
      <div class="swiper-pagination" ></div>
    </div>
<!--    <h1 @click="plusReady">打开</h1>-->
<!--    <h1 @click="titleNViewWebview">打开222</h1>-->
    <div class="infor">
      <div class="norms">{{hotelData.name}}</div>
      <div style="display: flex">
        <span class="address">{{hotelData.address}}</span>
        <img class="haed-img" :src="logoUrl" alt="" @click="openMessage()">
      </div>
      <ul class="tips">
        <li class="tip" :class="{blue:item.grade||item.grade===0}" v-for="item in tipsList">
          <span v-if="item.grade||item.grade===0">{{item.grade}}分·  {{item.evaluationNum}}条评论</span>
          {{item.name}}
        </li>
      </ul>
      <!--<ul class="room-infor">-->
         <!--<li v-for="i in 4">-->
           <!--<img src="@/assets/icon/yongchi.png" alt="">-->
           <!--<span class="title">一张床</span>-->
         <!--</li>-->
      <!--</ul>-->
      <div class="detail card">
        <h1>详情</h1>
        <div class="desc">{{kindDescription?kindDescription:'暂无详细'}}</div>
        <!--<p class="more">查看此房源的详情</p>-->
      </div>
      <ul class="icons" v-if="facSerData.length">
        <li class="icon" v-for="item in facSerData">
          <img :src="item.icon" alt="" >
          <p>{{item.name}}</p>
        </li>
      </ul>
      <div class="room-list">
        <h1>房间类型</h1>
        <p v-if="!roomList.length">暂无房间类型，不可预订</p>
        <div v-else class="item" v-for="item in roomList">
          <img :src="item.image1" alt=""  @click="openRoomDetal(item)">
          <div style="position: relative;padding:0 0 12px 10px">
            <p class="room-desc">
              <span>{{item.roomType}}</span>
              <span>{{item.bedScale}} · {{item.floor}}</span>
            </p>
            <p class="price">￥{{item.cancelPrice}}</p>
            <Button class="btn no-room" v-if="item.count===0">满房</Button>
            <Button class="btn" v-else @click.stop="showDateBox(item)">预订</Button>
          </div>
        </div>
      </div>
      <div class="evaluate card">
        <h1>评价</h1>
        <div class="item" v-for="item in hotelEvaList">
          <div class="base-infor" >
            <img  :src="item.avatar" alt="">
            <div>
              <p class="name">{{item.username}}</p>
              <p class="time">{{item.evaluateTime}}</p>
            </div>
          </div>
          <div class="desc">{{item.content}}</div>
          <span class="star">
             <Rate disabled v-model="item.grade"/>
            </span>
        </div>
        <p class="more">
          <span v-if="total" @click="openAllEval">阅读全部{{total}}条评价</span>
          <span v-else>暂无评价</span>
        </p>
      </div>
      <div class="trip card">
        <h1>出行</h1>
        <div class="tirp-tip">
          <p>请导航至“{{hotelData.address}}”</p>
          <!--<p>打车请告知地址为锦苑国际公寓。</p>-->
        </div>
        <div class="tirp-content">
          <!-- <AMap v-if="hotelData.latitude" ref="AMap"> </AMap> -->
          <iframe v-if="hotelData.latitude" :src="mapURL" frameborder="0" ></iframe>
          <img v-else src="@/assets/img/map.png" alt="" @click="$toast('该酒店尚未提供地图地位')">
          <!-- <div @click="openAMap"></div> -->
        </div>
        <p class="mark" @click="isBus=true">
          <img src="@/assets/img/taxi.png" alt="">
          约车出行
        </p>
      </div>
      <div v-if="rulesData.length" class="rules">
        <h1>酒店政策</h1>
        <div v-for="(item,index) in rulesData" :key="index">
          <h3>{{item.rulesType.name}}:</h3>
          <span>{{item.content}}</span>
        </div>
      </div>
    </div>
    <date ref="date" :showCalendar.sync='showdateDouble' maxDate="3m" :roomId="hotelid" :options="dateOptionsDouble" @changeDate="changeDateDouble"></date>
    <div v-if="isBus" class="bus-wrap">
      <div class="close-btn" @click="backApp">返回</div>
      <iframe class="bus-content" src="https://common.diditaxi.com.cn/general/webEntry?wx=true&bizid=257&channel=70365" width="100%" height="100%" frameborder="0" scrolling="no"></iframe>
    </div>
  </div>
</template>

<script>
  import {getHotelDetail,getRoomList,getlistLabels,getHomeListLabels,getHomeStarDetail} from "@/lib/API/hotel";
  import {addCollect,delCollect,getEvaluationsList,getEvalListByHome,userCollection} from "@/lib/API/comment";
  import date from "@/components/datepicker/datePicker"
  import AMap from '@/components/AMap/AMap'
  import { MessageBox  } from 'mint-ui'

  export default {
    components:{
      date,
      AMap
    },
    props: {
      title: String // 标题
    },
    data() {
      return {
        isBus:false,
        map:null,
        // position:[22,111],
        hotelType:'',
        mapURL:'',
        grade:5,
        logoUrl:'',
        rulesData:{},//酒店政策
        hotelData:{},//酒店详情
        hotelImgList:[], //酒店图片
        kindDescription:'暂无描述......',//酒店描述
        hotelName:null,
        hotelAddress:null,
        hotelId:null, //酒店ID
        hotelEvaList:[], // 酒店所有评论
        total:null, // 酒店所有评论总数
        facSerData:[], //酒店配套设施
        roomList:[], //房间列表
        isFixed:false,
        isCollect:false,
        showDate:false,//日期选择器
        tipsList: [
          {
            evaluationNum: '55',
            grade:'4.9',
          },
        ],
        swiperOption: {
          notNextTick: true,
          pagination: '.swiper-pagination',
          slidesPerView: 'auto',
          centeredSlides: true,
          paginationClickable: true,
          spaceBetween: 30,
        },
        showdateDouble: false,
        startDouble: "",
        endDouble: "",
        dateOptionsDouble: {
          // scrollEnd: true, // 滚到最后
          maxDate: "3m", // 月份跨度
          isDoubleCheck: true,
          startDate: this.formatDate(new Date().getTime()),
          endDate: this.formatDate(new Date().getTime()+24*3600*1000)
        },
        mapIf:false, //判断是否有酒店经纬
      }
    },
    created(){
      this.seekType = this.$route.query.seekType //酒店还是民宿
      this.userID = localStorage.getItem('MicroHotelUserData')
      if(this.userID){
        this.userID=this.userID.split(',')[0];
      }
      this.hotelid = Number(this.$route.query.hotelid)
      this.getHotelDetail(this.hotelid)
      this.getEvaluationsList(this.hotelid)
      this.userCollection({itemId:this.hotelid, userId:this.userID, flag:1})
    },
    mounted () {
      window.addEventListener('scroll', this.handleScroll);
    },
    // updated(){this.pustAMapPosition()},
    destroyed () {
      window.removeEventListener('scroll', this.handleScroll)
    },
    methods: {
      plusReady(){
        console.log(666666);
        // 在这里调用plus api
        // var w = plus.webview.create('https://test.seeklane.com/seeklane/dlrc/sf3/index.html','室内导航');
        // plus.webview.show(w); // 显示窗口
        plus.webview.open('https://test.seeklane.com/seeklane/dlrc/sf3/index.html','室内导航')
      },
      titleNViewWebview() {
        var webview = null;
        webview = plus.webview.create('https://test.seeklane.com/seeklane/dlrc/sf3/index.html', '室内导航',
          {'titleNView':{style:'transparent',backgroundColor:'#FFFFFF','titleText':'室内导航','titleColor':'#000000',
              autoBackButton:true, 'backButtonAutoControl':'close'
              // buttons:[{text:'...',float:'right',onclick:this.clickButton()}]
            }})
        webview.addEventListener('close', function(){
          webview=null;
        });
        webview.addEventListener('titleUpdate', function(){
          webview.show();
        });
      },
      openAMap(){
        let mapURL = this.mapURL.split('#')[1]
         this.$router.push({path:mapURL})
      },
      //查看全部评价
      openAllEval(){
        this.$router.push({path:'/evaluate',query:{hotelid:this.hotelid,seekType:this.seekType}})
      },
      handleScroll () {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
        if(scrollTop > 300) {
          this.isFixed = true
        } else {
          this.isFixed = false
        }
      },
      //获取酒店详情
      async getHotelDetail(params){
        let res
        if(this.seekType=='民宿'){
          res = await getHomeStarDetail({id:params})
          if(res.data.manager){
            this.logoUrl = res.data.manager.avatar
          }else {
            this.logoUrl='http://micro-hotel.halohealth.cn/images/1561020722716.png'
          }
          this.landlordData = res.data.manager
        }else{
          res = await getHotelDetail({id:params})
          this.logoUrl = res.data.image1;
        }
        if(res.code === 200){
          this.hotelData =res.data
          this.hotelName = res.data.name
          this.hotelAddress = res.data.address
          this.facSerData = res.data.facilityServices
          this.roomList = res.data.rooms
          this.tipsList[0].grade = res.data.grade
          if(res.data.hotelRules.length){
            this.rulesData = res.data.hotelRules
            for(let i=0;i<this.rulesData.length;i++){
              this.rulesData[i].content = this.rulesData[i].content.split('&nbsp;').join(' ');
            }
            console.log(this.rulesData);
          }
          this.kindDescription = res.data.kindDescription;
          if(this.hotelData.latitude){
            this.mapIf=true
          }
          if(this.hotelData.image1){
            this.hotelImgList.push(this.hotelData.image1)
          }
          if(this.hotelData.image2){
            this.hotelImgList.push(this.hotelData.image2)
          }
          if(this.hotelData.image3){
            this.hotelImgList.push(this.hotelData.image3)
          }
          if(this.hotelData.image4){
            this.hotelImgList.push(this.hotelData.image4)
          }
          if(this.hotelData.image5){
            this.hotelImgList.push(this.hotelData.image5)
          }
          this.mapURL = '#/amap/'+this.hotelData.longitude+'|'+this.hotelData.latitude;
	        console.log(this.mapURL);
	        this.getlistLabels({id:this.hotelid})
        }
      },
      // 打开聊天窗口
      openMessage(){
        if(!this.userID){
          MessageBox.confirm('您还未登陆，现在去登陆?').then(action => {
            if(action==='confirm'){
              this.$router.push({name:'登录注册'})
            }
          }).catch(() => {
            console.log('取消');
          })
          return
        }
        if(this.landlordData){
          this.$router.push({
            path: '/chat',
            query: {
              id:this.landlordData.id,
              logoUrl:this.landlordData.avatar,
              name:this.landlordData.username
            }
          })
          let params = {
            id: this.landlordData.id
          }
          this.$store.dispatch('clearTip', params)
        }else{
          this.$toast('暂无房东信息')
        }
      },
      // 获取酒店标签
      async getlistLabels(params){
        let res
        if(this.seekType=='酒店'){
          res = await getlistLabels(params)
        }else {
          res = await getHomeListLabels(params)
        }
        if(res.code===200){
          let lists = res.data.list;
          for(let i=0;i<lists.length;i++){
            this.tipsList.push({name:lists[i].content})
          }
        }
      },
      //传酒店经纬度信息
      // pustAMapPosition(){
      //   if(this.mapIf){
      //     this.$refs.AMap.position=[this.hotelData.longitude,this.hotelData.latitude]
      //   }
      // },
      //打开房间详情
      openRoomDetal(item){
        this.$router.push({name:'room-detail',query: {roomData:item,roomid:item.id},params:{hotelSerData:this.facSerData,hotelName:this.hotelName,hotelAddress:this.hotelAddress,rules:this.rulesData}})
      },
      //选择入住离店日期
      async showDateBox(params){
        if(!this.userID){
          MessageBox.confirm('您还未登陆，现在去登陆?').then(action => {
            if(action==='confirm'){
              this.$router.push({name:'登录注册'})
            }
          }).catch(() => {
            console.log('取消');
          })
          return
        }
        this.$refs.date.roomId = params.id
        this.$refs.date.getVacantRoom()
        this.roomid = params.id
        this.roomData = params
        this.showdateDouble =true
      },
      //获取房间
      async getRoomList(params){
        let res = await getRoomList({hotelId:params})
        if(res.code === 200){
          this.roomList = res.data.list
          console.log(this.roomList);
        }
      },

      //获取酒店所有评论
      async getEvaluationsList(params){
        let res
        if(this.seekType=='民宿'){
          res = await getEvalListByHome({id:params})
        }else {
          res = await getEvaluationsList({id:params})
        }
        if(res.code === 200){
          this.tipsList[0].evaluationNum = res.data.total
          this.hotelEvaList = res.data.list.splice(0,5)
          this.total = res.data.total
        }
      },

      //查询当前酒店是否收藏
      async userCollection(params){
        let res = await userCollection(params)
        if(res.code === 200){
          if(res.data){
            this.isCollect=true
            this.delId = res.data
          }else {
            this.isCollect=false
          }
        }
      },
      //收藏
      collectHotel(){
        if(!this.userID){
          MessageBox.confirm('您还未登陆，现在去登陆?').then(action => {
            if(action==='confirm'){
              this.$router.push({name:'登录注册'})
            }
          }).catch(() => {
            console.log('取消');
          })
          return
        }
        this.isCollect = !this.isCollect
        if(this.isCollect){
          if(this.seekType=='酒店'){
            this.addCollect({collectionItemId:this.hotelid,userId:this.userID,flag:1})
          }else {
            this.addCollect({collectionItemId:this.hotelid,userId:this.userID,flag:2})
          }
        }else {
          console.log(this.delId);
          this.delCollect({id:this.delId})
        }
      },
      //加入收藏
      async addCollect(params){
        let res = await addCollect(params)
        if(res.code === 200){
          this.$toast('收藏成功')
        }else {
          this.$toast('收藏失败')
        }
      },
      //取消收藏
      async delCollect(params){
        let res = await delCollect(params)
        if(res.code === 200){
          this.$toast('取消收藏成功')
        }else {
          this.$toast('取消收藏失败')
        }
      },
      changeDateDouble(start, end) {
        this.startDouble = start;
        this.endDouble = end;
        this.$router.push({path:'/plan-detail',query:{startDate:start,endDate:end,roomData:this.roomData,rules:this.rulesData}})
      },
      formatDate(timestamp, formats) {
        formats = formats || "Y-M-D";
        var myDate = timestamp ? new Date(timestamp) : new Date();
        var year = myDate.getFullYear();
        var month = formatDigit(myDate.getMonth() + 1);
        var day = formatDigit(myDate.getDate());
        var hour = formatDigit(myDate.getHours());
        var minute = formatDigit(myDate.getMinutes());
        var second = formatDigit(myDate.getSeconds());
        return formats.replace(/Y|M|D|h|m|s/g, function(matches) {
          return {
            Y: year,
            M: month,
            D: day,
            h: hour,
            m: minute,
            s: second
          }[matches];
        });
        // 小于10补0
        function formatDigit(n) {
          return n.toString().replace(/^(\d)$/, "0$1");
        }
      },
      backApp(){
        // this.$router.back()
        this.isBus =false
      }
    }
  }
</script>

<style scoped>
  /*iview样式修改*/
  .evaluate >>> .ivu-rate-star{
    font-size: 24px;
    margin: 0 -2px;
  }
  .evaluate >>> .ivu-rate-star-full:before{
    color: #626bfd;
  }
  .evaluate >>> .ivu-rate-star-half .ivu-rate-star-content:before{
    color: #626bfd;
  }
  .evaluate .card >>> .ivu-radio-group{
    font-size: 24px;
    display: flex;
    align-items: center;
  }
  .banner >>> .swiper-pagination{
    width: 100%;
    bottom: 10px;
  }
  .banner >>> .swiper-pagination-bullet{
    width: 18px;
    height: 18px;
    margin: 0 10px;
  }
  .banner >>>  .swiper-pagination-bullet-active{
    background: #ffffff;
  }
</style>

<style lang="less" scoped>
 .main{
   padding-bottom: 126px;
   background:rgba(248,249,251,1);
   .bar{
     position: absolute;
     top: 24px;
     width: 100%;
     z-index: 9;
     padding: 0 40px;
     display: flex;
     align-items: center;
     justify-content: space-between;
     span{
       display: flex;
       justify-content: center;
       align-items: center;
     }
     span:last-child{
       img{
         margin-left: 24px;
       }
     }
   }
   .fixed{
     height:84px;
     background:rgba(248,248,248,1);
     box-shadow:0px 4px 4px 0px rgba(0,0,0,0.08);
     position: fixed;
     top:0
   }
   h1{
     height:44px;
     font-size:32px;
     font-family:PingFangSC-Medium;
     color:rgba(51,51,51,1);
     line-height:44px;
   }
   .banner{
     height:426px;
     overflow: hidden;
     position: relative;
     img{
       width: 100%;
       height:426px;
     }
   }
   .infor{
     text-align: left;
     padding: 0 40px;
     .norms{
       font-size:24px;
       font-family:PingFangSC-Semibold;
       font-weight:600;
       color:rgba(51,51,51,1);
       line-height:34px;
       margin: 28px 0 8px;
     }
     .address{
       width:572px;
       font-size:32px;
       font-family:PingFangSC-Semibold;
       font-weight:600;
       color:rgba(51,51,51,1);
       line-height:44px;
     }
     .haed-img{
       width:84px;
       height:84px;
       margin-left: 14px;
       border-radius: 50%;
     }
   }
   .tips{
     margin: 34px 0 52px;
     .tip{
       height:44px;
       line-height: 44px;
       background:rgba(236,236,236,1);
       border-radius:22px;
       font-size:24px;
       font-family:PingFangSC-Medium;
       font-weight:500;
       color:rgba(51,51,51,1);
       display: inline-block;
       padding: 0 18px;
       margin-right: 22px;
       margin-bottom: 20px;
     }
     .blue{
       background:rgba(235,240,255,1);
       color:rgba(98,140,253,1);
     }
   }
   .room-infor{
     display: flex;
     flex-wrap: wrap;
     margin-bottom: 62px;
     li{
       display: flex;
       align-items: center;
       margin:30px 100px 0 0;
     }
   }
   .card{
     .desc{
       width:666px;
       font-size:24px;
       font-family:PingFangSC-Regular;
       font-weight:400;
       color:rgba(51,51,51,1);
       line-height:34px;
       overflow: hidden;
       display: -webkit-box;
       -webkit-box-orient: vertical;
       -webkit-line-clamp: 3;
       overflow: hidden;
       margin-top: 28px;
       position: relative;
     }
     .star{
       position: absolute;
       right: 0;
       top: 0;
     }
     .more{
       font-size:24px;
       font-family:PingFangSC-Medium;
       font-weight:600;
       color:rgba(0,0,0,1);
       line-height:34px;
       margin-top: 8px;
       display: flex;
       justify-content: space-between;
     }
   }
   .icons{
     width:670px;
     border-top:solid #DADADAFF 1px; /*no*/
     border-bottom:solid #DADADAFF 1px; /*no*/
     margin: 58px 0 48px;
     padding: 42px 0 10px;
     display: flex;
     flex-wrap: wrap;
     .icon{
       display: flex;
       width: 25%;
       height: 100px;
       text-align: center;
       flex-direction: column;
       justify-content: space-between;
       align-items: center;
       margin-bottom: 30px;
       img{
         width: auto;
         height: auto;
         max-width: 56px;
         max-height: 56px;
       }
       p{
         height:34px;
         width: 100%;
         font-size:24px;
         text-align: center;
         font-family:PingFangSC-Regular;
         font-weight:400;
         color:rgba(13,1,1,1);
         line-height:34px;
         margin-top: 12px;
       }
     }
   }
   .room-list{
     margin-top: 30px;
     padding-top: 40px;
     /*border-top:solid #DADADAFF 1px; !*no*!*/
     h1{
       margin-bottom: 30px;
     }
     .item{
       margin-bottom: 40px;
       background:rgba(255,255,255,1);
       border-radius:0px 0px 16px 16px;
       .room-desc{
         font-size:28px;
         width: 500px;
         overflow:hidden;
         text-overflow:ellipsis;
         white-space: nowrap;
         font-family:PingFangSC-Regular;
         font-weight:400;
         color:rgba(51,51,51,1);
         line-height:40px;
         margin: 16px 0 2px;
         span:last-child{
           font-size:24px;
           color:rgba(136,136,136,1);
           line-height:34px;
           margin-left: 22px;
         }
       }
       img{
         width:670px;
         height:306px;
         border-radius: 8px;
         display: block;
         background-color: #cccccc;
       }
       .price{
         font-size:28px;
         font-family:PingFangSC-Regular;
         font-weight:400;
         color:rgba(217,47,47,1);
         line-height:40px;
       }
       .btn{
         width:124px;
         height:60px;
         line-height: 14px;
         border-radius:6px;
         border:3px solid rgba(98,140,253,1);
         font-size:24px;
         font-family:PingFangSC-Medium;
         font-weight:500;
         color:rgba(98,140,253,1);
         position: absolute;
         right: 20px;
         top:15px;
       }
       .no-room{
         background-color: #c7c7c7;
         border:none;
         color: #ffffff;
       }
     }
   }
   .evaluate{
     padding-bottom: 48px;
     border-bottom:solid #DADADAFF 1px; /*no*/
     margin-top: 60px;
     .item{
       position: relative;
       padding-bottom: 20px;
     }
     .base-infor{
       display: flex;
       align-items: center;
       margin: 28px 0 32px;
       img{
         width:84px;
         height:84px;
         background-color: aquamarine;
         display: block;
         margin-right: 12px;
         border-radius: 50%;
       }
       .name{
         height:34px;
         font-size:24px;
         font-family:PingFangSC-Regular;
         font-weight:400;
         color:rgba(51,51,51,1);
         line-height:34px;
       }
       .time{
         height:32px;
         font-size:22px;
         font-family:PingFangSC-Regular;
         font-weight:400;
         color:rgba(153,153,153,1);
         line-height:32px;
       }
     }
     .more{
       margin-top: 30px;
     }
   }
   .landlord{
     padding:50px 0 48px;
     .base-infor{
       display: flex;
       align-items: center;
       margin: 28px 0 32px;
       img{
         width:72px;
         height:72px;
         background-color: aquamarine;
         display: block;
         margin-right: 12px;
         border-radius: 50%;
       }
       .name{
         height:34px;
         font-size:24px;
         font-family:PingFangSC-Regular;
         font-weight:400;
         color:rgba(51,51,51,1);
         line-height:34px;
       }
       .time{
         height:28px;
         font-size:20px;
         font-family:PingFangSC-Regular;
         font-weight:400;
         color:rgba(102,102,102,1);
         line-height:28px;
       }
     }
     .content{
       width:670px;
       background:rgba(242,242,242,1);
       padding: 20px 18px;
       .tip{
         font-size:20px;
         font-family:PingFangSC-Regular;
         font-weight:400;
         color:rgba(102,102,102,1);
         line-height:28px;
       }
       p{
         display: flex;
         justify-content: space-between;
         margin-top: 28px;
         span{
           font-size:24px;
           font-family:PingFangSC-Regular;
           font-weight:400;
           color:rgba(23,23,23,1);
           line-height:34px;
         }
       }
     }
   }
   .trip{
     padding: 48px 0 30px;
     border-bottom:solid #DADADAFF 1px; /*no*/
     .tirp-tip{
       margin: 12px 0 24px;
     }
     .tirp-content{
       width:670px;
       height:324px;
       position: relative;
       >div{
         width: 100%;
         height: 324px;
         position: absolute;
         background: transparent;
         top: 0;
         left: 0;
       }
       iframe{
         width: 100%;
         height: 324px;
       }
       img{
         width: 100%;
       }
     }
     .mark{
       font-size:24px;
       font-family:PingFangSC-Medium;
       font-weight:500;
       color:rgba(51,51,51,1);
       line-height:34px;
       display: flex;
       align-items: center;
       margin-top: 28px;
       img{
         width: 34px;
         margin-right: 16px;
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
   .date-box{
     width:208px;
     height:80px;
     position: absolute;
     background:rgba(98,140,253,1);
     border-radius:8px;
     right: 40px;
     z-index: 0;
   }
   .bus-wrap{
     position: fixed;
     top:0;
     width: 100%;
     height: 100%;
     z-index: 99;
     .close-btn{
       width: 100%;
       height:90px;
       line-height:90px;
       background:rgba(245,245,245,1);
       box-shadow:0 4px 8px 0 rgba(0,0,0,0.05);
       text-align: left;
       position: absolute;
       top: 0;
       padding-left: 40px;
       font-size: 28px;
       font-weight: 600;
       z-index: 999;
     }
     .bus-content{
       position: absolute;
       width: 100%;
       height: 100%;
       left: 0;
       bottom: 0;
       padding-top: 90px;
     }
   }
   .rules{
     width: 100%;
     margin-top: 50px;
     padding-bottom: 50px;
     box-sizing: content-box;
     border-bottom:solid #DADADAFF 1px;
     >div{
       width: 100%;
       font-size: 30px;
       line-height: 50px;
       >h3{
         margin-top: 10px;
         margin-right: 10px;
         font-size: 24px;
       }
       >span{
         font-size: 20px;
       }
     }
   }
 }
</style>

