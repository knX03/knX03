<script setup>
import {onBeforeUnmount, onMounted, ref, watch} from "vue";
import useMusicPlayStore from "@/store/musicPlayStore.js";
import router from "@/router/index.js";


const musicPlayStore = useMusicPlayStore();
const music = ref()//播放器
const cover = ref()//歌曲封面
const progress = ref()//进度条
const circle = ref()//进度条按钮
const volumeM = ref()//音量条
const volumeMn = ref()//音量条父元素
const volumeCir = ref()//音量条按钮

//监听音乐路径
watch(() => musicPlayStore.musicUrl, (newValue, OldValue) => {
  musicU.value = newValue
  loadMusic();
  play.value = true
}, {deep: true});// 再根据业务，选择性开启 深度监视，监视监听源里面更加深层次的数据

//监听音乐播放器显示
watch(() => musicPlayStore.play, (newValue, OldValue) => {
  player.value = newValue
  if (newValue === false) {
    pauseMusic()
  }
}, {deep: true});

//监听音乐播放
watch(() => musicPlayStore.index, (newValue, OldValue) => {
  if (musicPlayStore.songList.length === 0) {
    songListLen.value = musicPlayStore.songList.length
  } else {
    musicU.value = musicPlayStore.songList[newValue].song_Directory
    songList.value = musicPlayStore.songList[newValue]
    activeItem.value = newValue
    loadMusic()
    play.value = true
  }
}, {deep: true});

let player = ref(false)//播放器显示
let play = ref(true)//播放按钮
let playType = ref(3) //播放模式 1：列表循环，2：单曲循环，3：随机播放
let loop = ref(false)//是否循环播放
let musicU = ref('')//播放器音乐路径
let volume = ref(1)//播放器音量
let duration = ref()//歌曲的总时长
let currentDuration = ref()//歌曲的当前进度
let paused = ref(true)//是否暂停
let isMoveIn = ref(false) //是否在移动中
let currentProgress = ref(0)//进度条位置
let showList = ref(false)//是否展开歌曲列表
let songListLen = ref() //歌曲列表长度
let activeItem = ref(musicPlayStore.index) //歌曲列表active的item

let playerDetail = ref(false)
//进度条的颜色
const customColors = [
  {color: '#789262', percentage: 25},
  {color: '#75c1c4', percentage: 50},
  {color: '#e58c43', percentage: 75},
  {color: '#b2bbbe', percentage: 100},
]
//歌曲列表
let songList = ref({
  song_ID: '',
  song_Name: '',
  singer_ID: '',
  singer_name: '',
  album_ID: '',
  album_name: '',
  song_Cover: '/src/photos/logo/唱片.png',
  song_Directory: '',
})


onMounted(() => {

})

onBeforeUnmount(() => {

})

function toSinger() {
  let index = musicPlayStore.index
  let singer_ID = musicPlayStore.songList[index].singer_ID
  router.push({
    path: '/singerDetail',
    query: {singer_ID}
  })
}

//播放歌曲
function playMusic() {
  if (music.value) {
    setTimeout(() => {
      music.value.play();
      cover.value.style.animationPlayState = ''
    }, 500)
  }
  play.value = !play.value
}

//停止播放
function pauseMusic() {
  music.value.pause();
  cover.value.style.animationPlayState = 'paused'
  play.value = !play.value
}

//重载播放器
function loadMusic() {
  music.value.load();
  playMusic()
}

//上一首
function lastMusic() {
  if (playType.value === 3) {
    let length = musicPlayStore.songList.length - 1
    musicPlayStore.index = Math.floor(Math.random() * length)
  } else if (playType.value === 2) {
    let index = musicPlayStore.index;
    musicPlayStore.index = -1;
    musicPlayStore.index = index;
  } else {
    if (musicPlayStore.index === 0) {
      musicPlayStore.index = musicPlayStore.songList.length - 1;
    } else {
      musicPlayStore.index--;
    }
  }
//loadMusic();
}

