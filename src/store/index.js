import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  // 在state中去声明全局变量，可以通过 this.$store.state 访问
  state:{
    count:0,
    tip:[],
  },
  // 在getters中声明state中变量的计算函数，缓存计算后的数据， 通过 this.$store.getters 调用
  getters:{
    // 接受state作为参数，每次 count发生变化时 ， 都会被调用
    count: state => {
      state.count = 0
      state.tip.forEach((v)=>{
        state.count = v.count + state.count
      })
      return state.count
    }
  },
  // 只能执行同步方法，不要去执行异步方法 通过 this.$store.commit 方法去调用
  mutations:{
    SET_TIP(state,data){
      state.tip = data
    },
    ADD_TIP(state,data){
      state.tip.forEach((v,index)=>{
        if(v.id === data.id){
          state.tip[index].count += 1
          state.tip[index].time = new Date().toLocaleString()
        }
      })
    },
    CLEAR_TIP(state,data){
      state.tip.forEach((v,index)=>{
        if(v.id === data.id){
          state.tip[index].count = 0
        }
      })
    },
    COUNT_SUM(state){
      state.count = 0
      state.tip.forEach((v)=>{
        state.count = v.count + state.count
      })
    }
  },
  // 借助actions的手去 执行 mutations ， 通过  this.$store.dispatch 的方式调用
  // 可以用来执行异步操作，可以跟踪异步数据状态变化
  actions:{
    setTip: (context,data) =>{
        context.commit('SET_TIP',data)
    },
    addTip: (context,data) =>{
        context.commit('ADD_TIP',data)
    },
    clearTip: (context,data) =>{
        context.commit('CLEAR_TIP',data)
    },
    countSum: (context) =>{
        context.commit('COUNT_SUM')
    },
  }
})

export default store
