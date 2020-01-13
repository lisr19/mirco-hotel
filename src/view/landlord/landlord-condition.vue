<template>
    <div class="condition-body">
        <div class="top-box">
            <div class="close-but" @click="closeCondition">
                <i></i>
                <i></i>
            </div>
        </div>
        <div class="page-name">
            <div></div>
            <h1>房客预订条件</h1>
        </div>
        <div class="set-area">
            <h1>微酒店对房客的要求</h1>
            <h2>
                <i></i>
                <span>已验证手机号</span>
            </h2>
            <h2>
                <i></i>
                <span>付款信息</span>
            </h2>
            <h2>
                <i></i>
                <span>同意您的房屋守则</span>
                <div class="Add" @click="openOfficialRulesAdd()">{{addButTxt}}</div>
            </h2>
            <div class="edge"></div>
            <h1>
                <span>其他要求</span>
                <div class="Add" @click="onClickOpenAdd()">{{userAddButTxt}}</div>
            </h1>
            <pre class="add-rules">{{addRules}}</pre>
        </div>
        <div class="update-but" @click="onClickUpData()">保存并上传信息</div>
        <div class="text-box" >
            <div class="close-box" @click="onClickCloseAdd()"></div>
            <div class="text-body">
                <Input v-model="addRules" type="textarea" :rows="10" placeholder="输入你想添加的守则" />
                <div class="ok-but" @click="ifUserAddNull()">完成</div>
            </div>
        </div>
        <div class="official-rules-box">
            <div class="close-box" @click="ifOfficialRulesNull()"></div>
            <div class="choose-box">
                <ul>
                    <li v-for="(item,index) in roomRules" :key="index">
                        <h3>{{item}}</h3>
                        <div @click="onClickAddThisBut(index)" class=""><i></i></div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import {addRoomRules,updateRoomRules} from "@/lib/API/landlord"
export default {
    data(){
        return{
            updata:false,
            roomId:null,
            addRulesBox:{},
            officialRulesBox:{},
            clickAddRulesButS:{},
            addRules:'',
            addRoomRules:[],
            addButTxt:'添加',
            userAddButTxt:'添加',
            roomRules:['禁止儿童（2-12岁）','禁止婴幼儿（2岁以下）','禁止携带宠物入住','禁止吸烟','禁止举办活动或聚会'],
        }
    },
    methods:{
        // 用户添加其他条件窗口开关
        onClickOpenAdd(){
            this.addRulesBox.style.height='100%';
        },
        onClickCloseAdd(){
            this.addRulesBox.style.height='0%';
        },
        // 用户添加官方条件窗口开关
        openOfficialRulesAdd(){
            this.officialRulesBox.style.height='100%';
        },
        closeOfficialRulesAdd(){
            this.officialRulesBox.style.height='0%';
        },

        closeCondition(){
            this.$router.push({name: 'landlord'})
        },

        ifUserAddNull(){
            if(this.addRules){
                this.userAddButTxt = '修改';
            }else{
                this.userAddButTxt = '添加';
            }
            this.onClickCloseAdd();
            console.log(this.addRules)
        },

        ifOfficialRulesNull(){
            if(this.addRoomRules){
                this.addButTxt='修改';
            }else{
                this.addButTxt='添加';
            }
            this.closeOfficialRulesAdd();
        },

        onClickAddThisBut(index){
            if(this.clickAddRulesButS[index].className){
                this.clickAddRulesButS[index].className='';
                let outRules = this.roomRules[index];
                if(this.addRoomRules.length==1){
                    this.addRoomRules=[];
                }else{
                    for(let i=0;i<this.addRoomRules.length;i++){
                        if(outRules==this.addRoomRules[i]){
                            this.addRoomRules.splice(i,1);
                        }
                    }
                }
            }else{
                this.clickAddRulesButS[index].className='click-yes';
                this.addRoomRules.push(this.roomRules[index]);
            }
            console.log(this.addRoomRules)
        },

        async onClickUpData(){
            let userAdd = this.addRules.split('\n');
            let updata = this.addRoomRules
            for(let i=0;i<userAdd.length;i++){
                updata.push(userAdd[i])
            }
            let res;
            if(this.updata){
              console.log(111);
              res = await updateRoomRules({
                    roomId:this.roomId,
                    ruleType:7,
                    content:updata.join(),
                    flag:1
                });
            }else{
              console.log(22);
              res = await addRoomRules({
                    roomId:this.roomId,
                    ruleType:7,
                    content:updata.join(),
                    flag:1
                });
            }
            console.log(res)
            if(res.code==200){
                if(this.addButTxt==='添加'){
                  this.$toast('添加成功')
                }else {
                  this.$toast('修改成功')
                }
                this.$router.push({name:'landlord'})
            }else{
                 this.$toast('请添加房客要求')
            }
        }
    },
    created(){
        this.updata = this.$route.query.updata;
        this.roomId = this.$route.query.roomId;
    },
    mounted(){
        this.officialRulesBox = document.getElementsByClassName('official-rules-box')[0];
        this.addRulesBox = document.getElementsByClassName('text-box')[0];
        this.clickAddRulesButS = document.getElementsByClassName('choose-box')[0].getElementsByTagName('div');
    }
}
</script>

<style scoped>
.text-body >>> textarea {
    border:none;
    font-size: 30px;
    outline: none;
    padding: 20px;
}
</style>


