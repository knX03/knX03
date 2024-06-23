<script setup>

import {onMounted, ref} from "vue";
import axios from "axios";
import {ElMessage, ElNotification} from "element-plus";
import {useRoute} from "vue-router";
import {
  aCollectAlbum,
  aDeleteAlbum,
  aIfCollectAlbum,
  aSelectDetailAlbum,
  aSelectSingerDetail,
  aSongByAlbum
} from "@/api/api.js";
import router from "@/router/index.js";

import useMusicPlayStore from "@/store/musicPlayStore.js";

const musicPlayStore = useMusicPlayStore();
const route = useRoute()
let ifCollect = ref(false)
let colletBUTX = ref("收藏")
let user = ref({user_ID: '', user_name: ''})
let album = ref({
  album_ID: '',
  album_Name: '',
  album_Cover: '',
  create_Time: '',
  singer_name: '',
  singer_ID: '',
  album_Introduction: '',
})

let singer = ref({
  singer_ID: '',
  singer_Name: '',
  singer_Avatar: ''
})
let songList = ref([{
  song_ID: '',
  song_Name: '',
  singer_ID: '',
  singer_name: '',
  album_ID: '',
  album_name: '',
  song_cover: '',
  song_Directory: '',
}])

const toSinger = (singer_ID) => {
  router.push({
    path: '/singerDetail',
    query: {singer_ID}
  })
}
onMounted(() => {
  const FAlbum_ID = route.query.album_ID
  ifCollectAlbum(FAlbum_ID)
  selectDetailAlbum(FAlbum_ID)
  selectSongByAlbum(FAlbum_ID)
})


/*专辑详情查询*/
function selectDetailAlbum(FAlbum_ID) {
  aSelectDetailAlbum(FAlbum_ID).then(resp => {
    if (resp.data.code === 200) {
      album.value = resp.data.data;
      /*查询歌手详细信息*/
      selectSingerDetail(resp.data.data.singer_ID)
    } else if (resp.data.code === 500) {
      console.log(resp.data.msg)
    }
  })
}

/*歌手详情查询*/
function selectSingerDetail(singer_ID) {
  aSelectSingerDetail(singer_ID).then(resp => {
    if (resp.data.code === 200) {
      singer.value = resp.data.data;
    } else if (resp.data.code === 500) {
      console.error(resp.data.msg)
    }
  })
}
/*根据跳转的专辑名字查询歌曲*/
function selectSongByAlbum(data) {
  aSongByAlbum(data).then(resp => {
    if (resp.data.code === 200) {
      songList.value = resp.data.data;
    } else if (resp.data.code === 500) {
      ElMessage({
        message: "error",
        type: "error",
      })
      console.log(resp.data.msg)
    }
  })
}

/*查询专辑是否收藏*/
function ifCollectAlbum(album_ID) {
  aIfCollectAlbum(album_ID).then(resp => {
    if (resp.data.code === 302) {
      colletBUTX.value = "已收藏"
      ifCollect.value = true;
    } else if (resp.data.code === 200) {
      ifCollect.value = false;
    }
  }).catch(resp => {
    console.log(resp)
  })
}

function
collectAlbum(row) {
  aCollectAlbum(row).then(resp => {
    if (resp.data.code === 200) {
      ElMessage.success("收藏成功！")
      colletBUTX.value = "已收藏"
      ifCollect.value = true;
    } else if (resp.data.code === 500) {
      console.error(resp.data.msg)
    }
  }).catch(resp => {
    ElNotification({
      title: '请先登录!',
      type: 'error'
    })
  })
}

function delColAlbum(row) {
  aDeleteAlbum(row).then(resp => {
    if (resp.data.code === 200) {
      ElMessage.success('删除成功！')
      colletBUTX.value = "收藏"
      ifCollect.value = false;
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

//播放全部歌曲
function playAll() {
  musicPlayStore.play = false
  musicPlayStore.play = true
  musicPlayStore.index = -2
  musicPlayStore.index = 0
  musicPlayStore.songList = songList.value
}
</script>

<template>
  <div class="first_mod">
    <img :src="album.album_Cover" class="Cover_mod">
    <div class="albumInfo_mod">
      <div class="basicInfo_mod">
        <span>{{ album.album_Name }}</span>
      </div>
      <div class="ALSingerInfo_mod">
        <img :src="singer.singer_Avatar" style="cursor: pointer" @click="toSinger(singer.singer_ID)">
        <span style="cursor: pointer" @click="toSinger(singer.singer_ID)">{{ singer.singer_Name }}</span>
        <span style="color: #e7e7e7">{{ album.create_Time }} 发布</span>
      </div>
      <!--todo 播放、下载功能待实现-->
      <div class="playAndLoad_mod">
        <el-button type="warning" @click="playAll()">
          <img src="/src/photos/logo/playWhite.png">
          <span>播放全部</span>
        </el-button>
        <el-button type="info" v-if="!ifCollect" @click="collectAlbum(album.album_ID)">
          <img src="/src/photos/logo/collect.png">
          {{ colletBUTX }}
        </el-button>
        <el-button type="warning" v-if="ifCollect" @click="delColAlbum(album.album_ID)">
          <img src="/src/photos/logo/collect.png">
          {{ colletBUTX }}
        </el-button>
        <el-button type="info">
          <img src="/src/photos/logo/downLoadWhite.png">
          <span>下载</span>
        </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.first_mod {
  width: 100%;
  height: 240px;
  background-image: linear-gradient(#333333, #ffffff);
}

/*专辑封面*/
.Cover_mod {
  width: 200px;
  height: 200px;
  border-radius: 30px;
  position: relative;
  top: 50%;
  left: 18%;
  transform: translate(-50%, -50%);
}

/*选项模块*/
.albumInfo_mod {
  height: 250px;
  position: absolute;
  top: 79px;
  left: 430px;
}

/*歌单基础信息*/
.basicInfo_mod {
  width: 185px;
  height: 40px;
  display: flex;
  position: relative;
  top: 30px;
  left: 10px;
  align-items: center;
}

.basicInfo_mod span {
  font-family: STXihei, serif;
  font-size: 30px;
  font-weight: 900;
  color: #ffffff;
}


/*用户信息模块*/
.ALSingerInfo_mod {
  width: 160px;
  height: 30px;
  position: relative;
  top: 40px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  left: 10px;
}

.ALSingerInfo_mod img {
  height: 20px;
  width: 20px;
  border-radius: 50%;
}

.ALSingerInfo_mod span {
  font-family: STXihei, serif;
  font-size: 12px;
  color: #e7e7e7;
}

.ALSingerInfo_mod span:hover {
  color: #ffffff;
}

/*播放和下载按钮*/
.playAndLoad_mod {
  width: 350px;
  height: 50px;
  position: absolute;
  bottom: 24px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;

}

.playAndLoad_mod span {
  font-family: STXihei, serif;
  color: white;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
}

.playAndLoad_mod img {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.playAndLoad_mod .el-button {
  color: #FFF;
  border-radius: 12px;

}

.playAndLoad_mod .el-button span {
  display: flex;
  align-items: center;
  justify-content: center;
}

/*下载按钮*/
.playAndLoad_mod .el-button--info {
  color: #FFF;
}
</style>