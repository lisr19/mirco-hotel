<template>
  <div class="main">
    <head-bar></head-bar>
    <h2> <span>房间信息</span></h2>
    <div class="content">
      <h3>请填写房间类型</h3>
      <input type="text" placeholder="例如：豪华大床房" v-model="roomType">
      <h3>能住多少位房客？</h3>
      <div class="room-infor">
        <p>
          <span>房客人数</span>
          <span class="count"><em @click="reduceNum">-</em><strong>{{roomNum}}</strong><em @click="addNum">+</em> </span>
        </p>
        <p>
          <span>房客床位</span>
          <span class="count"><em @click="reduceBed">-</em><strong>{{roomBed}}</strong><em @click="addBed">+</em></span>
        </p>
        <p>床是什么样的？</p>
        <input type="text" placeholder="例如：1.8米*2米 大床" v-model="bedScale">
      </div>
      <h3>房间所在楼层</h3>
      <input type="text" placeholder="例如：8-15" v-model="floor">
      <h3>房间面积</h3>
      <input type="number" placeholder="例如：28" v-model="square">
      <h3>房间照片</h3>
      <div class="demo-upload-list" v-for="item in uploadList">
        <template v-if="item.status === 'finished'">
          <img :src="item.url">
          <div class="demo-upload-list-cover">
            <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
            <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
          </div>
        </template>
        <template v-else>
          <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
        </template>
      </div>
      <img-upload ref="imgUpload" v-model="imgUrl" @imgUpload="getUploadImg"></img-upload>
      <!--<button class="add-btn">添加照片</button>-->
      <h3>房间提供哪些便利设施？</h3>
      <!--<p class="ptitle">房间配套设施类型</p>-->
      <!--<Select v-model="faciType" style="width:100%" @on-change="changeType">-->
        <!--<Option v-for="item in TypeList" :value="item.id" :key="item.id">{{ item.name}}</Option>-->
      <!--</Select>-->
      <p class="ptitle">房间配套设施服务</p>
      <Select v-model="faciNameId" multiple style="width:100%">
        <Option v-for="item in List" :value="item.id" :key="item.id">{{ item.name}}</Option>
      </Select>
      <h3>可入住儿童数</h3>
      <input type="number" placeholder="例如：1" v-model="availableChild">
      <h3>价格</h3>
      <input type="number" placeholder="例如：288" v-model="cancelPrice">
      <div class="btn-wrap">
        <button class="save-btn" :class="finish ? 'finish':''" @click="editRoom" v-if="isEdit">保存修改</button>
        <button class="save-btn" :class="finish ? 'finish':''" @click="addRoom" v-else>保存并进行下一步</button>
      </div>
    </div>
  </div>
</template>

