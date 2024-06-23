<script setup>

import SecondNav from "@/components/utils/secondNav.vue";
import AUTnav from "@/components/utils/AUTnav.vue";
import Backtop from "@/components/utils/backtop.vue";
import BottomLogo from "@/components/utils/bottomLogo.vue";
import SingerList from "@/components/singer/singerList.vue";
import SingerSelector from "@/components/singer/singerSelector.vue";

</script>

<template>
  <AUTnav></AUTnav>
  <secondNav></secondNav>
  <singer-selector></singer-selector>
  <singer-list></singer-list>
  <bottom-logo></bottom-logo>
  <backtop></backtop>
</template>

<style scoped>

</style>