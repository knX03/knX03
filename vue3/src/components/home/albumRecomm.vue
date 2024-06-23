<script setup>

import {onMounted, ref} from "vue";
import axios from "axios";
import router from "@/router/index.js";
import {aTenRandomAlbum} from "@/api/api.js";


let albumList = ref([
  {album_ID: '', album_Name: '', singer_ID: '', singer_name: '', album_Cover: ''},
])

const toAlbum = (album_ID) => {
  router.push({
    path: '/albumDetail',
    query: {album_ID}
  })
}
const toSinger = (singer_ID) => {
  router.push({
    path: '/singerDetail',
    query: {singer_ID}
  })
}

onMounted(() => {
  selectAlbum()
})

/*展示随机九个专辑*/
function selectAlbum() {
  aTenRandomAlbum().then(resp => {
    if (resp.data.code === 200) {
      albumList.value = resp.data.data
    } else if (resp.data.code === 500) {
      console.log(resp.data.msg)
    }
  })
}
</script>

<template>
  <div class="container_mod">
    <span class="title">专辑推荐</span>
    <div class="albumList_mod">
      <div class="albumRe" v-for="item in albumList">
        <div class="albumc" @click="toAlbum(item.album_ID)">
          <img class="albumCover" :src=item.album_Cover alt="">
        </div>
        <div class="album_text">
          <span class="albumName" @click="toAlbum(item.album_ID)">{{ item.album_Name }}</span>
          <span class="singer" @click="toSinger(item.singer_ID)">{{ item.singer_name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container_mod {
  width: 100%;
  height: 100%;
  background-image: linear-gradient(#f3f3f3, #fafafa);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  font-family: SimHei, serif;
  font-weight: 900;
  font-size: 33px;
  margin-top: 50px;
}

.albumList_mod {
  width: 80%;
  height: 80%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.albumRe {
  background: #F4D5B7;
  height: 200px;
  width: 200px;
  max-width: 200px;
  max-height: 200px;
  /*超出部分隐藏*/
  overflow: hidden;
  border-radius: 20px;
  margin: 20px;
}

.albumCover {
  height: 200px;
  width: 200px;
  background-color: #C0C4CC;
  transition: 0.5s all ease-in-out;
  cursor: pointer;
  border-radius: 20px;
  z-index: -1;
}

.albumRe:hover .albumCover {
  transition: all 0.6s ease;
  transform: scale(1.2, 1.2);
}

.album_text {
  display: flex;
  flex-direction: column;
  position: relative;
  bottom: 80px;
  padding-bottom: 30px;
  padding-left: 10px;
  transition: 2s all ease-in-out;
}

.albumName {
  font-family: STXihei, serif;
  font-weight: 900;
  font-size: 30px;
  color: white;
  cursor: pointer;
}

.singer {
  font-family: STXihei, serif;
  font-weight: 900;
  font-size: 20px;
  cursor: pointer;
  color: white;
  margin-left: 15px;
}

.albumRe:hover .album_text {
  backdrop-filter: blur(8px);
  bottom: 100px;
  transition: 0.1s all ease-in-out;
}

</style>