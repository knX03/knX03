<script setup>

import AUTnav from "@/components/utils/AUTnav.vue";
import AlbumInfo from "@/components/SecondPage/albumDetail/albumInfo.vue";
import AlbumSongList from "@/components/SecondPage/albumDetail/albumSongList.vue";
import BottomLogo from "@/components/utils/bottomLogo.vue";
import Backtop from "@/components/utils/backtop.vue";
</script>

<template>
  <AUTnav></AUTnav>
  <album-info></album-info>
  <AlbumSongList></AlbumSongList>
  <bottom-logo></bottom-logo>
  <Backtop></Backtop>
</template>

<style scoped>

</style>