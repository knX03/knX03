<script setup>
import {markRaw, onMounted, reactive, ref} from "vue";
import homeMenu from "@/components/artists/menuDetail/homeMenu.vue";
import worksManage from "@/components/artists/menuDetail/worksManage.vue";
import dataMenu from "@/components/artists/menuDetail/dataMenu.vue";
import publishWorks from "@/components/artists/menuDetail/publishWorks.vue";
import {store} from "xijs";
import {aGetArtists} from "@/api/api.js";
import router from "@/router/index.js";


let singer = ref({singer_ID: '', singer_Name: '', singer_Avatar: ''})
const menuRouteList = ref([
  {id: 4, name: '发布作品', component: markRaw(publishWorks)},
  {id: 1, name: '首页', component: markRaw(homeMenu)},
  {id: 2, name: '作品管理', component: markRaw(worksManage)},
  {id: 3, name: '数据中心', component: markRaw(dataMenu)},
])

// 默认显示的组件页面
const selectedComponent = ref(homeMenu);

onMounted(() => {
  let singerToken = store.get('access_singer_token').value
  if (singerToken !== null) {

  }
  singerInfo()
})

function selectChange(index) {
  selectedComponent.value = menuRouteList.value[index].component
}

function publishing() {
  selectedComponent.value = menuRouteList.value[0].component
}

//歌手详情
function singerInfo() {
  aGetArtists().then(resp => {
    singer.value = resp.data.data
    console.log(singer.value)
  })
}
</script>

<template>
  <div class="artContent_mod">
    <div class="artMenu_mod" id="artmenu">
      <div class="artInfo">
        <img :src=singer.singer_Avatar>
        <span>{{ singer.singer_Name }}</span>
        <el-button type="warning" plain round @click="publishing">发布作品</el-button>
      </div>
      <el-menu
          default-active="1"
          class="el-menu-vertical-demo"
          @select="selectChange"
      >
        <el-menu-item index="1">
          <el-icon>
            <Menu/>
          </el-icon>
          <span>首页</span>
        </el-menu-item>
        <el-menu-item index="2">
          <el-icon>
            <StarFilled/>
          </el-icon>
          <span>作品管理</span>
        </el-menu-item>
        <el-menu-item index="3">
          <el-icon>
            <Platform/>
          </el-icon>
          <span>数据分析</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="menuDetail_mod">
      <el-scrollbar>
        <KeepAlive>
          <component :is="selectedComponent" :singer="singer"></component>
        </KeepAlive>
      </el-scrollbar>
    </div>
  </div>
</template>

<style scoped>
.artContent_mod {
  //height: 951px;
  height: 834px;
  background-color: #f5f6fa;
  display: flex;
  padding-top: 20px;
  padding-left: 200px;
}

.artMenu_mod {
  background-color: #FFFFFF;
  height: 97%;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0px 0px 6px 1px #ececec;
}


.artInfo {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  height: 180px;
  margin-bottom: 20px;
}

.artInfo img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
}

.artInfo span {
  font-family: STXihei, serif;
  font-weight: bold;
}

#artmenu :deep(.el-menu) {
  border-right: 0px;
  transition: all 0.5s ease-in-out;
  width: 200px;
}

#artmenu :deep(.el-menu-item.is-active) {
  color: #e58c43;
  background-color: #f9f9f9;
  transition: all 0.5s ease-in-out;
}

#artmenu :deep(.el-menu-item:hover) {
  background-color: #f9f9f9;
  transition: all 0.5s ease-in-out;
}

.menuDetail_mod {
  margin-left: 20px;
  width: 75%;
  border-radius: 12px;
  /*  background-color: #FFFFFF;
    max-height: 97%;

    box-shadow: 0px 0px 6px 1px #ececec;*/
}
</style>