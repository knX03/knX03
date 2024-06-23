<script setup>
import {onMounted, ref} from "vue";
import {ElMessage, ElNotification} from "element-plus";
import {aGetUserAlbums, aUploadAlCover, aUploadSong} from "@/api/api.js";
import publishWorks from "@/components/artists/menuDetail/publishWorks.vue";

let active = ref(0)
let fileType = ref(["mp3", "wav", "m4a"])
let fileCoType = ref(["png", "jpg", "jpeg"])
let fileList = ref([])
let songFiles = ref([])
let ifAlbumExist = ref(false)
let creatAlbum = ref(false)
//回显封面
let tempAlbumCover = ref("")
let albumCover = ref()
let album = ref({album_ID: '', album_Name: '', album_Cover: '', album_Introduction: ''})
//当前用户创建的专辑列表
let albumList = ref([
  {album_ID: '1', album_Name: 'aaa', album_Cover: 'a'},
  {album_ID: '2', album_Name: 'ff', album_Cover: 'gg'},
  {album_ID: '3', album_Name: 'yhh', album_Cover: 'asf'},
  {album_ID: '4', album_Name: 'sdfg', album_Cover: '22d'},
  {album_ID: '4', album_Name: 'sdfg', album_Cover: '22d'},
  {album_ID: '4', album_Name: 'sdfg', album_Cover: '22d'},
  {album_ID: '4', album_Name: 'sdfg', album_Cover: '22d'},
  {album_ID: '4', album_Name: 'sdfg', album_Cover: '22d'},
  {album_ID: '4', album_Name: 'sdfg', album_Cover: '22d'},
  {album_ID: '4', album_Name: 'sdfg', album_Cover: '22d'},
])
//选定专辑
let ifSelect = ref()

//同意授权书
let agreeComitLet = ref(false)
//是否下一步
let ifNext = ref(false)
//下一步
const next = () => {
  if (fileList.value.length > 0 && album.value.album_Name.length > 0) {
    if (active.value++ >= 2) active.value = 2
  } else {
    ElNotification({
      title: '请检查歌曲或专辑是否完整!',
      type: 'error',
      duration: 1000,
      position: 'top-left',
    })
  }
}

const last = () => {
  if (active.value-- <= 0) active.value = 0
}
onMounted(() => {
  getAlbumList()
})

function /*上传封面前的验证*/
beforeUpload(file) {
  if (file.type !== "" || file.type != null || file.type !== undefined) {
    //截取文件的后缀，判断文件类型
    const FileExt = file.name.replace(/.+\./, "").toLowerCase();
    //计算文件的大小
    const isLt5M = file.size / 1024 / 1024 < 20; //这里做文件大小限制
    //如果大于200M
    if (!isLt5M) {
      ElMessage({
        message: "上传文件大小不能超过 20MB!",
        type: 'error',
      })
      return false;
    }
    //如果文件类型不在允许上传的范围内
    if (fileType.value.indexOf(FileExt) !== -1) {
      fileList.value.push(file)
      const fName = file.name.replace(/(.*\/)*([^.]+).*/ig, "$2");
      songFiles.value.push(fName)
      return true;
    } else {
      ElMessage.error("上传文件格式不正确!");
      return false;
    }
  }
}

function /*上传封面*/
uploadSong() {
  ElMessage.success("歌曲正在上传！")
  let formData = new FormData()
  fileList.value.forEach((val, index) => {
    formData.append("file", val);
  })
  songFiles.value.forEach((val, index) => {
    formData.append("songName", val);
  })

  const json = JSON.stringify(album.value);
  const blob = new Blob([json], {
    type: 'application/json'
  });
  formData.append('album', blob)
  aUploadSong(formData).then(resp => {

  })
}

function upload(item) {

}

