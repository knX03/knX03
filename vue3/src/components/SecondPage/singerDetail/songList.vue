<script setup>
import {defineAsyncComponent, markRaw, onBeforeMount, onMounted, reactive, ref} from "vue";
import {useRoute} from "vue-router";
import list from "@/components/SecondPage/singerDetail/option/singerSongList.vue";
import album from "@/components/SecondPage/singerDetail/option/singerAlbum.vue"
import introduction from "@/components/SecondPage/singerDetail/option/singerIntroduction.vue";

const route = useRoute()
//异步组件
const list1 = defineAsyncComponent(() => (
    new Promise(
        (resolve, reject) => setTimeout(() => {
          resolve(list)
        }, 1000)
    )
))


const topBtn = ref([
  {id: 1, name: '歌曲', component: markRaw(list)},
  {id: 2, name: '专辑', component: markRaw(album)},
  {id: 3, name: '歌手详情', component: markRaw(introduction)}])

// 默认显示的组件页面
const selectedComponent = ref(list);

// 当前选中按钮
const selectedBtn = ref(1);

// 点击按钮切换事件
const selectChange = (item) => {
  selectedBtn.value = item.id;
  selectedComponent.value = item.component;
}
let singer_ID = ref('')


onBeforeMount(() => {
  singer_ID.value = route.query.singer_ID
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
        <component :is="selectedComponent" :singer_ID="singer_ID"></component>
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
  background-color: #ffffff;
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