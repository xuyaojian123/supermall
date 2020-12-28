<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>

    <tab-control v-show="isTabFixed" class="tab-control"
                 @tabClick="tabClick"
                 :titles="['流行', '新款', '精选']"
                 ref="tabControl1">
    </tab-control>

    <scroll-vue
            class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll"
            :pull-up-load='true'
            @pullingUp="loadMore">
      <home-swiper class="home-swiper" :banners="banners" @swiperImageLoad.once="swiperImageLoad"/>
      <recommend-view :recommends="recommends" @imageLoad.once="imageLoad"/>
      <feature-view  @imageLoad.once="imageLoad"/>
      <tab-control  ref="tabControl2" :titles="['流行', '新款', '精选']" @tabClick="tabClick"/>
      <goods-list :goods="showGoods"></goods-list>
    </scroll-vue>
    <back-top @click.native="backTop" v-show="isShowBackTop"></back-top>
  </div>
</template>

<script>
  import HomeSwiper from './childComps/HomeSwiper'
  import RecommendView from './childComps/RecommendView'
  import FeatureView from './childComps/FeatureView'

  import NavBar from 'components/common/navbar/NavBar'
  import TabControl from 'components/content/tabControl/TabControl'
  import GoodsList from 'components/content/goods/GoodsList'
  import ScrollVue from 'components/common/scroll/Scroll.vue'
  import BackTop from 'components/content/backtop/backTop'

  import { getHomeMultidata, getHomeGoods } from "network/home"
  import {debounce} from 'common/utils'
  import {itemListenerMixin} from 'common/mixin'


  export default {
    name: "Home",
    mixins:[itemListenerMixin],
    components: {
      HomeSwiper,
      RecommendView,
      FeatureView,
      
      NavBar,
      TabControl,
      GoodsList,
      ScrollVue,
      BackTop
    },
    data() {
      return {
        banners: [],
        recommends: [],
        goods: {
          'pop': {page: 0, list: []},
          'new': {page: 0, list: []},
          'sell': {page: 0, list: []},
        },
        currentType: 'pop',
        isShowBackTop: false,
        isTabFixed: false,
        tabOffsetTop: 0,
        saveY: 0,
      }
    },
    computed: {
      showGoods() {
        return this.goods[this.currentType].list
      }
    },
    created() {
      // 1.请求多个数据
      this.getHomeMultidata()

      // 2.请求商品数据
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')
    },
    mounted() {
      console.log("Home的mounted方法");
    },
    activated() {
      console.log("Home的actived方法");
      this.$refs.scroll.refresh()
      this.$refs.scroll.scrollTo(0,this.saveY,0)
      console.log("Home通过混入监听事件总线GoodsListItem的itemImageLoad");
      this.itemImgListener("Home激活混入对象的监听")
    },
    deactivated() {
      this.saveY = this.$refs.scroll.getScrollY()
      this.$bus.$off('itemImageLoad',this.itemImgListener("Home取消混入对象的监听"))
    },
    destroyed() {
      console.log("home组件被销毁了");
    },
    methods: {
      /**
       * 网络请求相关的方法
       */
      getHomeMultidata() {
        getHomeMultidata().then(res => {
          // console.log(res);
          this.banners = res.data.banner.list;
          this.recommends = res.data.recommend.list;
        })
      },
      getHomeGoods(type) {
        const page = this.goods[type].page + 1
        getHomeGoods(type, page).then(res => {
          this.goods[type].list.push(...res.data.list)
          this.goods[type].page += 1

          //完场上拉加载更多
          this.$refs.scroll.finishPullUp()
        })
      },

       /**
       * 事件监听相关的方法
       */
      tabClick(index) {
        switch (index) {
          case 0:
            this.currentType = 'pop'
            break
          case 1:
            this.currentType = 'new'
            break
          case 2:
            this.currentType = 'sell'
            break
        }
        this.$refs.tabControl1.currentIndex = index
        this.$refs.tabControl2.currentIndex = index
      },

      backTop() {
        this.$refs.scroll.scrollTo(0, 0,2500)
      },
      contentScroll(position) {
        // console.log("-position.y:"+-position.y);
        // console.log("contentScroll:"+this.tabOffsetTop);
        // 1.决定tabFixed是否显示
        this.isTabFixed = (-position.y) > this.tabOffsetTop
      // 2.决定backTop是否显示
        this.isShowBackTop = (-position.y) > 1000
      },
      loadMore(){
        this.getHomeGoods(this.currentType)
      },
      swiperImageLoad(){
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
        console.log("swiperImageLoad方法offsetTop的高度为"+this.tabOffsetTop);
      },
      imageLoad(){
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
        console.log("imageLoad方法offsetTop的高度为"+this.tabOffsetTop);
      }
    }
  }
</script>

<style scoped>
  #home {
    /* padding-top: 44px; */
    height: 100vh;
    position: relative;
  }

  .home-nav {
    background-color: var(--color-tint);
    color: #fff;
    /* position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 9; */
  }
  .content{
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 44px;
    left: 0;
    right: 0;
  }
  .tab-control{
    /* 比较新的属性，可以实现吸顶效果 */
    /* position: sticky; */
    position: relative;
    /* top: 44px; */
    z-index: 9;
  }

</style>