//下一首
function nextMusic() {
  if (playType.value === 3) {
    let length = musicPlayStore.songList.length - 1
    musicPlayStore.index = Math.floor(Math.random() * length)
  } else if (playType.value === 2) {
    let index = musicPlayStore.index;
    musicPlayStore.index = -1;
    musicPlayStore.index = index;
  } else {
    if (musicPlayStore.index === musicPlayStore.songList.length - 1) {
      musicPlayStore.index = 0;
    } else {
      musicPlayStore.index++
    }
  }
  //loadMusic();
}

//变换循环类型
function changeType() {
  if (playType.value === 3) {
    playType.value = 1;
  } else {
    playType.value++;
  }
}

//歌曲加载完毕后执行的方法
function afterEnd() {
  songListLen.value = musicPlayStore.songList.length
  duration.value = timeFormat(music.value.duration)
  // music.value.volume = volume.value //默认百分百音量
  if (playType.value === 1) {
    listLoop()
  } else if (playType.value === 2) {
    musicLoop()
  } else if (playType.value === 3) {
    randomPlay()
  }
}

//列表循环：播放结束自动下一首
function listLoop() {
  let audioM = document.getElementById('audioM')
  loop.value = false
  audioM.addEventListener('ended', function () {
    if (music.value.ended) {
      nextMusic()
    }
  }, false);
}

//单曲循环
function musicLoop() {
  loop.value = true
}

//随机播放
function randomPlay() {
  let length = musicPlayStore.songList.length - 1;
  let audioM = document.getElementById('audioM')
  loop.value = false
  audioM.addEventListener('ended', function () {
    if (music.value.ended) {
      musicPlayStore.index = Math.floor(Math.random() * length)
    }
  }, false);
}


//将单位为秒的的时间转换成mm:ss的形式
function timeFormat(number) {
  let minute = parseInt(number / 60);
  let second = parseInt(number % 60);
  minute = minute >= 10 ? minute : "0" + minute;
  second = second >= 10 ? second : "0" + second;
  return minute + ":" + second;
}

//进度条发生变化时触发
function updateTime() {
  currentDuration.value = timeFormat(music.value.currentTime)
  //如果不是正在移动 和 没有暂停播放就执行
  if (!isMoveIn.value || !music.value.paused) {
    // 设置当前时间
    let MoveXC = progress.value.clientWidth * (music.value.currentTime / music.value.duration)
    let MoveX = (music.value.currentTime / music.value.duration) * 100
    // const cirOffsetX = circle.value.style.left.replace('px', '');
    circle.value.style.left = 685 + MoveXC + 'px' //685 为circle的初始位置
    //播放时更新距离
    currentProgress.value = MoveX
  }
}

//点击进度条更新进度
function clickProgress(e) {
  //如果不是正在移动 和 没有暂停播放就执行
  if (!isMoveIn.value) {
    updateProgress(e.offsetX)
  }
}

//更新进度
function updateProgress(MoveX) {
  //当前移动的位置 = 当前移动的位置 / 当前进度条的可视长度    //this.$refs.progress.clientWidth 注意一定要拿总长度 否则会拿进度条已经走过的长度
  let clickProgress = (MoveX / 3 / 100)
  //设置播放的时间 = 总时长 * 当前点击的长度
  music.value.currentTime = music.value.duration * clickProgress
  //设置移动的位置
  currentProgress.value = MoveX / 3
  circle.value.style.left = 685 + MoveX + 'px'//685 为circle的初始位置
  play.value = true
}

//鼠标弹起
function handleMouseup() {
  setTimeout(() => {
    music.value.play()
    paused.value = false
    isMoveIn.value = false
  }, 200)
}

