<script setup>

import AUTnav from "@/components/utils/AUTnav.vue";
import BottomLogo from "@/components/utils/bottomLogo.vue";
import Backtop from "@/components/utils/backtop.vue";
import Info from "@/components/myInfo/Info.vue";
import CreateList from "@/components/myInfo/createList.vue";
import LikeList from "@/components/myInfo/likeList.vue";
</script>

<template>
  <AUTnav></AUTnav>
  <Info></Info>
  <create-list></create-list>
  <like-list></like-list>
  <bottom-logo></bottom-logo>
  <backtop></backtop>
</template>

<style scoped>

</style>