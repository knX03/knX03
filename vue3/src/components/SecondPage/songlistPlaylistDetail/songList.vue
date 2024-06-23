<script setup>
import {markRaw, onBeforeMount, onMounted, ref} from "vue";
import router from "@/router/index.js";
import bus from "@/eventbus.js";
import axios from "axios";
import {ElMessage} from "element-plus";
import list from "@/components/SecondPage/songlistPlaylistDetail/option/playlistSongList.vue"
import introduction from "@/components/SecondPage/songlistPlaylistDetail/option/playlistIntroduction.vue"
import comment from "@/components/SecondPage/songlistPlaylistDetail/option/playlistcomment.vue"
import {useRoute} from "vue-router";


const route = useRoute()
const topBtn = ref([
  {id: 1, name: '歌曲', component: markRaw(list)},
  {id: 2, name: '详情', component: markRaw(introduction)},
  {id: 3, name: '评论', component: markRaw(comment)}])

// 默认显示的组件页面
const selectedComponent = ref(list);

// 当前选中按钮
const selectedBtn = ref(1);

// 点击按钮切换事件
const selectChange = (item) => {
  selectedBtn.value = item.id;
  selectedComponent.value = item.component;
}

let playlist_ID = ref('')


onBeforeMount(() => {
  playlist_ID.value = route.query.playlist_ID
})

onMounted(() => {

})


</script>

<template>
  <div class="second_mod">
    <div class="ListOption_mod">
      <span class="optionTX" :class="{ 'optionActive': selectedBtn === item.id }" v-for="item in topBtn" :key="item.id"
            @click="selectChange(item)">{{ item.name }}</span>
    </div>
    <div>
      <KeepAlive>
        <component :is="selectedComponent" :list_ID="playlist_ID"></component>
      </KeepAlive>
    </div>
  </div>
</template>

<style scoped>
/**
歌曲信息部分
 */
.second_mod {
  width: 100%;
  background-color: #f7f9fc;
}

.ListOption_mod {
  width: 350px;
  height: 40px;
  position: relative;
  left: 190px;
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.optionTX {
  font-family: STXihei, serif;
  color: black;
  font-weight: 800;
  font-size: 20px;
  cursor: pointer;
}

.optionTX:hover {
  color: #e58c43;
}

.optionActive {
  font-family: STXihei, serif;
  color: #e58c43;
  font-weight: 800;
  font-size: 20px;
  cursor: pointer;
}

</style>