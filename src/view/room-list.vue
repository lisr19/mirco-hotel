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
        <swiper-slide class="item">
          <img :src="roomData.image1" alt="">
        </swiper-slide>
        <swiper-slide class="item">
          <img :src="roomData.image2" alt="">
        </swiper-slide>
        <swiper-slide class="item">
          <img :src="roomData.image3" alt="">
        </swiper-slide>
        <swiper-slide class="item">
          <img :src="roomData.image4" alt="">
        </swiper-slide>
        <swiper-slide class="item">
          <img :src="roomData.image5" alt="">
        </swiper-slide>
      </swiper>
      <div class="swiper-pagination" ></div>
    </div>
    <div class="infor">
      <div class="norms">{{roomData.name}}</div>
      <div style="display: flex">
        <span class="address">{{roomData.address}}</span>
        <img class="haed-img" src="@/assets/img/headimg.png" alt="">
      </div>
      <ul class="tips">
        <li class="tip" :class="{blue:item.grade}" v-for="item in tipsList">
          <span v-if="item.grade">{{item.grade}}分·  {{item.evaluationNum}}</span>
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
        <div class="desc">在这里，您能一睹广州的全貌和美丽的珠江，晚上您可和朋友们悠然坐在阳台，饱览久负盛名的珠江夜景，让双眼度个假，吹吹江风舒缓一天的疲劳。…</div>
        <p class="more">查看此房源的详情</p>
      </div>
      <ul class="icons">
        <li class="icon" v-for="item in facSerData">
          <img src="@/assets/icon/yongchi.png" alt="" >
          <p>{{item.name}}</p>
        </li>
      </ul>
      <div class="evaluate card">
        <h1>评价</h1>
        <div class="base-infor">
          <img src="@/assets/img/headimg.png" alt="">
          <div>
            <p class="name">小亮亮</p>
            <p class="time">2019年2月</p>
          </div>
        </div>
        <div class="desc">光线挺好的 交通也非常方便，房子住起来很舒服，房东哥哥人超级棒！</div>
        <p class="more">
          <span>阅读全部122条评价</span>
          <span class="star">
             <Rate disabled v-model="grade"/>
          </span>
        </p>
      </div>
      <div class="trip card">
        <h1>出行</h1>
        <div class="tirp-tip">
          <p>开车请导航至“锦苑国际公寓底下停车场”</p>
          <p>打车请告知地址为锦苑国际公寓。</p>
        </div>
        <div class="tirp-content"></div>
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
    <div class="footer">
        <span class="price">
          <em>￥{{roomData.minPrice}}</em>/晚
        </span>
      <Button class="btn" type="primary" @click="showdateDouble = true">申请预订</Button>
    </div>
    <date :showCalendar.sync='showdateDouble' maxDate="12m" :options="dateOptionsDouble" @changeDate="changeDateDouble"></date>
  </div>
</template>

<script>
  import {getHotelDetail,getRoomList} from "@/lib/API/hotel";
  import {addCollect,delCollect} from "@/lib/API/comment";
  import date from "@/components/datepicker/datePicker";

  export default {
    components:{
      date
    },
    props: {
      title: String // 标题
    },
    data() {
      return {
        grade:5,
        roomData:{},//酒店详情
        hotelId:null, //酒店ID
        facSerData:[], //酒店配套设施
        isFixed:false,
        isCollect:false,
        showDate:false,//日期选择器
        tipsList: [
          {
            evaluationNum: '55条评论',
            grade:'4.9',
          },
          {
            name: '高性价比'
          },
          {
            name: '自助入住'
          },
          {
            name: '有泳池'
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
        array:[
          {
            title:'电梯',
            iconUrl: require('@/assets/icon/yongchi.png'),
          },
          {
            title:'厨房',
            iconUrl: require('@/assets/icon/yongchi.png'),
          },
          {
            title:'WiFi',
            iconUrl: require('@/assets/icon/WIFI.png'),
          },
          {
            title:'电梯',
            iconUrl: require('@/assets/icon/yongchi.png'),
          },
          {
            title:'厨房',
            iconUrl: require('@/assets/icon/yongchi.png'),
          },
          {
            title:'WiFi',
            iconUrl: require('@/assets/icon/WIFI.png'),
          },
          {
            title:'厨房',
            iconUrl: require('@/assets/icon/yongchi.png'),
          },
          {
            title:'WiFi',
            iconUrl: require('@/assets/icon/WIFI.png'),
          },
        ],
        showdateDouble: false,
        startDouble: "",
        endDouble: "",
        dateOptionsDouble: {
          // scrollEnd: true, // 滚到最后
          maxDate: "6m", // 月份跨度
          isDoubleCheck: true,
          startDate: this.formatDate(new Date().getTime()),
          endDate: this.formatDate(new Date().getTime()+24*3600*1000)
        },
      }
    },
    created(){
      this.hotelid = this.$route.query.hotelid
      this.getHotelDetail(this.hotelid)
      // this.getRoomList()
    },
    mounted () {
      window.addEventListener('scroll', this.handleScroll);
    },
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
      //获取酒店详情
      async getHotelDetail(params){
        let res = await getHotelDetail({id:params})
        if(res.code === 200){
          this.roomData =res.data
          this.facSerData = res.data.facilityServices
        }
      },
      //获取房间
      async getRoomList(params){
        let res = await getRoomList()
        if(res.code === 200){
        }
      },
      //收藏
      collectHotel(){
        this.isCollect = !this.isCollect
        if(this.isCollect){
          // this.addCollect({collectionItemId:this.hotelid,userId:2,flag:1})
        }else {
          console.log(this.hotelid);
          this.delCollect({id:this.hotelid})
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
        this.$router.push({path:'/plan-detail',query:{startDate:start,endDate:end}})
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
   .evaluate{
     padding-bottom: 48px;
     border-bottom:solid #DADADAFF 1px; /*no*/
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
       background-color: aquamarine;
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

