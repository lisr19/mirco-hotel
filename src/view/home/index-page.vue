<template>
  <div v-if="isBus" class="bus-wrap">
    <div class="close-btn" @click="backApp">返回</div>
    <iframe class="bus-content" src="https://common.diditaxi.com.cn/general/webEntry?wx=true&bizid=257&channel=70365"
            width="100%" height="100%" frameborder="0" scrolling="no"></iframe>
  </div>
  <div v-else class="index-box">
    <div class="banner">
      <swiper class="imglist" :options="swiperOption" ref="mySwiper">
        <!-- slides -->
        <swiper-slide class="item" v-for="item in imgList" :key="item.index">
          <img :src="item.url" alt="">
        </swiper-slide>
        <!-- Optional controls -->
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
    </div>
    <div class="card">
      <div class="address">
        <span :class="loading?'loading':''">{{currCity?currCity:'未定位城市'}}</span>
        <!--<span @click="getCity">-->
        <!--<Radio>当前位置</Radio>-->
        <!--</span>-->
        <span @click="changeCity">
          <em class="line"></em>
          <div class="curr-load">
            <label v-if="isCheck" :class="{checked:isCheck===true}"></label>
            <label class="unchecked"></label>
            当前位置
          </div>
          <!--<Checkbox>当前位置</Checkbox>-->
        </span>
      </div>
      <div class="select-date">
        <div id="checkinout" v-if="startDouble && endDouble">
          <div id="firstSelect" style="width:100%;" @click="showdateDouble = true">
            <div class="Date_lr" style="float:left;">
              <!--<P>入住</p>-->
              <input id="startDate" type="text" :value="startDouble| formatTime('MM月dd日')" readonly>
            </div>
            <div class="Date_lr" style="float:right;">
              <!--<p>离店</p>-->
              <input id="endDate" type="text" :value="endDouble| formatTime('MM月dd日')" readonly>
            </div>
            <span class="total-days">共{{days}}晚</span>
          </div>
        </div>
        <input v-else placeholder="请选择入住时间和离店时间" @click="showdateDouble = true" v-model="showDouble" readonly="readonly"
               style="border: none;">
      </div>

      <input type="text" placeholder="地标位置/房源标题/预约电话" v-model="keyWord">
      <div class="hotel-type">
        <span>类型</span>
        <RadioGroup v-model="hotelType">
          <Radio label="酒店"></Radio>
          <Radio label="民宿"></Radio>
          <Radio label="会议室"></Radio>
        </RadioGroup>
      </div>
      <button class="search-btn" @click="serchMore(keyWord)">搜索</button>
    </div>
    <div class="type-slides">
      <swiper class="items" :options="swiperOption2" ref="mySwiper2">
        <swiper-slide class="item" :style="{'border-color':item.color}" v-for="item in typeList" :key="item.index">
          <div @click.stop="openType(item)" style="z-index: 99">
            <img :src="item.icon" alt="">
            <p>{{item.name}}</p>
          </div>
        </swiper-slide>
      </swiper>
    </div>
    <div class="recommend">
      <h1 class="title">严选推荐</h1>
      <ul class="items">
        <li class="item" v-for="item in hotelList" @click="openDetail(item.id)">
          <img :src="item.image1" alt="">
          <div class="name">{{item.name}}</div>
          <div class="address">{{item.address}}</div>
          <div class="price">
            <span class="discount">￥{{item.minPrice}}</span>
            <!--<span class="original">￥{{item.orig}}</span>-->
            <!--<span class="duration"> {{item.dura}}</span>-->
            <span class="duration"> / 每晚</span>
          </div>
          <div class="score">
            <Rate disabled v-model="item.grade"/>
            <span>{{item.evaluationNum }}评论</span>
          </div>
        </li>
      </ul>
      <button class="more" @click="openMore('严选推荐','酒店')">显示更多热门预约</button>
    </div>
    <div class="love recommend">
      <h1 class="title">猜你喜欢</h1>
      <ul class="items">
        <li class="item" v-for="item in homeStayList" @click="openHomeDetail(item.id)">
          <img :src="item.image1" alt="">
          <div class="name">{{item.name}}</div>
          <div class="address">{{item.address}}</div>
          <div class="price">
            <span class="discount">￥{{item.minPrice}}</span>
            <!--<span class="original">￥{{item.orig}}</span>-->
            <!--<span class="duration"> {{item.dura}}</span>-->
            <span class="duration"> / 每晚</span>
          </div>
          <div class="score">
            <Rate disabled v-model="item.grade"/>
            <span>{{item.evaluationNum }}评论</span>
          </div>
        </li>
      </ul>
      <button class="more" @click="openMore('猜你喜欢','民宿')">显示更多</button>
    </div>
    <div class="icons">
      <img src="@/assets/img/tips.png" alt="">
    </div>
    <date :showCalendar.sync='showdateDouble' maxDate="12m" :options="dateOptionsDouble"
          @changeDate="changeDateDouble"></date>
  </div>