async function changeSong(index) {
  const pickerOpts = {
    types: [
      {
        description: "音频类型",
        accept: {"audio/*": ['.mp3', '.wav', '.m4a']}
      }
    ],
    excludeAcceptAllOption: true,
    multiple: false,
  };

  // 打开文件选择器
  const [fileHandle] = await window.showOpenFilePicker(pickerOpts);
  // 获取文件内容
  const fileData = await fileHandle.getFile();
  fileList.value[index] = fileData
  songFiles.value[index] = fileData.name
}

function removeFileList(index) {
  fileList.value.splice(index)
}

function getAlbumList() {
  aGetUserAlbums().then(resp => {
    if (resp.data.code === 200) {
      albumList.value = resp.data.data
      ifAlbumExist.value = true
    } else {
      ifAlbumExist.value = false
    }
  })
}

//上传封面前的验证
function beforeUpCover(file) {
  if (file.type !== "" || file.type != null || file.type !== undefined) {
    //截取文件的后缀，判断文件类型
    const FileExt = file.name.replace(/.+\./, "").toLowerCase();
    //计算文件的大小
    const isLt5M = file.size / 1024 / 1024 < 20; //这里做文件大小限制
    //如果大于200M
    if (!isLt5M) {
      ElMessage({
        message: "上传文件大小不能超过 20MB!",
        type: 'error',
      })
      return false;
    }
    //如果文件类型不在允许上传的范围内
    if (fileCoType.value.indexOf(FileExt) !== -1) {
      tempAlbumCover.value = URL.createObjectURL(new Blob([file]));//赋值图片的url，用于图片回显功能
      return true;
    } else {
      ElMessage.error("上传文件格式不正确!");
      return false;
    }
  }
}

//上传封面
function uploadCover(item) {
  albumCover.value = item.file
}

//选择专辑
function selectAlbum(item) {
  album.value = item
}

function uploadAlCover() {
  /*  if (!agreeComitLet.value) {
      ElNotification({
        title: '请同意授权!',
        type: 'error',
        duration: 1000,
        position: 'top-left',
      })
      return;
    }*/
  if (album.value.album_ID.length === 0) {
    let aFormData = new FormData()
    aFormData.append("alCover", albumCover.value)
    aUploadAlCover(aFormData).then(resp => {
      if (resp.data.code === 200) {
        album.value.album_Cover = resp.data.data;
        success()
      }
    })
  } else {
    success()
  }

}

function success() {
  active.value = 2
  let formData = new FormData()
  fileList.value.forEach((val, index) => {
    formData.append("file", val);
  })
  songFiles.value.forEach((val, index) => {
    formData.append("songName", val);
  })
  const json = JSON.stringify(album.value);
  const blob = new Blob([json], {
    type: 'application/json'
  });
  formData.append('album', blob)
  aUploadSong(formData).then(resp => {
    if (resp.data.code === 200) {
      setTimeout(() => {
        ElNotification({
          title: '上传成功，两秒后退出!',
          type: 'success',
          duration: 1000,
          position: 'top-left',
        })
        location.reload();
      }, 2000)
    }
  })
}

</script>

