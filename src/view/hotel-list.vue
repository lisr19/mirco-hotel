<template>
  <div class="main">
    <div class="onclick-seek-box">
      <div class="return-but" @click="onClickBack()">
        <i></i>
      </div>
      <h1 class="open-seek-but" @click="onClickOpenSeek()">
        <template>{{seekCruxCity}} · {{currHotelType}}</template>
      </h1>
      <div class="location-but">
        <i></i>
        <span>位置</span>
      </div>
    </div>
    <div class="seek-window">
      <div class="seek-box">
        <div class="close-but" @click="onClickCloseSeek()">
          <i></i>
          <i></i>
        </div>
        <h1 class="reset-but" @click="onClickReset()">重置</h1>
        <input type="text" class="seek-text" placeholder='搜索。您要去哪？' v-model="keyWord">
        <div class="cilck-seek" @click="onClickSeek()"></div>
      </div>
      <ul class="seek-record-box">
        <h2>最近的搜索</h2>
        <li class="seek-record" v-for="(item,index) in userSeekRecordList" :key="index" @click="onClickSeekRecord(index)">
          <i></i>
          {{item}}
        </li>
      </ul>
    </div>


    <div class="hotel-items" v-if="hotelList.length" :style="{ height: wrapperHeight + 'px' }">
      <div class="type-but-window">
        <ul class="type-but-box">
          <li v-for="(item,index) in typeSelect" :class="{active:index === currType}" :key="index" @click="typeChange(item,index)">{{item}}</li>
          <li @click="openMoreSelect">更多筛选</li>
        </ul>
      </div>
      <h1 v-if="hotelList.length">超过{{total}}个房源</h1>
      <mt-loadmore :bottom-method="onClickMore"  @bottom-status-change="handleBottomChange" :bottom-all-loaded="allLoaded" ref="loadmore" >
        <div>
          <div class="item" v-for="item in hotelList" @click="openDetail(item.id)" :key="item.index">
              <img :src="item.image1" alt="">
              <div class="desc">
                <p class="name">{{item.name}}</p>
                <div class="address">{{item.address}}</div>
                <div class="price">
                  <span class="discount">￥{{item.minPrice}}</span>
                  <!--<span class="duration"> / {{item.dura}}</span>-->
                </div>
                <div class="score">
                  <Rate disabled v-model="item.grade"/>
                  <span class="num">{{item.evaluationNum }}条评论</span>
                </div>
              </div>
          </div>
          <h1 @click="onClickMore" class="more-but" v-if="hotelList.length">
            {{moreButText}}
          </h1>
          <h1 class="more-but" v-else>暂无房源数据</h1>
        </div>
        <div slot="bottom" class="mint-loadmore-bottom">
          <span v-show="topStatus !== 'loading'" :class="{ 'rotate': topStatus === 'drop' }">下拉加载更多</span>
          <span v-show="topStatus === 'loading'">加载中...</span>
        </div>
      </mt-loadmore>
    </div>
    <div class="hotel-items" v-else-if="homeStayList.length">
      <div class="item" v-for="item in homeStayList" @click="openDetail(item.id)">
        <img :src="item.image1" alt="">
        <div class="desc">
          <p class="name">{{item.name}}</p>
          <div class="address">{{item.address}}</div>
          <div class="price">
            <span class="discount">￥{{item.minPrice}}</span>
            <!--<span class="duration"> / {{item.dura}}</span>-->
          </div>
          <div class="score">
            <Rate disabled v-model="item.grade"/>
            <span class="num">{{item.evaluationNum }}条评论</span>
          </div>
        </div>
      </div>
    </div>
    <h1 class="more-but" v-else>暂无房源数据</h1>
  </div>
</template>

