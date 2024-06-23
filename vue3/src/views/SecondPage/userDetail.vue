<script setup>

import AUTnav from "@/components/utils/AUTnav.vue";
import BottomLogo from "@/components/utils/bottomLogo.vue";
import Backtop from "@/components/utils/backtop.vue";
import Info from "@/components/SecondPage/userDetail/Info.vue";
import CreateList from "@/components/SecondPage/userDetail/CreateList.vue";
import LikeList from "@/components/SecondPage/userDetail/LikeList.vue";
</script>

<template>
  <AUTnav></AUTnav>
  <Info></Info>
  <CreateList></CreateList>
  <LikeList></LikeList>
  <bottom-logo></bottom-logo>
  <Backtop></Backtop>
</template>

<style scoped>

</style>