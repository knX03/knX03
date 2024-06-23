<script setup>

import {Top} from "@element-plus/icons-vue";
</script>

<template>
  <el-backtop :bottom="100">
    <div
        style="
        height: 100%;
        width: 100%;
        border-radius: 13px;
        background-color: var(--el-bg-color-overlay);
        box-shadow: var(--el-box-shadow-lighter);
        text-align: center;
        line-height: 40px;
        color: #e58c43;
      "
    >
      <Top style="width: 1em; height: 1em; "/>
    </div>
  </el-backtop>
</template>

<style scoped>

</style>