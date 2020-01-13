<template>
  <div class="main">
    <template v-if="currentIndex===0">
      <div class="big-bar">房源</div>
      <div class="room-list">
        <div class="item" @click="addRoom">+ 新增房源</div>
        <ul class="status">
          <li v-for="(item,index) in statusList" :class="{active:index === currentStatus}" @click="tabStatus(index)">{{item.status}}</li>
        </ul>
        <div class="home-item" v-for="item in homeList">
          <img :src="item.image1" alt="" @click="openRoom(item)">
          <div class="cover-img" v-if="item.deleted===1" @click="openRoom(item)">
            未发布
          </div>
          <div class="desc">
            <p class="name">
              {{item.name}}
              <span class="tip">
                <img src="@/assets/icon/status1.png" alt="" v-if="item.status===1">
                <img src="@/assets/icon/status2.png" alt="" v-else-if="item.status===2">
                <img src="@/assets/icon/status3.png" alt="" v-else-if="item.status===3">
              </span>
            </p>
            <div class="address">{{item.address}}</div>
            <div class="price">
              <span class="discount">￥{{item.minPrice}}</span>
              <!--<span class="duration"> {{item.hotel[0].dura}}</span>-->
            </div>
            <div class="score">
              <Rate disabled v-model="item.grade"/>
              <span class="num">{{item.evaluationNum }}条评论</span>
            </div>
          </div>
          <div class="more-but" @click="onClickOpenMore(item)">· · ·</div>
        </div>
      </div>
    </template>
    <template v-if="currentIndex===1">
      <div class="order-menu">
        <div class="big-bar" @click="onClickRestoreType()">订单</div>
        <ul class="types">
          <li class="seek-tpye" v-for="(item,index) in typeList" :class="{active:currentType===index}" :key="index" @click="tabOrderType(index)">{{item.title}}</li>
        </ul>
      </div>
      <div class="order-content">
        <ul v-if="OrderLists.length">
          <li class="order-box" v-for="(item,index) in OrderLists" :key="index" @click="onClickOpenOrder(item)">
            <img :src="item.user[0].avatar" alt="">
            <h1 class="userNickname">{{item.user[0].username}}</h1>
            <div></div>
            <h2 class="add-orderi-time">下单时间{{item.addTime}}</h2>
            <h2 class="into-out-time">入离时间：{{item.startTime}} 至 {{item.endTime}}</h2>
            <h2 class="user-phone">联系电话：{{item.user[0].phone}}</h2>
            <h2 class="total-price">总价：¥{{item.totalPrice}}</h2>
            <div class="call-user" @click.stop="openViewByPath(item.userId)">{{item.butTxt}}</div>
          </li>
        </ul>
        <img src="@/assets/icon/null-icon.png" alt="" v-else>
      </div>
    </template>
    <template v-if="currentIndex===2">
      <message style="margin-top: -25px"></message>
    </template>
    <template v-if="currentIndex===3">
      <div class="big-bar">我的</div>
      <div class="head-infor" @click="openMyDetail">
        <div style="display: flex;align-items:flex-start">
          <img class="head-img" :src="avatar?avatar:defaultHeadImg" alt="">
          <strong class="name">{{username}}</strong>
        </div>
        <Icon type="ios-arrow-forward" />
      </div>
      <div class="about-hotel">
        <div class="item">
          收款设置
          <Icon type="ios-arrow-forward" />
        </div>
        <div class="item" @click="openEvaluate">
          评价管理
          <Icon type="ios-arrow-forward" />
        </div>
        <div class="item" @click="$toast('您未违规')">
        <span>
          违规记录
        </span>
          <span class="edition">
            您未违规
            <Icon type="ios-arrow-forward" style="margin-left: 10px"/>
        </span>
        </div>
      </div>
      <button class="apply-btn" @click="openMy">
        <img src="@/assets/icon/fangdong.png" alt="">
        切换成房客
      </button>
    </template>
    <!--脚部NAV切换-->
    <div class="tag-nav">
      <div v-for="(item,index) in array" class="item" :class="{active:index === currentIndex}" @click="tabNav(index)">
        <img :src="item.iconUrl2" alt="" v-if="index === currentIndex">
        <img :src="item.iconUrl" alt="" v-else>
        <p>{{item.title}}</p>
      </div>
    </div>
    <!--管理弹窗-->
    <div class="more-window">
      <ul class="more-box">
        <li @click="openHomeStayDate()">修改房源信息</li>
        <!--<li @click="checkManage()">入住管理</li>-->
        <li @click="upHomeStay(0)" v-if="this.deleted===1">发布房源</li>
        <li @click="upHomeStay(1)" v-if="this.deleted===0">下架房源</li>
        <li @click="delHomeStay()" v-if="this.status===2">删除房源</li><!--还未审核的可删除-->
        <li @click="onClickOffMore()">取消</li>
      </ul>
    </div>
  </div>
