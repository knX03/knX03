import {onMounted, ref} from "vue";

let dialogVisible = ref(false)
let changeFlag = ref(0)
let messageCode = ref("")
let CLSong = ref({playlist_ID: '', song_Name: '',})
let creatList = ref([{
    playlist_ID: '',
    playlist_Name: '',
}])
let songList = ref([{
    song_Name: '',
    singer_ID: '',
    album_ID: '',
    song_Cover: '',
    song_Directory: '',
}])
let likeList = ref([{
    playlist_ID: '',
    create_By: '',
    create_Time: '',
    playlist_Name: '',
    playlist_Cover: '',
}])

let AlbumList = ref([{
    album_Name: '',
    singer_ID: '',
    album_Cover: '',
    create_Time: '',
}])


onMounted(() => {

})

function selectSongByUser(user_ID) {
    let that = this;
    axios({
        method: 'GET',
        url: 'http://localhost/song/SongByUser?user_ID=' + user_ID,
    }).then(resp => {
        if (resp.data.code === 200) {
            that.songList = resp.data.data
        } else if (resp.data.code === 500) {
            console.log(resp.data.msg)
        }
    })
}

function selectCreateDetail(user_ID) {
    let that = this;
    axios({
        method: 'GET',
        url: 'http://localhost/songPlaylist/createPlaylist?user_ID=' + user_ID,
    }).then(resp => {
        if (resp.data.code === 200) {
            that.creatList = resp.data.data
        } else if (resp.data.code === 500) {
            console.error(resp.data.msg)
        }
    })
}

function selectLikePlaylist(user_ID) {
    let that = this;
    axios({
        method: 'GET',
        url: 'http://localhost/songPlaylist/likePlaylist?user_ID=' + user_ID,
    }).then(resp => {
        if (resp.data.code === 200) {
            that.likeList = resp.data.data
            for (let i = 0; i < resp.data.data.length; i++) {
                that.selectNameByCreateBY(i, resp.data.data[i].create_By)
            }
        } else if (resp.data.code === 500) {
            console.error(resp.data.msg)
        }
    })
}

function selectNameByCreateBY(i, user_ID) {
    console.log(user_ID)
    let that = this;
    axios({
        method: 'GET',
        url: 'http://localhost/user/DetailByID?user_ID=' + user_ID,
    }).then(resp => {
        if (resp.data.code === 200) {
            that.likeList[i].create_By = resp.data.data.user_Name
        } else if (resp.data.code === 500) {
            console.error(resp.data.msg)
        }
    })
}

function selectLikeAlbum(user_ID) {
    let that = this;
    axios({
        method: 'GET',
        url: 'http://localhost/album/likeAlbum?user_ID=' + user_ID,
    }).then(resp => {
        if (resp.data.code === 200) {
            that.AlbumList = resp.data.data
        } else if (resp.data.code === 500) {
            console.error(resp.data.msg)
        }
    })
}

function beforeCL(row) {
    let that = this;
    this.dialogVisible = true;
    that.CLSong.song_Name = row;
    console.log(that.CLSong)
}

function ifExistSong() {
    let that = this;
    console.log(that.CLSong)
    axios({
        method: 'GET',
        url: 'http://localhost/songPlaylist/IESong?playlist_ID=' + that.CLSong.playlist_ID + '&song_Name=' + that.CLSong.song_Name,
    }).then(resp => {
        if (resp.data.code === 302) {
            this.$message.error(resp.data.msg)
            that.CLSong.playlist_ID = '';
            that.dialogVisible = false;
        } else if (resp.data.code === 200) {
            that.collectSongToPlaylist()
        }
    })
}

function collectSongToPlaylist() {
    let that = this;
    axios({
        method: 'GET',
        url: 'http://localhost/songPlaylist/CLSong?playlist_ID=' + that.CLSong.playlist_ID + '&song_Name=' + that.CLSong.song_Name,
    }).then(resp => {
        if (resp.data.code === 200) {
            that.dialogVisible = false;
            that.CLSong.playlist_ID = '';
            this.$message.success('收藏成功！')
        }
    })
}

function deleteSong(row) {
    let that = this;
    this.$confirm('确认移除' + row + '？')
        .then(_ => {
            axios({
                method: 'get',
                url: 'http://localhost/song/deleteSong?song_name=' + row + "&user_ID=" + that.user.user_ID,
            }).then(resp => {
                if (resp.data.code === 200) {
                    that.selectSongByUser(that.user.user_ID)
                } else if (resp.data.code === 500) {
                    console.log(resp.data.msg)
                }
            })
        })
        .catch(_ => {
        });

}