//调整进度
function handleMousedown() {
  music.value.pause()
  paused.value = true
  isMoveIn.value = true
  //进度条 左 边距离页面左边的距离 移动最小值
  let moveMin = progress.value.offsetParent.offsetLeft + progress.value.offsetLeft
  //进度条 右 边距离页面左边的距离 移动最大值
  let moveMax = progress.value.offsetParent.offsetLeft + progress.value.offsetLeft + progress.value.clientWidth
  //小圆圈的宽度
  let circleWidth = (circle.value.clientWidth / 2)
  let moveX = (e) => {
    if (e.pageX >= moveMax) {
      return
    } else if (e.pageX <= moveMin) {
      return
    }
    updateProgress(e.pageX - moveMin)//更新进度与进度条的位置、按钮的位置
  }
  //获取当前鼠标的位置 X
  document.addEventListener('mousemove', moveX)
  //鼠标弹起来
  document.addEventListener('mouseup', () => {
    document.removeEventListener('mousemove', moveX)
  })
}

//静音
function mute() {
  music.value.volume = 0
  volume.value = 0
  volumeM.value.style.width = 0 + 'px'
  volumeCir.value.style.left = 0 + 'px'
}

//取消静音
function cancelMute() {
  music.value.volume = 1
  volume.value = 1
  volumeM.value.style.width = 80 + 'px'
  volumeCir.value.style.left = 80 + 'px'
}

//点击音量条
function clickVolume(e) {
  updateVolumeProgress(e.offsetX)
}

//点击音量条
function clickVolumeM(e) {
  updateVolumeProgress(e.offsetX)
}

//更新音量进度
function updateVolumeProgress(MoveX) {
  //得到音量  【0 - 1】 区间
  const volumeT = (MoveX / 100).toFixed(1)
  music.value.volume = volumeT
  volume.value = volumeT
  //移动音量条
  let MX = MoveX * 80 / 100
  volumeM.value.style.width = MX + 'px'
  //移动小圆圈
  volumeCir.value.style.left = MX + 'px'
}

//调整音量
function handleMousedownVolume() {
  //音量的最小值
  let moveMin = volumeMn.value.offsetLeft
  //音量的最大值
  let moveMax = volumeMn.value.offsetLeft + volumeMn.value.clientWidth
  //小圆圈的高度
  let circleHeight = (volumeCir.value.clientWidth / 2)
  let moveY = (e) => {
    //禁止移动时复制内容
    e.preventDefault()
    if (e.pageX >= moveMax) {
      return
    } else if (e.pageX <= moveMin) {
      return
    }
    volumeM.value.style.width = (e.pageX - moveMin) * 80 / 100 + 'px'
    volumeCir.value.style.left = (e.pageX - moveMin) * 80 / 100 + 'px'
    updateVolumeProgress(e.pageX - moveMin)
  }
  //获取当前鼠标的位置 X
  document.addEventListener('mousemove', moveY)
  //鼠标弹起来
  document.addEventListener('mouseup', () => {
    document.removeEventListener('mousemove', moveY)
  })
}

//展开歌曲列表
function showSList() {
  showList.value = !showList.value
}

//清空歌曲列表
function deleteSongList() {
  musicPlayStore.songList = []
  musicPlayStore.index = -1;
}

//点击歌曲列表播放
function playSongList(index) {
  activeItem.value = index
  musicPlayStore.index = -1;
  musicPlayStore.index = index;
}
</script>

