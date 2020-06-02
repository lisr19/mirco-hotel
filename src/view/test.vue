<template>
  <div class="main">
    <head-bar title="test"></head-bar>
    <div v-for="item in List">
      {{item.name}}——{{item.age}}
      <span @click="Del(item)">删除</span>
      <span @click="update(item)">修改</span>
    </div>
    <template>
      <input type="text" v-model="name">
      <input type="text" v-model="age">
    </template>

    <button @click="Add">添加</button>
    <button @click="Del">删除</button>
  </div>
</template>

<script>
  import headBar from '@/components/header/head-bar'
  import {getList,Add,Del,update} from "@/lib/API/test"
  import { Loadmore , Indicator } from 'mint-ui'
  export default {
    components:{
      headBar,
    },
    data() {
      return {
        name:'',
        age:'',
        page:1,
        currType:-1, // 当前分类
        keyWord:null,//关键字搜索
       List:[],//酒店列表
      }
    },
    created() {
      this.getList()
    },
    mounted(){

    },
    methods: {
      async Add(){
        let params = {
          name:this.name,
          age:this.age,
        }
        let res = await Add(params)
        if(res.errno===0){
          this.getList()
        }
      },
      async Del(item){
        let res = await Del({id:item.id})
        if(res.errno===0){
          this.$toast('删除成功')
          this.getList()
        }
      },
      async update(item){
        let res = await update({id:item.id})
        if(res.errno===0){
          this.$toast('修改成功')
          this.getList()
        }
      },
      //获取列表
      async getList(params){
        let res = await getList(params)
        if(res.errno===0){
          this.List = res.data.list
          console.log(this.List);
        }
      },
    }
  }
</script>

<style scoped>

</style>
<style lang="less" scoped>
  .main {
    background:#FAFAFCFF;
    height: 100%;
    position: relative;
    padding-top: 200px;
  }
</style>
