<script setup>

function changeData() {

}
</script>

<template>
  <span class="title_dm">数据中心</span>
  <el-dropdown
      trigger="click">
    <div class="option_dm" @click="changeData()">
      <span>粉丝</span>
      <div class="division_dm"></div>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>作品</el-dropdown-item>
        <el-dropdown-item>粉丝</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
  <div class="box_mod">
    <span style="font-size: 20px">年龄分布</span>
    <div class="fans_age_data">
    </div>
  </div>

  <div class="small_box_container">
    <div class="small_box_mod">
      <span style="font-size: 20px">性别分布</span>
      <div class="fans_age_data">
      </div>
    </div>

    <div class="small_box_mod">
      <span style="font-size: 20px">性别分布</span>
      <div class="fans_age_data">
      </div>
    </div>
  </div>

</template>

<style scoped>
.box_mod {
  width: 100%;
  background-color: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0px 0px 6px 1px #ececec;
  margin-bottom: 20px;
  padding: 20px 30px;
}

/*小盒子容器*/
.small_box_container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

/*小盒子模块*/
.small_box_mod {
  width: 49%;
  background-color: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0px 0px 6px 1px #ececec;
  padding: 20px 30px;
}

.title_dm {
  display: block;
  font-family: SimHei, serif;
  font-size: 25px;
  font-weight: bolder;
  margin-top: 20px;
  margin-bottom: 20px;
}

.option_dm {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100px;
  height: 45px;
  margin-bottom: 20px;
  cursor: pointer;
}

.option_dm span {
  font-size: 23px;
  font-family: SimHei, serif;
  color: #4d4d4d;
}

.division_dm {
  width: 44px;
  height: 3px;
  border-radius: 30px;
  background-color: #4d4d4d;
}

/*修改下来菜单的样式*/
:deep(.el-dropdown-menu__item:not(.is-disabled):focus) {
  background-color: #fff4ec;
  color: #e58c43;
}

:deep(.el-dropdown-menu) {
  width: 100px;
}

:deep(.el-dropdown-menu__item) {
  width: 100px;
  height: 50px;
  font-size: 16px;
}

:deep( .el-popper) {
  position: absolute !important;
  left: 704px !important;
}


:deep(.el-popper__arrow ) {
  display: none;
}

.fans_age_data {
  width: 100%;
  height: 300px;
  margin-top: 10px;
  background-color: #1b80e4;
}
</style>