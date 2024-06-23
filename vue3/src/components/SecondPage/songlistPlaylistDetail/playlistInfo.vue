<script setup>
import {getCurrentInstance, onMounted, reactive, ref, toRaw, watch} from "vue";
import router from "@/router/index.js";
import {ElMessage, ElNotification} from "element-plus";
import {useRoute} from "vue-router";
import {
  aChangePlaylistInfo,
  aCheckPlaylistName,
  aCollectPlaylist, aDeletePlaylist,
  aDetailByID, aGetAllPLTag,
  aIfCollectPlaylist, aIfMy, aIfMyPlaylist, aSelectPlaylistTags, aSelectSongByPlaylist,
  aSelectUserInfoByID, aUploadPlaylistCover
} from "@/api/api.js";

import useMusicPlayStore from "@/store/musicPlayStore.js";

const musicPlayStore = useMusicPlayStore();
const route = useRoute()
let dialogVisible = ref(false)
let showEdit = ref(true)
let collectBT = ref(true)
let ifCollect = ref(false)
let fileType = ref(["png", "jpg", "jpeg"])
let new_playlist_Cover = ref("")
let colletBUTX = ref("收藏")

let creator = ref({
  ID: '',
  name: '',
  avatar: 'src/photos/logo/avatarWhite.png',
})
let songPlaylists = ref({
  playlist_ID: '',
  create_By: '',
  create_Time: '',
  playlist_Name: '',
  playlist_Cover: '',
  playlist_Introduction: '',
  playlist_Tag: [],
})
let playlistForm = ref({
  playlist_ID: '',
  create_By: '',
  create_Time: '',
  playlist_Name: '',
  playlist_Cover: '',
  playlist_Introduction: '',
  playlist_Tag: [],
})

let songList = ref([{
  song_ID: '',
  song_Name: '',
  singer_ID: '',
  singer_name: '',
  album_ID: '',
  album_name: '',
  song_Cover: '',
  song_Directory: '',
}])

//歌单的标签列表
let PLTags = ref([{
  tag_id: '',
  tag_name: '',
}])

//已有的标签列表
const PLTagList = ref([
  {tag_id: '', tag_name: ''}
])

let tagFlag = ref(false)

const toUserInfo = (user_ID) => {
  aIfMy(user_ID).then(resp => {
    if (resp.data.data) {
      router.push({
        path: '/myInfo',
      })
    } else {
      router.push({
        path: '/userDetail',
        query: {user_ID}
      })
    }
  })
}

const toPLbyTag = (tag_ID) => {
  router.push({
    path: '/songList',
    query: {tag_ID}
  })
}

onMounted(() => {
  let FPlaylist_ID = route.query.playlist_ID
  selectDetail(FPlaylist_ID)
  selectSong(FPlaylist_ID)
  selectPlaylistTags(FPlaylist_ID)
  getAllPLTag()
  editInfo(FPlaylist_ID)
})

/*根据跳转的歌单ID查询歌单详情*/
function selectDetail(data) {
  aDetailByID(data).then(resp => {
    if (resp.data.code === 200) {
      songPlaylists.value = resp.data.data;
      new_playlist_Cover.value = resp.data.data.playlist_Cover;
      playlistForm.value = songPlaylists.value;
      selectCreatorDetail(resp.data.data.create_By)
      ifCollectPlaylist(songPlaylists.value.playlist_ID)
    } else if (resp.data.code === 500) {
      console.log(resp.data.msg)
    }
  })
}

/*根据跳转的歌单名字查询歌单内容*/
function selectSong(data) {
  aSelectSongByPlaylist(data).then(resp => {
    if (resp.data.code === 200) {
      songList.value = resp.data.data;
    } else if (resp.data.code === 500) {
      ElMessage.error("error！")
      console.log(resp.data.msg)
    }
  })
}

/*查询歌单的标签列表*/
function selectPlaylistTags(playlist_ID) {
  aSelectPlaylistTags(playlist_ID).then(resp => {
    if (resp.data.code === 200) {
      PLTags.value = resp.data.data
    } else {
      console.log(resp.data.Msg)
    }
  })
}

/*创建者详情查询*/
function selectCreatorDetail(create_By) {
  aSelectUserInfoByID(create_By).then(resp => {
    if (resp.data.code === 200) {
      creator.value.ID = resp.data.data.user_ID
      creator.value.name = resp.data.data.user_Name
      creator.value.avatar = resp.data.data.user_Avatar
    } else if (resp.data.code === 500) {
      console.error(resp.data.msg)
    }
  })
}

