<script setup>
import {useRoute} from 'vue-router'
import {ref} from "vue";
//当前路由
const route = useRoute()
const itemList = ref([
      {path: '/', title: '首页'},
      {path: '/MY', title: '我的'},
      {path: '/songList', title: '歌单'},
      {path: '/singer', title: '歌手'},
      {path: '/album', title: '专辑'},
    ]
)

const activeIndex = ref(
    route.fullPath
)

function handleSelect() {

}
</script>

<template>
  <div class="container">
    <el-menu
        id="seNav_mod"
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
        router
    >
      <el-menu-item id="seNav_item" v-for="(item, index) in itemList" :index="item.path" :key="index">
        <span  slot="title">{{ item.title }}</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<style scoped src="../css/secondNav.css">

</style>