<template>
  <div class="box_mod">
    <div class="step_mod_el">
      <el-steps style="width: 519px" :active="active" finish-status="success" align-center>
        <el-step title="上传歌曲"/>
        <el-step title="授权签约"/>
      </el-steps>
    </div>
  </div>

  <div class="box_mod" v-if="active===0">
      <span style="display:block;margin-bottom: 20px"> <svg t="1717673128149" class="icon" viewBox="0 0 1024 1024"
                                                            version="1.1"
                                                            xmlns="http://www.w3.org/2000/svg" p-id="17217"
                                                            id="mx_n_1717673128151"
                                                            width="16" height="16"><path
          d="M355.53333337 144.6c0 3.8-0.4 7.5-0.9 11.2l0.9 0 0 714-0.9 0c0.5 3.7 0.9 7.4 0.9 11.2 0 43.1-35 78.1-78.1 78.1S199.33333337 924.1 199.33333337 881c0-3.8 0.4-7.5 0.9-11.2L199.33333337 869.8l0-714 0.9 0c-0.5-3.7-0.9-7.4-0.9-11.2 0-43.1 35-78.1 78.1-78.1S355.53333337 101.5 355.53333337 144.6z"
          fill="#e58c43" p-id="17218"></path></svg>上传歌曲 <span
          v-if="fileList.length>0">（{{ fileList.length }}首）</span></span>
    <div class="upload_mod_song" id="uploadsong">
      <div style="width: 85%;" v-if="fileList.length ===0">
        <el-upload
            class="upload-demo"
            drag
            accept="audio/wav, audio/x-m4a, audio/mp3"
            :before-upload="beforeUpload"
            :http-request="upload"
            :show-file-list="false"
        >
          <svg t="1717670705309" class="icon" viewBox="0 0 1445 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
               p-id="15576" width="64" height="64">
            <path
                d="M1237.052235 496.158118a272.986353 272.986353 0 0 1 154.925177 246.844235c0 145.347765-113.724235 265.637647-260.397177 273.950118l-740.47247 0.722823-19.034353-0.843294a354.785882 354.785882 0 0 1-338.763294-354.665412c0-194.861176 158.539294-354.243765 353.460706-355.388235l5.421176-0.060235 2.168471-5.059765A435.561412 435.561412 0 0 1 796.912941 33.792a436.826353 436.826353 0 0 1 436.344471 436.344471 1276.988235 1276.988235 0 0 0-1.084236 23.67247l4.818824 2.349177z m-509.289411-169.502118L476.882824 577.536l53.910588 53.850353 158.84047-158.840471v348.822589h76.257883v-348.762353l158.84047 158.780235 53.910589-53.850353-250.88-250.88z"
                fill="#e58c43" p-id="15577" data-spm-anchor-id="a313x.search_index.0.i5.af3c3a81Uz2B8T"
                class="selected"></path>
          </svg>
          <div class="el-upload__text">
            将歌曲拖动至此 或 <em>点击上传</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              歌曲格式必须为MP3，wav，m4a，音质 > 320kBps，大小 < 200M
            </div>
          </template>
        </el-upload>
      </div>

      <div class="song_list_upload">
        <div class="song_list" v-for="(item,index) in fileList">
          <div class="song_name_in">
            <span style="margin-right: 20px">曲目{{ index + 1 }}</span>
            <input title="歌曲名称" v-model="songFiles[index]">
          </div>
          <div class="song_info">
            <span style="color:#000;font-size: 15px;cursor: text">{{ item.name }}</span>
            <div class="divisionLn"></div>
            <span @click="changeSong(index)">更换音频</span>
            <span @click="removeFileList(index)">删除</span>
          </div>
        </div>
      </div>

      <div style="width: 85%;" v-if="fileList.length>0">
        <div>
        </div>
        <el-upload
            class="upload-demo"
            drag
            accept="audio/wav, audio/x-m4a, audio/mp3"
            :before-upload="beforeUpload"
            :http-request="upload"
            :show-file-list="false"
        >
          <svg t="1717670705309" class="icon" viewBox="0 0 1445 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
               p-id="15576" width="64" height="64">
            <path
                d="M1237.052235 496.158118a272.986353 272.986353 0 0 1 154.925177 246.844235c0 145.347765-113.724235 265.637647-260.397177 273.950118l-740.47247 0.722823-19.034353-0.843294a354.785882 354.785882 0 0 1-338.763294-354.665412c0-194.861176 158.539294-354.243765 353.460706-355.388235l5.421176-0.060235 2.168471-5.059765A435.561412 435.561412 0 0 1 796.912941 33.792a436.826353 436.826353 0 0 1 436.344471 436.344471 1276.988235 1276.988235 0 0 0-1.084236 23.67247l4.818824 2.349177z m-509.289411-169.502118L476.882824 577.536l53.910588 53.850353 158.84047-158.840471v348.822589h76.257883v-348.762353l158.84047 158.780235 53.910589-53.850353-250.88-250.88z"
                fill="#e58c43" p-id="15577" data-spm-anchor-id="a313x.search_index.0.i5.af3c3a81Uz2B8T"
                class="selected"></path>
          </svg>
          <div class="el-upload__text">
            <em>继续上传</em>
          </div>
        </el-upload>
      </div>
    </div>
  </div>


  <div class="box_mod" v-if="active===0">
    <span class="title_set_album"> <svg t="1717673128149" class="icon"
                                        viewBox="0 0 1024 1024"
                                        version="1.1"
                                        xmlns="http://www.w3.org/2000/svg"
                                        p-id="17217"
                                        id="mx_n_1717673128151"
                                        width="16" height="16"><path
        d="M355.53333337 144.6c0 3.8-0.4 7.5-0.9 11.2l0.9 0 0 714-0.9 0c0.5 3.7 0.9 7.4 0.9 11.2 0 43.1-35 78.1-78.1 78.1S199.33333337 924.1 199.33333337 881c0-3.8 0.4-7.5 0.9-11.2L199.33333337 869.8l0-714 0.9 0c-0.5-3.7-0.9-7.4-0.9-11.2 0-43.1 35-78.1 78.1-78.1S355.53333337 101.5 355.53333337 144.6z"
        fill="#e58c43" p-id="17218"></path></svg>设置专辑</span>
    <div class="setAlbum_mod_song" id="setA">
      <div class="album_create_mod" v-if="!ifAlbumExist && !creatAlbum" @click="creatAlbum=true">
        <svg t="1717742866710" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
             p-id="10962" width="32" height="32">
          <path
              d="M512 62c-248.4 0-450 201.6-450 450s201.6 450 450 450 450-201.6 450-450-201.6-450-450-450zM725.282 544.733h-172.602v172.611c0 20.753-17.487 38.232-38.242 38.232-20.753 0-38.232-17.478-38.232-38.232v-172.611h-172.62c-20.745 0-38.232-17.478-38.232-38.232 0-20.764 17.487-38.242 38.242-38.242h172.611v-172.611c0-20.753 17.478-38.232 38.232-38.232s38.242 17.478 38.242 38.232v172.62h172.602c20.764 0 38.242 17.469 38.242 38.232 0 21.843-17.478 38.232-38.242 38.232z"
              p-id="10963" fill="#e58c43"></path>
        </svg>
        <label>创建新专辑</label>
      </div>

      <div class="creat_album_form" v-if="creatAlbum">
        <div class="create_form_title" title="取消新建" @click="creatAlbum=false">
          <svg t="1717742866710" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
               p-id="10962" width="16" height="16">
            <path
                d="M512 62c-248.4 0-450 201.6-450 450s201.6 450 450 450 450-201.6 450-450-201.6-450-450-450zM725.282 544.733h-172.602v172.611c0 20.753-17.487 38.232-38.242 38.232-20.753 0-38.232-17.478-38.232-38.232v-172.611h-172.62c-20.745 0-38.232-17.478-38.232-38.232 0-20.764 17.487-38.242 38.242-38.242h172.611v-172.611c0-20.753 17.478-38.232 38.232-38.232s38.242 17.478 38.242 38.232v172.62h172.602c20.764 0 38.242 17.469 38.242 38.232 0 21.843-17.478 38.232-38.242 38.232z"
                p-id="10963" fill="#2c2c2c"></path>
          </svg>
          <span>创建新专辑</span>
        </div>
        <div class="creat_form_content" id="cfc">
          <el-form :model="album" label-width="auto" style="max-width: 600px">
            <el-form-item label="专辑封面">
              <div class="upload_album_cover">
                <div class="upload_album_cover_input" id="upaci">
                  <el-upload
                      class="avatar-uploader"
                      accept="image/jpg, image/jpeg, image/png"
                      :show-file-list="false"
                      :before-upload="beforeUpCover"
                      :http-request="uploadCover"
                  >
                    <img v-if="tempAlbumCover" :src="tempAlbumCover" class="avatar"/>
                    <el-icon v-else class="avatar-uploader-icon">
                      <Plus/>
                    </el-icon>
                  </el-upload>
                </div>
                <div class="upload_album_cover_option">
                  <span>图片格式为jpg、jpeg、png 大小 < 20M</span>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="专辑名称">
              <el-input
                  placeholder="请输入名称，最多30个字符"
                  maxlength="30"
                  v-model="album.album_Name"/>
            </el-form-item>
            <el-form-item label="专辑类型">
              <el-select placeholder="请选择类型">
                <el-option label="Zone one" value="shanghai"/>
                <el-option label="Zone two" value="beijing"/>
              </el-select>
            </el-form-item>
            <el-form-item label="流派">
              <el-select placeholder="请选择流派">
                <el-option label="Zone one" value="shanghai"/>
                <el-option label="Zone two" value="beijing"/>
              </el-select>
            </el-form-item>
            <el-form-item label="语种">
              <el-select placeholder="请选择语种">
                <el-option label="Zone one" value="shanghai"/>
                <el-option label="Zone two" value="beijing"/>
              </el-select>
            </el-form-item>
            <el-form-item label="专辑介绍">
              <el-input
                  v-model="album.album_Introduction"
                  type="textarea"
                  maxlength="200"
                  placeholder="200"
                  show-word-limit/>
            </el-form-item>
          </el-form>
        </div>
      </div>

      <div class="album_list_mod" id="alm" v-if="ifAlbumExist && !creatAlbum">
        <el-scrollbar height="180px">
          <el-radio-group v-model="ifSelect">
            <div class="creat_album_BT" @click="creatAlbum=true">
              <svg t="1717770542712" class="icon" viewBox="0 0 1024 1024" version="1.1"
                   xmlns="http://www.w3.org/2000/svg"
                   p-id="16810" width="128" height="128">
                <path
                    d="M809.857 392.857H512c-65.803 0-119.143 53.34-119.143 119.143v297.857C392.857 875.66 446.197 929 512 929h297.857C875.66 929 929 875.66 929 809.857V512c0-65.803-53.34-119.143-119.143-119.143zM273.714 95H154.571C121.67 95 95 121.67 95 154.571v119.143c0 32.901 26.67 59.571 59.571 59.571h119.143c32.901 0 59.571-26.67 59.571-59.571V154.571C333.286 121.67 306.616 95 273.714 95z m178.715 238.286h119.143c32.901 0 59.571-26.67 59.571-59.571V154.571c0-32.901-26.67-59.571-59.571-59.571H452.429c-32.901 0-59.571 26.67-59.571 59.571v119.143c-0.001 32.902 26.669 59.572 59.571 59.572zM869.429 95H750.286c-32.901 0-59.571 26.67-59.571 59.571v119.143c0 32.901 26.67 59.571 59.571 59.571h119.143c32.901 0 59.571-26.67 59.571-59.571V154.571C929 121.67 902.33 95 869.429 95zM273.714 392.857H154.571c-32.901 0-59.571 26.67-59.571 59.571v119.143c0 32.901 26.67 59.571 59.571 59.571h119.143c32.901 0 59.571-26.67 59.571-59.571V452.429c0.001-32.902-26.669-59.572-59.571-59.572z m0 297.857H154.571c-32.901 0-59.571 26.67-59.571 59.571v119.143C95 902.33 121.67 929 154.571 929h119.143c32.901 0 59.571-26.67 59.571-59.571V750.286c0.001-32.902-26.669-59.572-59.571-59.572z"
                    fill="#8a8a8a" p-id="16811"></path>
              </svg>
              <el-radio label="新建专辑" size="large"></el-radio>
            </div>
            <div class="album_list" id="al" v-for="(item , index) in albumList"
                 @click="selectAlbum(item)">
              <img :src=item.album_Cover>
              <el-radio :label="item.album_Name" size="large"></el-radio>
            </div>
          </el-radio-group>
        </el-scrollbar>
      </div>
    </div>
  </div>

  <div class="box_mod" v-if="active ===1">
    <div class="commitment_letter">
      <el-scrollbar>
        <div class="letter_text">
          <label>授权书</label>
          <p>授权人：；身份证号码：</p>
          <p>被授权人：AUT音乐</p>
          <p>一、授权作品及授权权利</p>
          <p> 1、
            授权人将其享有的授权作品及全部下述权利授权许可被授权人（详见附件《授权作品及授权权利清单》）：（1）音乐词曲作品著作权之信息网络传播权；（2）MV作品著作权之信息网络传播权；（3）录音/录像制品的词曲著作权和表演者权、录音制作者权、录像制作者权等邻接权之信息网络传播权。</p>
          <p> 2、
            本授权书的信息网络传播权是指：以有线或者无线方式向公众提供或传播作品、录音及表演，包括交互式和非交互式。具体使用形式包括但不限于网络点播、下载、IPTV、数字电视、无线或有线增值业务等现有各种使用形式及授权期限内新出现的其他使用形式等，具体用户的接收终端和显示终端形式包括不限于手机、电脑、平板电脑、机顶盒、MPEG4播放器、车载电视、航空器电视等现有接收终端或显示终端及授权期限内新出现的其他接收终端或显示终端等。</p>
          <p>二、授权性质</p>
          <p> 1、本授权为非独占性授权。</p>
          <p> 2、被授权人有权将全部授权作品及授权权利转授权给其关联公司使用。</p>
          <p> 三、授权期限：自 至。授权期限届满前三十日内，如双方未书面达成一致终止授权或被授权人未书面通知授权人终止授权的，则本授权期限自动续期一年，依此类推
            。</p>
          <p> 四、授权地域范围：全世界。</p>
          <p> 五、授权人有权做出上述授权，并为此承担一切法律责任。</p>
          <p>
            六、其他未尽事项，按照授权人与被授权人所签订的包括但不限于《AUT音乐平台服务协议》及被授权人平台所发布制定的其他公告和通知内容为准</p>
          <p style="font-weight: 900;font-size: 15px">授权人：</p>
          <p style="font-weight: 900;font-size: 15px">授权日期：</p>
          <p style="font-weight: 900;font-size: 15px">签名：
            <span style="font-size: 40px;color: #cb1f1f">xxx</span>
          </p>
        </div>
      </el-scrollbar>
    </div>
    <div id="aCL">
      <el-checkbox v-model="agreeComitLet" label="我已阅读授权书，并同意授权" size="large" border/>
    </div>
  </div>

  <div class="box_mod" v-if="active === 2">
    <div class="tip_upload">
      <svg t="1717825065847" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
           p-id="12251" width="200" height="200">
        <path
            d="M110.933333 892.330667a25.6 25.6 0 0 0-25.6 25.6v37.802666a25.6 25.6 0 0 0 25.6 25.6h438.442667a276.565333 276.565333 0 0 1-46.506667-89.002666zM439.381333 0C307.669333 4.096 203.52 112.896 203.605333 245.546667a238.890667 238.890667 0 0 0 45.312 139.605333l16.469334 21.546667 12.8 17.92 20.394666 31.317333 6.741334 12.330667v5.12a54.186667 54.186667 0 0 1-13.994667 35.2l-13.312 13.098666-4.138667 3.328H167.765333l-1.28-0.512c-75.093333 0-115.498667 29.44-122.666666 90.965334l-0.853334 10.538666L42.666667 636.586667v122.112a94.293333 94.293333 0 0 0 84.181333 94.122666l8.96 0.512h358.144a277.333333 277.333333 0 0 1 302.933333-318.549333c-15.445333-6.442667-34.005333-10.154667-55.808-11.093333l-11.605333-0.256-105.984-0.042667-6.826667-5.674667-5.290666-5.205333a54.954667 54.954667 0 0 1-16.853334-32l-0.597333-7.338667-0.810667-0.426666a142.506667 142.506667 0 0 1 21.333334-40.96c7.168-11.093333 15.146667-22.314667 24.277333-34.432a243.456 243.456 0 0 0 54.741333-154.88c-2.005333-127.573333-99.84-231.808-224.810666-241.792L456.106667 0h-16.64z"
            p-id="12252" fill="#2c2c2c"></path>
        <path
            d="M768 597.333333a213.333333 213.333333 0 1 1 0 426.666667 213.333333 213.333333 0 0 1 0-426.666667z m16.213333 116.352h-50.133333a8.533333 8.533333 0 0 0-8.533333 8.533334v113.152l102.314666 94.165333a8.533333 8.533333 0 0 0 11.776-0.256l35.413334-35.413333a8.576 8.576 0 0 0-0.426667-12.245334l-81.834667-73.685333v-85.717333a8.533333 8.533333 0 0 0-8.533333-8.533334z"
            p-id="12253" fill="#2c2c2c"></path>
      </svg>
      <span style="margin-top: 30px">您的歌曲已提交，工作人员将在三个工作日内完成审核，审核完成后将上架AUT音乐。</span>
    </div>
  </div>

  <div class="option_next_cancel">
    <el-button type="info" round plain size="large" v-if="active===0">取消</el-button>
    <el-button type="info" round plain size="large" v-if="active===1" @click="last">上一步</el-button>
    <el-button type="warning" round plain size="large" v-if="active <1" :disabled="ifNext" @click="next">下一步
    </el-button>
    <el-button type="warning" round plain size="large" v-if="active===1" @click="uploadAlCover"
               :disabled="!agreeComitLet">
      上传
    </el-button>
  </div>