/*查询所有歌单标签*/
function getAllPLTag() {
  aGetAllPLTag().then(resp => {
    if (resp.data.code === 200) {
      PLTagList.value = resp.data.data;
    } else if (resp.data.code === 500) {
      console.log(resp.data.msg)
    }
  })
}

function editInfo(playlist_ID) {
  aIfMyPlaylist(playlist_ID).then(resp => {
    if (resp.data.code === 200) {
      showEdit.value = resp.data.data;
      collectBT.value = !resp.data.data;
    }
  }).catch(resp => {
    showEdit.value = false;
    collectBT.value = true;
  })
}

/*查询歌单是否收藏*/
function ifCollectPlaylist(playlist_ID) {
  aIfCollectPlaylist(playlist_ID).then(resp => {
    if (resp.data.code === 302) {
      ifCollect.value = true;
      colletBUTX.value = "已收藏"
    } else if (resp.data.code === 200) {
      ifCollect.value = false;
    }
  }).catch(resp => {
    console.error(resp)
  })
}

function /*收藏歌单*/
collectPlaylist(row) {
  aCollectPlaylist(row).then(resp => {
    if (resp.data.code === 200) {
      ElMessage.success(resp.data.msg)
      ifCollect.value = true;
      colletBUTX.value = "已收藏"
    } else if (resp.data.code === 500) {
      console.error(resp.data.msg)
    }
  }).catch(resp => {
    ElNotification({
      title: '请先登录!',
      type: 'error'
    })
  })
}

function /*检查歌单名是否存在*/
checkPlaylistName(row) {
  if (row == null) {
    ElMessage.error("名称不能为空！")
  }
  aCheckPlaylistName(row).then(resp => {
    if (resp.data.code === 302) {
      ElMessage.error(resp.data.msg)
      playlistForm.value.playlist_Name = ''
    } else if (resp.data.code === 200) {
    }
  })
}

/*修改歌单资料*/
function changePlaylistInfo() {
  if (playlistForm.value.playlist_Name == null) {
    ElMessage.error('重申一遍！名称不能为空！')
    return;
  }
  aChangePlaylistInfo(playlistForm.value).then(resp => {
    if (resp.status === 401) {
      ElNotification({
        title: '请先登录!',
        type: 'error'
      })
    } else if (resp.data.code === 200) {
      dialogVisible.value = false
      ElMessage.success(resp.data.msg)
      songPlaylists.value = playlistForm.value
      selectPlaylistTags(songPlaylists.value.playlist_ID)
      //selectDetail(songPlaylists.value.playlist_ID)
    } else if (resp.data.code === 500) {
      dialogVisible.value = false
      ElMessage.error(resp.data.msg)
    }
  })
}

function /*上传封面前的验证*/
beforeUpload(file) {
  if (file.type !== "" || file.type != null || file.type !== undefined) {
    //截取文件的后缀，判断文件类型
    const FileExt = file.name.replace(/.+\./, "").toLowerCase();
    //计算文件的大小
    const isLt5M = file.size / 1024 / 1024 < 20; //这里做文件大小限制
    //如果大于50M
    if (!isLt5M) {
      ElMessage({
        message: "上传文件大小不能超过 20MB!",
        type: 'error',
      })
      return false;
    }
    //如果文件类型不在允许上传的范围内
    if (fileType.value.indexOf(FileExt) !== -1) {
      new_playlist_Cover.value = URL.createObjectURL(new Blob([file]));//赋值图片的url，用于图片回显功能
      return true;
    } else {
      ElMessage.error("上传文件格式不正确!");
      return false;
    }

  }
}

function /*上传封面*/
uploadCover(item) {
  ElMessage.success("封面正在上传！")
  //上传文件的需要formdata类型;所以要转
  let FormDatas = new FormData()
  FormDatas.append('file', item.file);
  aUploadPlaylistCover(FormDatas).then(resp => {
    if (resp.data.code === 200) {
      playlistForm.value.playlist_Cover = resp.data.data
      ElMessage.success("封面上传成功！")
    } else {
      ElMessage({
        message: "上传失败！",
        duration: 1000
      });
    }
  })
}

