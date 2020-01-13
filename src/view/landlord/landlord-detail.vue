<template>
  <div class="main">
    <head-bar title=""></head-bar>
    <div class="used-infor">
      <div>
        <p class="name">{{username}}</p>
        <p class="time">于2018年5月加入</p>
      </div>
      <img  :src="avatar" alt="">
    </div>
    <div class="tips">
      <p>
        <img  src="@/assets/icon/fdrz.png" alt="">
        已认证
      </p>
      <p>
        <img  src="@/assets/icon/yellowstar.png" alt="">
        超赞房东
      </p>
    </div>
    <div class="about">
      <h1>关于</h1>
      <div class="content">
        hello～我是神奇的随我房东，一枚桂林的小可爱，现在出租的是我在某某某地方的房源哦，环境十分舒适呢，家里的每一个角落我都有细心的设计哦，希望您住的舒心…
      </div>
    </div>
    <div class="provide about">
      <h1>已提供</h1>
      <ul>
        <li v-for="item in ruleList">
          <img :src="item.iconUrl" alt="">
          {{item.name}}
        </li>
      </ul>
    </div>
    <div class="others">
      <h1>房源</h1>
      <div class="banner">
        <swiper class="img-list" :options="swiperOption" ref="mySwiper">
          <swiper-slide class="item" v-for="item in homeList" :key='item.index'>
            <img :src="item.image1" alt="">
            <div class="desc">
              <p class="name">{{item.name}}</p>
              <div class="address">{{item.address}}</div>
              <!--<div class="price">-->
                <!--<span class="discount">￥</span>-->
              <!--</div>-->
              <div class="score">
                <Rate disabled v-model="grade"/>
                <span class="num">{{item.evaluationNum}}条评论</span>
              </div>
            </div>
          </swiper-slide>
        </swiper>
      </div>
      <p>查看所有{{total}}处房源</p>
    </div>
  </div>
</template>

<script>
  import headBar from '@/components/header/head-bar'
  import {getUserDate} from "@/lib/API/login-enroll";
  import {getHomeList} from "@/lib/API/landlord";
  export default {
    components:{
      headBar
    },
    data() {
      return {
        grade:5,
        isFixed:false,
        ruleList:[
          {
            iconUrl:require('@/assets/icon/select.png'),
            name:'身份证'
          },
          {
            iconUrl:require('@/assets/icon/select.png'),
            name:'真人照片认证'
          },
          {
            iconUrl:require('@/assets/icon/select.png'),
            name:'电子邮件地址'
          },
          {
            iconUrl:require('@/assets/icon/select.png'),
            name:'手机号'
          },
        ],
        imgList:[
          {
            name:'I\'m Slide 1',
            imgurl: require('@/assets/img/hotel-img.png'),
          },
          {
            name:'I\'m Slide2 ',
            imgurl: require('@/assets/img/hotel-img.png'),
          },
          {
            name:'I\'m Slide 3',
            imgurl: require('@/assets/img/hotel-img.png'),
          },
        ],
        swiperOption: {
          slidesPerView: 1,
          spaceBetween: 10,
          centeredSlides: true,
        },
        username:null,
        homeList:[]
      }
    },
    created(){
      this.userID = localStorage.getItem('MicroHotelUserData').split(',')[0]
      this.getUserDate()
      this.getHomeList()
    },

    mounted () {
      window.addEventListener('scroll', this.handleScroll);
    },
    destroyed () {
      window.removeEventListener('scroll', this.handleScroll)
    },
    methods: {
      //获取个人信息
      async getUserDate(){
        let res = await getUserDate({id:this.userID})
        if(res.code === 200){
          this.myData = res.data.list[0]
          this.name = this.myData.name
          this.username = this.myData.username?this.myData.username:'u'+this.myData.phone
          this.email = this.myData.email
          this.phone = this.myData.phone
          this.idNumber = this.myData.idNumber
          this.emergencyContact = this.myData.emergencyContact
          this.emergencyContactPhone = this.myData.emergencyContactPhone
          this.avatar = this.myData.avatar
          if(!this.myData.avatar){
            this.avatar='http://micro-hotel.halohealth.cn/images/1561020722716.png'
          }
        }
      },
      //获取房源列表
      async getHomeList(){
        let params = {
          deleted:0,
          userId:this.userID,
          size:50
        }
        let res = await getHomeList(params)
        if(res.code === 200){
          this.homeList = res.data.list
          this.total = res.data.total
        }
      },
      handleScroll () {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
        if(scrollTop > 300) {
          this.isFixed = true
        } else {
          this.isFixed = false
        }
      },
    }
  }
</script>

<style scoped>
  /*iview样式修改*/
  .banner >>> .ivu-rate-star{
    margin: 0 -2px;
  }
  .banner >>> .ivu-rate-star-full:before{
    color: #626BFDFF
  }
  .banner >>> .ivu-rate-star-half .ivu-rate-star-content:before{
    color: #626BFDFF
  }
</style>

<style lang="less" scoped>
  .main{
    background-color: #F8F9FB;
    padding: 148px 40px 92px;
    text-align: left;
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
    .used-infor{
      display: flex;
      text-align: left;
      justify-content: space-between;
      font-size:32px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:rgba(72,72,72,1);
      .name{
        font-size:48px;
        font-family:PingFangSC-Medium;
        font-weight:500;
        color:rgba(72,72,72,1);
        line-height:66px;
        margin-bottom: 12px;
      }
      img{
        width:168px;
        height:168px;
        border-radius: 50%;
      }
    }
    .tips{
      margin: 84px 0 58px;
      border-bottom: solid 1px #D4D4D4; /*no*/
      p{
        font-size:32px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(51,51,51,1);
        line-height:44px;
        display: flex;
        align-items: center;
        margin-bottom: 64px;
        img{
           height: 50px;
          margin-right: 40px;
        }
      }
    }
    .about{
      text-align: left;
      font-size:32px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:rgba(51,51,51,1);
      line-height:44px;
      border-bottom: solid 1px #D4D4D4; /*no*/
      h1{
        font-size:40px;
        font-family:PingFangSC-Medium;
        font-weight:500;
        color:rgba(51,51,51,1);
        line-height:56px;
      }
      .content{
        margin: 80px 0 48px;
      }
    }
    .provide{
      margin: 50px 0 0px;
      ul{
        flex-wrap: wrap;
        display: flex;
        margin: 42px 0 50px;
        li{
          display: flex;
          align-items: center;
          width: 50%;
          margin-bottom: 40px;
          img{
            border-radius: 50%;
            margin-right: 24px;
          }
        }
      }
    }
    .others{
      margin-top: 50px;
      h1{
        font-size:48px;
        font-family:PingFangSC-Medium;
        font-weight:500;
        color:rgba(72,72,72,1);
        line-height:66px;
      }
      p{
        font-size:36px;
        font-family:PingFangSC-Medium;
        font-weight:500;
        color:rgba(98,140,253,1);
        line-height:50px;
      }
    }
    .img-list{
      margin-top: 56px;
      .item{
        width:580px;
        margin: 0 auto 40px;
        border-radius:20px;
        overflow: hidden;
        img{
          width: 100%;
          height:348px;
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
            font-family:PingFangSC-Semibold;
            font-weight:600;
            color:rgba(72,72,72,1);
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
              color:rgba(72,72,72,1);
              line-height:40px;
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
  }
</style>