<style lang="less" scoped>
.condition-body{
    position: relative;
    width: 100%;
    height: 100%;
    background:rgba(248,249,251,1);
    .top-box{
        width: 100%;
        height: 80px;
        background:rgba(245,245,245,1);
        position: fixed;
        top: 0;
        left: 0;
        z-index: 10;
        .close-but{
            position: absolute;
            top: 28px;
            left: 40px;
            width: 30px;
            height: 30px;
            >i{
                display: block;
                position: absolute;
                width: 2px;
                height: 30px;
                top: 0;
                left: 50%;
                background: #555555;
            }
            >i:nth-of-type(1){
                transform: rotate(45deg);
            }
            >i:nth-of-type(2){
                transform: rotate(-45deg);
            }
        }
    }
    .page-name{
        width: 288px;
        height: 66px;
        position: absolute;
        top: 128px;
        left: 40px;
        >h1{
            min-width: 6em;
            position: absolute;
            top: 0;
            left: 0;
            font-size:48px;
            font-family:PingFangSC-Semibold;
            font-weight:600;
            color:rgba(51,51,51,1);
            line-height:66px;
        }
        >div{
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 18px;
            background:linear-gradient(90deg,rgba(155,192,255,1) 0%,rgba(98,140,253,1) 100%);
        }
    }
    .set-area{
        padding-top: 294px;
        width: 100%;
        >h1{
            height:50px;
            font-size:36px;
            font-family:PingFangSC-Semibold;
            font-weight:600;
            color:rgba(51,51,51,1);
            line-height:50px;
            text-align: left;
            margin-left: 40px;
            margin-bottom: 10px;
        }
        >h2{
            height:44px;
            font-size:32px;
            font-family:PingFangSC-Regular;
            font-weight:400;
            color:rgba(72,72,72,1);
            line-height:44px;
            text-align: left;
            margin-left: 40px;
            margin-top: 24px;
            >i{
                display: inline-block;
                width: 30px;
                height: 15px;
                border: 2px solid #628CFD;
                border-top: 0;
                border-right: 0;
                transform: rotate(-45deg);
                margin-right: 20px;
                margin-bottom: 6px;
            }
        }
        .Add{
            width:64px;
            height:44px;
            font-size:32px;
            font-family:PingFangSC-Regular;
            font-weight:400;
            color:rgba(98,140,253,1);
            line-height:44px;
            float:right;
            margin-right: 40px;
        }
        .edge{
            width:670px;
            height:2px;
            background: #D4D4D4;
            margin: 76px auto 48px;
        }
    }
    .add-rules{
        text-align: left;
        font-size: 30px;
        width: 90%;
        min-height: 430px;
        margin: 0 auto;
        font-family:PingFangSC-Semibold;
        color:rgba(51,51,51,1);
    }
    .update-but{
        width:450px;
        height:66px;
        background:rgba(98,140,253,1);
        border-radius:4px;
        font-size:32px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(255,255,255,1);
        line-height:66px;
        margin: 48px auto;
    }
    .text-box{
        width: 100%;
        height: 0%;
        background: rgba(0,0,0,0.5);
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 11;
        overflow: hidden;
        transition: all .5s;
        >.close-box{
            width: 100%;
            height: 50%;
            position: absolute;
            top:0;
            left: 0;
        }
        >.text-body{
            width: 100%;
            height: 50%;
            background: #fff;
            position: absolute;
            bottom: 0;
            left: 0;
            border-radius: 20px 20px 0 0;
            overflow: hidden;
            >.ok-but{
                width:450px;
                height:66px;
                background:rgba(98,140,253,1);
                border-radius:4px;
                font-size:32px;
                font-family:PingFangSC-Regular;
                font-weight:400;
                color:rgba(255,255,255,1);
                line-height:66px;
                position: absolute;
                bottom: 54px;
                left: 150px;
            }
        }
    }
    .official-rules-box{
        width: 100%;
        height: 0%;
        background: rgba(0,0,0,0.5);
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 11;
        overflow: hidden;
        transition: all .5s;
        >.close-box{
            width: 100%;
            height: 416px;
            position: absolute;
            top:0;
            left: 0;
        }
        >.choose-box{
            width: 100%;
            height: 918px;
            background: #fff;
            border-radius:20px 20px 0px 0px;
            position: absolute;
            bottom: 0;
            left: 0;
            >ul li{
                width: 90%;
                height: 136px;
                border-bottom: 2px solid #D4D4D4;
                margin: 0 auto;
                text-align: left;
                line-height: 136px;
                font-size:32px;
                font-family:PingFangSC-Regular;
                font-weight:400;
                color:rgba(72,72,72,1);
                position: relative;
                >div{
                    width:48px;
                    height:44px;
                    border-radius:6px;
                    border:2px solid rgba(98,140,253,1);
                    position: absolute;
                    top: 44px;
                    right: 0px;
                    transition: all .5s;
                    >i{
                        display: block;
                        width: 30px;
                        height: 15px;
                        border: 2px solid #628CFD;
                        border-top: 0;
                        border-right: 0;
                        transform: rotate(-45deg);
                        position: absolute;
                        top: 10px;
                        left: 8px;
                    }
                }
                >.click-yes{
                    background: #628CFD;
                    >i{
                        border: 2px solid #fff;
                        border-top: 0;
                        border-right: 0;
                    }
                }
            }
        }
    }
}
</style>
