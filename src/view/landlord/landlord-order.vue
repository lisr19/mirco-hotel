<template>
    <div class="oreder-body">
        <head title='房间订单详情'></head>
        <div class="details-body">
            <div class="room-box">
                <h1>{{orderData.roomName}}</h1>
                <i></i>
                <img :src="orderData.roomLogoImg" alt="">
                <ul>
                    <li>下单时间：{{orderData.addTime}}</li>
                    <li>入离时间：{{orderData.intoTime}} 至 {{orderData.outTime}}</li>
                    <li>房型：{{orderData.roomType}}</li>
                    <li>总价：¥{{orderData.price}}</li>
                </ul>
            </div>
            <div class="user-box">
                <img :src="orderData.userHea" alt="">
                <ul>
                    <li>{{orderData.trueName}}</li>
                    <li>电话：<span>{{orderData.userPhone}}</span></li>
                    <li>紧急联系人：<span>{{orderData.nameTwo}}</span></li>
                </ul>
                <i></i>
            </div>
            <div v-if="ifEvaluation" class="EVA-box">
                <h1>评分：</h1>
                <h1>评价：</h1>
                <Rate disabled v-model="orderData.EVAgrade" />
                <p>{{orderData.EVATxt}}</p>
            </div>
        </div>
        <div class="call-user" @click="openViewByPath(orderData.userId,orderData.userHea,orderData.userName)">联系房客</div>
    </div>
</template>

<script>
import hea from '@/components/header/head-bar'
import {getOrderDetails} from '@/lib/API/landlord'
export default {
    components:{
        hea
    },
    data(){
        return{
            ifEvaluation:false,
            orderId:null,
            orderData:{},
            lists:{}
        }
    },
    methods:{
        neatenGetData(){
            let datas = this.$route.query.orderData;
            console.log(datas)
            this.orderData={
                userHea:datas.user[0].avatar,
                userId:datas.user[0].id,
                userName:datas.user[0].username,
                userPhone:datas.phone,
                trueName:datas.user[0].name,
                nameTwo:datas.user[0].emergencyContact,
                nameTwoPhone:datas.user[0].emergencyContactPhone,
                roomName:this.lists.hotel.name,
                roomLogoImg:this.lists.hotel.image1,
                addTime:this.lists.addTime,
                intoTime:(this.lists.startTime).split(' ')[0],
                outTime:(this.lists.startTime).split(' ')[0],
                roomType:this.lists.room.roomType,
                price:this.lists.totalPrice
            };
            if(datas.evaluation.length){
                this.ifEvaluation=true;
                this.orderData.EVATxt = datas.evaluation.content;
                this.orderData.EVAgrade = datas.evaluation.grade;
            }
            console.log(this.orderData)
        },
        async getHomeData(){
            this.orderId = this.$route.query.orderData.id;
            let res = await getOrderDetails({id:this.orderId});
            if(res.code===200){
                this.lists = res.data;
                this.neatenGetData()
            }else{
                this.$router.back()
            }
        },
        // 打开聊天窗口
        openViewByPath(id,img,name) {
            this.$router.push({
            path: '/chat',
            query: {
                id: id,
                logoUrl: img,
                name: name
            }
            })
            let params = {
            id: id
            }
            this.$store.dispatch('clearTip', params)
        },
    },
    created(){
    },
    mounted(){
        this.getHomeData()
    }
}
</script>

<style scoped>
.ivu-rate{
    position: absolute;
    left: 132px;
    top: -5px;
}
.ivu-rate >>> .ivu-rate-star-full:before{
    color: #626BFD;
}
.ivu-rate >>> .ivu-rate-star{
    margin: 0;
}
.ivu-rate >>> .ivu-rate-star{
    font-size: 46px;
    line-height: 46px;
}
</style>
<style lang="less" scoped>
.oreder-body{
    width: 100%;
    height: 100%;
    background: #F8F9FB;
    position: relative;
    i{
        display: block;
        width:670px;
        height:2px;
        background: #E8E8E8;
        position: absolute;
    }
    .room-box{
        width: 750px;
        height: 344px;
        float: left;
        margin: 110px auto 30px;
        background: #fff;
        position: relative;
        >h1{
            height:40px;
            font-size:28px;
            font-family:PingFangSC-Regular;
            font-weight:400;
            color:rgba(51,51,51,1);
            line-height:40px;
            max-width: 650px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            position: absolute;
            top: 56px;
            left: 40px;
            text-align: left;
        }
        >i{
            top: 104px;
            left: 40px;
        }
        >img{
            display: block;
            width: 168px;
            height: 168px;
            border-radius: 10px;
            position: absolute;
            top: 126px;
            left: 40px;
        }
        >ul{
            position: absolute;
            top: 122px;
            left: 244px;
          >li{
                max-width: 500px;
                height:34px;
                font-size:24px;
                font-family:PingFangSC-Regular;
                font-weight:400;
                color:rgba(72,72,72,1);
                line-height:34px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                text-align: left;
                margin-bottom: 10px;
          }
        }
    }
    .user-box{
        width: 750px;
        min-height: 264px;
        max-height: 416px;
        float: left;
        margin: 0 auto;
        position: relative;
        background:rgba(255,255,255,1);
        >img{
            width: 168px;
            height: 168px;
            border-radius: 10px;
            display: block;
            position: absolute;
            top: 20px;
            left: 40px;
        }
        >ul{
            position: absolute;
            top: 36px;
            left: 244px;
            >li{
                height:40px;
                font-size:28px;
                font-family:PingFangSC-Regular;
                font-weight:400;
                color:rgba(51,51,51,1);
                line-height:40px;
                text-align: left;
                margin-bottom: 18px;
                >span{
                    color: #628CFD;
                }
            }
        }
        >i{
            top: 218px;
            left: 40px;
        }
    }
    .EVA-box{
        width: 750px;
        height: 184px;
        float: left;
        margin: -20px auto 0;
        margin-bottom: 14px;
        background: #fff;
        position: relative;
        >h1{
            width: 78px;
            height:36px;
            font-size:26px;
            font-family:PingFangSC-Medium;
            font-weight:500;
            color:rgba(51,51,51,1);
            line-height:36px;
            text-align: left;
            position: absolute;
            left: 40px;
            white-space: nowrap;
        }
        >h1:nth-of-type(1){
            top: 0;
        }
        >h1:nth-of-type(2){
            top: 58px;
        }
        >p{
            width:586px;
            height:102px;
            font-size:26px;
            font-family:PingFangSC-Regular;
            font-weight:400;
            color:rgba(51,51,51,1);
            line-height:36px;
            text-align: left;
            position: absolute;
            top: 58px;
            left: 124px;
            display: -webkit-box;
            overflow: hidden;
            text-overflow: ellipsis;
            word-break: break-all;
            -webkit-box-orient: vertical;
            -webkit-line-clamp:3;
        }
    }
    .call-user{
        width:90%;
        height:90px;
        background:rgba(98,140,253,1);
        border-radius:6px;
        position: absolute;
        bottom: 44px;
        left: 40px;
        font-size:32px;
        font-family:PingFangSC-Semibold;
        font-weight:600;
        color:rgba(255,255,255,1);
        line-height:90px;
    }
}
</style>