<script>
  import headBar from '@/components/header/head-bar'
  import {getHotelList,getHomeStayList} from "@/lib/API/hotel"
  import { Loadmore , Indicator } from 'mint-ui'
  export default {
    components:{
      headBar,
    },
    data() {
      return {
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
        page:1,
        pages:0,
        currType:-1, // 当前分类
        moreButText:'上拉加载更多',
        keyWord:null,//关键字搜索
        hotelList:[],//酒店列表
        homeStayList:[],//民宿列表
        saveUserSeekRecordListLength:15,  // 保存用户搜索内容数量
        userSeekRecordList:[],            // 用户搜索内容数据
        typeSelect:['酒店','民宿'],
        seekCruxCity: '热门',
        currHotelType: '',
        seekWindowBox:[],                 // 搜索窗口
        seekRecordBoxS:[],                // 搜索记录
        meetingData:[],
        allLoaded:false,
        topStatus:'',
        wrapperHeight:0
      }
    },
    created() {
      if(this.$route.query.more==='严选推荐'){
        this.getHotelList()
      }else if(this.$route.query.more==='猜你喜欢'){
        this.getHomeStayList()
      }else {
        this.currHotelType = this.$route.query.search
        this.ifGet()
      }
    },
    mounted(){
      this.seekWindowBox = document.getElementsByClassName('seek-window')[0];
      this.seekRecordBoxS = document.getElementsByClassName('seek-record');
      this.getUserSeekRecordList();
      let windowWidth = document.documentElement.clientWidth;//获取屏幕宽度
      if (windowWidth >= 736) {//这里根据自己的实际情况设置容器的高度
        this.wrapperHeight = document.documentElement.clientHeight - 50;
      } else {
        this.wrapperHeight = document.documentElement.clientHeight - 30;
      }
    },
    methods: {
      handleBottomChange(status) {
        this.topStatus = status;
      },
      ifGet(){
        if(this.currHotelType=='酒店'){
          if(this.$route.query.keyWord){
            this.keyWord = this.$route.query.keyWord;
            this.seekCruxCity = this.keyWord;
            console.log(isNaN(this.keyWord));
            if(isNaN(this.keyWord)){
              this.getHotelList({address:this.keyWord,page:this.page})
            }else{
              this.getHotelList({contactPhone1:this.keyWord,page:this.page})
            }
          }else {
            this.getHotelList({page:this.page})
          }
        }else if(this.currHotelType=='民宿'){
          if(this.$route.query.keyWord){
            this.keyWord = this.$route.query.keyWord;
            this.seekCruxCity = this.keyWord;
            if(isNaN(this.keyWord)){
              this.getHomeStayList({address:this.keyWord,page:this.page})
            }else{
              this.getHomeStayList({contactPhone1:this.keyWord,page:this.page})
            }
          }else {
            this.getHomeStayList({page:this.page})
          }
        }else if(this.currHotelType=='会议室'){
          this.meetingData = []
        }
      },
      onClickMore(){
        this.allLoaded = true
        if(this.page>=this.pages){
          this.moreButText='没更多房源了'
          this.$refs.loadmore.onBottomLoaded();
        }else{
          this.page++;
          this.ifGet();
        }
      },
      //获取酒店列表
      async getHotelList(params){
        Indicator.open('加载中...')
        let res = await getHotelList(params)
        if(res.code === 200){
          Indicator.close()
          for(let i=0;i<res.data.list.length;i++){
            this.hotelList.push(res.data.list[i])
          }
          this.page=res.data.pageNum
          this.pages = res.data.pages
          this.total = res.data.total
          this.currHotelType ='酒店'
          if(this.allLoaded){
            this.allLoaded = false
            this.$refs.loadmore.onBottomLoaded();
          }
        }
      },
      //获取民宿列表
      async getHomeStayList(params){
        Indicator.open('加载中...')
        let res = await getHomeStayList(params)
        if(res.code === 200){
          Indicator.close()
         for(let i=0;i<res.data.list.length;i++){
            this.hotelList.push(res.data.list[i])
          }
          this.page=res.data.pageNum
          this.pages = res.data.pages
          this.total = res.data.total
          this.currHotelType ='民宿'
          if(this.allLoaded){
            this.allLoaded = false
            this.$refs.loadmore.onBottomLoaded();
          }
        }
      },
      //跳转酒店详情
      openDetail(id){
        this.$router.push({path: 'hotel-detail',query:{hotelid:id,seekType:this.currHotelType}})
      },
      //跳转民宿详情
      openHomeDetail(id){
        this.$router.push({path: 'home-detail',query:{homeId:id}})
      },
      //分类搜索
      typeChange(item,index){
        this.currType = index
        if(item==='酒店'){
          this.homeStayList=[]
          this.hotelList= []
          this.getHotelList()
        }else {
          this.homeStayList=[]
          this.hotelList= []
          this.getHomeStayList()
        }
      },
      //更多筛选
      openMoreSelect(){
        this.$router.push({name:'更多筛选'})
      },
      onClickBack(){
        this.$router.back();
      },
      onClickOpenSeek(){
        this.seekWindowBox.style=('height: 100%;')
      },
      onClickCloseSeek(){
        this.seekWindowBox.style=('height: 0%;')
      },
      // 点击重置
      onClickReset(){
        this.keyWord='';
      },
      // 点击搜索
      onClickSeek(){
        this.hotelList=[];
        this.getHotelList({address:this.keyWord})
        this.onClickCloseSeek();
        this.userSeekRecord();
      },
      // 点击记录
      onClickSeekRecord(index){
        this.keyWord = this.userSeekRecordList[index];
      },
      // 获取用户搜索记录
      getUserSeekRecordList(){
        this.userSeekRecordList = localStorage.getItem('mircoHotelSeekRecord');
        if(this.userSeekRecordList){
          this.userSeekRecordList = this.userSeekRecordList.split(",");
          if(!this.userSeekRecordList[1]){
            let thisLength = this.userSeekRecordList.length;
            this.userSeekRecordList = this.userSeekRecordList.slice(0,thisLength-1);
          }
          this.userSeekRecordList = this.userSeekRecordList.reverse();
        }
      },
      // 添加搜索记录
      userSeekRecord(){
        if(this.keyWord){
          if(this.userSeekRecordList){
            this.userSeekRecordList = this.userSeekRecordList.reverse();
            for(let i=0;i<this.userSeekRecordList.length;i++){
              if(this.keyWord == this.userSeekRecordList[i]){
                if(i==0){
                  if(!this.userSeekRecordList[i+1]){
                    this.userSeekRecordList=[''];
                  }else{
                    this.userSeekRecordList.splice(0,1);
                  }
                }else{
                  this.userSeekRecordList.splice(i,1);
                }
              }
            }
            if(this.userSeekRecordList.length>=this.saveUserSeekRecordListLength){
              this.userSeekRecordList.splice(0,1);
              this.userSeekRecordList.push(this.keyWord);
            }else{
              this.userSeekRecordList.push(this.keyWord);
              if(!this.userSeekRecordList[0])this.userSeekRecordList = this.userSeekRecordList.reverse();
            }
            localStorage.setItem('mircoHotelSeekRecord',[this.userSeekRecordList]);
          }else{
            localStorage.setItem('mircoHotelSeekRecord',[this.keyWord+',']);
          }
        }
        this.getUserSeekRecordList();
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
  .hotel-items>>>.ivu-rate{
    display: flex;
  }
  .hotel-items >>> .ivu-rate-star{
    font-size: 28px;
    margin: 0 2px;
  }
  .hotel-items >>> .ivu-rate-star-full:before{
    color: #626bfd;
  }
  .hotel-items >>> .ivu-rate-star-half .ivu-rate-star-content:before{
    color: #626bfd;
  }
  .bar >>> .ivu-icon{
    font-size: 58px;
    color: #333333FF;
    margin-left: -20px;
  }
</style>
<style lang="less" scoped>
  .main {
    background:#FAFAFCFF;
    height: 100%;
    position: relative;
    .onclick-seek-box{
      width: 90%;
      height: 76px;
      position: fixed;
      top: 36px;
      left: 50%;
      margin-left: -45%;
      box-shadow:0px 4px 8px 0px rgba(0,0,0,0.05);
      background:rgba(255,255,255,1);
      border-radius:8px;
      z-index: 5;
      >.return-but{
        width: 15%;
        height: 100%;
        float: left;
        position: relative;
        i{
          display: block;
          width: 30px;
          height: 30px;
          border: 5px solid #666666;
          border-right: 0;
          border-top: 0;
          transform: rotate(45deg);
          position: absolute;
          top: 50%;
          left: 50%;
          margin-top: -15px;
          margin-left: -15px;
        }
      }
      >.open-seek-but{
        float: left;
        width: 60%;
        height: 100%;
        font-size:28px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(102,102,102,1);
        line-height:76px;
        text-align: left;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      >.location-but{
        float: right;
        width: 25%;
        height: 100%;
        font-size:28px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(102,102,102,1);
        line-height:76px;
        text-align: left;
        >i{
          float: left;
          width: 35px;
          height: 76px;
          display: block;
          background: transparent url(../assets/icon/gps-icon.png) no-repeat center center;
          background-size: contain;
        }
        >span{
          float: left;
          display: block;
          padding-left: 20px;
          font-size:28px;
          font-family:PingFangSC-Regular;
          font-weight:400;
          color:rgba(102,102,102,1);
          line-height:76px;
        }
      }
    }
    .seek-window{
      width: 100%;
      height: 0%;
      position: fixed;
      top: 0;
      left: 0;
      background:rgba(248,249,251,1);
      z-index: 10;
      overflow: hidden;
      transition: all .5s;
      >.seek-box{
        width: 100%;
        height: 228px;
        background: rgba(255,255,255,1);
        box-shadow:0px 4px 8px 0px rgba(0,0,0,0.07);
        position: relative;
        top: 0;
        left: 0;
        >.close-but{
          width: 30px;
          height: 30px;
          position: absolute;
          top: 26px;
          left: 42px;
          overflow: hidden;
          >i{
            position: absolute;
            top: 0;
            left: 12.5px;
            display: block;
            width: 2px;
            height: 30px;
            margin: 0 auto;
            background: #333;
          }
          >i:nth-of-type(1){
            float: left;
            transform: rotate(45deg);
          }
          >i:nth-of-type(2){
            transform: rotate(-45deg);
          }
        }
        >.reset-but{
          width:56px;
          min-width: 2em;
          height:40px;
          font-size:28px;
          font-family:PingFangSC-Medium;
          font-weight:500;
          color:rgba(72,72,72,1);
          line-height:40px;
          position: absolute;
          top: 26px;
          right: 40px;
        }
        >.seek-text{
          width: 73.07%;
          height: 66px;
          border: 0;
          position: absolute;
          top: 110px;
          left: 56px;
          font-size:48px;
          font-family:PingFangSC-Medium;
          font-weight:500;
          line-height: 66px;
          outline: none;
        }
        >.cilck-seek{
          width: 14.41%;
          height: 44px;
          border-left: 2px solid #979797;
          position: absolute;
          top: 124px;
          right: 5.05%;
          background: transparent url('../assets/icon/seek-icon.png') no-repeat center center;
          background-size: contain;
        }
      }
      >.seek-record-box{
        width: 100%;
        float: left;
        position: relative;
        >h2{
          width:110px;
          min-width: 5em;
          margin-top: 70px;
          margin-left: 40px;
          margin-bottom: 40px;
          height:32px;
          font-size:22px;
          font-family:PingFangSC-Medium;
          font-weight:500;
          color:rgba(102,102,102,1);
          line-height:32px;
        }
        >li{
          >i{
            display: inline-block;
            width: 24px;
            height: 24px;
            padding-right: 26px;
            background: transparent url('../assets/icon/record-icon.png') no-repeat center center;
            background-size: contain;
          }
          text-align: left;
          list-style: none;
          height:34px;
          font-size:24px;
          font-family:PingFangSC-Medium;
          font-weight:500;
          color:rgba(51,51,51,1);
          line-height:34px;
          margin-left: 40px;
          margin-bottom: 30px;
        }
      }
    }
    .more-but{
      width: 100%;
      height: 100px;
      padding-top: 350px;
      font-size: 36px;
    }
    .hotel-items{
      padding-top: 150px;
      overflow-y:scroll;
      z-index: 3000;
      .type-but-window{
        width: 90%;
        height: 90px;
        overflow-y: hidden;
        overflow-x: scroll;
        margin: 0 auto;
        >ul{
          float: left;
          height: 56px;
          white-space: nowrap;
          >li{
            display: inline-block;
            list-style: none;
            height: 56px;
            border-radius:10px;
            border:2px solid rgba(213,213,213,1);
            font-size:28px;
            font-family:PingFangSC-Regular;
            font-weight:400;
            color:rgba(102,102,102,1);
            line-height:56px;
            padding: 0 22px;
            margin-left: 20px;
          }
          .active{
            color:rgba(98,140,253,1);
            border:2px solid rgba(98,140,253,1);
          }
          >li:nth-of-type(1){
            margin-left: 0px;
          }
        }
      }
      .type-but-window::-webkit-scrollbar { width: 0 !important }
      >h1{
        width: 88%;
        padding-left: 6%;
        text-align: left;
        height:56px;
        font-size:40px;
        font-family:PingFangSC-Semibold;
        font-weight:600;
        color:rgba(72,72,72,1);
        line-height:56px;
        margin-bottom: 50px;
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
    .more-select{
      text-align: left;
      position: absolute;
      top: 0;
      background:rgba(248,249,251,1);
      width: 100%;
      height: 100%;
      z-index: 9;
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