</template>
<style scoped>
.box_mod {
  width: 100%;
  background-color: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0px 0px 6px 1px #ececec;
  margin-bottom: 10px;
  padding: 20px 30px;
}

.step_mod_el {
  display: flex;
  align-items: center;
  justify-content: center;
}


/*文件上传模块*/
.upload_mod_song {
  display: flex;
  align-items: center;
  flex-direction: column;
}

#uploadsong :deep(.el-upload-dragger:hover) {
  border-color: #e58c43;
}

#uploadsong :deep(.el-upload-dragger .el-upload__text em ) {
  color: #e58c43;
}


/*上传的歌曲列表*/
.song_list_upload {
  margin-bottom: 30px;
  width: 85%;
}

.song_list {
  background-color: #f8f9fc;
  height: 60px;
  border-radius: 12px;
  padding-left: 20px;
  padding-right: 20px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.song_name_in {
  display: flex;
  align-items: center;
}

.song_name_in input {
  border: 1px solid #e58c43;
  border-radius: 12px;
  height: 35px;
  width: 250px;
}


.song_info {
  display: flex;
  align-items: center
}

.song_info span {
  color: #e58c43;
  font-size: 13px;
  margin-left: 20px;
  cursor: pointer;
}

.divisionLn {
  background-color: black;
  width: 1px;
  height: 15px;
  margin-left: 20px
}

/*设置专辑模块*/
.title_set_album {
  display: block;
  margin-bottom: 20px;
}

.setAlbum_mod_song {
  display: flex;
  justify-content: center;
}

.album_create_mod {
  background-color: #f8f9fc;
  width: 85%;
  border-radius: 12px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.album_create_mod:hover {
  background-color: rgba(229, 140, 67, 0.1);
}

.album_create_mod label {
  font-size: 14px;
  font-family: STXihei, serif;
  cursor: pointer;
}

.album_create_mod label:hover {
  color: #e58c43;
}

/*创建专辑表单*/
.creat_album_form {
  background-color: #f8f9fc;
  width: 85%;
  border-radius: 12px;
}

.create_form_title {
  width: 100%;
  height: 100px;
  background-color: #f2f4f8;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  font-size: 14px;
  font-family: STXihei, serif;
}

.create_form_title span {
  cursor: pointer;
}

.create_form_title span:hover {
  color: #e58c43;
}

.creat_form_content {
  padding: 20px 30px 20px 80px;
}

/*封面上传*/
.upload_album_cover {
  width: 400px;
  height: 130px;
  background-color: #FFFFFF;
  border-radius: 12px;
  display: flex;
  align-items: center;
  padding-left: 10px;
  padding-right: 10px;
}

.upload_album_cover_input {
  width: 100px;
  height: 100px;
  border-radius: 12px;
  border: 1px dashed;
}

.upload_album_cover_input:hover {
  border: 1px dashed #e58c43;
}

.upload_album_cover_input img {
  width: 100px;
  height: 100px;
  border-radius: 12px;
}

#upaci :deep(.el-upload) {
  width: 100px;
  height: 100px;
  border-radius: 12px;
}

#upaci :deep(.el-upload:focus) {
  border-color: #e58c43;
  color: #e58c43;
}