//取消收藏歌单
function delColPlaylist(row) {
  aDeletePlaylist(row).then(resp => {
    if (resp.data.code === 200) {
      ifCollect.value = false;
      colletBUTX.value = "收藏"
    } else if (resp.data.code === 500) {
      console.log(resp.data.msg)
    }
  }).catch(resp => {
    ElNotification({
      title: '请先登录!',
      type: 'error'
    })
  })
}

//播放全部歌曲
function playAll() {
  musicPlayStore.play = false
  musicPlayStore.play = true
  musicPlayStore.index = -2
  musicPlayStore.index = 0
  musicPlayStore.songList = songList.value
}

//todo 监听标签选择(无法获取playlist_Tag的长度判断最多三个标签)
watch(() => playlistForm.value.playlist_Tag, (newValue, OldValue) => {
  let tags = toRaw(newValue)
  /*  console.log("new" + newValue);
    console.log("raw" + tags);*/
});

</script>

<template>
  <div class="first_mod">
    <img :src="songPlaylists.playlist_Cover" class="cover_mod">
    <div class="option_mod">
      <div class="basicInfo_mod">
        <span class="playListName_mod">{{ songPlaylists.playlist_Name }}</span>
        <img v-show="showEdit" src="/src/photos/logo/editGray.png" class="editInfo_mod"
             @click="dialogVisible=true">
      </div>
      <div class="plIntroduction_mod"
           v-if="![null,''].includes(songPlaylists.playlist_Introduction)">
        <el-tooltip
            class="box-item"
            :content="songPlaylists.playlist_Introduction"
            placement="bottom"
            effect="light"
        >
          <span>{{ songPlaylists.playlist_Introduction }}</span>
        </el-tooltip>
      </div>
      <div class="userInfo_mod">
        <img :src="creator.avatar" @click="toUserInfo(creator.ID)">
        <span class="userName_mod" @click="toUserInfo(creator.ID)">
          {{ creator.name }}
        </span>
        <div class="playlistTag_mod" v-if="PLTags.length>0">
          <span>标签：</span>
          <label class="tag_mod" v-for="item in PLTags" @click="toPLbyTag(item.tag_id)">
            {{ item.tag_name }}
            <span v-if="PLTags.length>1"> /</span></label>
        </div>
        <span class="creatTime_mod">{{ songPlaylists.create_Time }} 创建</span>
      </div>
      <!--todo 播放和下载功能待实现-->
      <div class="playAndLoad_mod">
        <el-button type="warning" @click="playAll()">
          <img src="/src/photos/logo/playWhite.png">
          <span>播放全部</span>
        </el-button>
        <el-button type="info">
          <img src="/src/photos/logo/downLoadWhite.png">
          <span>下载</span>
        </el-button>
        <!-- 收藏歌单功能-->
        <div class="collect_mod" v-if="collectBT">
          <el-button type="info" v-if="!ifCollect"
                     @click="collectPlaylist(songPlaylists.playlist_ID)">
            <img src="/src/photos/logo/collect.png">
            {{ colletBUTX }}
          </el-button>
          <el-button type="warning" v-if="ifCollect"
                     @click="delColPlaylist(songPlaylists.playlist_ID)">
            <img src="/src/photos/logo/collect.png">
            {{ colletBUTX }}
          </el-button>
        </div>
      </div>
    </div>
  </div>


  <!--编辑歌单资料-->
  <div class="editUserInfo" id="edituserinfo">
    <el-dialog
        title="编辑歌单信息"
        v-model="dialogVisible"
        width="50%"
    >
      <div class="editForm" id="editform">
        <el-form :model="playlistForm" label-width="80px">
          <el-form-item label="名称：" id="playlist_Name">
            <el-input size="large" v-model="playlistForm.playlist_Name"
                      @blur="checkPlaylistName(playlistForm.playlist_Name)"></el-input>
          </el-form-item>
          <el-form-item label="简介：" id="eidtplaylist_introduction">
            <el-input size="large"
                      type="textarea"
                      v-model="playlistForm.playlist_Introduction"
                      placeholder="200"
                      maxlength="200"
                      show-word-limit></el-input>
          </el-form-item>
          <!--todo 标签模块(需将同一类型的标签进行分类，不可重复选择同一类型标签)-->
          <el-form-item label="标签">
            <el-select
                v-model="playlistForm.playlist_Tag"
                multiple
                size="large"
                placeholder="选择标签"
            >
              <el-option
                  v-for="item in PLTagList"
                  :key="item.tag_id"
                  :label="item.tag_name"
                  :value="item.tag_id"
                  :disabled="tagFlag"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button size="large" @click="dialogVisible = false">取消</el-button>
            <el-button size="large" type="primary" @click="changePlaylistInfo()">保存</el-button>
          </el-form-item>
        </el-form>

        <div class="editCover">
          <el-upload
              class="avatar-uploader"
              action="#"
              :show-file-list="false"
              :before-upload="beforeUpload"
              :http-request="uploadCover"
          >
            <img :src="new_playlist_Cover" class="Cover">
          </el-upload>
        </div>
      </div>
      <span slot="footer" class="dialog-footer"></span>
    </el-dialog>
  </div>