<script>
  import headBar from '@/components/header/head-bar'
  import ImgUpload from '@/components/img-upload/img-upload'
  import {faciTypeList,faciList,addRoom,addRoomFaci,getRoomDetail,editRoom} from "@/lib/API/landlord";
  export default {
    components: {
      headBar,
      ImgUpload
    },
    watch: {
      cancelPrice(curVal, oldVal) {
        if(curVal){
          this.finish = true
        }else {
          this.finish = false
        }
      }
    },
    data() {
      return {
        roomId:'',
        isEdit:false,
        availableAdult:'', //可住成人数量
        availableChild:'', //可住儿童数量
        square:'',
        bedScale:'',
        floor:'',
        roomNum:2,
        roomBed:2,
        cancelPrice:'', //房间取消价格
        roomType:'', //房间类型
        homeId:'', //民宿ID
        content:null,//提示内容
        faciType:'',//配套设施类型ID
        faciNameId:[], //配套设施服务ID
        TypeList:[], //配套设施类型
        List:[], //配套设施服务
        defaultList: [
          {
            'name': 'a42bdcc1178e62b4694c830f028db5c0',
            'url': 'https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar'
          },
          {
            'name': 'bc7521e033abdd1e92222d733590f104',
            'url': 'https://o5wwk8baw.qnssl.com/bc7521e033abdd1e92222d733590f104/avatar'
          }
        ],
        imgName: '',
        visible: false,
        uploadList: [],
        finish:false,
        homeName:'',
        address:'',
        image1:'https://o5wwk8baw.qnssl.com/bc7521e033abdd1e92222d733590f104/avatar',
        imgUploadList: [], // 图片资源
        imgUrl:{},
        myHeader: { authorization: localStorage.getItem('token') },
      }
    },
    created(){
      this.userID = localStorage.getItem('MicroHotelUserData').split(',')[0]
      this.homeId = this.$route.query.homeId
      this.faciList()
      if(this.$route.query.roomId){
        console.log(this.$route.query.roomId);
        this.getRoomDetail({id:this.$route.query.roomId})
        this.isEdit = true
      }
    },
    // activated(){
    //   if(this.$route.query.roomId){
    //     console.log(this.$route.query.roomId);
    //     this.getRoomDetail({id:this.$route.query.roomId})
    //     this.isEdit = true
    //   }
    // },
    methods: {
      //获取房间详情
      async getRoomDetail(params){
        let res = await getRoomDetail(params)
        if(res.code === 200){
          this.roomType= res.data.roomType
          this.bedScale= res.data.bedScale
          this.square= res.data.square
          this.cancelPrice= res.data.cancelPrice
          this.floor= res.data.floor
          this.roomNum= res.data.availableAdult
          this.availableChild= res.data.availableChild
          // this.image1= res.data.image1
          this.pushImages(res.data)
          if(res.data.facilityServices.length){
            let copyList =res.data.facilityServices
            copyList.forEach((item)=>{
              this.faciNameId.push(item.id)
              console.log(this.faciNameId);
            })
          }
        }
      },
      pushImages(item){
        if(item.image1){
          this.$refs.imgUpload.uploadList.push({
            status:'finished',
            url:item.image1,
            name:'image1'
          })
          if(item.image2){
            this.$refs.imgUpload.uploadList.push({
              status:'finished',
              url:item.image2,
              name:'image2'
            })
            if(item.image3){
              this.$refs.imgUpload.uploadList.push({
                status:'finished',
                url:item.image3,
                name:'image3'
              })
              if(item.image4){
                this.$refs.imgUpload.uploadList.push({
                  status:'finished',
                  url:item.image4,
                  name:'image4'
                })
                if(item.image5){
                  this.$refs.imgUpload.uploadList.push({
                    status:'finished',
                    url:item.image5,
                    name:'image5'
                  })
                }
              }
            }
          }
        }
      },
      //添加房间
      async addRoom(){
        let params = {
          hotelId: this.homeId,
          roomType:this.roomType,
          cancelPrice:this.cancelPrice,
          square:this.square,
          bedScale:this.bedScale,
          availableAdult:this.roomNum,
          availableChild:this.availableChild,
          image1:this.image1,
          floor:this.floor,
          flag:2
        }
        if(this.image2){
          params.image2 = this.image2
        } if(this.image3){
          params.image3 = this.image3
        }
        if(this.image4){
          params.image4 = this.image4
        } if(this.image5){
          params.image5 = this.image5
        }
        if(this.type===''){
          this.$toast('请填写房间类型')
          return
        }
        if(this.bedScale===''){
          this.$toast('请填写床的规格')
          return
        }
        if(this.image1===''){
          this.$toast('请上传房间图片')
          return
        }
        if(this.cancelPrice===''){
          this.$toast('请填写房间价格')
          return
        }
        let res = await addRoom(params)
        if(res.code === 200){
          this.roomId = res.data
          setTimeout(()=> {
            this.addRoomFaci()
          },300)
          this.$router.push({name:'landlord-time',query:{roomId:this.roomId}})
        }
      },
      //编辑房间
      async editRoom(){
        let params = {
          id: this.$route.query.roomId,
          roomType:this.roomType,
          cancelPrice:this.cancelPrice,
          square:this.square,
          bedScale:this.bedScale,
          availableAdult:this.roomNum,
          availableChild:this.availableChild,
          image1:this.image1,
          floor:this.floor,
          flag:2
        }
        let res = await editRoom(params)
        if(res.code === 200){
          this.$toast('修改成功')
          this.$router.push({name:'landlord-roomlist',query:{homeId:this.homeId,updata:true}})
        }
      },

      //配套设施类型
      async faciTypeList(){
        let res = await faciTypeList()
        if(res.code === 200){
          this.TypeList = res.data.list
        }
      },
      //配套设施服务
      async faciList(){
        let res = await faciList({size:1000})
        if(res.code === 200){
          this.List = res.data.list
        }
      },
      //添加房间配套设施
      async addRoomFaci(){
        let params = {
          roomId: this.roomId,
          facilityServiceId:this.faciNameId[0],
          flag:1
        }
        let res = await addRoomFaci(params)
        if(res.code === 200){
          console.log('添加民宿房间配套服务成功');
        }
      },
      // 配套设施类型改变
      changeType(){
        this.faciList(this.faciType)
      },
      // 上传图片url
      getUploadImg (url) {
        this.imgUrl = url
        this.imgUploadList.push(url)
        this.updateImg()
      },
      updateImg(){
        if(this.imgUploadList.length===1){
          this.image1 = this.imgUploadList[0]
        }else if(this.imgUploadList.length===2) {
          this.image2 = this.imgUploadList[1]
        }else if(this.imgUploadList.length===3) {
          this.image3 = this.imgUploadList[2]
        }else if(this.imgUploadList.length===4) {
          this.image4 = this.imgUploadList[3]
        }else if(this.imgUploadList.length===5) {
          this.image5 = this.imgUploadList[4]
        }
      },
      handleView (name) {
        this.imgName = name;
        this.visible = true;
      },
      reduceNum(){
        this.roomNum --
        if(this.roomNum<0) {
          this.roomNum=0
        }
      },
      addNum(){
        this.roomNum ++
      },
      reduceBed(){
        this.roomBed--
        if(this.roomBed<0) {
          this.roomBed=0
        }
      },
      addBed(){
        this.roomBed++
      },
    }
  }
