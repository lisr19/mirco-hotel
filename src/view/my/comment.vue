<template>
    <div class="comment-body">
        <headBar title="评价"></headBar>
        <ul v-if="listNull" class="comment-box">
            <li v-for="(item,index) in userCommentList" :key="index">
                <h1>打分</h1>
                <h2>{{item.dateY}}年{{item.dateM}}月{{item.dateD}}日</h2>
                <!--<h2>浏览{{item.browse}}</h2>-->
                <div class="score-box">
                    <Rate style="float: left;" disabled v-model="item.score" />
                </div>
                <p>{{item.comment}}</p>
                <div class="hotel-box" @click="onClickHotelBox(item.hotelID,item.orderType)">
                    <img :src="item.hotelData.hotelImg" alt="">
                    <h1>{{item.hotelData.hotelName}}</h1>
                    <h2>总价：¥{{item.hotelData.hotelPrice}}</h2>
                    <h2>
                        <span>{{item.hotelData.hotelCity}}</span>
                    </h2>
                    <i></i>
                </div>
                <div class="more-but" @click="onClickOpenMore(item.commentID,item.orderId),newMark=item.score,newComment=item.comment">· · ·</div>
            </li>
        </ul>
        <div class="null-box" v-else>
            <h1>暂无评价</h1>
            <img src="@/assets/icon/null-icon.png" alt="">
        </div>
        <div class="more-window">
            <ul class="more-box">
                <li @click="onClickUpDataBut()">修改评价</li>
                <li>设为匿名</li>
                <li @click="onClickDelcomment()">删除评价</li>
                <li @click="onClickOffMore()">取消</li>
            </ul>
        </div>
        <div class="mark-box">
            <div>
                <Rate v-model="newMark"/>
                <p style="color: #628CFD;">{{newMark}}分</p>
                <Input v-model="newComment" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入评语" />
                <button @click="userCancelUpData()">取消</button>
                <button @click="onClickUpdataComment()">确认</button>
            </div>
        </div>
    </div>
</template>

<script>
import {getCommentList,delComment,updataComment} from "@/lib/API/comment";
import headBar from '@/components/header/head-bar'
export default {
    components:{
        headBar,
    },
    data(){
        return{
            userID:'',
            listNull:false,
            userCommentList:[],
            clickCommentID: '',
            clickOrderId:'',
            userUpdataCommentList:[],
            moreBox:[],
            upDataBox:[],
            newMark:0,
            newComment:'',
        }
    },
    methods:{
        async getCommentList(){
            let res = await getCommentList({userId:this.userID});
            if(res.code===200){
                this.userCommentList = [];
                let resList = res.data.list;
                if (resList.length){
                    this.listNull = true;
                }
                for(let i=0;i<resList.length;i++){
                    let score = Number(resList[i].grade);
                    let orderId = resList[i].orderId;
                    let orderType = resList[i].orderList.orderType;
                    let commentID = resList[i].id;
                    let time = resList[i].evaluateTime.split(' ')[0].split('-');
                    let comment = resList[i].content;
                    let hotelID;
                    let hotelPrice;
                    if(resList[i].orderList){
                        hotelID = resList[i].orderList.room[0].hotelId;
                        hotelPrice = resList[i].orderList.totalPrice;
                    }else{
                        hotelID = 0;
                        hotelPrice =0;
                    }
                    this.userCommentList.push({
                        orderType:orderType,
                        orderId:orderId,
                        commentID: commentID,
                        hotelID:hotelID,
                        score: score,
                        dateY:time[0],
                        dateM:time[1],
                        dateD:time[2],
                        comment:comment,
                        hotelData:{
                            hotelImg: resList[i].orderList.room[0].hotelImage1,
                            hotelName: resList[i].orderList.room[0].hotelName,
                            hotelPrice: resList[i].orderList.totalPrice,
                            hotelCity: resList[i].orderList.room[0].hotelAddress,
                        },
                        browse:'162',
                    })
                }
            }
        },
        onClickOpenMore(CID,OID){
            this.moreBox.style.height=('100%');
            this.clickCommentID=CID;
            this.clickOrderId=OID;
        },
        onClickOffMore(){
            this.moreBox.style.height=('0%');
            this.clickCommentID='';
            this.clickOrderId='';
        },
        // 用户删除评价
        async onClickDelcomment(){
            console.log(this.clickCommentID);
            let res = await delComment({id:this.clickCommentID});
            if(res.code===200){
                this.onClickOffMore();
                console.log('删除成功');
                this.getCommentList();
            }
        },
        // 用户点击修改评价
        onClickUpDataBut(){
            this.moreBox.style.height=('0%');
            this.upDataBox.style.height=('100%');
        },
        // 用户修改评价
        async onClickUpdataComment(){
            let updataDate = (new Date)+'';
            let res = await updataComment({
                id:this.clickCommentID,
                orderId:this.clickOrderId,
                evaluateTime:updataDate,
                userId:2,
                content:this.newComment,
                grade:this.newMark,
            });
            if(res.code===200){
                console.log('修改成功');
                this.upDataBox.style.height=('0%');
                this.newComment='';
                this.newMark=0;
                this.getCommentList();
            }
        },
        // 用户点击取消修改
        userCancelUpData(){
            this.moreBox.style.height=('100%');
            this.upDataBox.style.height=('0%');
        },
        onClickHotelBox(ID,type){
            let orderType
            if(type==1){
                orderType='酒店'
            }else if(type==2){
                orderType='民宿'
            }
            this.$router.push({path: 'hotel-detail',query:{hotelid:ID,seekType:orderType}});
        }
    },
    created(){
        this.userID = localStorage.getItem('MicroHotelUserData').split(',')[0];
        console.log('UserID:'+this.userID);
    },
    mounted(){
        this.getCommentList()
        this.upDataBox = document.getElementsByClassName('mark-box')[0];
        this.moreBox = document.getElementsByClassName('more-window')[0];
    }
}
</script>

