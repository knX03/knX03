<script setup>
import {ref} from "vue";

const swiperImg = ref([
  {
    id: "0", idView: 'src/photos/singerAvatar/JJ.jpg', url: '/music/SecondaryPage/SingerDetail.html',
    type: "singer_ID",
    value: "周杰伦"
  },
  {
    id: "1", idView: '/src/photos/singerAvatar/JJ.jpg', url: '/music/SecondaryPage/SingerDetail.html',
    type: "singer_ID",
    value: "林俊杰"
  },
  {
    id: "2", idView: '/src/photos/albumCover/我很忙.jpg', url: '/music/SecondaryPage/AlbumDetail.html',
    type: "album_Name",
    value: "我很忙"
  },
  {
    id: "3", idView: '/src/photos/userAvatar/IMG_5185.PNG', url: '/music/SecondaryPage/SingerDetail.html',
    type: "singer_ID",
    value: "周杰伦"
  },
  {
    id: "4", idView: '/src/photos/albumCover/学不会.jpg', url: '/music/SecondaryPage/AlbumDetail.html',
    type: "album_Name",
    value: "学不会"
  },
  {
    id: "5", idView: '/src/photos/albumCover/魔杰座.png', url: '/music/SecondaryPage/AlbumDetail.html',
    type: "album_Name",
    value: "魔杰座"
  },
],)

/*轮播图跳转*/
function swiperDetail(swiperImg) {
  location.href = swiperImg.url;
  window.sessionStorage.setItem(swiperImg.type, swiperImg.value);
}
</script>

<template>
    <el-carousel :interval="4000" type="card" indicator-position="none" arrow="never">
      <el-carousel-item v-for="item in swiperImg" :key="item">
        <!--todo 每张图片有不同对应页面-->
        <a href="#" @click="swiperDetail(item)">
          <div class="imgContainer">
            <img :src="item.idView">
          </div>
        </a>
      </el-carousel-item>
    </el-carousel>
</template>

<style scoped>
/**
轮播图模块
 */
el-carousel {
  position: relative;
  height: 400px;
  width: 1500px;
}

a {
  text-decoration: none;
}

.imgContainer {
  width: 750px;
  height: 400px;
  overflow: hidden;
  max-height: 400px;
  max-width: 750px;
}

img {
  width: 750px;
  height: 400px;
  transition: 0.5s all ease-in-out;

}

.imgContainer:hover img {
  transition: 0.5s all ease-in-out;
  transform: scale(1.2, 1.2);
}
</style>