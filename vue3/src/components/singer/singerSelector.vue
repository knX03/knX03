<script setup>
import {getCurrentInstance, onMounted, ref} from "vue";
import axios from "axios";
import bus from "@/eventbus.js";
import {aSingerSelector} from "@/api/api.js";

// ctx等同于Vue2.x的this
const {ctx} = getCurrentInstance()

const langType = ref(['全部', '华语', '欧美', '日本', '韩国', '其他'])
const singerType = ref(['全部', '男歌手', '女歌手', '乐队'])
const singerStyle = ref(['',])
const alphabet = ref(['热门', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'L',
  'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '#'],)
let singerLang = ref('全部')
let singerTY = ref('全部')
let singerAl = ref('热门')
let selectorList = ref([singerLang.value, singerTY.value, singerAl.value])
let singerList = ref([
  {
    singer_ID: '',
    singer_Name: '',
    singer_Avatar: '',
  }
])

onMounted(() => {
  handleClick()
})


function handleClick() {
  setTimeout(() => {
    selectSinger()
  }, 100)
}

function selectSinger() {
  selectorList.value = [singerLang.value, singerTY.value, singerAl.value]
  aSingerSelector(selectorList.value).then(resp => {
    if (resp.data.code === 200) {
      singerList.value = resp.data.data;
      bus.emit('singerListChange', singerList.value)
    } else if (resp.data.code === 500) {
      console.error(resp.data.msg)
    }
  })
}
</script>

<template>
  <div id="selector_mod">
    <div class="langType_mod">
      <el-tabs type="card" id="langType_tab" v-model="singerLang" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane v-for="item in langType" :label="item" :name="item" :key="item"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="singerType_mod">
      <el-tabs type="card" id="singerType_tab" v-model="singerTY" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane v-for="item in singerType" :label="item" :name="item" :key="item"></el-tab-pane>
      </el-tabs>
    </div>
    <div id="alphabet_mod">
      <el-tabs type="card" id="alphabet_tab" v-model="singerAl" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane v-for="item in alphabet" :label="item" :name="item" :key="item"></el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<style scoped>
#selector_mod {
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  padding-left: 190px;
}

.langType_mod {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.langType_mod span {
  margin-right: 15px;
}

.singerType_mod {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.singerType_mod span {
  margin-right: 15px;

}

#alphabet_mod {
  display: flex;
  max-width: 80%;
  align-items: center;
  margin-bottom: 15px;

}

#alphabet_mod span {
  margin-right: 15px;

}

/*选择器样式覆写*/
/*
#selector_mod >>> .el-tabs--card > .el-tabs__header {
*/
#selector_mod :deep(.el-tabs__header) {
  border: 0;
}

/*
#selector_mod >>> .el-tabs--card > .el-tabs__header .el-tabs__nav {
*/
#selector_mod :deep(.el-tabs__header .el-tabs__nav) {
  border: 0;
}

#selector_mod :deep(.el-tabs__item) {
  width: 80px;
  height: 40px;
  border-radius: 34px;
  border: 1px solid #d0d0d0;
  background-color: rgba(234, 234, 234, 0.31);
  margin-right: 20px;
  transition: 0.5s all ease-in-out;
}

#selector_mod :deep(.el-tabs__item:hover) {
  color: #e58c43;
  background-color: rgba(227, 149, 91, 0.34);
  transition: 0.5s all ease-in-out;
}

#selector_mod :deep(.el-tabs__item.is-active) {
  color: #e58c43;
  background-color: rgba(227, 149, 91, 0.34);
}

/*字母表筛选样式*/
#alphabet_mod :deep(.el-tabs) {
  max-width: 100%;
}

#alphabet_mod :deep(.el-tabs__item) {
  width: 30px;
  height: 30px;
  border-radius: 0;
  border: 0;
  background-color: transparent;
  margin-right: 0;
  transition: 0.5s all ease-in-out;
}

#alphabet_mod :deep(.el-tabs__item.is-active) {
  background-color: transparent;
}

#alphabet_mod :deep(.el-tabs__item:hover) {
  color: #e58c43;
  background-color: transparent;
  transition: 0.5s all ease-in-out;
}

#alphabet_mod :deep(.el-tabs__nav-wrap.is-scrollable) {
  padding: 0 30px;
}

#alphabet_mod :deep(.el-tabs__nav-next) {
  color: #e58c43;
}

</style>