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
        <swiper-slide class="item" v-for="item in hotelImgList" :key='item.index'>
          <img :src="item" alt="">
        </swiper-slide>
      </swiper>
      <div class="swiper-pagination" ></div>
    </div>
    <div class="infor">
      <div class="norms">{{hotelData.name}}</div>
      <div style="display: flex">
        <span class="address">{{hotelData.address}}</span>
        <img class="haed-img" src="@/assets/img/headimg.png" alt="">
      </div>
      <ul class="tips">
        <li class="tip" :class="{blue:item.grade}" v-for="item in tipsList">
          <span v-if="item.grade">{{item.grade}}分·  {{item.evaluationNum}}条评论</span>
          {{item.name}}
        </li>
      </ul>
      <div class="detail card">
        <h1>详情</h1>
        <div class="desc">{{kindDescription?kindDescription:'暂无详细'}}</div>
        <!--<p class="more">查看此房源的详情</p>-->
      </div>
      <ul class="icons" v-if="facSerData.length">
        <li class="icon" v-for="item in facSerData">
          <img src="@/assets/icon/yongchi.png" alt="" >
          <p>{{item.name}}</p>
        </li>
      </ul>
      <div class="room-list">
        <h1>房间类型</h1>
        <p v-if="!roomList.length">暂无房间类型，不可预订</p>
        <div v-else  class="item" v-for="item in roomList">
          <img :src="item.image1" alt=""  @click="opneRommDetail(item)">
          <div style="position: relative;padding:0 0 12px 10px">
            <p class="room-desc">
              <span>{{item.type}}</span>
              <span>{{item.bedScale}} · {{item.floor}}层</span>
            </p>
            <p class="price">￥{{item.cancelPrice}}</p>
            <Button class="btn no-room" v-if="item.count===0">满房</Button>
            <Button class="btn" v-else @click.stop="showDateBox(item)">预订</Button>
          </div>
        </div>
      </div>
      <div class="evaluate card" >
        <h1>评价</h1>
        <div class="item" v-for="item in hotelEvaList">
          <div class="base-infor" >
            <img src="@/assets/img/headimg.png" alt="">
            <div>
              <p class="name">{{item.username}}</p>
              <p class="time">{{item.evaluateTime}}</p>
            </div>
          </div>
          <div class="desc">{{item.content}}
            <span class="star">
             <Rate disabled v-model="item.grade"/>
            </span>
          </div>
        </div>
        <p class="more" style="margin-top: 30px">
          <span v-if="total">阅读全部{{total}}条评价</span>
          <span v-else>暂无评价</span>
        </p>
      </div>
      <div class="trip card">
        <h1>出行</h1>
        <div class="tirp-tip">
          <p>开车请导航至“锦苑国际公寓底下121停车场”</p>
          <p>打车请告知地址为锦苑国际公寓。</p>
        </div>
        <div class="tirp-content">
          <AMap v-if="hotelData.latitude" ref="AMap"> </AMap>
          <img v-else src="@/assets/img/map.jpg" alt="">
        </div>
        <p class="mark">
          <img src="@/assets/img/taxi.png" alt="">
          约车出行
        </p>
      </div>
      <div class="landlord card">
        <h1>房东</h1>
        <div class="base-infor">
          <img src="@/assets/img/headimg.png" alt="">
          <div>
            <p class="name">小亮亮</p>
            <p class="time">已认证·161条评论</p>
          </div>
        </div>
        <div class="content">
          <div class="tip">爱自然爱科学，乐于与世界各地的旅者共享家里的多余空间</div>
          <p>
            <span>进一步了解房东</span>
            <span>联系房东</span>
          </p>
        </div>
      </div>
    </div>
    <date :showCalendar.sync='showdateDouble' maxDate="3m" :roomId="hotelid" :options="dateOptionsDouble" @changeDate="changeDateDouble"></date>
  </div>
</template>

