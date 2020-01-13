<template>
  <div class="main">
    <head-bar></head-bar>
    <div class="title">开始发布您的房源吧</div>
    <h2> <span>介绍您的房源</span></h2>
    <div class="content">
      <h3>给您的房源起一个好听的名字吧</h3>
      <input type="text" placeholder="添加房源标题" v-model="homeName">
      <!--<h3>请选择房子所属类型</h3>-->
      <!--<Select v-model="theme" style="width:100%">-->
        <!--<Option v-for="item in themeList" :value="item.id" :key="item.id">{{ item.subject}}</Option>-->
      <!--</Select>-->
      <h3>您的房源位于什么地方？</h3>
      <!--<input type="text" placeholder="例如：所在地区">-->
      <input type="text" placeholder="例如：详细地址，精确到门牌号" v-model="address">
      <h3>民宿特色介绍？</h3>
      <input type="text" placeholder="例如：靠近美食街" v-model="kindDescription">
      <h3>您能提供哪些便利设施？</h3>
      <!--<p class="ptitle">配套设施类型</p>-->
      <!--<Select v-model="faciType" style="width:100%" @on-change="changeType">-->
        <!--<Option v-for="item in TypeList" :value="item.id" :key="item.id">{{ item.name}}</Option>-->
      <!--</Select>-->
      <p class="ptitle">配套设施服务</p>
      <Select v-model="faciNameId" multiple style="width:100%">
        <Option v-for="item in List" :value="item.id" :key="item.id">{{ item.name}}</Option>
      </Select>
      <!--<button class="save-btn" @click="addFaciServices">测试配套</button>-->
      <h3>房源照片</h3>
      <img-upload  ref="imgUpload"  @imgUpload="getUploadImg" @delImg="delUploadImg"></img-upload>
      <!--<button class="add-btn">添加照片</button>-->
      <h3>请输入您的名字</h3>
      <input type="text" placeholder="例如：李四" v-model="contact1">
      <h3>请确认您的手机号码</h3>
      <div class="phone">
        <input type="number" placeholder="+86" v-model="contactPhone1">
        <button class="get-btn">获取验证码</button>
      </div>
      <input type="text" placeholder="请输入验证码">
      <div class="btn-wrap">
        <button class="save-btn" :class="finish ? 'finish':''" v-if="isEdit" @click="upHomeStay">保存修改</button>
        <button class="save-btn" :class="finish ? 'finish':''" v-else  @click="addHomeStay">保存并进行下一步</button>
      </div>
    </div>
  </div>
</template>