</template>

<script>
	import {getHotelList, getHomeStayList} from "@/lib/API/hotel";
	import {getSliderList} from "@/lib/API/comment";
	import date from "@/components/datepicker/datePicker";
	import MapLoader from '@/lib/utils/AMap.js'

	export default {
		name: "index",
		components: {
			date,
		},
		watch: {
			endDouble(curVal, oldVal) {
				if (curVal !== oldVal) {
					this.endDouble = curVal
					this.DateDiff(this.endDouble, this.startDouble)
				}
			},
			startDouble(curVal, oldVal) {
				if (curVal !== oldVal) {
					this.startDouble = curVal
					this.DateDiff(this.endDouble, this.startDouble)
				}
			},
		},
		computed: {
			showDouble() {
				if (this.startDouble && this.endDouble) {
					return this.startDouble + "至" + this.endDouble;
				} else if (this.startDouble && !this.endDouble) {
					return this.startDouble
				} else {
					return ''
				}
			},
		},
		data() {
			return {
				currCity: '桂林市',
				delayTime: false, //定位延迟，防止短时间多次切换定位
				isCheck: false,
				loading: false,
				isBus: false,
				days: 1,
				firstGetCity: true,
				hotelList: [],//酒店列表
				homeStayList: [], //名宿列表
				startDouble: this.formatDate(new Date().getTime()),
				endDouble: this.formatDate(new Date().getTime() + 24 * 3600 * 1000),
				showdateDouble: false,
				dateOptionsDouble: {
					maxDate: "3m", // 月份跨度
					isDoubleCheck: true,
					startDate: this.formatDate(new Date().getTime()),
					endDate: this.formatDate(new Date().getTime() + 24 * 3600 * 1000)
				},
				currentIndex: 0,
				hotelType: '酒店',
				keyWord: null,//搜索关键字
				valueCustomText: 152,
				imgList: [
					// {
					// 	name: "首页轮播第一张图",
					// 	url: require('@/assets/img/banner.png')
					// }
				],//轮播图Banner
				typeList: [
					{
						name: '约车出行',
						color: '#FDC662',
						icon: require('@/assets/img/taxi.png'),
						url: 'https://common.diditaxi.com.cn/general/webEntry?wx=true&bizid=257&channel=70365'
					},
					{
						name: '精品酒店',
						color: '#62B2FD',
						icon: require('@/assets/img/hotel.png'),
						url: '/hotel-list?keyWord&search=酒店'
					},
					{
						name: '品质民宿',
						color: '#FD6262',
						icon: require('@/assets/img/minsu.png'),
						url: '/hotel-list?keyWord&search=民宿'
					},
					{
						name: '高级会议室',
						color: '#0144BB',
						icon: require('@/assets/img/meeting.png'),
						url: ''
					}
				],
				swiperOption: {
					notNextTick: true,
					pagination: '.swiper-pagination',
					slidesPerView: 'auto',
					centeredSlides: true,
					paginationClickable: true,
					spaceBetween: 30,
					autoplay: '5000'
				},
				swiperOption2: {
					notNextTick: true,
					slidesPerView: 'auto',
					spaceBetween: 10,
				},
			}
		},
		created() {
			this.getHotelList()
			this.getHomeStayList()
			this.getSliderList({typeId: 1})
			this.getCityAuto()
			console.log(this.currCity);
		},
		mounted() {
			// this.getCity()
			// this.loading = false
			// this.currCity = '桂林市'
			// this.firstGetCity = true
		},
		methods: {
			//获取首页轮播图列表
			async getSliderList(params) {
				let res = await getSliderList(params)
				if (res.code === 200) {
					this.imgList= res.data.list
					// for (let i = 0; i < res.data.list.length; i++) {
					// 	this.imgList.push(res.data.list[i])
					// }
				}
			},
			//获取酒店列表
			async getHotelList() {
				let res = await getHotelList()
				if (res.code === 200) {
					this.hotelList = res.data.list.slice(0, 4)
				}
			},
			//获取民宿列表
			async getHomeStayList() {
				let res = await getHomeStayList()
				if (res.code === 200) {
					this.homeStayList = res.data.list.slice(0, 4)
				}
			},
			//快捷入口
			openType(item) {
				if (item.name === '高级会议室') {
					this.$toast('功能暂未开通，敬请期待')
				}
				if (item.name === '约车出行') {
					this.isBus = true
					// window.location.href=item.url
				}
				this.$router.push({path: item.url})
			},
			//更多酒店列表
			openMore(more, type) {
				this.$router.push({path: 'hotel-list', query: {more: more, search: type}})
			},
			//搜索酒店
			serchMore(keyWord) {
				if (this.currCity === '获取中…') {
					this.$toast('获取当前定位中，请稍后再试', 2000)
				} else {
					this.$router.push({path: 'hotel-list', query: {keyWord: keyWord, search: this.hotelType}})
				}
			},
			//跳转酒店详情
			openDetail(id) {
				this.$router.push({path: 'hotel-detail', query: {hotelid: id, seekType: '酒店'}})
			},
			//跳转民宿详情
			openHomeDetail(id) {
				this.$router.push({path: 'hotel-detail', query: {hotelid: id, seekType: '民宿'}})
			},
			changeDateDouble(start, end) {
				this.startDouble = start;
				this.endDouble = end;
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
				return formats.replace(/Y|M|D|h|m|s/g, function (matches) {
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
			DateDiff(sDate1, sDate2) {
				var aDate, oDate1, oDate2, iDays
				aDate = sDate1.split("-")
				oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])
				aDate = sDate2.split("-")
				oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])
				iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24)
				this.days = iDays
				return iDays
			},
			//首次自动获取当前城市
			getCityAuto() {
				this.firstGetCity = true
				this.loading = true
				this.currCity = '获取中…'
				console.log('首次进入自动获取城市')
				let self = this
				MapLoader().then(AMap => {
					this.map = new AMap.Map('container', {
						resizeEnable: true,
						zoom: 18,
						center: this.position
					})
					//定位
					this.map.plugin('AMap.Geolocation', () => {
						let geolocation = new AMap.Geolocation({
							// 设置定位超时时间，默认：无穷大
							timeout: 1000,
						})
						geolocation.getCurrentPosition()
						AMap.event.addListener(geolocation, 'complete', onComplete)
						AMap.event.addListener(geolocation, 'error', onError)

						function onComplete(data) {
							self.loading = false
							self.currCity = data.addressComponent.city
							console.log(self.currCity)
						}

						function onError(data) {
							self.$toast('定位失败，请确认手机是否已开启定位权限')
							this.currCity = '未定位城市'
							// 定位出错
						}
					})
				}, e => {
					console.log('地图加载失败', e)
				})
			},
			changeCity() {
				if (this.delayTime === true) {
					this.$toast('请勿频繁获取定位，请稍后再试')
					return
				}
				this.isCheck = !this.isCheck
				this.delayTime = true
				setTimeout(() => {
					this.delayTime = false
				}, 3000)
				if (this.isCheck === true) {
					console.log('获取定位');
					this.getCity()
				} else if (this.isCheck === false) {
					console.log('取消定位');
					this.keyWord = null
				}
			},
			getCity() {
				if (this.isCheck) {
					this.loading = true
					this.currCity = '获取中…'
					this.keyWord = null
					let self = this
					MapLoader().then(AMap => {
						this.map = new AMap.Map('container', {
							resizeEnable: true,
							zoom: 18,
							center: this.position
						})
						console.log(this.position);
						//定位
						this.map.plugin('AMap.Geolocation', () => {
							let geolocation = new AMap.Geolocation({
								// 设置定位超时时间，默认：无穷大
								timeout: 1000,
							})
							geolocation.getCurrentPosition()
							AMap.event.addListener(geolocation, 'complete', onComplete)
							AMap.event.addListener(geolocation, 'error', onError)

							function onComplete(data) {
								self.loading = false
								self.currCity = data.addressComponent.city
								self.keyWord = self.currCity.substr(0, self.currCity.length - 1)
								console.log(self.currCity)
							}

							function onError(data) {
								self.$toast('定位失败，请确认手机是否已开启定位权限')
								this.currCity = '未定位城市'
								// 定位出错
							}
						})
					}, e => {
						console.log('地图加载失败', e)
					})
				} else {
					this.keyWord = null
				}
			},
			backApp() {
				this.$router.back()
				this.isBus = false
			}
		}
	}