.upload_album_cover_option {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 20px;
}

.upload_album_cover_option span {
  font-family: STXihei, serif;
  font-size: 12px;
  color: #3f3f3f;
}

#cfc :deep(.el-form-item__label-wrap) {
  margin-right: 20px;
}

#cfc :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #e58c43 inset;
}

#cfc :deep(.el-select__wrapper.is-focused) {
  box-shadow: 0 0 0 1px #e58c43 inset;
}

#cfc :deep(.el-textarea__inner:focus) {
  box-shadow: 0 0 0 1px #e58c43 inset;
}

/*名称输入框*/
#cfc :deep(.el-input ) {
  width: 400px;
}

/*选项框*/
#cfc :deep(.el-select ) {
  width: 400px;
}

/*简介输入框*/
#cfc :deep(.el-textarea__inner) {
  width: 400px;
  height: 100px;
  max-height: 150px;
}

#cfc :deep(.el-textarea .el-input__count ) {
  position: absolute;
  font-size: 12px;
  line-height: 14px;
  bottom: 10px;
  left: 330px;
  right: inherit;
}

.album_list_mod {
  background-color: #f8f9fc;
  width: 90%;
  height: 200px;
  border-radius: 12px;
  padding: 20px 0 20px 30px;
}

.album_list_mod .el-scrollbar {
  width: 100%;
}

