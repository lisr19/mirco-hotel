<template>
  <div class="main">
    <div id="checkinout">
      <div id="firstSelect" style="width:100%;">
        <div class="Date_lr" style="float:left;">
          <!--<P>入住</p>-->
          <input id="startDate" type="text" value=""style="" readonly>
        </div>
        <div class="Date_lr" style="float:right;">
          <!--<p>离店</p>-->
          <input id="endDate" type="text" value="" style="" readonly>
        </div>
        <span class="span21">共<span class="NumDate">1</span>晚</span>
      </div>
    </div>
    <div class="mask_calendar">
      <div class="calendar"></div>
    </div>
  </div>
</template>

<script>
  import '@/common/css/calendar.css'
  import '@/common/js/jquery.min.js'
  import '@/common/js/date.js'

  export default {
    props: {
      checkBox: false // 标题
    },
    data() {
      return {
      }
    },
    created(){
      $(function(){
        $('#firstSelect').on('click',function () {
          $('.mask_calendar').show();
        });
        $('.mask_calendar').on('click',function (e) {
          if(e.target.className == "mask_calendar"){
            $('.calendar').slideUp(200);
            $('.mask_calendar').fadeOut(200);
          }
        })
        $('#firstSelect').calendarSwitch({
          selectors : {
            sections : ".calendar"
          },
          index : 5,      //展示的月份个数
          animateFunction : "slideToggle",        //动画效果
          controlDay:true,//知否控制在daysnumber天之内，这个数值的设置前提是总显示天数大于90天
          daysnumber : "60",     //控制天数
          comeColor : "#628CFDFF",       //入住颜色
          outColor : "#628CFDFF",      //离店颜色
          comeoutColor : "#628CFDFF",        //入住和离店之间的颜色
          callback :function(){//回调函数
            $('.mask_calendar').fadeOut(200);
            var startDate = $('#startDate').val();  //入住的天数
            var endDate = $('#endDate').val();      //离店的天数
            var NumDate = $('.NumDate').text();    //共多少晚
            console.log(startDate);
            console.log(endDate);
            console.log(NumDate);
            //下面做ajax请求
            //show_loading();
            /*$.post("demo.php",{startDate:startDate, endDate:endDate, NumDate:NumDate},function(data){
                        if(data.result==1){
                            //成功
                        } else {
                            //失败
                        }
                    });*/
          }  ,
          comfireBtn:'.comfire'//确定按钮的class或者id
        });
        var b=new Date();
        var ye=b.getFullYear();
        var mo=b.getMonth()+1;
        mo = mo<10?"0"+mo:mo;
        var da=b.getDate();
        da = da<10?"0"+da:da;
        $('#startDate').val(ye+'-'+mo+'-'+da);
        b=new Date(b.getTime()+24*3600*1000);
        var ye=b.getFullYear();
        var mo=b.getMonth()+1;
        mo = mo<10?"0"+mo:mo;
        var da=b.getDate();
        da = da<10?"0"+da:da;
        $('#endDate').val(ye+'-'+mo+'-'+da);
      });
    },
    methods:{
    }
  }
</script>


<style scoped>
  .Date_lr{width:50%;text-align:center;}
  .span21{
    position: absolute;
    top: 52%;
    left: 50%;
    -webkit-transform: translate(-50%,-50%);
    transform: translate(-50%,-50%);
    padding:3px 18px;
    border-radius: 50px;
    background-color: #fff;
    line-height: 32px;
    border:1px solid rgba(151,151,151,1);
    font-size:22px;
    font-family:PingFangSC-Regular;
    font-weight:400;
    color:rgba(51,51,51,1);
  }
  #checkinout{
    height: 78px;
    line-height: 78px;
    position: relative;
    padding: 2px 0;
    display: -webkit-box;
    display: flex;
  }
  #firstSelect p{line-height:25px;color: #999;font-size:12px;}
  #startDate{border:0;position: absolute;left: 0;margin: 0 auto;width: 50%;font-size:28px;
    font-family:PingFangSC-Semibold;font-weight:600;color:rgba(72,72,72,1);text-align: left;}
  #endDate{border:0;position: absolute;right: 0;margin:auto 0;width:50%;font-size:28px;
    font-family:PingFangSC-Semibold;font-weight:600;color:rgba(72,72,72,1);text-align: right;}
  .mask_calendar {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,.4);
    display: none;
    z-index: 9999;
  }
  .calendar {
    height: 70%;
    position: fixed;
    bottom: 0;
    left: 0;
  }
  .animated {
    animation-duration: 1s;
    animation-fill-mode: both;
  }
  @keyframes slideInDown {
    from {
      transform: translate3d(0, -100%, 0);
      visibility: visible;
    }

    to {
      transform: translate3d(0, 0, 0);
    }
  }
  .slideInDown {
    animation-name: slideInDown;
  }
  input:focus { outline: none; }
</style>