</script>

<style scoped>
  /*iview样式修改*/
  .address >>> .ivu-checkbox-wrapper {
    font-size: 26px;
  }

  .ivu-checkbox-wrapper >>> .ivu-checkbox {
    margin-top: -5px;
    margin-right: 8px;
  }

  .ivu-checkbox-wrapper >>> .ivu-checkbox-checked {
    width: 25px;
    height: 25px;
    background-color: #ffffff;
    border-radius: 50%;
  }

  .ivu-checkbox-wrapper >>> .ivu-checkbox-inner {
    width: 25px;
    height: 25px;
    border-radius: 50%;
  }

  .ivu-checkbox-wrapper >>> .ivu-checkbox-checked:hover .ivu-checkbox-inner {
    border-radius: 50%;
    border: #555555;
  }

  .ivu-checkbox-wrapper >>> .ivu-checkbox-inner::after {
    display: none;
  }

  .index-box >>> .ivu-rate {
    display: flex;
  }

  .index-box >>> .ivu-rate-star {
    font-size: 24px;
    margin: 0 -1px;
  }

  .index-box >>> .ivu-rate-star-full:before {
    color: #626bfd
  }

  .index-box >>> .ivu-rate-star-half .ivu-rate-star-content:before {
    color: #626bfd
  }

  .index-box >>> .ivu-rate-star-content:before {
    color: #626bfd
  }

  .index-box .card >>> .ivu-radio-group {
    font-size: 24px;
    display: flex;
    align-items: center;
  }

  .index-box .card >>> .ivu-radio-wrapper {
    font-size: 24px;
    display: flex;
    align-items: center;
    margin-left: 24px;
  }

  .index-box .card >>> .ivu-radio-inner {
    width: 20px;
    height: 20px;
    border-radius: 50%;
  }

  .index-box .card >>> .ivu-radio-inner:after {
    width: 13px;
    height: 13px;
    left: 2px;
    top: 2px;
    border-radius: 50%;
  }

  .index-box .card .address >>> .ivu-radio-inner {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    margin-right: 10px;
  }

  .index-box .card .address >>> .ivu-radio-inner:after {
    width: 20px;
    height: 20px;
    left: 3px;
    top: 2px;
    border-radius: 50%;
  }

  .total-days {
    position: absolute;
    top: 52%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    padding: 3px 18px;
    border-radius: 50px;
    background-color: #fff;
    line-height: 32px;
    border: 1px solid rgba(151, 151, 151, 1);
    font-size: 22px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
  }

  #checkinout {
    height: 78px;
    line-height: 78px;
    position: relative;
    display: -webkit-box;
    display: flex;
    border-bottom: solid #E6E6E6 1px;
  }

  #firstSelect p {
    line-height: 25px;
    color: #999;
    font-size: 12px;
  }

  #startDate {
    border: 0;
    position: absolute;
    left: 0;
    margin: 0 auto;
    width: 50%;
    font-size: 28px;
    font-family: PingFangSC-Semibold;
    font-weight: 600;
    color: rgba(72, 72, 72, 1);
    text-align: left;
  }

  #endDate {
    border: 0;
    position: absolute;
    right: 0;
    margin: auto 0;
    width: 50%;
    font-size: 28px;
    font-family: PingFangSC-Semibold;
    font-weight: 600;
    color: rgba(72, 72, 72, 1);
    text-align: right;
  }
