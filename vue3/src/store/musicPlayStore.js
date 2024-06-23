import {defineStore} from 'pinia';
import {store} from "xijs";

const musicPlayStore = defineStore("flagData", {
    state: () => ({
        index: -1,
        play: false,
        musicUrl: '',
        musicUrlList: [],
        songList: [{
            song_ID: '',
            song_Name: '',
            singer_ID: '',
            singer_name: '',
            album_ID: '',
            album_name: '',
            song_Cover: '',
            song_Directory: '',
        }]
    }),
    persist: {
        enabled: true,
        strategies: [
            {
                key: 'musicPlay_store',
                storage: localStorage,
            },
        ],
    },
})

export default musicPlayStore