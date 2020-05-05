import Vue from 'vue'
import App from './App.vue'

// 导入 Element-ui
import ElementUI from 'element-ui';
// 导入 Element-ui的样式
import 'element-ui/lib/theme-chalk/index.css';
// 插件 Element-ui
Vue.use(ElementUI)

// 导入全局初始化样式
import './assets/index.css'

// 路由整合
import VueRouter from 'vue-router'
Vue.use(VueRouter)

// 导入 需要通过路由管理的组件
import discovery from './views/01.discovery.vue'
import playlists from './views/02.playlists.vue'
import songs from './views/03.songs.vue'
import mvs from './views/04.mvs.vue'
import result from './views/05.result.vue'
import playlist from './views/06.playlist.vue'
import mv from './views/07.mv.vue'
// 创建路由
let router = new VueRouter({
  routes: [
    //配置地址 和 组件的对应关系
    {
      path: "/",
      component: discovery
    },
    {
      // 发现音乐
      path: "/discovery",
      component: discovery
    },
    {
      // 推荐歌单
      path: "/playlists",
      component: playlists
    },
    {
      // 推荐歌单
      path: "/songs",
      component: songs
    },
    {
      path: "/mvs",
      component: mvs
    },
    {
      path: "/result",
      component: result
    },
    {
      path: "/playlist",
      component: playlist
    },
    {
      path: "/mv",
      component: mv
    }
  ]
})

Vue.filter('playTimeFormat', function (originVal) {
  let duration = originVal
  let min = parseInt(duration / 1000 / 60)
  if (min < 10) {
    min = '0' + min
  }
  let sec = parseInt((duration / 1000) % 60)
  if (sec < 10) {
    sec = '0' + sec
  }
  return `${min}:${sec}`
})

Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

Vue.filter('playNumFormat', function (playCount) {
  if (playCount > 100000) {
    return parseInt(playCount / 10000) + '万'
  }
  return playCount
})

new Vue({
  render: h => h(App),
  // 挂载到Vue实例上
  router // router:router
}).$mount('#app')