</style>

<style lang="less" scoped>
  input::-webkit-input-placeholder {
    color: rgba(216, 216, 216, 1);
    font-size: 26px;
  }

  input:focus {
    outline: none;
  }

  .index-box {
    padding-bottom: 144px;
    background-color: #f8f9fb;

    .banner {
      height: 468px;
      /*border-radius: 0 0 60px 60px ;*/
      overflow: hidden;
      background-color: #ffffff;

      .imglist {
        .item {
          height: 468px;

          img {
            width: 100%;
          }
        }
      }
    }

    .card {
      /*width: 670px;*/
      width: 90%;
      height: 476px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 8px 10px 0px rgba(0, 0, 0, 0.08);
      border-radius: 20px;
      margin: 0 auto;
      padding: 32px 30px;
      position: absolute;
      top: 240px;
      left: 5%;
      z-index: 9;
      text-align: left;

      > div {
        height: 80px;
      }

      .address {
        display: flex;
        justify-content: space-between;
        border-bottom: solid #E6E6E6 1px;
        font-size: 26px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        line-height: 80px;

        span:last-child {
          padding-left: 60px;
          position: relative;

          .line {
            height: 28px;
            width: 2px;
            background-color: #D8D8D8;
            display: inline-block;
            position: absolute;
            top: 25px;
            left: 0;
          }
        }

        .loading {
          color: #D8D8D8;
        }

        .curr-load {
          position: relative;
          padding-left: 38px;

          .unchecked {
            border-radius: 50%;
            width: 26px;
            height: 26px;
            opacity: 0.5;
            display: inline-block;
            border: solid 2px rgba(67, 129, 239, 1);
            position: absolute;
            top: 26px;
            left: 0;
          }

          .checked {
            width: 22px;
            height: 22px;
            border-radius: 50%;
            background: rgba(98, 140, 253, 1);
            border: 2px solid rgba(255, 255, 255, 1);
            display: inline-block;
            position: absolute;
            top: 28px;
            left: 2px;
          }
        }
      }

      .date {
        border-bottom: solid #E6E6E6 1px;
      }

      input {
        width: 100%;
        height: 80px;
        font-size: 26px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        line-height: 36px;
        border: none;
        padding: 0 10px;
        border-top: solid #E6E6E6 1px;
        border-bottom: solid #E6E6E6 1px;
      }

      .hotel-type {
        font-size: 24px;
        font-weight: 400;
        color: rgba(85, 85, 85, 1);
        line-height: 80px;
        display: flex;
        align-items: center;
      }

      .search-btn {
        width:100%;
        height: 86px;
        background: rgba(90, 135, 255, 1);
        box-shadow: 0px 8px 8px 0px rgba(68, 121, 225, 0.46);
        border-radius: 47px;
        opacity: 0.9;
        border: none;
        font-size: 40px;
        font-family: PingFangSC-Medium;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        line-height: 56px;
        margin-top: 8px;
      }
    }

    .type-slides {
      margin-top: 300px;
      .items {
        margin: 0 40px;
        .item {
          width: 196px;
          height: 122px;
          background: rgba(255, 255, 255, 1);
          box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.14);
          border-radius: 12px;
          border: 2px solid rgba(253, 198, 98, 1);
          img {
            margin: 15px 0 8px;
            max-height: 48px;
          }
          p {
            margin-bottom: 12px;
	          font-size: 18px;
          }
        }
      }
    }

    .recommend {
      margin: 60px 40px 44px;

      .title {
        height: 60px;
        font-size: 44px;
        font-family: PingFangSC-Semibold;
        font-weight: 600;
        color: rgba(72, 72, 72, 1);
        line-height: 60px;
        text-align: left;
      }

      .items {
        justify-content: space-between;
        flex-wrap: wrap;
        display: flex;
        margin: 44px 0 0;

        .item {
          font-family: PingFangSC-Medium;
          width: 314px;
          height: 376px;
          text-align: left;
          margin-bottom: 56px;

          img {
            width: 314px;
            height: 188px;
            display: block;
            background: rgba(185, 185, 185, 1);
            border-radius: 12px;
            background: antiquewhite;
          }

          .name {
            height: 28px;
            font-size: 20px;
            font-weight: 500;
            color: rgba(51, 51, 51, 1);
            line-height: 28px;
            margin: 14px 0 2px;
          }

          .address {
            width: 314px;
            font-size: 24px;
            font-weight: 500;
            color: rgba(51, 51, 51, 1);
            line-height: 34px;
            overflow: hidden;
            text-overflow: ellipsis;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            height: 68px;
            vertical-align: center;
            text-overflow: -o-ellipsis-lastline;
            text-overflow: ellipsis;
            display: -webkit-box;
          }

          .price {
            margin: 6px 0 8px;

            .discount {
              height: 40px;
              font-size: 28px;
              font-weight: 500;
              color: rgba(51, 51, 51, 1);
              line-height: 40px;
            }

            .original {
              width: 58px;
              height: 34px;
              font-size: 24px;
              font-weight: 400;
              color: rgba(181, 181, 181, 1);
              line-height: 34px;
              text-decoration: line-through
            }

            .duration {
              width: 58px;
              height: 34px;
              font-size: 24px;
              font-weight: 400;
              color: rgba(181, 181, 181, 1);
              line-height: 34px;
            }
          }

          .score {
            font-weight: 500;
            color: rgba(51, 51, 51, 1);
            display: flex;
            align-items: center;

            span {
              margin-left: 10px;
              font-size: 16px;
              font-family: PingFangSC-Medium;
              font-weight: 500;
              color: rgba(51, 51, 51, 1);
            }
          }
        }
      }

      .more {
        /*width: 670px;*/
        width: 85%;
        height: 72px;
        border-radius: 6px;
        border: 2px solid rgba(98, 107, 253, 1);
        font-size: 26px;
        font-family: PingFangSC-Medium;
        font-weight: 500;
        color: rgba(98, 107, 253, 1);
        line-height: 36px;
        background-color: #fff;
      }
    }

    .icons {
      width: 100%;
      height: 226px;
      margin: 84px auto 0;
      img {
        width: 100%;
      }
    }
  }

  .tag-nav {
    position: fixed;
    bottom: 0;
    display: flex;
    width: 100%;
    height: 88px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.48);

    .item {
      width: 25%;
    }

    .active {
      color: rgba(98, 140, 253, 1);
    }
  }

  .bus-wrap {
    position: relative;
    width: 100%;
    min-height: 100%;
    z-index: 99;

    .close-btn {
      width: 100%;
      height: 90px;
      line-height: 90px;
      background: rgba(245, 245, 245, 1);
      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.05);
      text-align: left;
      position: absolute;
      top: 0;
      padding-left: 40px;
      font-size: 28px;
      font-weight: 600;
      z-index: 999;
    }

    .bus-content {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      bottom: 0;
      padding-top: 90px;
    }
  }
</style>
