<script setup>
import {defineProps, onMounted, ref} from "vue";
import router from "@/router/index.js";
import axios from "axios";
import {useRoute} from "vue-router";
import {aGetSingerAlbums} from "@/api/api.js";

const route = useRoute()
let albumList = ref([
  {
    album_ID: '',
    album_Name: '',
    album_Cover: '',
  },
])
let singerAlbumExist = ref(false)
const {singer_ID} = defineProps(['singer_ID']);

onMounted(() => {
  getSingerAlbums(singer_ID)
})

function getSingerAlbums(ID) {
  aGetSingerAlbums(ID).then((resp) => {
    if (resp.data.code === 200) {
      albumList.value = resp.data.data
      if (albumList.value.length > 0) {
        singerAlbumExist.value = true
      }
    } else if (resp.data.code === 500) {
      console.log(resp.data.msg)
    }
  })
}


/*专辑详情跳转*/
function toAlbum(row) {
  router.push({
    path: '/albumDetail',
    query: {album_ID: row}
  })
}
</script>

<template>
  <div class="singerAlbumList_mod" v-if="singerAlbumExist">
    <div class="singerAlbumList_container">
      <div class="albumList_mod" v-for="item in albumList">
        <div class="img_container" @click="toAlbum(item.album_ID)">
          <img :src="item.album_Cover">
          <div class="album_name_action">
            {{ item.album_Name }}
          </div>
        </div>
        <span @click="toAlbum(item.album_ID)">{{ item.album_Name }}</span>
      </div>
    </div>
  </div>
  <div class="singerAlbumNull_mod" v-if="!singerAlbumExist">
    <svg t="1714831700907" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
         p-id="9134" width="200" height="200">
      <path
          d="M1021.5 669.1c0 107.8-233.8 166.6-598.7 166.6-282.1-0.1-428.3-75-422.6-171.1 7-118.2 213-175.5 495.1-175.5s526.2 120.2 526.2 180z m0 0"
          fill="#F8F9FC" p-id="9135"></path>
      <path
          d="M738.2 679s-10.5 16-23.5 19c0 0 44.5 0.3 74 4 0 0 14-21.5 20.5-23-0.1 0-47 3-71 0z m0 0M871.9 659.3s12 3.5 21.5 4c0 0 2.1 24.7-17.5 40 0 0-10-10-21.5-14.5 0 0 21-7.3 17.5-29.5z m-21.5-75.9s10.5 13.7 25.5 3.4c0 0-1.7 23.1 6.2 26.6 4.8 3 14.8 10 14.8 10s-23.5 10.5-42.5-9c-7.5-9-4-26-4-31z m0 0"
          fill="#C7CFE1" p-id="9136"></path>
      <path d="M769 599.1L566 763.6l-7-333 215-114-5 282.5z m0 0" fill="#F0F2F5" p-id="9137"></path>
      <path d="M201 658.1V534l298.5 85.5c20-142 60-212 60-180 0 17 4.5 241.5 7 325.5L201 658.1z m0 0" fill="#E6E9F0"
            p-id="9138"></path>
      <path d="M560 440l-98-21-6-70 5-122.5 313 90L560 440z m0 0" fill="#CDD2D9" p-id="9139"></path>
      <path d="M461 420l-255-70.5L461 226v194z m0 0" fill="#E6E9F0" p-id="9140"></path>
      <path d="M848 470l-74-153.5-2 132.5 76 21z m0 0" fill="#E1E5EC" p-id="9141"></path>
      <path d="M501.5 627.6L136 516.5l69-167 354.5 90-58 188.1z m0 0" fill="#F1F5F9" p-id="9142"></path>
      <path
          d="M942.8 73.5c-6-9-49.5 1-69 30-5.5 9-11.5 36-7 30 11.5-17 32.5-7 48.5-20.5 13.5-11 33-32.5 27.5-39.5z m0 0"
          fill="#F0F1F4" p-id="9143"></path>
      <path
          d="M868.3 138.5h-2c-4.5-2.5 4.5-28.5 7-33.5 15-23 45-33.5 60-34.5 6 0 9.5 2 11.5 4.5 8 11.5-26.5 42.5-27.5 42.5-8 7-17 8-25.5 9-9 2-17.5 2.5-23 10.5 1 0.5 0.5 1.5-0.5 1.5z m66-64.5c-15 0-42.5 10.5-56.5 32-3.5 5.5-6 17.5-8 24 7-7 15-8 23-9s16-2.5 23-8c15-13 30-32 26.5-36-0.5-2-3.5-3-8-3z m0 0"
          fill="#CDD2D9" p-id="9144"></path>
      <path
          d="M888.8 112.5l-3.5-2.5c16-20.5 34.5-36 73.5-47 3.5-1 5.5-2 6-2 2-1 2-1 7-1l1 4.5c-4.5 1-4.5 1-6 1-1 0-2.5 1-6 2-38.5 10-57 25-72 45z m0 0"
          fill="#CDD2D9" p-id="9145"></path>
      <path d="M170 691.6c-1 9-38 19.5-64.5 7-9-3.5-24-20.5-18.5-17.5 16 6 27.5-8 45-6 14.5 2.5 38 9.5 38 16.5z m0 0"
            fill="#F0F1F4" p-id="9146"></path>
      <path
          d="M130 707.1c-9.5 0-19.5-2-28.5-5.5-6-2.5-23-16-20.5-20.5 0 0 1-2.5 4.5-1 8 3.5 14 1 22-2 7-2.5 14-5.5 23-3.5 8 1 39.5 8 39.5 18.5 0 2.5-2 5.5-6 7-7.5 3.5-20 7-34 7z m-42.5-22c3.5 4.5 10.5 9.5 15 12.5 20.5 9 47 5.5 57.5-2 2.5-2 3.5-2.5 3.5-3.5 0-4.5-18.5-11.5-36-14-8-1-14 2-20.5 3.5-5.5 2.5-11.5 5-19.5 3.5z m0 0"
          fill="#CDD2D9" p-id="9147"></path>
      <path
          d="M182 692.6c-17-4.5-31-2.5-43.5-2s-22 2-32.5-2l2-4.5c9 3.5 19.5 2.5 31 2 13-1 27.5-2.5 44 2l-1 4.5z m0 0M723.8 227c-13 0-28-3-44.5-9.5l2-4.5c29 11 51.5 12.5 68.5 3.5-6.5-3-10.5-7-13-11-5.5-8-6.5-18.5-2.5-28 3-8 14-12 23-12.5 10-0.5 18.5 2.5 22 8.5 2.5 5 4 13.5-6 28-3.5 5.5-8 10-12.5 13.5 5 1 10.5 2 18 2 25.5 0 45.5-19.5 59-57.5l4.5 1.5c-14.5 40.5-36 61-64 61-9.5 0-17-1.5-23-3.5-8.5 6-19 8.5-31.5 8.5z m36.5-57h-2c-9 0.5-16.5 4.5-18.5 9.5-3 8-2.5 16.5 2 23.5 2.5 3.5 6.5 7.5 14 10.5 5.5-3.5 10-8.5 14-14.5 6.5-10 8.5-17.5 6-22.5-3.5-5-10-6.5-15.5-6.5z m0 0M276.4 617.9c-10.3 1.9-22.5 1.8-36.5-0.9l0.9-3.8c24.5 4.4 42.5 2.2 54.6-7.4-5.6-1.4-9.3-4-11.9-6.7-5.5-5.5-7.9-13.6-6.1-21.7 1.2-6.8 9.3-11.6 16.3-13.3 7.8-1.9 15-0.8 18.6 3.4 2.7 3.6 5.2 10.1-0.6 23-1.9 4.9-4.8 9.1-7.9 12.5 4.1 0 8.6 0 14.5-1.1 20.1-3.8 33-22.2 38-54.2l3.8 0.5c-5.4 34.1-19.3 53.5-41.4 57.7-7.5 1.4-13.6 1.4-18.7 0.7-5.8 5.9-13.7 9.4-23.6 11.3z m20.3-50.5l-1.6 0.3c-7 1.7-12.3 6-13.2 10.3-1.2 6.8 0.5 13.4 5.1 18.2 2.5 2.4 6.2 4.9 12.6 6.2 3.8-3.6 6.6-8.2 8.9-13.5 3.6-8.9 4.1-15.1 1.4-18.6-3.5-3.5-8.8-3.7-13.2-2.9z m0 0"
          fill="#CDD2D9" p-id="9148"></path>
      <path
          d="M633.9 788.7c-8.3 9.8-7.6 26 12.1 28 15.4 1.6 35.1 5.9 64.7-4.7l121.7-74.5c19.9-12.2 22.7-40.3 5.2-55.7-0.3-0.3-0.6-0.6-1-0.8-11.1-9.4-26.9-11-39.6-3.9-38.2 21.3-133.3 76.3-163.1 111.6z"
          fill="#E2E6ED" opacity=".7" p-id="9149"></path>
      <path
          d="M692.6 805.9l-33-54 165.6-101.4c3.8-2.3 8.8-1.1 11.3 2.7l24.5 40.1c2.3 3.9 1.1 8.8-2.7 11.3L692.6 805.9z m0 0"
          fill="#FDE9CB" p-id="9150"></path>
      <path d="M789.7 672.2l18.1-11.1 33 54-18.1 11.1-33-54zM643.8 797.6l15.7-45.8 33 54-48.7-8.2z m-3.8-3.9"
            fill="#FADAAB" p-id="9151"></path>
      <path d="M693.5 795.9l119.6-73.2 1.1 1.8-119.6 73.2-1.1-1.8z m0 0" fill="#FFFFFF" p-id="9152"></path>
      <path
          d="M430.2 295l-2.1 2.1c-2.3 2.3-6.1 2.3-8.5 0l-43.2-43.2c-2.3-2.3-2.3-6.1 0-8.5l2.1-2.1c2.3-2.3 6.1-2.3 8.5 0l43.2 43.2c2.3 2.4 2.3 6.2 0 8.5zM499.4 279.8h-3c-3.3 0-6-2.7-6-6v-61c0-3.3 2.7-6 6-6h3c3.3 0 6 2.7 6 6v61c0 3.3-2.7 6-6 6zM567.8 297.1l-2.1-2.1c-2.3-2.3-2.3-6.1 0-8.5l43.2-43.2c2.3-2.3 6.1-2.3 8.5 0l2.1 2.1c2.3 2.3 2.3 6.1 0 8.5l-43.2 43.2c-2.4 2.3-6.2 2.3-8.5 0z"
          fill="#ACBBD1" p-id="9153"></path>
    </svg>
    <span>歌手暂未发布专辑哦</span>
  </div>