<script>
  import {getHomeStarDetail,getRoomList,getHomeListLabels} from "@/lib/API/hotel";
  import {addCollect,delCollect,getEvalListByHome,userCollection} from "@/lib/API/comment";
  import date from "@/components/datepicker/datePicker";
  import AMap from '@/components/AMap/AMap'

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
        grade:5,
        hotelData:{},//酒店详情
        hotelImgList:[],
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
      this.userID = localStorage.getItem('MicroHotelUserData').split(',')[0];
      this.hotelid = Number(this.$route.query.homeId)
      this.getHomeStarDetail(this.hotelid)
      this.getEvalListByHome(this.hotelid)
      this.userCollection({itemId:this.hotelid, userId:this.userID, flag:2})
    },
    mounted () {
      window.addEventListener('scroll', this.handleScroll)
    },
    updated(){this.pustAMapPosition()},
    destroyed () {
      window.removeEventListener('scroll', this.handleScroll)
    },
    methods: {
      handleScroll () {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
        if(scrollTop > 300) {
          this.isFixed = true
        } else {
          this.isFixed = false
        }
      },
      //获取民宿详情
      async getHomeStarDetail(params){
        let res = await getHomeStarDetail({id:params})
        if(res.code === 200){
          this.hotelData =res.data
          this.hotelName = res.data.name
          this.hotelAddress = res.data.address
          this.facSerData = res.data.facilityServices
          this.roomList = res.data.rooms
          this.tipsList[0].grade = res.data.grade;
          this.kindDescription = res.data.kindDescription;
          if(this.hotelData.latitude){
            this.mapIf=true;
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
          this.getHomeListLabels()
        }
      },
      //获取标签
      async getHomeListLabels(){
        let res = await getHomeListLabels({id:this.hotelid})
        if(res.code===200){
          let lists = res.data.list;
          for(let i=0;i<lists.length;i++){
            this.tipsList.push({name:lists[i].content})
          }
        }
      },
      //传酒店经纬度信息
      pustAMapPosition(){
        if(this.mapIf){
          this.$refs.AMap.position=[this.hotelData.longitude,this.hotelData.latitude]
        }
      },
      //打开房间详情
      opneRommDetail(item){
        this.$router.push({name:'room-detail',query: {roomid:item.id},params:{hotelSerData:this.facSerData,hotelName:this.hotelName,hotelAddress:this.hotelAddress}})
      },
      //选择入住离店日期
      showDateBox(params){
        this.showdateDouble =true
        this.roomData = params
        this.roomid = params.id
      },
      //获取房间
      async getRoomList(params){
        let res = await getRoomList({hotelId:params})
        if(res.code === 200){
          this.roomList = res.data.list
          console.log(this.roomList);
        }
      },

      //获取民宿所有评论
      async getEvalListByHome(params){
        let res = await getEvalListByHome({id:params})
        if(res.code === 200){
          this.tipsList[0].evaluationNum = res.data.list.length;
          this.hotelEvaList = res.data.list
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
        this.isCollect = !this.isCollect
        if(this.isCollect){
          this.addCollect({collectionItemId:this.hotelid,userId:this.userID,flag:2})
        }else {
          console.log(this.delId);
          this.delCollect({id:this.delId})
        }
      },
      //加入收藏
      async addCollect(params){
        let res = await addCollect(params)
        if(res.code === 200){
          console.log('加入收藏成功');
        }else {
          console.log('加入收藏成功');
        }
      },
      //取消收藏
      async delCollect(params){
        let res = await delCollect(params)
        if(res.code === 200){
          console.log('取消收藏成功');
        }else {
          console.log('取消收藏失败');
        }
      },
      changeDateDouble(start, end) {
        this.startDouble = start;
        this.endDouble = end;
        this.$router.push({path:'/plan-detail',query:{startDate:start,endDate:end,roomData:this.roomData}})
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
      }
    }
  }
</script>

<style scoped>
  /*iview样式修改*/
  .evaluate >>> .ivu-rate-star{
    margin: 0 -2px;
  }
  .evaluate >>> .ivu-rate-star-full:before{
    color: #626BFDFF
  }
  .evaluate >>> .ivu-rate-star-half .ivu-rate-star-content:before{
    color: #626BFDFF
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
       .star{
         position: absolute;
         right: 0;
       }
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
     h1{
       margin-bottom: 30px;
     }
     .item{
       margin-bottom: 40px;
       background:rgba(255,255,255,1);
       .room-desc{
         font-size:28px;
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
 }
</style>

