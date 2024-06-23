<script setup>

</script>

<template>
  <!--底部模块-->
  <div id="a" class="bottom_mod">
    <div>
      <el-icon><Sunrise /></el-icon>
      <el-icon><Sunny /></el-icon>
      <el-icon><MostlyCloudy /></el-icon>
      <el-icon><Pouring /></el-icon>
      <el-icon><Drizzling /></el-icon>
      <el-icon><Cloudy /></el-icon>
      <el-icon><PartlyCloudy /></el-icon>
      <el-icon><Sunset /></el-icon>
      <el-icon><Moon /></el-icon>
      <el-icon><MoonNight /></el-icon>
    </div>
    <label>Copyright © 2003 - 2023 knx. All Rights Reserved.</label>
  </div>
</template>

<style scoped>
.bottom_mod {
  /*width: 100%;*/
  height: 100px;
  background-color: #707070;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  z-index: 0;
  margin-top: 15px;
}

.bottom_mod i {
  margin-left: 20px;
}

.bottom_mod label {
  font-family: STXihei, serif;
  font-size: 12px;
}
</style>