<script setup>

import {getCurrentInstance, onMounted, ref, toRaw, watch} from "vue";
import axios from "axios";
import {ElMessage} from "element-plus";
import bus from "@/eventbus.js";
import router from "@/router/index.js";
import useUserStore from '@/store/userStore.js'
import {
  aCheckPlaylistName,
  aCreateNewPlaylist,
  aGetAllPLTag,
  aSelectCreateDetail,
  aUploadPlaylistCover
} from "@/api/api.js";

const userStore = useUserStore()
const {ctx} = getCurrentInstance()
let dialogVisibleP = ref(false)
let fileType = ref(["png", "jpg", "jpeg"])
const user_ID = ''
let creatList = ref([{
  playlist_ID: '',
  playlist_Name: '',
  playlist_Cover: '',
}])

let playlist = ref({
  playlist_ID: '',
  playlist_Name: null,
  playlist_Cover: '',
  playlist_Introduction: '',
  create_By: '',
  create_Time: '',
  playlist_Tag: [],
})

//已有的标签列表
const PLTagList = ref([
  {tag_id: '', tag_name: ''}
])

let tagFlag = ref(false)

let new_playlist_Cover = ref('src/photos/logo/addPlaylist.png')

const toPlaylist = (playlist_ID) => {
  router.push({
    path: '/playlistDetails',
    query: {playlist_ID}
  })
}

onMounted(() => {
  selectCreateDetail(user_ID)
  getAllPLTag()
})

