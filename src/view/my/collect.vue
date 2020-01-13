<template>
  <div class="main">
    <head-bar title="收藏"></head-bar>
    <div class="loadmore-wrapper" style="overflow: auto" :style="{ height: wrapperHeight + 'px' }">
      <mt-loadmore :top-method="loadTop" @bottom-status-change="handleBottomChange" :bottom-method="loadBottom"  :bottom-all-loaded="allLoaded" :auto-fill="false" ref="loadmore">
        <div class="collect-items">
          <ul class="classify">
            <li v-for="(item,index) in classifyList" :class="{active:index === currentStatus}" @click="tabStatus(index)">
              {{item.classify}}<span :class="{red:currentStatus === 1}"></span>
            </li>
          </ul>
          <div class="item" v-for="item in collectByhotel" v-if="currentStatus===0 &&item.hotel[0]" @click="openDetail(item.hotel[0].id)">
            <img :src="item.hotel[0].image1" alt="">
            <div class="desc">
              <p class="tip">{{item.hotel[0].name}}</p>
              <div class="name">{{item.hotel[0].address}}</div>
              <div class="price">
                <span class="discount">￥{{item.hotel[0].minPrice}}</span>
                <!--<span class="duration"> {{item.hotel[0].dura}}</span>-->
              </div>
              <div class="score">
                <Rate disabled v-model="item.hotel[0].grade"/>
                <span class="num">{{item.hotel[0].evaluationNum }}条评论</span>
              </div>
            </div>
          </div>
          <div class="item" v-for="item in collectByhome" v-if="currentStatus===1&&item.homeStay[0]" @click="openDetail(item.homeStay[0].id)">
            <img :src="item.homeStay[0].image1" alt="">
            <div class="desc">
              <p class="tip">{{item.homeStay[0].name}}</p>
              <div class="name">{{item.homeStay[0].address}}</div>
              <div class="price">
                <span class="discount">￥{{item.homeStay[0].minPrice}}</span>
                <!--<span class="duration"> {{item.hotel[0].dura}}</span>-->
              </div>
              <div class="score">
                <Rate disabled v-model="item.homeStay[0].grade"/>
                <span class="num">{{item.homeStay[0].evaluationNum }}条评论</span>
              </div>
            </div>
          </div>
          <p v-if="allLoaded===true">没有更多了</p>
        </div>
        <div slot="bottom" class="mint-loadmore-bottom">
          <span v-show="topStatus !== 'loading'" :class="{ 'rotate': topStatus === 'drop' }">上拉加载更多</span>
          <span v-show="topStatus === 'loading'">加载中...</span>
        </div>
      </mt-loadmore>
    </div>
  </div>
</template>

<script>
  import headBar from '@/components/header/head-bar'
  import {getColletList} from "@/lib/API/hotel";
  import { Loadmore,Indicator } from 'mint-ui'
  export default {
    components:{
      headBar,
    },
    data() {
      return {
        page:1,
        allLoaded:false,
        topStatus:'',
        loading:false, //数据加载中true
        wrapperHeight:0,
        collectByhotel:[],//酒店收藏列表
        collectByhome:[],// 民宿的收藏
        currentStatus:0,//当前收藏类别
        flag:1, //1为酒店，2为民宿
        classifyList:[
          {
            classify:'酒店'
          },
          {
            classify:'民宿'
          }
        ]//收藏分类
      }
    },
    created() {
      this.userID = localStorage.getItem('MicroHotelUserData').split(',')[0];
      this.getColletList()
    },
    mounted() {
      let windowWidth = document.documentElement.clientWidth;//获取屏幕宽度
      if (windowWidth >= 736) {//这里根据自己的实际情况设置容器的高度
        this.wrapperHeight = document.documentElement.clientHeight - 50;
      } else {
        this.wrapperHeight = document.documentElement.clientHeight - 30;
      }
    },
    methods: {
      //获取酒店收藏列表
      async getColletList(){
        Indicator.open('加载中...')
        let res = await getColletList({userId:this.userID,flag :this.flag,size:10,page:this.page})
        if(res.code === 200){
          Indicator.close()
          if(this.flag===1){
            if(res.data.list.length!==10){
              this.allLoaded = true
            }
            this.collectByhotel =this.collectByhotel.concat(res.data.list)
          }else if(this.flag===2){
            if(res.data.list.length!==10){
              this.allLoaded = true
            }
            this.collectByhome =this.collectByhome.concat(res.data.list)
          }
        }
      },
      //切换分类
      tabStatus(index){
        if(this.currentStatus!=index){
          this.allLoaded = false
          this.currentStatus = index
          if(this.currentStatus===0){
            this.flag=1
            this.page=1
            this.collectByhotel=[]
            this.getColletList()
          }else if(this.currentStatus===1){
            this.flag=2
            this.page=1
            this.collectByhome=[]
            this.getColletList()
          }
        }
      },
      //跳转酒店详情
      openDetail(id){
        let seekType
        if(this.currentStatus===1){
          seekType = '民宿'
        }else {
          seekType = '酒店'
        }
        this.$router.push({path: 'hotel-detail',query:{hotelid:id,seekType:seekType}})
      },
      loadTop() {
        this.page=1
        if(this.flag===1){
          this.collectByhotel=[]
        }else {
          this.collectByhome=[]
        }
        this.allLoaded = false
        this.getColletList()
        this.$refs.loadmore.onTopLoaded()
      },
      handleBottomChange(status) {
        this.topStatus = status
      },
      loadBottom() {
        if(!this.allLoaded){
          this.page++
          this.getColletList()
        }
        // this.allLoaded = true;// 若数据已全部获取完毕
        this.$refs.loadmore.onBottomLoaded()
      },
    }
  }
</script>

<style scoped>
  .main >>> .head-bar{
    position: fixed;
    top: 0;
    width: 100%;
  }
  .collect-items>>>.ivu-rate{
    display: flex;
  }
  .collect-items >>> .ivu-rate-star{
    font-size: 28px;
    margin: 0 2px;
  }
  .collect-items >>> .ivu-rate-star{
  }
  .collect-items >>> .ivu-rate-star-full:before{
    color: #626BFDFF;
  }
  .collect-items >>> .ivu-rate-star-half .ivu-rate-star-content:before{
    color: #626BFDFF;
  }
</style>
<style lang="less" scoped>
  .main {
    background:#FAFAFCFF;
    padding-bottom: 54px;
    min-height: 100%;
    .collect-items{
      padding-top: 120px;
      .classify{
        text-align: left;
        padding: 0 40px;
        font-size:32px;
        font-family:PingFangSC-Medium;
        font-weight:400;
        color:rgba(51,51,51,1);
        line-height:44px;
        margin: 34px 0 50px;
        li{
          display: inline-block;
          margin-right: 40px;
          position: relative;
          &.active{
            font-weight:600;
            span{
              width:64px;
              height:14px;
              background:linear-gradient(90deg,rgba(253,253,253,1) 0%,rgba(98,178,253,1) 100%);
              display: block;
            }
          }
          .red{
            background:linear-gradient(90deg,rgba(253,253,253,1) 0%,rgba(253,98,98,1) 100%)!important;
          }
        }
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
          .tip{
            font-size:24px;
            line-height:34px;
          }
          .name{
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
            display: flex;
            align-items: center;
            .num{
              font-size:22px;
              font-family:PingFangSC-Regular;
              font-weight:400;
              color:rgba(102,102,102,1);
              line-height:32px;
              margin-left: 10px;
            }
          }
        }
      }
    }
  }
</style>
