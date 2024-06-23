<script setup>
import {onMounted, ref} from "vue";
import axios from "axios";
import router from "@/router/index.js";
import {aSelectAllAlbum} from "@/api/api.js";

let albumList = ref([
  {
    album_ID: '',
    album_Name: '',
    album_Cover: '',
  },
])

onMounted(() => {
  selectAllAlbum()
})

/*查询所有*/
function selectAllAlbum() {
  aSelectAllAlbum().then(resp => {
    if (resp.data.code === 200) {
      albumList.value = resp.data.data
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
  <div class="album_mod">
    <div class="albumList_container">
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
</template>

<style scoped>
/**
列表部分
 */
.album_mod {
  width: 100%;
  display: flex;
  justify-content: center;
  min-height: 600px;
}

.albumList_container {
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
</style>