</script>

<style scoped>
  .demo-upload-list{
    display: inline-block;
    width:118px;
    height:118px;
    text-align: center;
    line-height: 118px;
    border:2px solid rgba(151,151,151,1);
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    margin-right: 24px;
  }
  .demo-upload-list img{
    width: 100%;
    height: 100%;
  }
  .demo-upload-list-cover{
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,.6);
  }
  .demo-upload-list:hover .demo-upload-list-cover{
    display: block;
  }
  .demo-upload-list-cover i{
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }
/*input框*/
  .content >>> .ivu-select-single .ivu-select-selection{
    height: 58px;
    line-height: 58px;
  }
  .content >>> .ivu-select-single .ivu-select-selection .ivu-select-placeholder, .ivu-select-single .ivu-select-selection .ivu-select-selected-value{
    height: 58px;
    line-height: 54px;
    font-size: 32px;
  }
  .content >>> .ivu-select-single .ivu-select-selection .ivu-select-selected-value{
    height: 58px;
    line-height: 54px;
    font-size: 32px;
  }
  .content >>> .ivu-select-item{
    padding: 20px 10px;
    font-size: 28px!important;
  }

  .content >>> .ivu-select-multiple .ivu-select-selection{
    /*height: 58px;*/
    line-height: 54px;
  }
  .content >>> .ivu-select-placeholder{
    font-size: 32px;
  }
  .content >>> .ivu-select-multiple .ivu-select-selection .ivu-select-placeholder{
    height: 58px;
    line-height: 54px;
  }
  .content >>> .ivu-select-multiple .ivu-tag{
    height: 48px;
    line-height: 48px;
    font-size: 26px;
  }
  .content >>> .ivu-select-dropdown{
    max-height:420px
  }
</style>

<style lang="less" scoped>
  .main {
    background-color: #FAFAFCFF;
    padding-top:90px;
    text-align: left;
    .content{
      padding: 0 40px;
      .room-infor{
        p{
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 40px;
          .count{
            font-size:44px;
            font-family:PingFangSC-Regular;
            font-weight:400;
            color:rgba(98,140,253,1);
            line-height:60px;
            strong{
              font-weight: 400;
              margin: 0 44px;
            }
            em{
              border: solid 1px #040404;
              border-radius: 50%;
              width:60px;
              line-height: 50px;
              height:60px;
              text-align: center;
              display: inline-block;
              font-size: 50px;
              color: #040404;
            }
          }
        }

      }
    }
    .title{
      height:148px;
      line-height: 158px;
      background:rgba(98,140,253,1);
      border-radius:0px 0px 20px 20px;
      font-size:48px;
      font-family:PingFangSC-Semibold;
      font-weight:600;
      color:rgba(255,255,255,1);
      padding-left: 40px;
    }
    h2{
      font-size:48px;
      font-family:PingFangSC-Semibold;
      font-weight:600;
      color:rgba(51,51,51,1);
      line-height:66px;
      height: 66px;
      margin: 48px 40px;
      position: relative;
      &:after{
        content: '';
        position: absolute;
        width:192px;
        bottom: 0;
        left: 0;
        height:18px;
        background:linear-gradient(90deg,rgba(155,192,255,1) 0%,rgba(98,140,253,1) 100%);
      }
      span{
        position: absolute;
        z-index: 9;
      }
    }
    h3{
      font-size:36px;
      font-family:PingFangSC-Medium;
      font-weight:600;
      color:rgba(51,51,51,1);
      line-height:50px;
      margin:48px 0 22px;
    }
    p{
      font-size:32px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:rgba(72,72,72,1);
      line-height:44px;
    }
    input{
      font-size:32px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      width: 100%;
      color:rgba(98,140,253,1);
      line-height:44px;
      border: none;
      padding-bottom: 10px;
      margin-top: 20px;
      border-bottom: solid 1px #D4D4D4;
      background:#FAFAFCFF;
    }
    input:focus{
      outline: none;
    }
    .add-btn{
      width:192px;
      height:66px;
      border-radius:4px;
      border:2px solid rgba(98,140,253,1);
      font-size:28px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:rgba(98,140,253,1);
      line-height:40px;
      background-color: #ffffff;
    }
    .phone{
      position: relative;
      .get-btn{
        position: absolute;
        right: 0;
        bottom: 14px;
        width: 140px;
        height: 52px;
        color: #999999;
        border:  dotted 1px #999999;
        background-color: #ffffff;
      }
    }
    .btn-wrap{
      text-align: center;
      padding: 80px 0 86px;
      .save-btn{
        width:450px;
        height:66px;
        background:rgba(216,216,216,1);
        border-radius:4px;
        margin: 0 auto;
        border: none;
        font-size:32px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(153,153,153,1);
        line-height:44px;
      }
      .finish{
        background:rgba(98,140,253,1);
        color:rgba(255,255,255,1);
      }
    }
    .ptitle{
      margin: 20px 0 10px;
    }
  }
</style>
