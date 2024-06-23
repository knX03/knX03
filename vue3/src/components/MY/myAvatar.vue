<script setup>
import {onMounted, ref} from "vue";
import axios from "axios";
import bus from "@/eventbus.js";

let sex_logo = ref("")

onMounted(() => {
  let FUser_ID = 46540
})
let user = ref(
    {user_Name: '', user_ID: '', user_Avatar: 'src/photos/logo/avatarWhite.png', user_Sex: ''}
)
bus.on('userInfo', (data) => {
  user.value = data
  changeSexLogo()
})

/*不同的性别对应不同的logo*/
function changeSexLogo() {
  switch (user.value.user_Sex) {
    case '男':
      sex_logo.value = "src/photos/logo/boy.png"
      break
    case '女':
      sex_logo.value = "src/photos/logo/girl.png"
      break
    case '外星人':
      sex_logo.value = "src/photos/logo/alien.png"
      break
    case '沃尔玛':
      sex_logo.value = "src/photos/logo/wal.png"
      break
    case '不被定义的':
      sex_logo.value = "src/photos/logo/alien.png"
      break
  }
}
</script>

<template>
  <div class="avatar_container">
    <div class="backgroundPage_mod">
      <div class="myAvatar_mod">
        <img :src="user.user_Avatar">
      </div>
      <div class="myName">
        <span>{{ user.user_Name }}</span>
        <img id="sexLogo" :src=sex_logo>
      </div>
    </div>
  </div>
</template>

<style scoped>
.avatar_container {
  /*  width: 1684px;*/
  width: 100%;
  height: 350px;
  background-image: url("../../photos/background/sky1.jpg");
  background-size: cover;
}

.backgroundPage_mod {
  width: 100%;
  height: 350px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  backdrop-filter: blur(50px);
}

/*头像*/
.myAvatar_mod {
  width: 150px;
  height: 150px;
  overflow: hidden;
  border-radius: 50%;
  background-color: #fff4ea;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 40px;
  z-index: 5;
}

.myAvatar_mod img {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background-color: #f0c78a;
  transition: 3s all ease-in-out;

}

.myAvatar_mod img:hover {
  transition: all 2s ease;
  transform: scale(1.2, 1.2);
}

/*名称*/
.myName {
  width: 200px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  z-index: 5;
}

.myName span {
  font-family: STXihei, serif;
  font-size: 30px;
  font-weight: 800;
  color: #ffffff;
}

.myName img {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  transition: 0.5s all ease-in-out;
  animation-play-state: paused;
}

.myName img:hover {
  animation: rotation 3s linear infinite;
  transition: 0.5s all ease-in-out;
}

/*性别logo动画旋转*/
@keyframes rotation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>