<script setup>
import {onMounted, ref} from "vue";
import axios from "axios";
import router from "@/router/index.js";
import {aSelectLikePlaylist} from "@/api/api.js";
import {useRoute} from "vue-router";

const route = useRoute()
let likeList = ref([{
  playlist_ID: '',
  playlist_Name: '',
  playlist_Cover: '',
}])

let LSwitch = ref(true)

const toPlaylist = (playlist_ID) => {
  if (playlist_ID === 10000) {
    router.push({
      path: '/dailyRecomm',
      query: {playlist_ID}
    })
  } else {
    router.push({
      path: '/playlistDetails',
      query: {playlist_ID}
    })
  }
}

onMounted(() => {
  const userID = route.query.user_ID
  selectLikeDetail(userID)
})

/*用户收藏的歌单详情*/
function selectLikeDetail(userID) {
  aSelectLikePlaylist(userID).then(resp => {
    if (resp.data.code === 200) {
      likeList.value = resp.data.data
      if (likeList.value.length === 0) {
        LSwitch.value = false
      }
    } else if (resp.data.code === 500) {
      console.error(resp.data.msg)
    }
  })
}
</script>

<template>
  <!--收藏的歌单-->
  <div v-if="LSwitch" class="likeInfo_mod">
    <label class="titleLike_mod">TA收藏的歌单</label>
    <div class="likeListInfo_mod">
      <div v-for="list in likeList">
        <router-link to="#" @click="toPlaylist(list.playlist_ID)">
          <div class="songPlaylistsCover_mod">
            <img :src="list.playlist_Cover"/>
            <div class="likeListName_action">{{ list.playlist_Name }}</div>
          </div>
          <span class="songPlaylistsName_mod">{{ list.playlist_Name }}</span>
        </router-link>
      </div>

    </div>
  </div>
</template>
<style scoped>

/*收藏的歌单列表*/
.likeInfo_mod {
  width: 100%;
  height: 600px;
  margin-bottom: 50px;
  padding-top: 20px;
  background-image: linear-gradient(#ffffff, #c7c7c7, #dea582, #c7c7c7, #FFFFFF);
  padding-left: 70px;
}

/*标题*/
.titleLike_mod {
  font-family: STXihei, serif;
  font-size: 20px;
  font-weight: 900;
  color: #000000;
  margin-bottom: 10px;
}

/*歌单收藏列表*/
.likeListInfo_mod {
  width: 100%;
  height: 100%;
  padding-top: 5px;
  padding-bottom: 10px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.likeListInfo_mod a {
  text-decoration: none;
  border-radius: 20px;
}

.likeListInfo_mod a:hover {
  /*background-color: #e8e5e5;*/
}

/*歌单封面*/
.songPlaylistsCover_mod {
  height: 200px;
  width: 200px;
  max-width: 200px;
  max-height: 200px;
  /*超出部分隐藏*/
  overflow: hidden;
  border-radius: 20px;
  margin: 20px;
}

.songPlaylistsCover_mod img {
  height: 200px;
  width: 200px;
  border-radius: 20px;
  background-color: #7d8561;
  transition: 0.5s all ease-in-out;

}

.songPlaylistsCover_mod:hover img {
  transition: all 0.6s ease;
  transform: scale(1.2, 1.2);
}

.likeListName_action {
  font-family: STXihei, serif;
  background: transparent;
  width: 100%;
  height: 50%;
  transition: 2s all ease-in-out;
  translate: 0 20px;
}

.songPlaylistsCover_mod:hover .likeListName_action {
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