<template>
    <div class="loginEnroll-body">
        <img src="@/assets/img/login-back.png" alt="">
        <div class="login-box">
            <input  v-model="userPhoneNum" type="text" placeholder='请输入手机号码'>
            <input  v-model="userPassWord" v-if="showPass" type="text" placeholder='请输入密码' name="">
            <input  v-model="userPassWord" v-else type="password" placeholder='请输入密码' name="">
            <div class="show-pass" @click="onClickPassShow">
                <img v-if="showPass" src="@/assets/icon/hide-pass.png" alt="">
                <img v-else style="margin: 20% 0;" src="@/assets/icon/show-pass.png" alt="">
            </div>
            <button class="login-but" @click="userLogin()">登录</button>
            <h1 class="forget-pass" @click="openForget()">忘记密码？</h1>
            <h1 class="new-enroll" @click="onClickEnrollBox()">注册账号</h1>
            <p v-if="warningShow" class="warning">{{warningText}}</p>
        </div>
        <div class="enroll-box">
            <div class="go-login" @click="onClickLoginBox">
                <!-- <i></i> -->
                <i></i>
            </div>
            <input  v-model="newUserPhoneNum" placeholder='请输入手机号码' type="text">
            <input  v-model="newUserverification" type="text" placeholder='输入验证码'>
            <input  v-model="newUserPassWord" placeholder='请设置您的密码' type="text">
            <h5 class="get-note" @click="SMS(1)">{{noteButtonText}}</h5>
            <button class="enroll-but" @click="newUser()">注册，并立即登录</button>
            <h1>点击注册，表示您已同意<span>《微酒店服务协议》</span></h1>
            <p v-if="warningShow" class="warning">{{warningText}}</p>
        </div>
        <div class="forget-box">
            <div class="go-login" @click="offForget">
                <i></i>
            </div>
            <input  v-model="userPhone" placeholder='请输入手机号码' type="text">
            <input  v-model="userVerification" type="text" placeholder='输入验证码'>
            <input  v-model="userNewPass" placeholder='输入您的新密码' type="text">
            <h5 class="get-note" @click="SMS(2)">{{noteButtonText}}</h5>
            <button class="forget-but" @click="newPass()">修改密码，并立即登录</button>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import {newUser,userLogin,SMS,newPass} from "@/lib/API/login-enroll";
