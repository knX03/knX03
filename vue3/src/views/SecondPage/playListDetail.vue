<script setup>

import AUTnav from "@/components/utils/AUTnav.vue";
import SongList from "@/components/SecondPage/songlistPlaylistDetail/songList.vue";
import BottomLogo from "@/components/utils/bottomLogo.vue";
import Backtop from "@/components/utils/backtop.vue";
import PlaylistInfo from "@/components/SecondPage/songlistPlaylistDetail/playlistInfo.vue";
</script>

<template>
  <AUTnav></AUTnav>
  <playlist-info></playlist-info>
  <song-list></song-list>
  <bottom-logo></bottom-logo>
  <backtop></backtop>
</template>

<style scoped>

</style>