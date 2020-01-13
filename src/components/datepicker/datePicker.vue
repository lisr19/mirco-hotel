<template>
  <div class="am-calendar">
    <transition name="am-calendar-mask">
      <div class="am-calendar-backdrop" @click="closeCalendar" v-show="showCalendar"></div>
    </transition>
    <transition name="am-calendar-content">
      <div class="am-calendar-content am-calendar-content-transition" v-show="showCalendar" ref="amCalendar">
        <div class="am-calendar-title">
          <span class="close" @click="closeCalendar">
            <span class="iconfont icon-xdn-data-close-big">关闭</span>
          </span>
          <span class="title">选择入住离店日期</span>
          <span class="button" @click="successCallback">完成</span>
        </div>
        <div class="am-calendar-week-bar">
          <span class="weekend">日</span>
          <span>一</span>
          <span>二</span>
          <span>三</span>
          <span>四</span>
          <span>五</span>
          <span class="weekend">六</span>
        </div>
        <!--<div class="month-bar-fixed" id="fixedBarEle" ref="fixedBar" :style="{'opacity': fixedBarOpacity}">{{ fixedMonthbar }}</div>-->
        <div class="scroll-panel-wrapper" id="scroll-panel-wrapper" ref="scroll">
          <div class="scroll-date-wrapper" id="scroll-panel">
            <div class="month-panel" v-for="(item, index1) of date" :key="index1" :data-index="index1" ref="months">
              <div class="month-bar">{{ item.month }}</div>
              <ul class="month-list-item">
                <!--<li class="isOne" v-for="item in dayList">{{item}}</li>-->
                <li @click.stop="selectedFunc" v-for="(day, index) of item.days" :key="index" :index='index' :data-sec="new Date(day).getTime() || ''" :data-date-format="day | convertDateFormatValue" :class="{
                    'selected-start': isStartDate == new Date(day).getTime(),
                    'selected-end': isEndDate == new Date(day).getTime(),
                    'selected-line': isStartDate < new Date(day).getTime() && new Date(day).getTime() < isEndDate,
                    'disabled': new Date(day).getTime()<new Date().getTime()-24*3600*1000||dayList[index1][index]==0
                  }">
                  <span>
                    <em>{{ day | convertDateFormatDay }}</em>
                    <em class="tip" v-if="isStartDate == new Date(day).getTime()">入住</em>
                    <em class="tip" v-if="isEndDate == new Date(day).getTime()">离店</em>
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import util from "./util";
import BScroll from "better-scroll";
import {getVacantRoom} from "@/lib/API/room";
export default {
  props: {
    // roomId:{
    //   type: Number
    // },
    showCalendar: {
      type: Boolean,
      default: false
    },
    options: {
      type: Object,
      default() {
        return {
          start: "", // 开始日期
          end: "", // 结束日期
          maxDate: "3m", // 月份跨度
          startDate: "", // 默认选中的开始日期,
          endDate: "" ,// 默认选中的结束日期
        };
      }
    },
    isDoubleCheck: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      days:1,
      date: util.getAllPanelData(this.options),
      todaySec: util.getTodaySec(),
      isStartDate: util.dateConvertSec(this.options.startDate),
      isEndDate: util.dateConvertSec(this.options.endDate),
      fixedBarOpacity: 1,
      dayList:[[],[],[]],
      fixedMonthbar: "",
    };
  },
  beforeCreate(){
  },
  created() {
    if (this.isStartDate === this.isEndDate) {
      this.isEndDate = 0;
    }

    for(let i in this.date){
      let day = this.date[i].days
    }
    if(this.$route.name!='首页'){
      if(!this.roomId){
        if(this.$route.name == 'hotel-detail'){
          // this.roomId = Number(this.$route.query.hotelid);
          this.roomId = 0;
        }else if(this.$route.name == 'room-detail'){
          this.roomId = Number(this.$route.query.roomid);
        } else if (this.$route.name == 'plan-detail'){
          this.roomId = this.$route.query.roomData.id;
        }
        console.log(this.roomId)
        this.getVacantRoom()
      }
    }
  },
  beforeMount(){
  },
  mounted(){
  },
  methods: {
    //查询空房
    async getVacantRoom(){
      let roomId = this.roomId;
      let res1 = await getVacantRoom({roomId :roomId,year :2019,month :new Date().getMonth()+1})
      if(res1.code === 200){
        let dayList = '';
        for(let i=0;i<7;i++){
          if(!this.date[0].days[i])dayList+="0,";
        }
        let lists = res1.data.split(',');
        dayList+=lists;
        this.dayList[0]=dayList.split(',');
      }
      let res2 = await getVacantRoom({roomId :roomId,year :2019,month :new Date().getMonth()+2})
      if(res2.code === 200){
        let dayList = '';
        for(let i=0;i<7;i++){
          if(!this.date[1].days[i])dayList+="0,";
        }
        let lists = res2.data.split(',');
        dayList+=lists;
        this.dayList[1]=dayList.split(',');
      }
      let res3 = await getVacantRoom({roomId :roomId,year :2019,month :new Date().getMonth()+3});
      console.log(res3)
      if(res3.code === 200){
        let dayList = '';
        for(let i=0;i<7;i++){
          if(!this.date[2].days[i])dayList+="0,";
        }
        let lists = res3.data.split(',');
        dayList+=lists;
        this.dayList[2]=dayList.split(',');
      }
      // console.log(this.dayList)
    },

    ifDay(){
      let monthBox = document.getElementsByClassName('month-panel');
      for(let i=0;i<monthBox.length;i++){
        let dayBox = monthBox[i].getElementsByTagName('li');
        for(let l=0;l<dayBox.length;l++){
          if(this.dayList[i][l]==0){
            dayBox[l].className='';
            dayBox[l].className='disabled';
          }
        }
      }
    },

    formatDate(timestamp, formats) {
      formats = formats || "Y-M-D";
      var myDate = timestamp ? new Date(timestamp) : new Date();
      var year = myDate.getFullYear();
      var month = formatDigit(myDate.getMonth() + 1);
      var day = formatDigit(myDate.getDate());
      var hour = formatDigit(myDate.getHours());
      var minute = formatDigit(myDate.getMinutes());
      var second = formatDigit(myDate.getSeconds());
      return formats.replace(/Y|M|D|h|m|s/g, function(matches) {
        return {
          Y: year,
          M: month,
          D: day,
          h: hour,
          m: minute,
          s: second
        }[matches];
      });
      // 小于10补0
      function formatDigit(n) {
        return n.toString().replace(/^(\d)$/, "0$1");
      }
    },
    closeCalendar() {
      this.$emit("update:showCalendar", false);
    },
    selectedFunc(event) {
      const currentTarget = event.currentTarget;
      let nowDate = new Date().getDate();
      if(currentTarget<nowDate){

      }
      if (currentTarget.classList.contains("disabled")) return;
      let sec = Number(currentTarget.dataset.sec);
      if (this.options.isDoubleCheck) {
        if (this.isStartDate) {
          if (this.isEndDate) {
            this.isStartDate = sec;
            this.isEndDate = "";
          } else {
            if (this.isStartDate === sec) {
              this.isStartDate = sec;
              return;
            }
            if (sec < this.isStartDate) {
              [this.isStartDate, this.isEndDate] = [sec, this.isStartDate];
            } else {
              this.isEndDate = sec;
            }
          }
        } else {
          this.isStartDate = sec;
        }
      } else {
        this.isStartDate = sec;
      }
    },
    successCallback() {
      let start = this.isStartDate
        ? util.dateFormat("yyyy-MM-dd", new Date(this.isStartDate))
        : undefined;
      let end = this.isEndDate
        ? util.dateFormat("yyyy-MM-dd", new Date(this.isEndDate))
        : start;
      this.$emit("changeDate", start, end);
      this.$emit("update:showCalendar", false);
    },
    disabled(val) {
      if (this.options.start && this.options.end) {
        return (
          val < util.dateConvertSec(this.options.start) ||
          val > util.dateConvertSec(this.options.end)
        );
      }
      if (this.options.start && this.options.maxDate && !this.options.end) {
        return val < util.dateConvertSec(this.options.start);
      }
      return val < this.todaySec;
    },
  },
  mounted() {
    this.$watch("showCalendar", val => {
      if (val) {
        this.$nextTick(() => {
          this.$refs.amCalendar.addEventListener(
            "touchmove",
            function(ev) {
              ev.preventDefault();
            },
            false
          );
          let months = this.$refs.months;
          let panelHeightArr = [];
          this.fixedMonthbar = this.date[0].month;
          for (let i = 0; i < months.length; i++) {
            panelHeightArr.push(months[i].clientHeight);
          }
          let panelAbsPosi = [];
          let tmpArr = [];
          for (let i = 0; i < panelHeightArr.length; i++) {
            tmpArr.push(panelHeightArr[i]);
            panelAbsPosi[i] = tmpArr.reduce((a, b) => {
              return a + b;
            });
          }
          this.scroll = new BScroll(this.$refs.scroll, {
            probeType: 3,
            preventDefault: false
          });
          if (this.options.scrollEnd) {
            this.fixedMonthbar = this.date[this.date.length - 1].month;
            this.scroll.scrollTo(0, -panelAbsPosi[panelHeightArr.length - 2]);
          }
          this.scroll.on("scroll", pos => {
            // fixedBar(this, panelAbsPosi, pos);
          });
        });
      } else {
        this.scroll.destroy();
      }
    })

    function fixedBar(scope, panelAbsPosi, pos) {
      if (pos.y > 0) {
        scope.fixedBarOpacity = 0;
      } else {
        scope.fixedBarOpacity = 1;
        scope.$refs.fixedBar.style.transform = "translate(0, 0)";
      }
      let y = Math.abs(pos.y || 0);
      if (y === 0) {
        scope.$refs.fixedBar.style.WebkitTransform = "translate(0, 0)";
        scope.$refs.fixedBar.style.transform = "translate(0, 0)";
      }
      let fixedBarHeight = scope.$refs.fixedBar.clientHeight;
      for (let i = 0; i < panelAbsPosi.length; i++) {
        if (
          y > panelAbsPosi[i] - fixedBarHeight &&
          y < panelAbsPosi[i + 1] - fixedBarHeight
        ) {
          let heightDiffer = panelAbsPosi[i] - fixedBarHeight;
          if (y >= heightDiffer && y - heightDiffer <= fixedBarHeight) {
            scope.$refs.fixedBar.style.WebkitTransform =
              "translate(0," + (heightDiffer - y) + "px)";
            scope.$refs.fixedBar.style.transform =
              "translate(0," + (heightDiffer - y) + "px)";
            scope.panelState = i;
          } else if (y - heightDiffer > fixedBarHeight) {
            scope.$refs.fixedBar.style.WebkitTransform = "translate(0, 0)";
            scope.$refs.fixedBar.style.transform = "translate(0, 0)";
            scope.panelState = i + 1;
          }
        }
      }
      if (y < panelAbsPosi[0] - fixedBarHeight) {
        scope.panelState = 0;
      }
      scope.fixedMonthbar = scope.date[scope.panelState].month;
    }

  },
  filters: {
    convertDateFormatDay(val) {
      if (val !== "") {
        return new Date(val).getDate();
      } else {
        return "";
      }
    },
    convertDateFormatValue(date) {
      if (date !== "") {
        return util.dateFormat("yyyy-MM-dd", date);
      } else {
        return "";
      }
    }
  }
};
</script>

