<script setup>

import {onMounted, ref} from "vue";
import axios from "axios";
import {useRouter} from "vue-router";
import {aChangeDailyList, aNineRandomPlaylist} from "@/api/api.js";

const router = useRouter()
let songList = ref([
  {playlist_ID: '', playlist_Name: '', playlist_Cover: ''},
])
//当前日期
const date = ref(new Date());
const month = ref(date.value.getMonth() + 1)
const today = ref(date.value.getDate())
const day = ref(month.value.toString() + "/" + today.value.toString())
const dailyRe = ref(
    {url: 'src/photos/Daily/' + today.value + '.png', today: day}
)


const toPlaylist = (playlist_ID) => {
  console.log(playlist_ID)
  router.push({
    path: '/playlistDetails',
    query: {playlist_ID}
  })
}

const toDaily = (playlist_ID) => {
  router.push({
    path: '/dailyRecomm',
    query: {playlist_ID}
  })
}


onMounted(() => {
  changeDailyList()
  selectSongPlaylist()
})

/*展示随机十个歌单*/
function selectSongPlaylist() {
  aNineRandomPlaylist().then(resp => {
    if (resp.data.code === 200) {
      songList.value = resp.data.data
    } else if (resp.data.code === 500) {
      console.log(resp.data.msg)
    }
  })
}

//根据日常修改日推
function changeDailyList() {
  aChangeDailyList().then(resp => {
    if (resp.data.code === 500) {
      console.log(resp.data.msg)
    }
  })
}

</script>

<template>
  <div class="container_mod">
    <span class="title">歌单推荐</span>
    <div class="songList_mod">
      <div class="dailyRe">
        <router-link to="#" @click="toPlaylist(10000)">
          <img :src=dailyRe.url>
          <span>{{ dailyRe.today }}</span>
        </router-link>
      </div>
      <div class="songListRe" v-for="item in songList">
        <div class="songList_container" @click="toPlaylist(item.playlist_ID)">
          <img :src=item.playlist_Cover>
          <div class="name_action">{{ item.playlist_Name }}</div>
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

.songList_mod {
  width: 80%;
  height: 80%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.dailyRe {
  background: #7d8561;
  height: 200px;
  width: 200px;
  max-width: 200px;
  max-height: 200px;
  /*超出部分隐藏*/
  overflow: hidden;
  border-radius: 20px;
  margin: 20px;

}

.dailyRe a {
  text-decoration: none;
}

.dailyRe span {
  font-family: STXihei, serif;
  font-weight: 900;
  font-size: 40px;
  color: white;
  cursor: pointer;
  position: relative;
  bottom: 0;
  padding-left: 20px;
  padding-bottom: 50px;
  transition: 0.5s all ease-in-out;
}

.dailyRe:hover span {
  width: 100%;
  height: 100%;
  display: block;
  backdrop-filter: blur(8px);
  bottom: 30px;
  transition: all 0.6s ease;
}

.dailyRe img {
  height: 150px;
  width: 150px;
  margin-left: 25px;
  background-color: transparent;
  transition: 0.5s all ease-in-out;
  cursor: pointer;
  border-radius: 20px;
  z-index: -1;
}

.dailyRe:hover img {
  transition: all 0.5s ease;
  transform: scale(1.2, 1.2);
}

.songListRe {
  background: #F4D5B7;
  height: 200px;
  width: 200px;
  /*超出部分隐藏*/
  overflow: hidden;
  border-radius: 20px;
  margin: 20px;
}

.songList_container {
  width: 200px;
  height: 200px;
  overflow: hidden;
  border-radius: 12px;
}

.songListRe img {
  height: 200px;
  width: 200px;
  background-color: #C0C4CC;
  transition: 0.5s all ease-in-out;
  cursor: pointer;
  border-radius: 20px;
  z-index: -1;
}


.songListRe:hover img {
  transition: all 0.6s ease;
  transform: scale(1.2, 1.2);
}

.name_action {
  color: transparent;
  width: 100%;
  height: 50%;
  font-family: STXihei, serif;
  font-weight: 900;
  font-size: 20px;
  cursor: pointer;
  transition: 2s all ease-in-out;
  translate: 0 20px;
}

.songListRe:hover .name_action {
  width: 100%;
  height: 100%;
  backdrop-filter: blur(8px);
  color: #ffffff;
  font-size: 30px;
  font-weight: 900;
  padding-left: 15px;
  translate: 0 -100px;
  box-shadow: 0 0 20px 0 #bebebe;
  cursor: pointer;
  transition: 0.2s all ease-in-out;
}

</style>