#alm :deep() .el-scrollbar__view {
  display: flex;
  flex-wrap: wrap;
}

.creat_album_BT {
  width: 150px;
  height: 180px;
  border-radius: 12px;
  margin-right: 25px;
  display: flex;
  align-items: center;
  flex-direction: column;
}

.creat_album_BT svg {
  cursor: pointer
}

.album_list {
  width: 150px;
  height: 180px;
  border-radius: 12px;
  margin-right: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/*专辑选项框*/
#al :deep(.el-radio__inner:hover) {
  border-color: #e58c43;
}

#al :deep(.el-radio__input.is-checked + .el-radio__label) {
  color: #e58c43;
}

#al :deep(.el-radio__input.is-checked .el-radio__inner) {
  background-color: #e58c43;
  border-color: #e58c43;
}

.album_list img {
  width: 120px;
  height: 120px;
  border-radius: 12px;
}

/*承诺书模块*/
.commitment_letter {
  background-color: #f5f6fa;
  width: 100%;
  height: 600px;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
}

.letter_text {
  padding: 20px 30px;
  font-family: SimHei, serif;
}

.letter_text label {
  font-weight: 900;
  font-size: 30px;
  font-family: SimHei, serif;
  margin-bottom: 20px;
}

/*同意选项模块*/

#aCL :deep(.el-checkbox.is-bordered.is-checked) {
  border-color: #e58c43;
}

#aCL :deep(.el-checkbox__inner:hover) {
  border-color: #e58c43;
}

#aCL :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #e58c43;
  border-color: #e58c43;
}

#aCL :deep(.el-checkbox__input.is-checked + .el-checkbox__label) {
  color: #e58c43;
}

.tip_upload {
  width: 100%;
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: SimHei, serif;
  color: #575757;
}

/*按钮模块*/
.option_next_cancel {
  width: 100%;
  text-align: center;
  margin-top: 30px;
  margin-bottom: 30px;
}
</style>
