<template>
  <div class="main">
    <head-bar title="编辑个人资料"></head-bar>
    <div class="head-box">
      <Upload
        ref="upload"
        :show-upload-list="false"
        :on-success="handleSuccess"
        :format="['jpg','jpeg','png']"
        :max-size="20480"
        :on-format-error="handleFormatError"
        :on-exceeded-size="handleMaxSize"
        type="drag"
        name="imgFile"
        :headers="myHeader"
        action="http://120.78.215.17:9091/upload/img"
        style="display: inline-block;">
        <img class="img-head" :src="avatar" alt=" ">
      </Upload>
      <input class="name" type="text" v-model="username" ref="editname" disabled @blur="lostFouc">
      <p class="edit-name" @click="editMyName" v-show="isEdit===false">编辑用户名</p>
      <p class="edit-name" @click="confirm" v-show="isEdit===true">确定</p>
    </div>
    <div class="content">
      <p class="title">私人信息</p>
      <ul class="items">
        <li class="item" @click="writeInfor('姓名',name)">姓名
          <span>{{name ? name:'添加'}}</span>
        </li>
        <li class="item" @click="showSex">性别
          <span v-if="gender">{{gender}}</span>
          <Icon v-else type="ios-arrow-forward" />
        </li>
        <li class="item" @click = "setDate">出生日期
          <span v-if="birthYear">{{birthYear}}年{{birthMonth}}月{{birthDay}}日</span>
          <Icon v-else type="ios-arrow-forward" />
        </li>
        <li class="item" @click="writeInfor('电子邮件',email)">电子邮件
          <span>{{email ? email:'添加'}}</span>
        </li>
        <li class="item" @click="writeInfor('电话',phone)">电话
          <span>{{phone ? phone:'添加'}}</span>
        </li>
        <li class="item" @click="writeInfor('身份证',idNumber)">身份证
          <span>{{idNumber ? idNumber:'提供'}}</span>
        </li>
        <li class="item" @click="writeInfor('紧急联系人',emergencyContact)">紧急联系人
          <span>{{emergencyContact ? emergencyContact:'添加'}}</span>
        </li>
        <li class="item" @click="writeInfor('紧急联系人电话',emergencyContactPhone)">紧急联系人电话
          <span>{{emergencyContactPhone ? emergencyContactPhone:'添加'}}</span>
        </li>
      </ul>
      <Button class="btn" type="primary" @click="save">确定</Button>
    </div>
    <!--选择性别弹窗-->
    <div class="layout" v-if="showSexBox">
      <div class="box-wrap" >
        <p>性别</p>
        <RadioGroup v-model="gender" vertical @on-change="showSexBox =false">
          <Radio label="男"></Radio>
          <Radio label="女"></Radio>
        </RadioGroup>
      </div>
    </div>
  </div>
</template>

