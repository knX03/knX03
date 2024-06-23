<script setup>

import {defineProps, onMounted, ref} from "vue";
import router from "@/router/index.js";
import {ElMessage, ElNotification} from "element-plus";
import {aDeleteLikeSong, aLikeSong, aSelectLikeSong, aSongByAlbum} from "@/api/api.js";

import useMusicPlayStore from "@/store/musicPlayStore.js";

const musicPlayStore = useMusicPlayStore();
let songList = ref([{
  song_ID: '',
  song_Name: '',
  singer_name: '',
  singer_ID: '',
  album_name: '',
  album_ID: '',
  song_Cover: '',
  song_Directory: '',
}])
let myLikeSong = ref([])

let album_ID = ref("")

const toSinger = (singer_ID) => {
  router.push({
    path: '/singerDetail',
    query: {singer_ID}
  })
}
const {albumid} = defineProps(['albumid']);

onMounted(() => {
  album_ID.value = albumid
  selectSongByAlbum(album_ID.value)
})

/*根据跳转的专辑名字查询歌曲*/
function selectSongByAlbum(data) {
  aSongByAlbum(data).then(resp => {
    if (resp.data.code === 200) {
      songList.value = resp.data.data;
      selectLikeSong()
    } else if (resp.data.code === 500) {
      ElMessage({
        message: "error",
        type: "error",
      })
      console.log(resp.data.msg)
    }
  })
}

/*查询喜欢的歌曲*/
function selectLikeSong() {
  aSelectLikeSong().then(resp => {
    if (resp.status === 401) {
      console.error(resp.status)
    } else if (resp.data.code === 200) {
      myLikeSong.value = resp.data.data;
    } else if (resp.data.code === 500) {
      console.log(resp.data.msg)
    }
  }).catch(resp => {
    console.error(resp)
  })
}

/*添加至我喜欢*/
function likeSong(row) {
  aLikeSong(row).then(resp => {
    if (resp.data.code === 200) {
      myLikeSong.value = resp.data.data
      ElMessage.success("添加成功！")
      selectLikeSong()
    } else if (resp.data.code === 500) {
      console.log(resp.data.msg)
    }
  }).catch(resp => {
    ElNotification({
      title: '请先登录!',
      type: 'error'
    })
  })
}

function dislikeSong(row) {
  aDeleteLikeSong(row).then(resp => {
    if (resp.data.code === 200) {
      selectLikeSong()
    } else if (resp.data.code === 500) {
      console.log(resp.data.msg)
    }
  }).catch(resp => {
    ElNotification({
      title: '请先登录!',
      type: 'error'
    })
  })
}

/*音乐播放*/
function play(index) {
  musicPlayStore.play = false
  musicPlayStore.play = true
  musicPlayStore.index = -2
  musicPlayStore.index = index
  musicPlayStore.songList = songList.value
}
</script>

<template>
  <div class="albumSongList_mod">
    <div class="albumListTitle_mod">
      <span class="snTitle">#</span>
      <span class="songTitle">标题</span>
      <span class="albumTitle">专辑</span>
      <span class="likeTitle">喜欢</span>
      <span class="downloadTitle">下载</span>
    </div>
    <div class="albumListBody_mod" v-for="(item,index) in songList ">
      <!--todo 播放功能待实现-->
      <div class="playButton_mod" @click="play(index)">
        <img src="/src/photos/logo/playGray.png">
      </div>
      <div class="SN_mod">{{ index + 1 }}
      </div>
      <div class="songName_mod">
        <img :src="item.song_Cover">
        <div class="songInfo_mod">
          <span class="song_Name">{{ item.song_Name }}</span>
          <span class="singer_Name" @click="toSinger(item.singer_ID)">{{ item.singer_name }}</span>
        </div>
      </div>
      <div class="albumName_mod">
        <span>{{ item.album_name }}</span>
      </div>
      <div class="like_mod">
        <img src="/src/photos/logo/like.png" @click="likeSong(item.song_ID)"
             v-if="myLikeSong.indexOf(item.song_ID) ===-1">
        <img src="/src/photos/logo/喜欢.png" @click="dislikeSong(item.song_ID)"
             v-if="myLikeSong.indexOf(item.song_ID) !==-1">
      </div>
      <!--todo 下载功能可以更加完善-->
      <div class="download_mod">
        <a :href=item.song_Directory :download="item.song_Name">
          <img src="/src/photos/logo/download.png">
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
/*歌曲列表模块*/
.albumSongList_mod {
  width: 75%;
  min-height: 413px;
  background-color: #f7f9fc;
  margin-left: 200px;
  margin-top: 10px;
  z-index: 2;
  border-radius: 12px;
  padding-bottom: 20px;
  box-shadow: 0 0 10px 3px #e58c43;
  backdrop-filter: blur(8px);
}