import {getHomeList} from '@/lib/API/landlord';
export default {
    data(){
        return{
            SMSNum:0,// 验证码
            showPass: false,
            //登录的 账号 密码
            userPhoneNum: '',
            userPassWord: '',
            //新账号的 账号 验证码 密码
            newUserPhoneNum:'',
            newUserverification:'',
            newUserPassWord:'',
            noteButtonText:'获取验证码',
            note60SLock:true,
            //忘记密码的 账号 验证码 新密码
            userPhone:'',
            userVerification:'',
            userNewPass:'',
            //错误提示
            warningTextList:['手机号码有误','验证码有误','手机号码已存在','密码长度不得小于6位','账户或密码有误'],
            warningText:'',
            warningShow:false,
            loginButton:[],
            enrollButton:[],
            forgetButton:[],
            loginBox:[],
            enrollBox:[],
            forgetBox:[],
            isLogin:true,
        }
    },
    methods:{
        // 登录注册窗口切换
        onClickEnrollBox(){
            this.warningShow = false;
            this.loginBox.style.left='-50%';
            this.enrollBox.style.left='50%';
        },
        onClickLoginBox(){
            this.warningShow = false;
            this.loginBox.style.left='';
            this.enrollBox.style.left='';
        },
        // 打开、关闭忘记密码窗口
        openForget(){
            this.warningShow = false;
            this.loginBox.style.left='-50%';
            this.forgetBox.style.left='50%'
        },
        offForget(){
            this.warningShow = false;
            this.loginBox.style.left='';
            this.forgetBox.style.left=''
        },
        // 登录密码显示隐藏
        onClickPassShow(){
            if(this.showPass){
                this.showPass = false;
            }else{
                this.showPass = true;
            }
        },
        //登录按钮颜色
        loginButtonDecide(){
            if(this.userPhoneNum&&this.userPassWord){
                this.loginButton.style.background='#628CFD';
            }else{
                this.loginButton.style.background='#969696';
            }
        },
        //注册按钮颜色
        enrollButtonDecide(){
            if(this.newUserPhoneNum&&this.newUserverification&&this.newUserPassWord){
                this.enrollButton.style.background='#628CFD';
            }else{
                this.enrollButton.style.background='#969696';
            }
        },
        //修改密码按钮变色
        forgetButtonDecide(){
            if(this.userPhone&&this.userVerification&&this.userNewPass){
                this.forgetButton.style.background='#628CFD';
            }else{
                this.forgetButton.style.background='#969696';
            }
        },
        // 获取注册验证码
        onClickGetNote(){
            //倒计时
            if(this.note60SLock){
                this.note60SLock = false;
                let second = 60;
                let countDown = setInterval(()=>{
                  this.noteButtonText = second+'S';
                    second--;
                    if(second == 0){
                        clearInterval(countDown);
                        this.note60SLock = true;
                        this.noteButtonText = '重新发送';
                    }
                },1000)
            }
        },
        // 警告提示
        warningTextShow(index,TXT){
            this.warningShow = true;
            this.warningText = TXT;
            setTimeout(()=>{
                if(this.warningShow){
                    let warningBox = document.getElementsByClassName('warning')[index]
                    warningBox.style=('background:#fff;color:rgba(253,98,98,1);')
                }
            },100);
        },
        // 用户登录
        async userLogin(){
            let res = await userLogin({
                username:this.userPhoneNum,
                password :this.userPassWord,
                type:1,
            });
            console.log(res,this.userPassWord)
            if(res.code===200){
                let isLandlordRes = await getHomeList({userId:res.data.userInfo.id,deleted:0})
                let isLan;
                if(isLandlordRes.code===200){
                    if(isLandlordRes.data.list.length){
                        isLan = true;
                    }else{
                        isLan = false;
                    }
                    //websocket连接
                    this.socketApi.initWebSocket(res.data.userInfo.id);
                    console.log(res.data.userInfo.id)
                    let userData = res.data.userInfo.id+','+res.data.token+','+isLan
	                let token = res.data.token
	                localStorage.setItem('token',token)
                    localStorage.setItem('MicroHotelUserData',userData);
                    if(this.isLogin){
                        this.$router.push({name:'首页',params:{isLogin:true}})
                    }else {
                        this.$router.push({name:'我的'})
                    }
                }
            }else{
                this.warningTextShow(0,res.message);
            }
        },
        // 新用户注册
        async newUser(){
            if(this.newUserverification == this.SMSNum){
                let res = await newUser({
                    phone:this.newUserPhoneNum,
                    password:this.newUserPassWord,
                    addTime:(new Date)+'',
                });
                if(res.code===200){
                    this.userPhoneNum=this.newUserPhoneNum;
                    this.userPassWord=this.newUserPassWord;
                    this.isLogin = false
                    this.userLogin()
                }else{
                    this.warningTextShow(1,res.message);
                }
            }else{
                this.warningTextShow(1,'验证码错误');
            }
        },
        // 用户修改密码
        async newPass(){
            if(this.userVerification == this.SMSNum){
                let res = await newPass({
                    phone:this.userPhone,
                    password:this.userNewPass
                });
                console.log(res,this.userNewPass)
                if(res.code===200){
                    this.userPhoneNum = this.userPhone;
                    this.userPassWord = this.userNewPass;
                    this.isLogin = true;
                    this.userLogin()
                }else{
                    this.warningTextShow(2,res.message);
                }
            }else{
                this.warningTextShow(2,'验证码错误');
            }
        },
        // 发送信息
        async SMS(index){
            let res;
            if(index==1){
                res = await SMS({phone:this.newUserPhoneNum})
            }else if(index==2){
                res = await SMS({phone:this.userPhone})
            }
            if(res.code===200){
                this.SMSNum = res.data;
                this.onClickGetNote()
            }else{
                this.warningTextShow(index,res.message);
            }
        }
    },
    mounted(){
        this.loginButton = document.getElementsByClassName('login-but')[0];
        this.loginBox = document.getElementsByClassName('login-box')[0];
        this.enrollButton = document.getElementsByClassName('enroll-but')[0];
        this.enrollBox = document.getElementsByClassName('enroll-box')[0];
        this.forgetButton = document.getElementsByClassName('forget-but')[0];
        this.forgetBox = document.getElementsByClassName('forget-box')[0];
    },
    updated(){
        this.forgetButtonDecide();
        this.enrollButtonDecide();
        this.loginButtonDecide();
    }

}
</script>
<style lang="less" scoped>
    .loginEnroll-body{
        width: 100%;
        height: 100%;
        background-size: cover;
        button{
            transition: all .5s;
        }
        >img{
            display: block;
            width: 100%;
            height: 100%;
        }
        >div{
            position: fixed;
            top: 50%;
            margin-left: -289px;
            background: #fff;
            border-radius:10px;
            transition: all .5s;
            >input{
                width: 440px;
                height: 58px;
                outline: none;
                display: block;
                border: 0;
                border-bottom: 2px solid #C7C7C7;
                background: #fff ;
                margin: 38px auto 0;
                font-size:24px;
                font-family:PingFangSC-Regular;
                font-weight:400;
                line-height:58px;
            }
            >input:nth-of-type(1){
                margin-top: 68px;
            }
            >button{
                border: 0;
                width:440px;
                height:72px;
                background:rgba(150,150,150,1);
                box-shadow:0px 4px 8px 4px rgba(80,113,203,0.12);
                border-radius:10px;
                outline: none;
                font-size:28px;
                font-family:PingFangSC-Medium;
                font-weight:500;
                color:rgba(255,255,255,1);
                line-height:72px;
                margin-top: 64px;
            }
            >h1{
                position: absolute;
                height:34px;
                font-size:24px;
                font-family:PingFangSC-Regular;
                font-weight:400;
                color:rgba(153,153,153,1);
                line-height:34px;
            }
            >p{
                width: 100%;
                height: 34px;
                position: absolute;
                top: 20px;
                left: 0;
                font-size:24px;
                font-family:PingFangSC-Regular;
                font-weight:400;
                line-height:34px;
                background: rgba(253,98,98,1);
                color:#fff;
                transition: all 1s;
            }
        }
        .login-box{
            width: 578px;
            height: 512px;
            margin-top: -256px;
            left: 50%;
            input{
              padding-left: 15px;
            }
            >.show-pass{
                width: 40px;
                height: 40px;
                position: absolute;
                right: 78px;
                top: 180px;
                >img{
                    display: block;
                    width: 100%;
                }
            }
            >h1:nth-of-type(1){
                top: 426px;
                left: 270px;
            }
            >h1:nth-of-type(2){
                top: 426px;
                left: 414px;
            }
        }
        .enroll-box{
            width: 630px;
            height: 616px;
            margin-top: -308px;
            margin-left: -315px;
            left: 150%;
            >.go-login{
                width: 50px;
                height: 50px;
                position: absolute;
                top: 10px;
                left: 10px;
                z-index: 10;
                >i{
                    display: block;
                    position: absolute;
                }
                >i:nth-of-type(1){
                    width: 20px;
                    height: 20px;
                    border: 2px solid rgba(150,150,150,1);
                    border-top: 0;
                    border-right: 0;
                    transform: rotate(45deg);
                    top: 50%;
                    margin-top: -10px;
                    margin-left: 11px;
                }
            }
            >.get-note{
                position: absolute;
                top: 160px;
                right: 95px;
                padding: 0 10px;
                width: auto;
                min-width: 140px;
                height: 52px;
                font-size:24px;
                line-height: 50px;
                border-radius: 10px;
                color: rgba(150,150,150,1);
                border: 2px solid rgba(150,150,150,1);
            }
            >h1{
                width: 100%;
                bottom: 24px;
                left: 0;
                height: auto;
                >span{
                    color: #628CFD;
                }
            }
        }
        .forget-box{
            width: 630px;
            height: 516px;
            margin-top: -258px;
            margin-left: -315px;
            left: 150%;
            z-index: 10;
            >.go-login{
                width: 50px;
                height: 50px;
                position: absolute;
                top: 10px;
                left: 10px;
                z-index: 10;
                >i{
                    display: block;
                    position: absolute;
                }
                >i:nth-of-type(1){
                    width: 20px;
                    height: 20px;
                    border: 2px solid rgba(150,150,150,1);
                    border-top: 0;
                    border-right: 0;
                    transform: rotate(45deg);
                    top: 50%;
                    margin-top: -10px;
                    margin-left: 11px;
                }
            }
            >.get-note{
                position: absolute;
                top: 160px;
                right: 95px;
                padding: 0 10px;
                width: auto;
                min-width: 140px;
                height: 52px;
                font-size:24px;
                line-height: 50px;
                border-radius: 10px;
                color: rgba(150,150,150,1);
                border: 2px solid rgba(150,150,150,1);
            }
        }
    }

</style>