</template>

<style scoped>
/**
列表部分
 */
.singerAlbumList_mod {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: start;
  min-height: 600px;
}

.singerAlbumList_container {
  margin-top: 15px;
  max-width: 1400px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}


.albumList_mod {
  height: 250px;
  border-radius: 12px;
  margin-top: 20px;
  margin-left: 40px;
}

.img_container {
  width: 220px;
  height: 220px;
  overflow: hidden;
  border-radius: 12px;
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

.album_name_action {
  font-family: "微软雅黑 Light", serif;
  background: transparent;
  width: 100%;
  height: 50%;
  transition: 2s all ease-in-out;
  translate: 0 20px;
}

.img_container:hover .album_name_action {
  width: 100%;
  height: 50%;
  backdrop-filter: blur(8px);
  transition: 0.2s all ease-in-out;
  color: #ffffff;
  font-size: 30px;
  font-weight: 900;
  padding-left: 15px;
  translate: 0 -100px;
  box-shadow: 0 0 20px 0 #bebebe;
  cursor: pointer;
}


.albumList_mod span {
  display: flex;
  font-family: "微软雅黑 Light", serif;
  font-size: 16px;
  margin-left: 15px;
  margin-top: 15px;
  cursor: pointer;
  color: #000000;
  transition: 0.5s all ease-in-out;
}

.albumList_mod span:hover {
  color: #75c1c4;
}

.singerAlbumNull_mod {
  min-height: 413px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.singerAlbumNull_mod svg {
  width: 300px;
  height: 300px;
}

.singerAlbumNull_mod span {
  font-family: STXihei, serif;
  font-size: 15px;
  font-weight: 900;
}
</style>