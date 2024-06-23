<script setup>
import {onBeforeMount, onMounted, ref} from "vue";
import axios from "axios";
import router from "@/router/index.js";
import {aGetAllPLTag, aSelectALlPlaylist, aSelectPlaylistByTag} from "@/api/api.js";
import {useRoute} from "vue-router";

const route = useRoute()
let SPlist = ref([
  {
    playlist_ID: '',
    playlist_Name: '',
    playlist_Cover: '',
  },
])
const PLTagList = ref([
  {tag_id: '', tag_name: ''}
])
const activeIndex = ref(
    '0'
)
onBeforeMount(() => {
  getAllPLTag()
})
onMounted(() => {
  let tagID = route.query.tag_ID
  if (tagID) {
    activeIndex.value = tagID
    selectPlaylistByTag(tagID)
  } else {
    selectALlPlaylist()
    activeIndex.value = '1'
  }
})

/*查询所有歌单标签*/
function getAllPLTag() {
  aGetAllPLTag().then(resp => {
    if (resp.data.code === 200) {
      PLTagList.value = resp.data.data;
    } else if (resp.data.code === 500) {
      console.log(resp.data.msg)
    }
  })
}

/*查询所有歌单*/
function selectALlPlaylist() {
  aSelectALlPlaylist().then(resp => {
    if (resp.data.code === 200) {
      SPlist.value = resp.data.data;
    } else if (resp.data.code === 500) {
      console.log(resp.data.msg)
    }
  })
}

/*歌单标签查询*/
function selectPlaylistByTag(data) {
  aSelectPlaylistByTag(data).then(resp => {
    if (resp.data.code === 200) {
      SPlist.value = resp.data.data;
    } else if (resp.data.code === 500) {
      console.log(resp.data.msg)
    }
  })
}

/*歌单详情跳转*/
function toSongPlaylist(row) {
  router.push({
    path: '/playlistDetails',
    query: {playlist_ID: row}
  })
}

//菜单激活回调
function handleSelect(item) {
  if (item === '1') {
    selectALlPlaylist()
  } else {
    selectPlaylistByTag(item)
  }
}

//菜单激活回调
function handleClick(data) {
  //console.log(data)
}
</script>

<template>
  <div class="playlist_mod">
    <div id="playlist_selector">
      <el-menu
          id="plSelector_mod"
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
      >
        <el-menu-item id="plSelector_item"
                      v-for="(item,index) in PLTagList"
                      :key="index"
                      :index="item.tag_id"
                      @click="handleClick(item.tag_name)">
          <span slot="title">{{ item.tag_name }}</span>
        </el-menu-item>
        <!--todo 更多分类未完成-->
        <el-sub-menu index="6">
          <template #title id="title">更多</template>
          <div class="moreType_mod">
            <div class="tyTitle">
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
            </div>
            <div id="moreTyList">
              <el-menu-item index="6-1">item one</el-menu-item>
              <el-menu-item index="6-2">item two</el-menu-item>
              <el-menu-item index="6-3">item three</el-menu-item>
            </div>
          </div>
        </el-sub-menu>
      </el-menu>
    </div>
    <div class="playlist_container">
      <div class="songPlaylist_mod" v-for="item in SPlist">
        <div class="img_container" @click="toSongPlaylist(item.playlist_ID)">
          <img :src="item.playlist_Cover">
          <div class="playlist_name_action">
            {{ item.playlist_Name }}
          </div>
        </div>
        <span @click="toSongPlaylist(item.playlist_ID)">{{ item.playlist_Name }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/**
列表部分
 */
.playlist_mod {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 600px;
}

/*歌单选择器*/
#playlist_selector {
  margin-top: 15px;
}

#plSelector_mod {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  padding: 0;
  background-color: transparent;
}


#plSelector_item {
  height: 40px;
  width: 74px;
  list-style-type: none;
  margin: 10px 10px;
  float: left;
  transition: 0.5s all ease-in-out;
  border: 1px solid #C5C5C5FF;
  border-radius: 30px;
  background-color: rgba(0, 0, 0, 0.04);
}