</template>

<script>
  import {getRoomOrderByUser,getHomeStayByUser,getHomeList,delHomeStay,upHomeStay,getRoomDetail} from "@/lib/API/landlord";
  import {getUserDate} from "@/lib/API/login-enroll";
  import message from "@/view/message/message"
  export default {
    components: {
      message
    },
    data() {
      return {
        orderType:null, //租客订单类型
        currentType:0,//当前订单类型
        seekTypesBox:{},
        username:null, //用户名
        avatar:null, //头像
        defaultHeadImg: require('@/assets/img/headimg.png'),
        OrderLists:[],//暂无订单
        noMsg:true,//暂无消息
        currentIndex:0,
        currentStatus:0,
        statusList:[
          {
            status:'已发布'
          },
          {
            status:'未发布'
          },
        ],
        typeList:[
          {
            title:'全部订单'
          },
          {
            title:'待付款'
          },
          {
            title:'待入住'
          },
          {
            title:'待评价'
          },
          {
            title:'已完成'
          },
        ],
        array:[
          {
            title:'房源',
            path:'index',
            status:true,
            iconUrl: require('@/assets/icon/roomby.png'),
            iconUrl2: require('@/assets/icon/roomby2.png'),
          },
          {
            title:'订单',
            path:'order',
            iconUrl: require('@/assets/icon/orderby.png'),
            iconUrl2: require('@/assets/icon/orderby2.png'),
            status:false
          },
          {
            title:'消息',
            path:'news',
            iconUrl: require('@/assets/icon/newsby.png'),
            iconUrl2: require('@/assets/icon/newsby2.png'),
            status:false
          },
          {
            title:'我的',
            path:'my',
            iconUrl: require('@/assets/icon/myby.png'),
            iconUrl2: require('@/assets/icon/myby2.png'),
            status:false
          },
        ],
        homeList:[], //房源列表
        homeId: '',
        moreBox:[],
        upDataBox:[],
        newMark:0,
        newComment:'',
        deleted:0, //0下架，1上架
        status:null,  // 审核状态 1、通过；2、审核中；3、不符合要求

      }
    },
    created(){
      this.userID = localStorage.getItem('MicroHotelUserData').split(',')[0];
      this.getRoomOrderByUser(this.userID)
      this.getHomeList()
      this.getUserDate()
    },
    mounted(){
      // this.getCommentList()
      // this.upDataBox = document.getElementsByClassName('mark-box')[0];
      this.moreBox = document.getElementsByClassName('more-window')[0];
    },
    methods: {
      //获取房源列表
      async getHomeList(){
        let params = {
          deleted:this.deleted,
          userId:this.userID,
          size:50
        }
        let res = await getHomeList(params)
        if(res.code === 200){
          this.homeList = res.data.list
        }
      },
      //获取房东订单列表
      async getRoomOrderByUser(params){
        let res = null;
        if(this.orderType==null){
          res = await getRoomOrderByUser({userId:params,size:50})
        }else{
          res = await getRoomOrderByUser({userId:params,status:this.orderType,size:50})
        }
         // console.log('房东订单',res.data.list)
        if(res.code === 200){
          this.OrderLists = res.data.list;
          for(let i=0;i<this.OrderLists.length;i++){
            this.OrderLists[i].startTime = this.OrderLists[i].startTime.split(' ')[0];
            this.OrderLists[i].endTime = this.OrderLists[i].endTime.split(' ')[0];
            if(this.OrderLists[i].status == 0){
              this.OrderLists[i].butTxt = '待付款';
            }else{
              this.OrderLists[i].butTxt = '联系租客';
            }
          }
        }
      },
      //获取个人信息
      async getUserDate(){
        let res = await getUserDate({id:this.userID})
        if(res.code === 200){
          this.myData = res.data.list[0]
          // this.name = this.myData.name
          this.username = this.myData.username
          this.avatar = this.myData.avatar
        }
      },
      //打开添加房间
      openRoom(item){
        this.$router.push({name:'landlord-roomlist',query:{homeId:item.id,hotelName:item.name}})
      },
      //跳转民宿详情
      openHomeDetail(id){
        this.$router.push({path: 'home-detail',query:{homeId:id}})
      },
      onClickOpenOrder(data){
        this.$router.push({name:'房东订单详情',query:{orderData:data}})
      },
      //新增房源
      addRoom(){
        this.$router.push({name: 'landlord-apply'})
      },
      // 入住管理
      checkManage(){
        this.$router.push({name: 'landlord-time',query:{roomId:this.homeId,updata:true}})
      },
      tabNav(index){
        this.currentIndex = index;
        if(index==1){
          if(!this.seekTypesBox.length){
            this.seekTypesBox = document.getElementsByClassName('seek-tpye');
          }
        }
      },
      tabStatus(index){
        if(this.currentStatus!=index){
          this.currentStatus = index
          if(this.currentStatus===0){
            this.deleted = 0
            this.getHomeList()
          }else {
            this.deleted = 1
            this.getHomeList()
          }
        }
      },
      //评论
      openEvaluate(){
        this.$router.push({path: '/home-list'})
      },
      //房东详情
      openMyDetail(){
        this.$router.push({path: '/landlord-detail'})
      },
      openMy(){
        this.$router.push({path: '/'})
      },

      onClickOpenMore(item){
        this.moreBox.style.height=('100%');
        this.homeId=item.id;
        this.status = item.status
      },
      onClickOffMore(){
        this.moreBox.style.height=('0%');
        this.homeId='';
      },

      // 删除房源
      async delHomeStay(){
        let res = await delHomeStay({id:this.homeId});
        if(res.code===200){
          this.homeList = []
          this.$toast('删除成功')
          this.onClickOffMore();
          this.getHomeList()
        }
      },
      // 修改房源信息
      openHomeStayDate(){
        this.moreBox.style.height=('0%');
        this.$router.push({name:'landlord-apply',query:{homeId:this.homeId}})
      },
      // 修改房源信息
      async upHomeStay(deleted){
        let res = await upHomeStay({
          id:this.homeId,
          deleted:deleted
        })
        if(res.code===200){
          this.homeList = []
          if(deleted===0){
            this.$toast('发布成功')
          }else if(deleted===1){
            this.$toast('下架成功')
          }
          this.onClickOffMore()
          this.getHomeList()
        }
      },
      // 取消
      userCancelUpData(){
        this.moreBox.style.height=('100%');
        this.upDataBox.style.height=('0%');
      },
      onClickHotelBox(ID){
        this.$router.push({path: 'hotel-detail',query:{hotelid:ID}});
      },


      // 还原分类选着
      onClickRestoreType(){
        for(let i=0;i<5;i++){
          this.seekTypesBox[i].className='seek-tpye'
        }
        this.orderType = null;
        this.getRoomOrderByUser(this.userID)
      },
      // 点击订单分类
      tabOrderType(index){
        this.currentType = index
        this.OrderLists=[]
        if(index===0){
          this.orderType = null
        }else if(index===1 ||index===2){
          this.orderType = index-1
        }else{
          this.orderType = index
        }
        this.getRoomOrderByUser(this.userID);
      },
      // 打开聊天窗口
      openViewByPath(id) {
        this.$router.push({
          path: '/chat',
          query: {
            id: id,
            logoUrl: this.avatar,
            name: this.username
          }
        })
        let params = {
          id: id
        }
        this.$store.dispatch('clearTip', params)
      },

    }
  }
