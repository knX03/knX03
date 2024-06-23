<script setup>

import {getCurrentInstance, onMounted, ref} from "vue";
import axios from "axios";
import bus from "@/eventbus.js";
import router from "@/router/index.js";
import {aSelectAllSinger} from "@/api/api.js";

// ctx等同于Vue2.x的this
const {ctx} = getCurrentInstance()

/*let user = ref({
  user_Name: '',
  user_Avatar: '../photos/logo/avatarWhite.png',
})*/
let singerList = ref([
  {
    singer_ID: '',
    singer_Name: '',
    singer_Avatar: '',
  }
])

const toSinger = (singer_ID) => {
  router.push({
    path: '/singerDetail',
    query: {singer_ID}
  })
}

onMounted(() => {
  selectAllSinger()
})

bus.on('singerListChange', (data) => {
  singerList.value = data;
})

/*查询所有歌手*/
function selectAllSinger() {
  aSelectAllSinger().then(resp => {
    if (resp.data.code === 200) {
      singerList.value = resp.data.data
    } else if (resp.data.code === 500) {
      console.error(resp.data.msg)
    }
  })
}

</script>

<template>
  <div class="sgSecond_mod">
    <div class="singerList_mod">
      <div class="singer_mod" v-for="item in singerList">
        <div class="img_container" @click="toSinger(item.singer_ID)">
          <img :src="item.singer_Avatar">
          <div class="singer_name_action">{{ item.singer_Name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/**
列表部分
 */
.sgSecond_mod {
  width: 100%;
  display: flex;
  justify-content: center;
  min-height: 600px;
}

.singerList_mod {
  margin-top: 15px;
  max-width: 1400px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}

/*歌手展示模块*/
.singer_mod {
  height: 250px;
  border-radius: 12px;
  margin-top: 10px;
  margin-left: 20px;
}

.img_container {
  width: 220px;
  height: 220px;
  overflow: hidden;
  border-radius: 50%;
}

.img_container img {
  width: 220px;
  height: 220px;
  border-radius: 12px;
  cursor: pointer;
  transition: 0.5s all ease-in-out;
}

.img_container:hover img {
  transition: 0.5s all ease-in-out;
  transform: scale(1.1, 1.1);
}

.singer_name_action {
  width: 100%;
  height: 50%;
  font-family: "微软雅黑 Light", serif;
  background: transparent;
  padding-left: 70px;
  translate: 0 20px;
  transition: 2s all ease-in-out;
}

.img_container:hover .singer_name_action {
  width: 100%;
  height: 50%;
  color: #ffffff;
  font-size: 25px;
  font-weight: 900;
  padding-left: 70px;
  translate: 0 -70px;
  box-shadow: 0 0 20px 0 #bebebe;
  cursor: pointer;
  backdrop-filter: blur(8px);
  transition: 0.2s all ease-in-out;
}

</style>