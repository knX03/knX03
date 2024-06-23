import {createRouter, createWebHistory} from 'vue-router'
import Home from '../views/Home.vue'
import Test from '../views/test.vue'
import navAUT from '../components/utils/AUTnav.vue'
import MY from '../views/MY.vue'
import secondNav from '../components/utils/secondNav.vue'
import singer from '../views/singer.vue'
import songList from '../views/songList.vue'
import album from '../views/album.vue'
import myInfo from '../views/myInfo.vue'
import playlistDetails from '../views/SecondPage/playlistDetail.vue'
import albumDetail from '../views/SecondPage/albumDetail.vue'
import singerDetail from '../views/SecondPage/singerDetail.vue'
import dailyRecomm from '../views/SecondPage/dailyRecomm.vue'
import signIn from '../views/LRF/signIn.vue'
import signUp from '../views/LRF/signUp.vue'
import forgetPass from '../views/LRF/fogerPass.vue'
import userDetail from '../views/SecondPage/userDetail.vue'
import artists from '../views/Artists/artists.vue'
import artHome from '../views/Artists/artDetail/artHome.vue'
import MusicPlayer from "@/components/utils/musicPlayer.vue";
import musicPlay from '../views/musicPlay.vue'
import {ElNotification} from "element-plus";
import {store} from "xijs";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home,
        },
        {
            path: '/test',
            name: 'Test',
            component: Test
        },
        {
            path: '/MY',
            name: 'MY',
            meta: {
                requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
            },
            component: MY
        },
        {
            path: '/singer',
            name: 'singer',
            component: singer,
        },
        {
            path: '/songList',
            name: 'songList',
            component: songList
        },
        {
            path: '/album',
            name: 'album',
            component: album
        },
        {
            path: '/myInfo',
            name: 'myInfo',
            meta: {
                requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
            },
            component: myInfo
        },
        {
            path: '/playlistDetails',
            name: 'playlistDetails',
            component: playlistDetails
        },
        {
            path: '/albumDetail',
            name: 'albumDetail',
            component: albumDetail
        },
        {
            path: '/singerDetail',
            name: 'singerDetail',
            component: singerDetail
        },
        {
            path: '/dailyRecomm',
            name: 'dailyRecomm',
            component: dailyRecomm
        }, {
            path: '/signIn',
            name: 'signIn',
            component: signIn
        }, {
            path: '/signUp',
            name: 'signUp',
            component: signUp
        }, {
            path: '/forgetPass',
            name: 'forgetPass',
            component: forgetPass
        }, {
            path: '/userDetail',
            name: 'userDetail',
            component: userDetail
        }, {
            path: '/artists',
            name: 'artists',
            component: artists,

        }, {
            path: '/artHome',
            name: 'artHome',
            component: artHome,
        }/*, {
            path: '/MusicPlay',
            name: 'MusicPlay',
            component: MusicPlay,
            meta: {
                keepAlive: true
            }
        }*//*, {
            path: '/musicPlay',
            name: 'musicPlay',
            component: musicPlay,
            meta: {
                keepAlive: true
            }
        },*/

    ]
})
router.beforeEach((to, from, next) => {
    if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
        // 从本地存储localStorage获取当前的token是否存在
        if (store.get('access_token').value) {
            next()
        } else {
            ElNotification({
                title: '请先登录!',
                type: 'error',
                duration: 1000,
                position: 'top-left',
            })
            next('/signIn') //如果token不存在，就跳到首页
        }
    } else {
        //token存在时候，进去登录页面就自动跳转到首页
        if (store.get('access_token').value && to.path === '/signIn') {
            next('/')
            ElNotification({
                title: '您已登录!',
                type: 'success',
                duration: 1000,
                position: 'top-left',
            })
        } else {
            next()
        }
    }

});

export default router