/*用户创建的歌单详情*/
function selectCreateDetail(user_ID) {
  aSelectCreateDetail(user_ID).then(resp => {
    if (resp.data.code === 200) {
      creatList.value = resp.data.data
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

function /*新建歌单*/
createPlaylist() {
  if (playlist.value.playlist_Name == null) {
    ElMessage.error("重申一遍！名称不能为空！")
    return;
  }
  if (playlist.value.playlist_Cover.length === 0) {
    playlist.value.playlist_Cover = new_playlist_Cover.value
  }
  aCreateNewPlaylist(playlist.value).then(resp => {
    if (resp.data.code === 200) {
      dialogVisibleP.value = false
      playlist.value.playlist_Name = null
      playlist.value.playlist_Cover = ''
      playlist.value.playlist_Introduction = ''
      playlist.value.create_By = ''
      playlist.value.create_Time = ''
      ElMessage({
        message: resp.data.msg,
        type: "success"
      })
      selectCreateDetail()
    } else if (resp.data.code === 500) {
      dialogVisibleP.value = false
      ElMessage({
        message: resp.data.msg,
        type: "error"
      })
    }
  })
}

function /*检查歌单名是否存在*/
checkPlaylistName(row) {
  if (row == null) {
    ElMessage.error("名称不能为空！")
    aCheckPlaylistName(row).then(resp => {
      if (resp.data.code === 302) {
        ElMessage({
          message: resp.data.msg,
          type: "error"
        })
        playlist.value.playlist_Name = ''
      } else if (resp.data.code === 200) {
      }
    })
  }
}

function handleClose(done) {
  playlist.value.playlist_Name = null
  playlist.value.playlist_Cover = ''
  playlist.value.playlist_Introduction = ''
  playlist.value.create_By = ''
  playlist.value.create_Time = ''
  done();
}

function /*上传歌单封面*/
uploadCover(item) {
  ElMessage.success("封面正在上传！")
  //上传文件的需要formdata类型;所以要转
  let FormDatas = new FormData()
  FormDatas.append('file', item.file);
  aUploadPlaylistCover(FormDatas).then(resp => {
    if (resp.data.code === 200) {
      playlist.value.playlist_Cover = resp.data.data
      ElMessage.success("封面上传成功！")
    } else {
      ElMessage({
        message: "上传失败！",
        duration: 1000
      });
    }
  })
}

function beforeUpload(file) {
  console.log(file)
  if (file.type !== "" || file.type != null || file.type !== undefined) {
    //截取文件的后缀，判断文件类型
    const FileExt = file.name.replace(/.+\./, "").toLowerCase();
    //计算文件的大小
    const isLt5M = file.size / 1024 / 1024 < 20; //这里做文件大小限制
    //如果大于50M
    if (!isLt5M) {
      ElMessage.error("上传文件大小不能超过 20MB!")
      return false;
    }
    //如果文件类型不在允许上传的范围内
    if (fileType.value.indexOf(FileExt) !== -1) {
      new_playlist_Cover.value = URL.createObjectURL(new Blob([file]));//赋值图片的url，用于图片回显功能
      return true;
    } else {
      ElMessage({
        message: "上传文件格式不正确!",
        type: 'error',
      })
      return false;
    }
  }
}

//todo 监听标签选择(无法获取playlist_Tag的长度判断最多三个标签)
watch(() => playlist.value.playlist_Tag, (newValue, OldValue) => {
  let tags = toRaw(newValue)
  console.log("new" + newValue);
  console.log("raw" + tags);
});
</script>

<template>
  <!--创建的歌单-->
  <div class="createSongPlaylistsInfo_mod">
    <label class="titleSong_mod">我创建的歌单</label>
    <div class="songListInfo_mod">
      <!--点击跳转歌单详情并传送关键值-->
      <div v-for="list in creatList">
        <div class="songPlaylistsCover_mod" @click="toPlaylist(list.playlist_ID)">
          <img :src="list.playlist_Cover"/>
          <div class="createListName_action">{{ list.playlist_Name }}</div>
        </div>
        <span class="songPlaylistsName_mod">{{ list.playlist_Name }}</span>
      </div>
      <a href="#" @click="dialogVisibleP=true" v-show="creatList.length<14">
        <div class="createPlaylist">
          <img src="/src/photos/logo/addPlaylist.png"/>
        </div>
        <label class="songPlaylistsName_mod">新建歌单</label>
      </a>
    </div>
  </div>
  <!--新建歌单模块-->
  <div class="createPlaylistForm" id="createPlaylistForm">
    <el-dialog
        title="新建歌单"
        v-model="dialogVisibleP"
        width="50%"
        :before-close="handleClose"
    >
      <div class="creatForm" id="creatform">
        <el-form :model="playlist" label-width="80px">
          <el-form-item size="large" label="名称：" id="playlist_Name">
            <el-input v-model="playlist.playlist_Name" @blur="checkPlaylistName(playlist.playlist_Name)"></el-input>
          </el-form-item>
          <el-form-item size="large" label="简介：" id="playlist_Introduction">
            <el-input type="textarea"
                      v-model="playlist.playlist_Introduction"
                      placeholder="200"
                      maxlength="200"
                      show-word-limit></el-input>
          </el-form-item>
          <!--todo 标签模块(需将同一类型的标签进行分类，不可重复选择同一类型标签)-->
          <el-form-item label="标签" id="spLabel">
            <el-select
                v-model="playlist.playlist_Tag"
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
          <el-form-item id="formbutton">
            <el-button size="large" @click="dialogVisibleP=false">取消</el-button>
            <el-button size="large" type="primary" @click="createPlaylist()">保存</el-button>
          </el-form-item>
        </el-form>
        <!--上传封面-->
        <div class="playlistCover">
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
/*创建的歌单列表*/
.createSongPlaylistsInfo_mod {
  width: 100%;
  height: 600px;
  background-image: linear-gradient(#ffffff, #c7c7c7, #8DB799, #c7c7c7, #FFFFFF);
  margin-bottom: 50px;
  padding-top: 20px;
  padding-left: 70px;
}

/*标题*/
.titleSong_mod {
  font-family: STXihei, serif;
  font-size: 20px;
  font-weight: 900;
  color: #000000;
  margin-left: 20px;
}

/*歌单列表模块*/
.songListInfo_mod {
  width: 100%;
  height: 100%;
  padding-top: 5px;
  padding-bottom: 10px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;


}

/*歌单封面*/
.songPlaylistsCover_mod {
  height: 200px;
  width: 200px;
  max-width: 200px;
  max-height: 200px;
  overflow: hidden;
  border-radius: 20px;
  margin: 20px;
  cursor: pointer;
}

.songPlaylistsCover_mod img {
  height: 200px;
  width: 200px;
  border-radius: 20px;
  background-color: #C0C4CC;
  transition: 0.5s all ease-in-out;
}

.songPlaylistsCover_mod:hover img {
  transition: all 0.6s ease;
  transform: scale(1.2, 1.2);
}

.createListName_action {
  font-family: STXihei, serif;
  background: transparent;
  width: 100%;
  height: 50%;
  transition: 2s all ease-in-out;
  translate: 0 20px;
}

.songPlaylistsCover_mod:hover .createListName_action {
  width: 100%;
  height: 50%;
  backdrop-filter: blur(8px);
  transition: 0.2s all ease-in-out;
  color: #ffffff;
  font-size: 30px;
  font-weight: 900;
  padding-left: 15px;
  translate: 0 -100px;
  box-shadow: 0 0 20px 0 #bebebe;
  cursor: pointer;
}


.songPlaylistsName_mod {
  font-family: STXihei, serif;
  font-size: 15px;
  font-weight: 600;
  color: #000000;
  position: relative;
  left: 30px;
}

/* 新建歌单*/
.createPlaylist {
  height: 200px;
  width: 200px;
  max-width: 200px;
  max-height: 200px;
  overflow: hidden;
  border-radius: 20px;
  margin: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.createPlaylist img {
  height: 200px;
  width: 200px;
  border-radius: 20px;
  transition: 0.5s all ease-in-out;

}

.createPlaylist img:hover {
  transition: all 0.6s ease;
  transform: scale(1.2, 1.2);
}
</style>
<style src="../../components/css/myInfo/createList.css"></style>