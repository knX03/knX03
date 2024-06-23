<script setup>

import {getCurrentInstance, onMounted, ref} from "vue";
import axios from "axios";
import {ElMessage} from "element-plus";
import bus from "@/eventbus.js";
import router from "@/router/index.js";
import {aSelectCreateDetail} from "@/api/api.js";
import {useRoute} from "vue-router";

const route = useRoute()
const {ctx} = getCurrentInstance()
let creatList = ref([{
  playlist_ID: '',
  playlist_Name: '',
  playlist_Cover: '',
}])

let CSwitch = ref(true)
const toPlaylist = (playlist_ID) => {
  router.push({
    path: '/playlistDetails',
    query: {playlist_ID}
  })
}

onMounted(() => {
  const userID = route.query.user_ID
  selectCreateDetail(userID)

})

/*用户创建的歌单详情*/
function selectCreateDetail(userID) {
  aSelectCreateDetail(userID).then(resp => {
    if (resp.data.code === 200) {
      creatList.value = resp.data.data
      if (creatList.value.length === 0) {
        CSwitch.value = false
      }
    } else if (resp.data.code === 500) {
      console.error(resp.data.msg)
    }
  })
}
</script>

<template>
  <!--创建的歌单-->
  <div v-if="CSwitch" class="createSongPlaylistsInfo_mod">
    <label class="titleSong_mod">TA创建的歌单</label>
    <div class="songListInfo_mod">
      <!--点击跳转歌单详情并传送关键值-->
      <div v-for="list in creatList">
        <div class="songPlaylistsCover_mod" @click="toPlaylist(list.playlist_ID)">
          <img :src="list.playlist_Cover"/>
          <div class="createListName_action">{{ list.playlist_Name }}</div>
        </div>
        <span class="songPlaylistsName_mod">{{ list.playlist_Name }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/*创建的歌单列表*/
.createSongPlaylistsInfo_mod {
  width: 100%;
  height: 600px;
  background-image: linear-gradient(#ffffff, #c7c7c7, #8DB799, #c7c7c7, #FFFFFF);
  margin-bottom: 50px;
  padding-top: 20px;
  padding-left: 70px;
}

/*标题*/
.titleSong_mod {
  font-family: STXihei, serif;
  font-size: 20px;
  font-weight: 900;
  color: #000000;
  margin-left: 20px;
}

/*歌单列表模块*/
.songListInfo_mod {
  width: 100%;
  height: 100%;
  padding-top: 5px;
  padding-bottom: 10px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;


}

/*歌单封面*/
.songPlaylistsCover_mod {
  height: 200px;
  width: 200px;
  max-width: 200px;
  max-height: 200px;
  overflow: hidden;
  border-radius: 20px;
  margin: 20px;
  cursor: pointer;
}

.songPlaylistsCover_mod img {
  height: 200px;
  width: 200px;
  border-radius: 20px;
  background-color: #C0C4CC;
  transition: 0.5s all ease-in-out;
}

.songPlaylistsCover_mod:hover img {
  transition: all 0.6s ease;
  transform: scale(1.2, 1.2);
}

.createListName_action {
  font-family: STXihei, serif;
  background: transparent;
  width: 100%;
  height: 50%;
  transition: 2s all ease-in-out;
  translate: 0 20px;
}

.songPlaylistsCover_mod:hover .createListName_action {
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


.songPlaylistsName_mod {
  font-family: STXihei, serif;
  font-size: 15px;
  font-weight: 600;
  color: white;
  position: relative;
  left: 30px;
}
</style>