<script>

  import headBar from '@/components/header/head-bar'
  import write from '@/components/write/write'
  import {userUptate,getUserDate} from "@/lib/API/login-enroll";

  export default {
    components:{
      headBar,
      write,
    },
    data() {
      return {
        reg:null,
        myData:{},//我的个人信息
        imgUrl:{},
        avatar: require('@/assets/icon/headimg.png'),
        username:null, //用户名
        name:null, //姓名
        birthYear:null,
        birthMonth:null,
        birthDay:null,
        phone:null, //电话
        email:null,//邮件
        idNumber:null,//身份证
        emergencyContact:null, //紧急联系人
        emergencyContactPhone:null, //紧急联系人电话
        isEdit:false,
        showSexBox:false,//性别选择弹窗
        gender:1, //性别Value
        emeContact:null,
        imgName: '',
        visible: false,
        uploadList: [],
	      myHeader: { authorization: localStorage.getItem('token') },
      }
    },
    created() {
      this.userID = localStorage.getItem('MicroHotelUserData').split(',')[0]
      this.getUserDate()
    },
    mounted () {
      this.uploadList = this.$refs.upload.fileList;
    },
    methods: {
      // 编辑名字
      editMyName() {
        this.isEdit =true
        this.$refs.editname.disabled=false
        this.$refs.editname.focus()
      },
      getUploadImg (url) {
        this.imgUrl = url
      },
      confirm() {
        this.lostFouc()
        console.log('确认');
      },
      //失去焦点事件
      lostFouc() {
        this.$refs.editname.disabled=true
        this.isEdit =false
      },
      //性别选择弹窗
      showSex(){
        this.showSexBox = true
      },
      //编辑器
      writeInfor(item,type) {
        this.$router.push({name:`Write`,params: {pageTitle: item,
            oldText:type,
            callback: (content) => {
              console.log(content);
              if(item==='姓名'){
                this.name = content.text
              }
              if(item==='电子邮件'){
                this.email = content.text
              }
              if(item==='电话'){
                this.phone = content.text
              }
              if(item==='身份证'){
                this.idNumber = content.text
              }
              if(item==='紧急联系人'){
                this.emergencyContact = content.text
              }
              if(item==='紧急联系人电话'){
                this.emergencyContactPhone = content.text
              }
            }
          }})
      },
      //获取个人信息
      async getUserDate(params){
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
          this.birthYear = this.myData.birthYear
          this.birthMonth=this.myData.birthMonth
          this.birthDay=this.myData.birthDay
          this.avatar = this.myData.avatar?this.myData.avatar:require('@/assets/icon/headimg.png')
          if(!this.myData.avatar){
            this.avatar='http://micro-hotel.halohealth.cn/images/1561020722716.png'
          }
          if(this.myData.gender===1){
            this.gender = '男'
          }else {
            this.gender = '女'
          }
        }
      },
      //编辑个人信息
      async userUptate(params){
        let res = await userUptate(params)
        if(res.code === 200){
          this.$toast('修改成功')
          this.$route.params.callback && this.$route.params.callback()
          setTimeout(()=>{
            this.$router.back()
          },300)
        }else {
          this.$toast('修改失败')
        }
      },
      //信息提交保存
      save(){
        let params ={
          id:this.userID,
          gender:this.gender==='男'?1:2,
          name:this.name,
          // idNumber:this.idNumber,
          // emergencyContact:this.emergencyContact,
          // emergencyContactPhone:this.emergencyContactPhone,
          birthYear:this.birthYear,
          birthMonth:this.birthMonth,
          birthDay:this.birthDay,
          avatar:this.avatar

        }
        if(this.username){
          this.reg =/^[A-Za-z][a-zA-Z0-9_-]{4,16}$/
          params.username = this.username
        }
        if(this.email){
          params.email = this.email
        }
        if(this.idNumber){
          params.idNumber = this.idNumber
        }
        if(this.emergencyContact){
          params.emergencyContact = this.emergencyContact
        }
        if(this.emergencyContactPhone){
          params.emergencyContactPhone = this.emergencyContactPhone
        }
        if(this.username.match(this.reg)){

        }else {
          this.$toast('请输入正确的用户名，只能4~16位英文、数字、下划线、减号，首字母必选以字母开头')
          return
        }
        if(this.name===undefined){
          this.$toast('请填写姓名')
          return
        }
        if(this.birthYear===undefined){
          this.$toast('请选择出生年月')
          return
        }
        console.log(params);
        this.userUptate(params)
      },
      //设置生日
      setDate(){
        this.$picker.show({
          type:'datePicker',
          date:this.date,  //初始化时间
          endTime:'2020-12-31',  //截至时间
          startTime:'1900-01-01',  //开始时间
          onOk: (date) =>{
            this.birthYear = date.slice(0,4)
            this.birthMonth = date.slice(5,7)
            this.birthDay = date.slice(8,10)
          }
        });
      },
      handleSuccess (res, file) {
        file.url = res.data.url
        file.name = '头像'
        this.avatar = res.data.url
      },
      handleFormatError (file) {
        this.$toast('上传的图片格式不对，只支持jpg,jpeg,png')
      },
      handleMaxSize (file) {
        this.$toast('上传的图片最大不能超过2MB')
      },
    }
  }
</script>