#plSelector_item span {
  font-family: STXihei, serif;
  font-size: medium;
  display: block;
  color: black;
  text-decoration: none;
  user-select: none;
  transition: 0.5s all ease-in-out;
}

#plSelector_item:hover {
  background-color: rgba(229, 140, 67, 0.45);
  border: 1px solid #e58c43;
  border-radius: 30px;
  transition: 0.5s all ease-in-out;
}

#plSelector_item:hover span {
  color: #e16200;
}

.el-menu--horizontal > .el-menu-item.is-active {
  border: 1px solid #e58c43 !important;
  color: transparent;
  transition: 0.5s all ease-in-out;
}

.el-menu-item.is-active {
  background-color: rgba(229, 140, 67, 0.45) !important;
  border-radius: 30px;
  text-decoration: none;
  transition: 0.5s all ease-in-out;
}

.el-menu-item.is-active span {
  color: #e16200 !important;
  transition: 0.5s all ease-in-out;
}


/*多选*/
#playlist_selector >>> .el-menu--horizontal > .el-sub-menu {
  height: 40px;
  list-style-type: none;
  margin: 10px 10px;
  float: left;
  transition: 0.5s all ease-in-out;
  border: 1px solid #C5C5C5FF;
  border-radius: 30px;
  background-color: rgba(0, 0, 0, 0.04);
}

#playlist_selector >>> .el-menu--horizontal > .el-sub-menu .el-sub-menu__title {
  border: 1px solid #C5C5C5FF;
  border-radius: 30px;
  background-color: rgba(0, 0, 0, 0.04);
}

#playlist_selector >>> .el-menu--horizontal > .el-sub-menu .el-sub-menu__title:hover {
  background-color: rgba(229, 140, 67, 0.45);
  border: 1px solid #e58c43;
  border-radius: 30px;
  transition: 0.5s all ease-in-out;
}

#playlist_selector >>> .el-menu--horizontal > .el-sub-menu:hover .el-sub-menu__title {
  color: #e16200;
  border: 0;
}

#playlist_selector >>> .el-menu--horizontal > .el-sub-menu.is-active .el-sub-menu__title {
  background-color: rgba(229, 140, 67, 0.45);
  color: #e16200;
  border-radius: 30px;
  text-decoration: none;
  transition: 0.5s all ease-in-out;
  border: 0;
}

/*多选模块*/
.moreType_mod {
  width: 500px;
  height: 300px;
}

.tyTitle {
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;

}

.tyTitle span {
  height: 30px;
  width: 60px;
  background-color: #1b80e4;
}

#moreTyList {
  width: 100%;
  height: 100%;
  display: flex;

}

#moreTyList >>> .el-menu--horizontal > .el-menu-item {
  height: 40px;
  width: 74px;
  list-style-type: none;
  margin: 10px 10px;
  float: left;
  transition: 0.5s all ease-in-out;
  border: 1px solid #C5C5C5FF;
  border-radius: 30px;
  background-color: rgba(0, 0, 0, 0.04);
}

/*歌单列表*/
.playlist_container {
  margin-top: 15px;
  max-width: 1400px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}


.songPlaylist_mod {
  height: 250px;
  border-radius: 12px;
  margin-top: 10px;
  margin-left: 20px;
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

.playlist_name_action {
  font-family: "微软雅黑 Light", serif;
  background: transparent;
  width: 100%;
  height: 50%;
  transition: 2s all ease-in-out;
  translate: 0 20px;
}

.img_container:hover .playlist_name_action {
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

.songPlaylist_mod span {
  display: flex;
  font-family: "微软雅黑 Light", serif;
  font-size: 16px;
  margin-left: 15px;
  margin-top: 15px;
  cursor: pointer;
  color: #000000;
  transition: 0.5s all ease-in-out;
}

.songPlaylist_mod span:hover {
  transition: 0.5s all ease-in-out;
  transform: scale(1.1, 1.1);
  color: #75c1c4;
}

</style>