<template>
  <div v-show="player" class="musicPlayer_mod">
    <audio ref="music"
           id="audioM"
           :loop="loop"
           @timeupdate="updateTime"
           @canplay="afterEnd()">
      <source :src=musicU>
    </audio>
    <div class="songInfo_mod_player">
      <div ref="cover" class="songCover_mod_player">
        <img :src=songList.song_Cover @click.stop="playerDetail=!playerDetail">
      </div>
      <div class="songName_mod_player">
        <span style="color: #000000;font-size: 17px;font-weight: bolder">{{ songList.song_Name }}</span>
        -
        <span @click="toSinger()">{{ songList.singer_name }}</span>
      </div>
    </div>

    <div class="player_option_mod">
      <div class="player_OP">
        <div class="OP" @click="lastMusic()">
          <img src="/src/photos/logo/上一首.png" title="上一首"/>
        </div>
        <div class="OP" v-if="!play" @click="playMusic()">
          <img src="/src/photos/logo/play.png" title="播放"/>
        </div>
        <div class="OP" v-if="play" @click="pauseMusic()">
          <img src="/src/photos/logo/暂停.png" title="暂停"/>
        </div>
        <div class="OP" @click="nextMusic()">
          <img src="/src/photos/logo/下一首.png" title="下一首"/>
        </div>
        <div class="OP" @click="changeType()">
          <img v-show="playType===1" src="/src/photos/logo/循环播放.png" title="列表循环"/>
          <img v-show="playType===2" src="/src/photos/logo/单曲循环.png" title="单曲循环"/>
          <img v-show="playType===3" src="/src/photos/logo/随机播放.png" title="随机播放"/>
        </div>
      </div>
      <div class="progressBar_mod_player">
        <span>{{ currentDuration }}</span>
        <div class="progressBar_mod" ref="progress" @click="clickProgress" @mouseup="handleMouseup">
          <el-progress :percentage=currentProgress :color="customColors"><span></span></el-progress>
          <div class="circle" ref="circle" @mousedown="handleMousedown"></div>
        </div>
        <span>{{ duration }}</span>
      </div>
    </div>
    <div class="other_option_player">
      <div class="volume_player_mod">
        <img v-if="volume !== 0" src="/src/photos/logo/声音_实体.png" alt="" @click="mute()">
        <img v-if="volume === 0" src="/src/photos/logo/静音.png" alt="" @click="cancelMute()">
        <div class="volume_mod" ref="volumeMn" @click="clickVolume">
          <div ref="volumeM" @click.stop="clickVolumeM" class="volume_progress">
            <div ref="volumeCir" class="volume_circle" @mousedown="handleMousedownVolume"></div>
          </div>
        </div>
      </div>
      <el-icon>
        <Plus/>
      </el-icon>
      <el-icon>
        <Plus/>
      </el-icon>
      <el-icon>
        <Plus/>
      </el-icon>
      <div class="songList_perform">
        <img src="/src/photos/logo/list.png" @click="showSList()">
        <div v-if="showList" class="showSongList">
          <div class="song_title_item">
            <span style="font-weight: bolder;font-size: 18px;color: black">播放列表<span
                class="list_len">{{ songListLen }}</span></span>
            <span style="cursor: pointer" @click="deleteSongList()"><el-icon><Delete/></el-icon>清空</span>
          </div>
          <el-scrollbar height="450px">
            <div class="song_item" :class="{activeI:activeItem===index}" v-for="(item,index) in musicPlayStore.songList"
                 @click="playSongList(index)">
              <img :src=item.song_Cover>
              <div class="item_info">
                <span style="color:#000;font-size: 16px;font-weight: bolder">{{ item.song_Name }}</span>
                <span>{{ item.singer_name }}</span>
              </div>
            </div>
          </el-scrollbar>
        </div>
      </div>
    </div>
  </div>
  <!--todo 详情-->
  <div v-if="playerDetail" class="playerDetail">
    aaa
  </div>
</template>
<style src="../css/musicPlayerDetail.css"></style>
<style scoped>
/* 音乐播放器模块*/
.musicPlayer_mod {
  position: fixed;
  z-index: 2;
  bottom: 0;
  width: 100%;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #dedede;
}

/*歌曲的基本信息模块*/
.songInfo_mod_player {
  min-width: 300px;
  margin-left: 50px;
  display: flex;
}

/*歌曲的封面模块*/
.songCover_mod_player {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background-color: black;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: rotation 20s linear infinite;
}

.songCover_mod_player img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  z-index: 3;
}

/*歌曲封面的旋转动画*/
@keyframes rotation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.songName_mod_player {
  margin-left: 20px;
  padding-top: 10px;
  color: #494949;
}

.songName_mod_player span {
  font-size: 14px;
  font-family: STXihei, serif;
}

.songName_mod_player span:hover {
  color: black;
  cursor: pointer;
}