<style scoped>
  .head-box >>> .ivu-upload-drag{
    background-color: #f1f1f1;
    border: none;
  }
  .content >>> .ivu-icon{
    font-size: 40px;
    color: #628CFDFF;
  }
  .box-wrap >>> .ivu-radio-group{
    padding: 5px 0 30px;
  }
  .box-wrap >>> .ivu-radio-wrapper{
    font-size: 28px;
  }
  .box-wrap >>> .ivu-radio-group-vertical .ivu-radio-wrapper {
    display: block;
    height: 0.8rem;
    line-height: 0.8rem;
  }
  .box-wrap >>> .ivu-radio{
    margin-right: 20px;
  }
  .box-wrap >>> .ivu-radio-inner{
    width: 30px;
    height: 30px;
  }
  .box-wrap >>> .ivu-radio-inner:after{
    width: 18px;
    height: 18px;
    border-radius: 50%;
    left: 5px;
    top:5px;
  }
</style>
<style lang="less" scoped>
  .main {
    background:rgba(241,241,241,1);
    padding:100px 0 54px;
    .head-box{
      height: 448px;
      padding: 40px 0 28px;
      margin: 0 40px;
      display: flex;
      flex-direction: column;
      align-items: center;
      border-bottom: solid #D4D4D4FF 1px; /*no*/
      img{
        width:248px;
        height:248px;
        border-radius: 50%;
        display: block;
      }
      .name{
        height:50px;
        font-size:36px;
        font-family:PingFangSC-Medium;
        font-weight:500;
        color:rgba(72,72,72,1);
        line-height:50px;
        margin: 30px 0 12px;
        text-align: center;
        border: none;
        background-color: #F1F1F1FF;
      }
      .edit-name{
        height:40px;
        font-size:28px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(98,140,253,1);
        line-height:40px;
      }
    }
    .content{
      padding: 0 40px;
      .title{
        height:42px;
        font-size:30px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(72,72,72,1);
        line-height:42px;
        margin: 50px 0 30px;
      }
      .items{
        width:670px;
        background:rgba(255,255,255,1);
        box-shadow:0px 10px 16px 0px rgba(0,0,0,0.04);
        border-radius:20px;
        font-size:26px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(51,51,51,1);
        margin: 0 auto;
        .item{
          height: 80px;
          line-height:80px;
          border-bottom: solid #D4D4D4 1px;
          text-align: left;
          padding: 0 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          span:last-child{
            font-size:26px;
            font-family:PingFangSC-Regular;
            font-weight:400;
            color:rgba(98,140,253,1);
            line-height:36px;
          }
        }
        .item:last-child{
          border-bottom:none;
        }
      }
      .business{
        width:670px;
        background:rgba(255,255,255,1);
        box-shadow:0px 10px 16px 0px rgba(0,0,0,0.04);
        border-radius:20px;
        margin: 0 auto;
        p:first-child{
          font-size:28px;
          font-family:PingFangSC-Regular;
          font-weight:400;
          color:rgba(51,51,51,1);
          line-height:84px;
          height: 84px;
          border-bottom: solid #D4D4D4FF 1px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 32px;
          span:last-child{
            font-weight:400;
            color:rgba(153,153,153,1);
          }
        }
        p:last-child{
          font-size:24px;
          font-family:PingFangSC-Regular;
          font-weight:400;
          color:rgba(153,153,153,1);
          line-height:80px;
          height: 80px;
          text-align: left;
          padding: 0 32px;
        }
      }
      .btn{
        width: 100%;
        height: 68px;
        margin: 40px 0;
        font-size: 28px;
        border-radius: 8px;
      }
    }
    .box-wrap{
      width:668px;
      background:rgba(255,255,255,1);
      border-radius:10px;
      overflow: hidden;
      text-align: center;
      p{
        height: 80px;
        line-height: 80px;
        font-size: 30px;
        font-weight: 600;
      }
      .btns{
        margin: 20px 0;
        display: flex;
        justify-content: space-between;
        button{
          margin: 0 30px;
        }
      }
    }
    .img-head{
      width:248px;
      height:248px;
      border-radius: 50%;
      display: block;
	    background-color: #cccccc;
	    overflow: hidden;
    }
  }
</style>