</template>

<style scoped>
.first_mod {
  width: 100%;
  height: 250px;
  background-image: linear-gradient(to right, #ED5736, #25F8CD);
}

/*歌单封面*/
.cover_mod {
  width: 200px;
  height: 200px;
  border-radius: 30px;
  position: relative;
  top: 50%;
  left: 18%;
  transform: translate(-50%, -50%);
}

/*选项模块*/
.option_mod {
  min-width: 300px;
  height: 224px;
  padding-top: 23px;
  position: absolute;
  top: 79px;
  left: 430px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/*歌单基础信息*/
.basicInfo_mod {
  width: 300px;
  height: 40px;
  display: flex;
  align-items: center;
}

.playListName_mod {
  font-family: STXihei, serif;
  font-size: 30px;
  font-weight: 900;
  color: white;
}

/*编辑选项*/
.editInfo_mod {
  margin-left: 20px;
  width: 30px;
  height: 30px;
  cursor: pointer;
}

/*简介*/
.plIntroduction_mod {
  font-family: STXihei, serif;
  color: #ffffff;
  font-size: 15px;
  white-space: nowrap; /*强制单行显示*/
  text-overflow: ellipsis; /*超出部分省略号表示*/
  overflow: hidden; /*超出部分隐藏*/
  width: 1000px; /*设置显示的最大宽度*/
  display: inline-block;
}

/*自定义文字弹出背景*/
.plIntroduction_mod .el-popper.is-customized {
  /* Set padding to ensure the height is 32px */
  padding: 6px 12px;
  background: linear-gradient(90deg, rgb(159, 229, 151), rgb(204, 229, 129));
}

.plIntroduction_mod .el-popper.is-customized .el-popper__arrow::before {
  background: linear-gradient(45deg, #b2e68d, #bce689);
  right: 0;
}


/*用户信息模块*/
.userInfo_mod {
  min-width: 165px;
  height: 30px;
  display: flex;
  align-items: center;
}

.userInfo_mod img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
}

.userInfo_mod span {
  font-family: STXihei, serif;
  font-size: 12px;
  color: #ffffff;
}

.userName_mod {
  cursor: pointer;
  margin-left: 15px;
  margin-right: 15px;
}

.playlistTag_mod {
  min-width: 100px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-right: 15px;
}

.tag_mod {
  font-family: STXihei, serif;
  font-size: 12px;
  color: #1b80e4;
  cursor: pointer;
}

.tag_mod:hover {
  color: #5d98da;
}

/*播放和下载按钮*/
.playAndLoad_mod {
  width: 233px;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.playAndLoad_mod span {
  font-family: STXihei, serif;
  color: white;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
}

.playAndLoad_mod img {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.playAndLoad_mod .el-button {
  color: #FFF;
  border-radius: 12px;

}

.playAndLoad_mod .el-button span {
  display: flex;
  align-items: center;
  justify-content: center;
}

/*播放按钮*/
.playAndLoad_mod .el-button--warning {

}

/*下载按钮*/
.playAndLoad_mod .el-button--info {
  color: #FFF;
  backdrop-filter: blur(8px);
  background: #FFFFFF33;
}

/*收藏按钮*/
.collect_mod {
  width: 90px;
  margin-left: 10px;
}

.collect_mod .el-button > span {
  font-family: STXihei, serif;
  color: white;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
}

.collect_mod img {
  width: 20px;
  height: 20px;
  /*  cursor: pointer;*/
}

.collect_mod .el-button {
  color: #FFF;
  border-radius: 12px;
}

.collect_mod .el-button span {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
<style src="../../css/secondPage/playDetail/playlistInfoEdit.css"></style>