/*播放器的操作模块*/
.player_option_mod {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.player_OP {
  width: 150px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.player_OP img {
  width: 30px;
  height: 30px;
  transition: 0.5s all ease-in-out;
}

.player_OP img:hover {
  transition: all 0.5s ease;
  transform: scale(1.1, 1.1);
}

.OP {
  cursor: pointer;
  overflow: hidden;
}

/*进度条模块*/
.progressBar_mod_player {
  width: 380px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.progressBar_mod_player span {
  color: #a6a6a6;
  font-size: 12px;
  font-family: STXihei, serif;
}

.progressBar_mod {
  width: 300px;
  cursor: pointer;
}

.progressBar_mod :deep(.el-progress) {
  display: inline;
}

.progressBar_mod :deep(.el-progress-bar__outer) {
  background-color: white;
}

.progressBar_mod :deep(.el-progress-bar__inner) {
  transition: 0s;
}

.progressBar_mod:hover .circle {
  display: inline-block;
}

.circle {
  position: absolute;
  display: none;
  bottom: 12px;
  left: 685px;;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: #FFFFFF;
}

.circle:hover {
  border: 1px solid #e58c43;
}

/*更多操作模块*/
.other_option_player {
  margin-right: 50px;
  width: 300px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-around;
}

/*.other_option_player img {
  width: 20px;
  height: 20px;
  cursor: pointer;
}*/

/*音量模块*/
.volume_player_mod {
  display: flex;
  align-items: center;
}

.volume_player_mod img {
  width: 20px;
  height: 20px;
  cursor: pointer;
}


.volume_player_mod:hover .volume_mod {
  width: 100px;
  transform: scale(1, 1);
  opacity: 1;
}

/*音量条模块*/
.volume_mod {
  height: 20px;
  width: 0px;
  border-radius: 30px;
  background-color: #ffffff;
  translate: 2px 0;
  transform: scale(0, 0);
  opacity: 0;
  cursor: pointer;
  transition: all 0.5s ease-in-out;
  display: flex;
  align-items: center;
}

/*音量条进度*/
.volume_progress {
  display: block;
  height: 5px;
  width: 80px;
  margin-left: 10px;
  background-color: #e58c43;
}

.volume_mod:hover .volume_circle {
  transform: scale(1, 1);
}

/*音量条按钮*/
.volume_circle {
  height: 13px;
  width: 13px;
  border-radius: 50%;
  background-color: #b2bbbe;
  position: absolute;
  left: 80px;
  bottom: 3px;
  transform: scale(0, 0);
}

/*歌曲列表展示模块*/
.songList_perform {

}

.songList_perform img {
  width: 20px;
  height: 20px;
  cursor: pointer;
  transition: all 0.5s ease-in-out;
}

.songList_perform img:hover {
  transform: scale(1.1, 1.1);
}

.showSongList {
  width: 400px;
  height: 500px;
  overflow: hidden;
  background-color: #ffffff;
  position: absolute;
  bottom: 80px;
  right: 0px;
  border-top-left-radius: 12px;
}

.song_title_item {
  width: 100%;
  height: 50px;
  background-color: #ffffff;
  border-top-left-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 20px;
  padding-right: 20px;
}

.list_len {
  color: #707070;
  font-size: 11px;
  position: relative;
  bottom: 10px;
}

.song_title_item span {
  font-family: STXihei, serif;
  color: #494949;
  font-size: 13px;
}


.song_item {
  width: 100%;
  height: 80px;
  display: flex;
  align-items: center;
  padding-left: 20px;
  padding-right: 20px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}

.song_item:hover {
  background-color: rgba(241, 241, 241, 0.78);
}

.song_item.activeI {
  background-color: rgba(241, 241, 241, 0.78);
}

.song_item.activeI span {
  color: #e58c43 !important;
}

.song_item img {
  width: 60px;
  height: 60px;
  border-radius: 12px;
}

.item_info {
  margin-left: 10px;
  display: flex;
  flex-direction: column;
}

.item_info span {
  color: #494949;
  font-size: 14px;
  font-family: STXihei, serif;
  margin-bottom: 10px;
}
</style>