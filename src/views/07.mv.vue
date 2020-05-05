<template>
  <div class="mv-container">
    <div class="mv-wrap">
      <h3 class="title">mv详情</h3>
      <!-- mv -->
      <div class="video-wrap">
        <video controls :src="url"></video>
      </div>
      <!-- mv信息 -->
      <div class="info-wrap">
        <div class="singer-info">
          <div class="avatar-wrap">
            <!-- 歌手头像 -->
            <img :src="icon" alt />
          </div>
          <!-- 歌手名 -->
          <span class="name">{{ mvInfo.artistName }}</span>
        </div>
        <div class="mv-info">
          <!-- mv名 -->
          <h2 class="title">{{ mvInfo.name }}</h2>
          <!-- 发布时间 -->
          <span class="date">发布：{{ mvInfo.publishTime }}</span>
          <!-- 播放次数 -->
          <span class="number">播放：{{ mvInfo.playCount|playNumFormat }} 次</span>
          <!-- 描述 -->
          <p class="desc">{{ mvInfo.desc }}</p>
        </div>
      </div>
      <!-- 精彩评论 -->
      <div class="comment-wrap" v-if="hotComments !== undefined && hotComments.length !== 0">
        <p class="title">
          精彩评论
          <span class="number">({{ hotComments.length }})</span>
        </p>
        <div class="comments-wrap">
          <!-- 评论 -->
          <div class="item" v-for="(item, index) in hotComments" :key="index">
            <div class="icon-wrap">
              <!-- 头像 -->
              <img :src="item.user.avatarUrl" alt />
            </div>
            <div class="content-wrap">
              <div class="content">
                <span class="name">{{ item.user.nickname }}</span>
                <span class="comment">：{{ item.content }}</span>
              </div>
              <!-- 回复 -->
              <div class="re-content" v-if="item.beReplied.length !== 0">
                <span class="name">{{ item.beReplied[0].user.nickname }}</span>
                <span class="comment">：{{ item.beReplied[0].content }}</span>
              </div>
              <div class="date">{{ item.time }}</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 最新评论 -->
      <div class="comment-wrap">
        <p class="title">
          最新评论
          <span class="number">({{ total }})</span>
        </p>
        <div class="comments-wrap">
          <!-- 评论 -->
          <div class="item" v-for="(item, index) in comments" :key="index">
            <div class="icon-wrap">
              <!-- 头像 -->
              <img :src="item.user.avatarUrl" alt />
            </div>
            <div class="content-wrap">
              <div class="content">
                <span class="name">{{ item.user.nickname }}</span>
                <span class="comment">：{{ item.content }}</span>
              </div>
              <!-- 回复 -->
              <div class="re-content" v-if="item.beReplied.length !== 0">
                <span class="name">{{ item.beReplied[0].user.nickname }}</span>
                <span class="comment">：{{ item.beReplied[0].content }}</span>
              </div>
              <div class="date">{{ item.time }}</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 分页器 -->
      <el-pagination
        @current-change="handleCurrentChange"
        background
        layout="prev, pager, next"
        :total="total"
        :current-page="pageNum"
        :page-size="pageSize"
      ></el-pagination>
    </div>
    <div class="mv-recommend">
      <h3 class="title">相关推荐</h3>
      <div class="mvs">
        <div class="items">
          <div class="item" v-for="(item, index) in simiMvs" :key="index" @click="playMv(item.id)">
            <div class="img-wrap">
              <img :src="item.cover" alt />
              <span class="iconfont icon-play"></span>
              <div class="num-wrap">
                <div class="iconfont icon-play"></div>
                <div class="num">{{ item.playCount|playNumFormat }}</div>
              </div>
              <span class="time">{{ item.duration|playTimeFormat }}</span>
            </div>
            <div class="info-wrap">
              <div class="name">{{ item.name }}</div>
              <div class="singer">{{ item.artistName }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "mv",
  data() {
    return {
      id: "",
      // 总条数
      total: 20,
      // 页码
      pageNum: 1,
      // 页容量
      pageSize: 10,
      // mv地址
      url: "",
      // mv信息
      mvInfo: {},
      // 相关mv
      simiMvs: [],
      // 歌手头像
      icon: "",
      hotComments: [],
      comments: []
    };
  },
  created() {
    // 获取mv播放地址
    axios({
      url: "https://autumnfish.cn/mv/url",
      method: "get",
      params: {
        id: this.$route.query.q
      }
    }).then(res => {
      this.url = res.data.data.url;
    });

    // 获取mv信息
    axios({
      url: "https://autumnfish.cn/mv/detail",
      method: "get",
      params: {
        mvid: this.$route.query.q
      }
    }).then(res => {
      this.mvInfo = res.data.data;

      // 获取歌手信息
      axios({
        url: "https://autumnfish.cn/artists",
        method: "get",
        params: {
          id: this.mvInfo.artists[0].id
        }
      }).then(res => {
        this.icon = res.data.artist.picUrl;
      });
    });

    // 获取评论信息
    axios({
      url: "https://autumnfish.cn/comment/mv",
      method: "get",
      params: {
        id: this.$route.query.q,
        limit: 10,
        offset: 0
      }
    }).then(res => {
      // console.log(res);
      this.comments = res.data.comments;
      this.hotComments = res.data.hotComments;
    });

    // 获取相关mv
    axios({
      url: "https://autumnfish.cn/simi/mv",
      method: "get",
      params: {
        mvid: this.$route.query.q
      }
    }).then(res => {
      this.simiMvs = res.data.mvs;
    });
  },
  methods: {
    handleCurrentChange(val) {
      this.pageNum = val;
      // 重新获取数据
      axios({
        url: "https://autumnfish.cn/comment/mv",
        method: "get",
        params: {
          id: this.$route.query.q,
          limit: 10,
          offset: (this.pageNum - 1) * 10
        }
      }).then(res => {
        this.hotComments = res.data.hotComments;
      });
    }
  }
};
</script>

<style>
</style>