<script>
  import headBar from '@/components/header/head-bar'
  import ImgUpload from '@/components/img-upload/img-upload'
  import {addHomeStay,subjectList,faciTypeList,faciList,addFaciServices,getHomeDetail,upHomeStay,addManyFaciServices,delManyFaciServices } from "@/lib/API/landlord";
  export default {
    components: {
      headBar,
      ImgUpload
    },
    watch: {
      faciNameId(curVal,oldVal){
        this.addIds = curVal.filter(j => !this.copyFaciName.includes(j))
        this.delIds = this.copyFaciName.filter(i => !curVal.includes(i))
      },
      homeName(curVal, oldVal) {
        if(curVal){
          this.finish = true
        }else {
          this.finish = false
        }
      }
    },
    data() {
      return {
        roomNum:2,
        roomBed:2,
        homeId:'', //民宿ID
        content:null,//提示内容
        faciType:'',//配套设施类型ID
        faciNameId:[], //配套设施服务ID
        copyFaciName:[], //配套设施服务ID
        addIds:[], //添加的配套设施服务ID
        delIds:[],//删除的配套设施服务ID
        TypeList:[], //配套设施类型
        List:[], //配套设施服务
        theme:'',
        themeList:[],
        imgName: '',
        visible: false,
        finish:false,
        homeName:'',
        address:'',
        // image1:'https://o5wwk8baw.qnssl.com/bc7521e033abdd1e92222d733590f104/avatar',
        image1:'',
        kindDescription:'',
        contact1:'',
        contactPhone1:'',
        imgArray: [], // 图片资源
        imgUrl:{},
        homeData:{}, //详情
        isEdit:false, //是否编辑,
        homeCopy:{} //编辑内容
      }
    },
    created(){
      this.userID = localStorage.getItem('MicroHotelUserData').split(',')[0]
      if(this.$route.query.homeId){
        this.homeId = this.$route.query.homeId
        this.isEdit = true
        this.getHomeDetail({id:this.homeId})
      }
      //获取配套设施列表
      this.faciList()
    },
    activated(){
      if(this.$route.query.homeId){
        this.homeId = this.$route.query.homeId
        this.isEdit = true
        this.getHomeDetail({id:this.homeId})
      }
    },
    methods: {
      //已填写详情
      async getHomeDetail(params){
        let res = await getHomeDetail(params)
        if(res.code === 200){
          this.homeCopy = res.data
          this.homeName = res.data.name
          this.address = res.data.address
          this.kindDescription = res.data.kindDescription
          this.contact1 = res.data.contact1
          this.contactPhone1 = res.data.contactPhone1
          this.imgArray = []
          if(this.homeCopy.image1){
            this.imgArray.push(this.homeCopy.image1)
          }
          if(this.homeCopy.image2){
            this.imgArray.push(this.homeCopy.image2)
          }
          if(this.homeCopy.image3){
            this.imgArray.push(this.homeCopy.image3)
          }
          if(this.homeCopy.image4){
            this.imgArray.push(this.homeCopy.image4)
          }
          if(this.homeCopy.image5){
            this.imgArray.push(this.homeCopy.image5)
          }
          this.pushImages(res.data)
          if(res.data.facilityServices.length){
            let copyList =res.data.facilityServices
            copyList.forEach((item)=>{
              this.faciNameId.push(item.id)
              this.copyFaciName.push(item.id)
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

      //配套设施类型
      async faciTypeList(){
        let res = await faciTypeList()
        if(res.code === 200){
          this.TypeList = res.data.list
        }
      },
      //配套设施服务
      async faciList(type){
        let res = await faciList({type:type,size:1000})
        if(res.code === 200){
          this.List = res.data.list
        }
      },
      //删除配套设施
      async delManyType(){
        if(this.delIds.length===0) return
        let ids = this.delIds.toString()
        let res = await delManyFaciServices({ids:ids})
        if(res.code === 200){
          console.log('编辑设施删除成功');
        }
      },
      async addManyType(){
        let ids = this.addIds
        let params = []
        ids.forEach((id)=>{
          let item ={
            facilityServiceId:id,
            flag: 2,
            hotelId:this.homeId ,
          }
          params.push(item)
        })
        let res = await addManyFaciServices()
        if(res.code === 200){
        }
      },
      //添加民宿
      async addHomeStay(){
        let params = {
          userId:this.userID,
          name:this.homeName,
          address:this.address,
          // image1:this.image1,
          kindDescription:this.kindDescription,
          // contact1:this.contact1,
          // contactPhone1:this.contactPhone1,
          // id:this.theme
        }
        for(let i=0;i<this.imgArray.length;i++){
          if(i === 0)params.image1 = this.imgArray[i]
          if(i === 1)params.image2 = this.imgArray[i]
          if(i === 2)params.image3 = this.imgArray[i]
          if(i === 3)params.image4 = this.imgArray[i]
          if(i === 4)params.image5 = this.imgArray[i]
        }
        if(this.contact1){
          params.contact1 = this.contact1
        }
        if(this.contactPhone1){
          params.contactPhone1 = this.contactPhone1
        }
        if(this.homeName===''){
          this.$toast('房源标题不能为空')
          return
        }
        if(this.address===''){
          this.$toast('房源地址不能为空')
          return
        }
        if(this.imgArray.length==0){
          this.$toast('房源图片不能为空')
          return
        }
        if(this.kindDescription===''){
          this.$toast('提供特色服务和便利不能为空')
          return
        }
        let res = await addHomeStay(params)
        if(res.code === 200){
          this.homeId= res.data
          console.log('添加民宿成功');
          setTimeout(()=>{
            this.addType()
          },300)
          this.$router.push({name:'landlord-room',query:{homeId:this.homeId}})
        }
      },
      //添加配套设施服务
      async addType(){
        let parmas = {
          flag: 2,
          hotelId:this.homeId ,
        }
        if(this.isEdit){  //编辑
          console.log('设施编辑添加');
          this.addIds.forEach((id)=>{
            parmas.facilityServiceId = id
            this.addFaciServices(parmas)
          })
        }else { //新增
          console.log('设施新增');
          this.faciNameId.forEach((id)=>{
            parmas.facilityServiceId = id
            this.addFaciServices(parmas)
          })
        }
      },
      async addFaciServices(params){
        let res = await addFaciServices(params)
        if(res.code === 200){
        }
      },
      //编辑民宿
      async upHomeStay(){
        let params = {
          id:this.homeId,
          name:this.homeName,
          address:this.address,
          kindDescription:this.kindDescription,
          contact1:this.contact1,
          contactPhone1:this.contactPhone1,
        }
        for(let i=0;i<this.imgArray.length;i++){
          if(i === 0)params.image1 = this.imgArray[i]
          if(i === 1)params.image2 = this.imgArray[i]
          if(i === 2)params.image3 = this.imgArray[i]
          if(i === 3)params.image4 = this.imgArray[i]
          if(i === 4)params.image5 = this.imgArray[i]
        }
        this.$refs.imgUpload.updateImgUrl(this.imgArray)
        let res = await upHomeStay(params)
        if(res.code === 200){
          this.$toast('编辑成功')
          setTimeout(()=>{
            this.delManyType()
            this.addType()
          },300)
          this.$router.back()
        }
      },
      // 上传图片url
      getUploadImg (url) {
        this.imgArray.push(url)
      },
      // 删除上传图片url
      delUploadImg(index) {
        this.imgArray.splice(index,1)
      },
    }
  }
</script>


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
        width:288px;
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
