<script setup>
import AUTnav from '../components/utils/AUTnav.vue'
import SecondNav from "@/components/utils/secondNav.vue";
import {Top} from "@element-plus/icons-vue";
import Backtop from "@/components/utils/backtop.vue";
import SongListRecomm from "@/components/home/songListRecomm.vue";
import AlbumRecomm from "@/components/home/albumRecomm.vue";
import Swiper from "@/components/home/swiper.vue";
import BottomLogo from "@/components/utils/bottomLogo.vue";
</script>

<template>
  <AUTnav></AUTnav>
  <secondNav></secondNav>
  <swiper></swiper>
  <song-list-recomm></song-list-recomm>
  <album-recomm></album-recomm>
  <bottom-logo></bottom-logo>
  <backtop></backtop>
</template>

<style scoped>

</style>