</script>

<style scoped>
  .main >>> .ivu-icon{
    font-size: 40px;
    color: #979797FF;
  }
  .main >>> .ivu-rate-star{
    font-size: 28px;
    margin: 0 2px;
  }
  .main >>> .ivu-rate{
    display: flex;
  }
  .ivu-rate >>> .ivu-rate-star-full:before{
    color: #626BFD;
  }
</style>
<style lang="less" scoped>
  .main {
    background-color: #F8F9FB;
    padding: 48px 0 80px;
    min-height: 100%;
    .big-bar{
      font-size:48px;
      font-family:PingFangSC-Semibold;
      font-weight:600;
      color:rgba(72,72,72,1);
      line-height:66px;
      text-align: left;
      padding: 0 40px;
    }
    .room-list{
      margin-top: 46px;
      .status{
        height: 80px;
        line-height: 80px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        font-size: 30px;
        margin-bottom:10px ;
        background-color: #ffffff;
        li{
          &.active{
            color:rgba(98,140,253,1);
          }
        }
      }
      .home-item{
        margin: 0 auto 20px;
        padding: 18px 40px;
        display: flex;
        overflow: hidden;
        background:rgba(255,255,255,1);
        position: relative;
        img{
          width:176px;
          height:176px;
          display: block;
          border-radius: 5px;
        }
        .cover-img{
          width:176px;
          height:176px;
          background:rgba(0,0,0,0.5);
          position: absolute;
          color: #ffffff;
          font-size: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .desc{
          text-align: left;
          padding-left: 20px;
          font-family:PingFangSC-Semibold;
          color:rgba(51,51,51,1);
          font-weight:600;
          .name{
            font-size:36px;
            font-family:PingFangSC-Medium;
            font-weight:600;
            color:rgba(51,51,51,1);
            line-height:50px;
            .tip{
              display: inline-block;
              img{
                height: 34px;
                width: auto;
              }
            }
          }
          .address{
            font-size:24px;
            font-family:PingFangSC-Regular;
            font-weight:500;
            color:rgba(51,51,51,1);
            line-height:40px;
          }
          .price{
            span{
              font-size:32px;
              font-family:PingFangSC-Semibold;
              font-weight:600;
              color:rgba(217,47,47,1);
              line-height:44px;
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
        .more-but{
          width:80px;
          height:44px;
          border-radius:22px;
          border:2px solid rgba(221,221,221,1);
          position: absolute;
          bottom: 22px;
          right: 40px;
          font-size: 40px;
          color: #CFCFCF;
          line-height: 40px;
        }
      }
      .item{
        width:670px;
        height:88px;
        line-height: 82px;
        background:rgba(255,255,255,1);
        border:2px solid rgba(234,234,234,1);
        font-size:36px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(98,140,253,1);
        margin: 0 auto 24px;
      }
    }
    .tag-nav{
      position: fixed;
      bottom: 0;
      display: flex;
      width: 100%;
      height:88px;
      background:rgba(255,255,255,1);
      box-shadow:0px 4px 8px 0px rgba(0,0,0,0.48);
      .item{
        width: 25%;
        display: flex;
        text-align: center;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        img{
          max-height: 42px;
        }
        p{
          height:26px;
          font-size:18px;
          font-family:PingFangSC-Medium;
          font-weight:500;
        }
      }
      .active{
        color:rgba(98,140,253,1);
      }
    }
    .about-hotel{
      background:rgba(255,255,255,1);
      display: flex;
      flex-direction: column;
      justify-content: center;
      font-size:32px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:rgba(72,72,72,1);
      padding: 20px 0;
      .item{
        height: 88px;
        line-height: 88px;
        font-weight:400;
        border-bottom: solid 1px #E6E6E6;
        text-align: left;
        padding: 0 32px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size:32px;
        font-family:PingFangSC-Regular;
        color:rgba(72,72,72,1);
        .edition{
          font-size:24px;
          font-family:PingFangSC-Regular;
          font-weight:400;
          color:rgba(153,153,153,1);
          line-height:34px;
          display: flex;
          align-items: center;
        }
      }
      .item:last-child{
        border-bottom: none;
      }
    }
    .apply-btn{
      width:670px;
      height:96px;
      background:rgba(255,255,255,1);
      box-shadow:0px 10px 16px 0px rgba(0,0,0,0.04);
      border-radius:20px;
      margin: 380px auto 0;
      border: none;
      font-size:26px;
      font-family:PingFangSC-Medium;
      font-weight:500;
      color:rgba(51,51,51,1);
      img{
        margin-right: 20px;
        max-height: 32px;
      }
    }
    .order-menu{
      width: 100%;
      height: 296px;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 10;
      background: #F8F9FB;
      .big-bar{
        padding-top: 50px;
      }
    }
    .types{
      display: flex;
      justify-content: space-between;
      height:88px;
      line-height: 88px;
      background:rgba(255,255,255,1);
      margin-top: 56px;
      >li{
        font-size:28px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        width: 25%;
        color:rgba(102,102,102,1);
      }
      >.active{
        color: #628CFD;
      }
    }
    .head-infor{
      display: flex;
      justify-content: space-between;
      align-items: center;
      height:150px;
      background:rgba(255,255,255,1);
      padding: 0 40px;
      margin: 56px 0 24px;
      font-size:32px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:rgba(51,51,51,1);
      .head-img{
        margin-right: 40px;
        width:96px;
        height:96px;
        border-radius: 50%;
      }
    }
    .order-content{
      padding-top: 208px;
      text-align: center;
      >ul{
        margin-top: 30px;
        width: 100%;
        >.order-box{
          width: 698px;
          height: 275px;
          margin: 0 auto 20px;
          position: relative;
          background: #fff;
          border-radius:20px;
          color:#666666;
          >div{
            position: absolute;
            width:670px;
            height:2px;
            top: 74px;
            left: 14px;
            background: #E8E8E8;
          }
          >img{
            position: absolute;
            display: block;
            width: 112px;
            height: 112px;
            border-radius: 50%;
            top: 90px;
            left: 14px;
            margin: 0;
          }
          >.userNickname{
            text-align: left;
            position: absolute;
            max-width: 80%;
            top: 26px;
            left: 14px;
            font-size: 28px;
            font-family:PingFangSC-Regular;
            font-weight:400;
            color:rgba(51,51,51,1);
          }
          >h2{
            position: absolute;
            height: 32px;
            line-height: 32px;
            font-size:22px;
            font-family:PingFangSC-Regular;
            font-weight:400;
            left: 154px;
          }
          >.add-orderi-time{
            top: 94px;
          }
          >.into-out-time{
            top: 130px;
          }
          >.user-phone{
            top: 166px;
          }
          >.total-price{
            top: 202px;
          }
          >.call-user{
            width:144px;
            height:48px;
            border-radius:14px;
            border:1px solid rgba(98,140,253,1);
            top: 206px;
            left: 540px;
            bottom: 20px;
            right: 14px;
            font-size:24px;
            font-family:PingFangSC-Medium;
            font-weight:500;
            color:rgba(98,140,253,1);
            line-height:48px;
            border:1px solid rgba(98,140,253,1);
            background: transparent;
          }
        }
      }
      img{
        width:614px;
        margin: 250px auto 0;
      }
    }
    .msg-content{
      text-align: center;
      img{
        width:614px;
        margin: 250px auto 0;
      }
    }
    .more-window{
      position: fixed;
      z-index: 10;
      top: 0;
      left: 0;
      width: 100%;
      height: 0%;
      background: rgba(0, 0, 0, 0.3);
      overflow: hidden;
      transition: all .5s;
      >.more-box{
        width: 674px;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -180px;
        margin-left: -337px;
        background: #fff;
        border-radius:20px;
        >li{
          list-style: none;
          width: 100%;
          height: 40px;
          padding: 0 58px;
          text-align: left;
          margin-bottom: 40px;
          font-size:28px;
          font-family:PingFangSC-Regular;
          font-weight:400;
          color:rgba(51,51,51,1);
          line-height:40px;
        }
        >li:nth-of-type(1){
          margin-top: 40px;
        }
      }
    }
  }
</style>