/*表头模块*/
.albumListTitle_mod {
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  border-radius: 12px;
}

.albumListTitle_mod span {
  font-family: STXihei, serif;
  color: #2f2f2f;
  font-size: 16px;
  font-weight: 600;
}

.snTitle {
  width: 74px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.songTitle {
  margin-left: 10px;
  width: 570px;
}

.albumTitle {
  width: 500px;
}

.likeTitle {
  width: 87px;
}

.downloadTitle {
  width: 70px;
}

/*表体模块*/
.albumListBody_mod {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
}

.albumListBody_mod:hover {
  background-color: #ffffff;
}

.albumListBody_mod:hover .playButton_mod {
  display: flex;
}

.albumListBody_mod:hover .SN_mod {
  display: none;
}

/*播放按钮（悬浮显示）*/
.playButton_mod {
  display: none;
  height: 65px;
  width: 74px;
  justify-content: center;
  align-items: center;
}

.playButton_mod img {
  width: 30px;
  height: 30px;
  cursor: pointer;
  border-radius: 5px;
  background-color: #82848a;
  transition: 0.5s all ease-in-out;
}

.playButton_mod img:hover {
  transition: 0.5s all ease-in-out;
  border-radius: 50%;
  background-color: #e58c43;
}


/*序号*/
.SN_mod {
  height: 65px;
  width: 85px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/*歌曲名称*/
.songName_mod {
  height: 65px;
  width: 637px;
  display: flex;
  align-items: center;

}

.songName_mod img {
  width: 50px;
  height: 50px;
  border-radius: 20px;
}

.songInfo_mod {
  width: 180px;
  height: 57px;
  margin-left: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}


.song_Name {
  font-family: STXihei, serif;
  color: #000000;
  font-weight: 900;
  font-size: 20px;

}

.singer_Name {
  font-family: STXihei, serif;
  color: #5d5d5d;
  font-size: 15px;
  position: relative;
  cursor: pointer;
}

.singer_Name:hover {
  color: #e58c43;
}

/*专辑名称*/
.albumName_mod {
  width: 549px;
  height: 65px;
  display: flex;
  align-items: center;
}

.albumName_mod span {
  font-family: STXihei, serif;
  color: #5d5d5d;
  cursor: pointer;
}

.albumName_mod span:hover {
  color: #e58c43;
}

/*喜欢按钮*/
.like_mod {
  height: 65px;
  width: 96px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: left;
}

.like_mod img {
  height: 30px;
  width: 30px;
  cursor: pointer;
  transition: 0.5s all ease-in-out;

}

.like_mod img:hover {
  transition: 0.2s all ease-in-out;
  transform: scale(1.1, 1.1);
}

/*下载按钮*/
.download_mod {
  height: 65px;
  width: 79px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: left;
}

.download_mod img {
  height: 30px;
  width: 30px;
  cursor: pointer;
  transition: 0.5s all ease-in-out;

}

.download_mod img:hover {
  transition: 0.2s all ease-in-out;
  transform: scale(1.1, 1.1);
}

.player_mod {
  display: none;
  position: absolute;
  top: 31%;
  right: -5%;
  transform: translate(-50%, -50%);

}
</style>