<style scoped>
.ivu-rate{
    margin-top: -5%;
}
.ivu-rate >>> .ivu-rate-star-full:before{
    color: #626BFD;
}

.ivu-rate >>> .ivu-rate-star{
    font-size: 22px;
    line-height: 22px;
    margin: 0;
}
.mark-box >>> .ivu-rate-star{
  font-size: 46px;
}
</style>

<style lang="less" scoped>
.comment-body{
    background:rgba(250,250,252,1);
    min-height: 100% ;
    >.comment-box{
        width: 100%;
        margin-top: 90px;
        background:rgba(250,250,252,1);;
        >li{
            position: relative;
            background: rgba(255,255,255,1);
            list-style: none;
            width: 100%;
            height: 434px;
            border-radius:20px;
            top: 40px;
            margin-top: 40px;
            >h1{
                position: absolute;
                width: 48px;
                height: 34px;
                min-width: 2em;
                min-height: 1em;
                top: 28px;
                left: 5.33%;
                font-size:24px;
                font-family:PingFangSC-Medium;
                font-weight:500;
                color:rgba(51,51,51,1);
                line-height:34px;
            }
            >.score-box{
                position: absolute;
                top: 4%;
                left: 13.87%;
                // width: 130px;
                height: 22px;
                min-height: 1em;
            }
            >h2{
                position: absolute;
                font-size: 22px;
                height: 32px;
                min-height: 1em;
                width: auto;
                text-align: left;
                font-family:PingFangSC-Regular;
                font-weight:400;
                color:rgba(153,153,153,1);
            }
            >h2:nth-of-type(1){
                top: 30px;
                right: 40px;
            }
            >h2:nth-of-type(2){
                bottom: 28px;
                left: 40px;
            }
            >p{
                width:90%;
                height:115px;
                font-size:24px;
                font-family:PingFangSC-Regular;
                font-weight:400;
                color:rgba(51,51,51,1);
                line-height:34px;
                padding-top: 16px;
                border-top: 2px solid #E8E8E8;
                position: absolute;
                top: 74px;
                left: 50%;
                margin-left: -45%;
                text-align: left;
                display: -webkit-box;
                overflow: hidden;
                text-overflow: ellipsis;
                word-break: break-all;
                -webkit-box-orient: vertical;
                -webkit-line-clamp:3;
            }
            >.hotel-box{
                width:670px;
                height:116px;
                background:rgba(241,241,241,1);
                position: absolute;
                top: 234px;
                left: 50%;
                margin-left: -335px;
                >img{
                    position: absolute;
                    top: 16px;
                    left: 10px;
                    display: block;
                    width:84px;
                    height:84px;
                    border-radius:8px;
                }
                >h1{
                    position: absolute;
                    top: 16px;
                    left: 118px;
                    width:192px;
                    height:34px;
                    font-size:24px;
                    font-family:PingFangSC-Regular;
                    font-weight:400;
                    color:rgba(51,51,51,1);
                    line-height:34px;
                    text-align: left;
                    white-space: normal;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                >h2{
                    width: auto;
                    height: 34px;
                    font-size:24px;
                    font-family:PingFangSC-Regular;
                    font-weight:400;
                    color:rgba(153,153,153,1);
                    line-height:34px;
                    position: absolute;
                }
                >h2:nth-of-type(1){
                    top: 14px;
                    left: 378px;
                }
                >h2:nth-of-type(2){
                    width: 75%;
                    top: 66px;
                    left: 118px;
                    >span{
                        margin-right: 16px;
                    }
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
                >i{
                    display: block;
                    width: 28px;
                    height: 28px;
                    position: absolute;
                    top: 46px;
                    right: 20px;
                    border: 2px solid #999999;
                    border-left: 0;
                    border-bottom: 0;
                    transform: rotate(45deg);
                }
            }
            >.more-but{
                width:80px;
                height:44px;
                border-radius:22px;
                border:2px solid rgba(221,221,221,1);
                position: absolute;
                bottom: 16px;
                right: 40px;
                font-size: 40px;
                color: #CFCFCF;
                line-height: 40px;
            }
        }
    }
    >.null-box{
        width: 100%;
        min-height: 100% ;
        position: absolute;
        >h1{
            width: 200px;
            height: 70px;
            color: #484848;
            font-size:48px;
            font-family:PingFangSC-Semibold;
            font-weight:600;
            line-height:70px;
            position: absolute;
            top: 100px;
            left: 5.33%;
        }
        >img{
            display: block;
            width: 614px;
            height: auto;
            position: absolute;
            left: 50%;
            top: 30%;
            margin-left: -307px;
        }
    }
    >.more-window{
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
            height: 360px;
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
    >.mark-box{
                overflow: hidden;
                position: fixed;
                width: 100%;
                height: 0%;
                top: 0;
                left: 0;
                background: rgba(10,10,10,0.45);
                transition: all .5s;
                z-index: 10;
                >div{
                    width: 95%;
                    max-width: 888px;
                    height: 480px;
                    background: rgba(255,255,255,1);
                    position: relative;
                    top: 50%;
                    margin: 0 auto;
                    margin-top: -165px;
                    border-radius:10px;
                    >.ivu-rate{
                        margin-top: 0px ;
                    }
                    >p{
                        font-size: 32px;
                        font-weight:600;
                        font-family:PingFangSC-Semibold;
                    }
                    >.ivu-input-wrapper{
                        width: 90%;
                        height: 180px;
                        border: 3px solid #D4D4D4;
                        margin: 20px auto;
                        border-radius: 20px;
                        overflow: scroll;
                    }
                    >button{
                        margin: 0 10%;
                        float: left;
                        display: block;
                        width: 30%;
                        height: 90px;
                        outline-style: none;
                        border-radius: 10px;
                        background: #ffffff;
                        color: #628CFD;
                        font-family:PingFangSC-Semibold;
                    }
                    >button:nth-of-type(1){
                        border: 2px solid #628CFD;
                    }
                    >button:nth-of-type(2){
                        border: 2px solid #628CFD;
                    }
                }
            }
}
</style>