<style  scoped>
.am-calendar-mask-enter,
.am-calendar-mask-leave-to {
  opacity: 0;
}
.am-calendar-enter-active,
.am-calendar-leave-active {
  transition: opacity 0.4s ease;
}
.am-calendar-content-enter-active {
  animation: bounce-in 0.4s;
}
.am-calendar-content-leave-active {
  animation: bounce-out 0.4s;
}
@keyframes bounce-in {
  0% {
    transform: translateY(100%);
  }
  100% {
    transform: translateY(0);
  }
}
@keyframes bounce-out {
  0% {
    transform: translateY(0%);
  }
  100% {
    transform: translateY(100%);
  }
}
.am-calendar-backdrop {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
}
.am-calendar-content {
  background: #fff;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 70%;
  overflow: hidden;
  z-index: 1000;
  color: #333;
  user-select: none;
  transform: translateY(0);
}

.am-calendar-title {
  position: relative;
  line-height: 90px;
  height: 90px;
  text-align: center;
  z-index: 1001;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  font-size: 28px;
  padding: 0 20px;
}
.am-calendar-title .button {
  color: rgb(255, 255, 255);
  background-color: rgb(98, 140, 253);
  border-radius: 4px;
  height: 60px;
  line-height: 60px;
  padding: 0 25px;
}
.am-calendar-title .close {
  color: #484848;
  margin-left: 15px;
}
.am-calendar-week-bar {
  position: relative;
  height: 50px;
  line-height: 50px;
  display: flex;
  z-index: 1001;
  border-bottom: 1px solid #d9d9d9;
  margin: 10px 0 15px;
  padding-bottom: 20px;
  box-sizing:content-box;
}
.am-calendar-week-bar .weekend{
  color: #fa967f;
}
.am-calendar-week-bar > span {
  flex: 1;
  text-align: center;
  color: #9aaec1;
  font-size: 28px;
}
.scroll-panel-wrapper {
  position: relative;
  overflow: hidden;
  height: calc(100% - 196px);
}
.scroll-date-wrapper {
  transform: translateZ(0);
}
.month-bar {
  font-size:44px;
  font-family:PingFangSC-Regular;
  font-weight:400;
  color:rgba(51,51,51,1);
  line-height:60px;
  text-align: left;
  margin: 80px 0 30px;
  padding: 0 40px;
}
.month-list-item {
  overflow: hidden;
  padding: 0;
  margin: 0;
  list-style: none;
  margin: 5px;
}
.month-list-item li {
  float: left;
  width: 14.286%;
  text-align: center;
  position: relative;
  color: #333;
  list-style: none;
  position: relative;
}
.month-list-item li.disabled {
  color: #999999;
}
/*.month-list-item li.disabled span em{*/
  /*text-decoration:line-through*/
/*}*/
.month-list-item li span {
  box-sizing: border-box;
  width: 100%;
  font-size: 26px;
  font-weight: 600;
  position: relative;
  z-index: 2;
  height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

}
.month-list-item li span .tip{
  font-size: 16px;
  font-weight: 500;
}
.month-list-item li.selected-start span,
.month-list-item li.selected-end span {
  color: #fff;
  background-color: #628CFD;
  border-radius: 2px;
}
.month-list-item li.selected-line {
  background-color: #a4cbf4;
}

</style>
