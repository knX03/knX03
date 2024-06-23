<script setup>
import {getCurrentInstance, markRaw, onMounted, reactive, ref} from "vue";
import axios from "axios";
import bus from "@/eventbus.js";
import {ElMessage, ElMessageBox} from "element-plus";
import router from "@/router/index.js";
import song from "@/components/MY/option/song.vue";
import album from "@/components/MY/option/album.vue";
import playlist from "@/components/MY/option/playlist.vue";
import useMusicPlayStore from "@/store/musicPlayStore.js";

const musicPlayStore = useMusicPlayStore();

const {ctx} = getCurrentInstance()
const topBtn = ref([
  {id: 1, name: '歌曲', component: markRaw(song)},
  {id: 2, name: '歌单', component: markRaw(playlist)},
  {id: 3, name: '专辑', component: markRaw(album)}])

// 默认显示的组件页面
const selectedComponent = ref(song);

// 当前选中按钮
const selectedBtn = ref(1);

// 点击按钮切换事件
const selectChange = (item) => {
  selectedBtn.value = item.id;
  selectedComponent.value = item.component;
}


function downloadFile(filepath) {
  console.log(filepath)
  axios({
    method: 'POST',
    url: 'http://localhost/file/download',
    data: filepath,
    headers: {
      'Content-Type': 'application/json;charset=utf-8'      //改这里就好了
    }
  }).then(resp => {
    if (resp.data.code === 200) {
      ElMessage.success('下载成功！')
    } else if (resp.data.code === 500) {
      console.log(resp.data.msg)
      ElMessage.error('下载失败！')
    }
  })
}
</script>

<template>
  <div class="mySecond_mod">
    <div class="optionList_mod">
      <div class="menu" v-for="item in topBtn"
           :key="item.id"
           @click="selectChange(item)">
        <div class="optionButton" :class="{ 'optionActive': selectedBtn === item.id }">
          <span>{{ item.name }}</span>
        </div>
      </div>
    </div>
<!--    &lt;!&ndash;todo 播放和下载功能待实现&ndash;&gt;
    <div class="buttonList_mod">
      <el-button type="warning" plain round>
        播放全部
      </el-button>
      <el-button type="info" round @click="downloadSong()">下载全部</el-button>
      &lt;!&ndash;todo 批量操作待实现&ndash;&gt;
      &lt;!&ndash;<el-button type="info" round>批量操作</el-button>&ndash;&gt;
    </div>-->
    <div>
      <transition name="fade">
        <div>
          <KeepAlive>
            <component :is="selectedComponent"></component>
          </KeepAlive>
        </div>
      </transition>
    </div>
  </div>
</template>
<style scoped>
.optionList_mod {
  width: 380px;
  height: 61px;
  display: flex;
  margin-left: 200px;
  justify-content: space-around;
  align-items: center;
}

.menu {
  width: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu span {
  color: #2c2c2c;
  font-family: 方正粗黑宋简体, serif;
  font-size: 20px;
  cursor: pointer;
}


.optionButton {
  height: 40px;
  width: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.5s all ease-in-out;
  cursor: pointer;
}

.optionButton:hover {
  background-color: #e58c43;
  border-radius: 30px;
  transition: 0.5s all ease-in-out;
}

.optionActive {
  height: 40px;
  width: 100px;
  background-color: #e58c43;
  border-radius: 30px;
  cursor: pointer;
}

/*按钮列表*/
.buttonList_mod {
  width: 430px;
  height: 60px;
  margin-left: 200px;
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
}


.el-button--warning img {
  width: 20px;
  height: 20px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

</style>

