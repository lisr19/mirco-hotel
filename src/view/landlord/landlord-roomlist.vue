<template>
  <div class="main">
    <head-bar :title="hotelName"></head-bar>
    <div class="room-list">
      <div class="item" @click="addRoom">+ 新增房间</div>
      <div class="no-room" v-if="roomList.length===0">
        该房源下暂无房间
      </div>
      <div class="home-item" v-else v-for="item in roomList">
        <img :src="item.image1" alt="">
        <div class="desc">
          <p class="name">
            {{item.roomType}}
          </p>
          <div class="address">床型：{{item.bedScale}}
            <br>楼层：{{item.floor}} <span v-if="item.otherInfo">其他：{{item.otherInfo}}</span></div>
          <div class="price">
            <span class="discount">￥{{item.cancelPrice}}</span>
          </div>
        </div>
        <div class="more-but" @click="onClickOpenMore(item)">· · ·</div>
      </div>
    </div>
    <!--管理弹窗-->
    <div class="more-window">
      <ul class="more-box">
        <li @click="openRoomDate()">修改房间信息</li>
        <li @click="checkManage">入住管理</li>
        <li @click="delRoom">删除房间</li>
        <li @click="onClickOffMore()">取消</li>
      </ul>
    </div>
  </div>
</template>

<script>
  import headBar from '@/components/header/head-bar'
  import ImgUpload from '@/components/img-upload/img-upload'
  import {getRoomList,delRoom} from "@/lib/API/landlord";
  export default {
    components: {
      headBar,
      ImgUpload
    },
    data() {
      return {
        roomList:[], //房源房间列表
      }
    },
    created(){
      this.userID = localStorage.getItem('MicroHotelUserData').split(',')[0]
      this.homeId = this.$route.query.homeId
      this.hotelName = this.$route.query.hotelName
      this.getRoomList({hotelId:this.homeId,size:50})
    },
    mounted(){
      this.moreBox = document.getElementsByClassName('more-window')[0];
    },
    activated(){
      if(this.homeId!=this.$route.query.homeId){
        this.homeId = this.$route.query.homeId
        this.hotelName = this.$route.query.hotelName
        this.getRoomList({hotelId:this.homeId,size:50})
      }
      if(this.$route.query.updata){
        this.homeId = this.$route.query.homeId
        this.hotelName = this.$route.query.hotelName
        this.getRoomList({hotelId:this.homeId,size:50})
      }
    },
    methods: {
      //获取房间列表
      async getRoomList(params){
        let res = await getRoomList(params)
        if(res.code === 200){
          this.roomList = res.data.list
        }
      },
      //新增房源
      addRoom(){
        this.$router.push({name: 'landlord-room',query:{homeId:this.homeId}})
      },
      // 删除房源
      async delRoom(){
        let res = await delRoom({id:this.roomId});
        if(res.code===200){
          this.roomList = []
          this.$toast('删除成功')
          this.onClickOffMore();
          this.homeId = this.$route.query.homeId
          this.getRoomList({hotelId:this.homeId,size:50})
        }
      },
      // 修改房间信息
      openRoomDate(){
        this.moreBox.style.height=('0%');
        this.$router.push({name:'landlord-room',query:{homeId:this.homeId,roomId:this.roomId}})
      },
      onClickOpenMore(item){
        this.moreBox.style.height=('100%');
        this.roomId=item.id;
      },
      onClickOffMore(){
        this.moreBox.style.height=('0%');
        this.homeId='';
      },
      // 入住管理
      checkManage(){
        this.moreBox.style.height=('0%');
        this.$router.push({name: 'landlord-time',query:{roomId:this.homeId,updata:true}})
        // this.$router.push({name: 'landlord-condition',query:{roomId:this.homeId,updata:true}})
      },
    }
  }
</script>

<style lang="less" scoped>
  .main {
    background-color: #FAFAFCFF;
    padding-top:90px;
    min-height: 100%;
    text-align: left;
    .room-list{
      margin-top: 46px;
      text-align: center;
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
            .num{
              font-size:22px;
              font-family:PingFangSC-Regular;
              font-weight:400;
              color:rgba(102,102,102,1);
              line-height:32px;
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
