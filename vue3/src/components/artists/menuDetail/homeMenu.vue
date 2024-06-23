<script setup>
import {defineProps, onMounted, reactive, ref} from "vue";

const {singer} = defineProps(['singer']);
/*let singerInfo = reactive({singer_Name: '', singer_Avatar: ''})
onMounted(() => {
  singerInfo.value = singer
})*/
</script>

<template>
  <div class="box_mod">
    <div class="message_artists">
      <div class="message_content">
        <div class="message_text">
          <el-icon>
            <BellFilled/>
          </el-icon>
          卡就回大家拉萨看得看见路上啊空间大世界大赛爱哭的哈萨克的的就看到就拉升阶段拉萨的就省联考上的机阿里山大家了
        </div>
        <span>2024-06-09 14:49</span>
      </div>
      <div style="width: 1px;height: 20px;background-color: #6e6e6e;margin-left: 10px;margin-right: 10px"/>
      <div>全部消息</div>
    </div>
  </div>

  <div class="box_mod">
    <div class="artists_info">
      <img :src=singer.singer_Avatar>
      <div class="a_info">
        <span>{{ singer.singer_Name }}</span>
        <el-icon>
          <Sunny/>
        </el-icon>
      </div>
    </div>
  </div>

  <div class="small_box_container">
    <div class="small_box_mod">
      <div class="works_data_mod">
        <div class="title_dm">
          <span style="font-weight: 900;font-size: 20px">作品数据</span>
          <span style="cursor: pointer">详细数据 > </span>
        </div>
        <div class="data_form_mod">
          <div class="data_part">
            <span style="font-size: 15px">昨日歌曲播放</span>
            <span style="font-weight: 900;font-size: 40px">0</span>
          </div>
          <div class="data_part">
            <span style="font-size: 15px">昨日评论量</span>
            <span style="font-weight: 900;font-size: 40px">0</span>
          </div>
          <div class="data_part">
            <span style="font-size: 15px">昨日收藏量</span>
            <span style="font-weight: 900;font-size: 40px">0</span>
          </div>
        </div>
      </div>
    </div>

    <div class="small_box_mod">
      <div class="fans_data_mod">
        <div class="title_dm">
          <span style="font-weight: 900;font-size: 20px">粉丝数据</span>
          <span style="cursor: pointer">详细数据 > </span>
        </div>
        <div class="data_form_mod">
          <div class="data_part">
            <span style="font-size: 15px">当前粉丝数</span>
            <span style="font-weight: 900;font-size: 40px">0</span>
          </div>
          <div class="data_part">
            <span style="font-size: 15px">昨日新增粉丝</span>
            <span style="font-weight: 900;font-size: 40px">0</span>
          </div>
          <div class="data_part">
            <span style="font-size: 15px">昨日取消关注</span>
            <span style="font-weight: 900;font-size: 40px">0</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="box_mod">
    <h1>HOME</h1>
    <h1>HOME</h1>
    <h1>HOME</h1>
    <h1>HOME</h1>
    <h1>HOME</h1>
  </div>
</template>

<style scoped>
.homeMe_mod {
  width: 100%;
}

/*盒子模块*/
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

/*歌手消息栏*/
.message_artists {
  height: 30px;
  width: 100%;
  display: flex;
  align-items: center;
  color: #6e6e6e;
}

/*消息内容*/
.message_content {
  width: 90%;
  height: 25px;
  color: #6e6e6e;
  font-family: STXihei, serif;
  display: flex;
  justify-content: space-between;
}

.message_text {
  max-width: 75%;
  display: flex;
  align-items: center;
  text-align: center;
  overflow: hidden;
  white-space: nowrap; /*强制单行显示*/
  text-overflow: ellipsis; /*超出部分省略号表示*/
}

/*歌手信息展示*/
.artists_info {
  width: 100%;
  height: 150px;
  display: flex;
  align-items: center;
}

.artists_info img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}

.a_info {
  width: 200px;
  height: 80%;
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}

.a_info span {
  font-size: 25px;
  font-family: SimHei, serif;
  font-weight: 900;
}

/*作品数据*/
.works_data_mod {
  width: 100%;
  height: 150px;
}

/*粉丝数据*/
.fans_data_mod {
  width: 100%;
  height: 150px;
}

/*标头*/
.title_dm {
  width: 100%;
  height: 30px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: STXihei, serif;
}

.data_form_mod {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
}

.data_part {
  width: 130px;
  height: 105px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.data_part span {
  font-family: STXihei, serif;
}
</style>