<template>
  <div id="detail">
    <detail-nav-bar class="detail-navbar" @titleClick="titleClick" ref="detailNavbar"></detail-nav-bar>
    <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll">
      <detail-swiper :top-images="topImages" @imageLoad="imageLoad"></detail-swiper>
      <detail-base-info :goods="goods" @imageLoad="imageLoad"></detail-base-info>
      <detail-shop-info :shop="shop" @imageLoad="imageLoad"></detail-shop-info>
      <detail-goods-info
        :detail-info="detailInfo"
        @imageLoad="imageLoad"
      ></detail-goods-info>
      <detail-param-info :param-info="paramInfo" ref="params"  @imageLoad="imageLoad"></detail-param-info>
      <detail-comment-info :comment-info="commentInfo" ref="comment" @imageLoad="imageLoad"></detail-comment-info>
      <goods-list :goods="recommends" ref="recommend"></goods-list>
    </scroll>
    <detail-bottom-bar  @addCart="addToCart"></detail-bottom-bar>
    <back-top @click.native="backTop" v-show="isShowBackTop"></back-top>
  </div>
</template>

<script>
import DetailNavBar from "./childComps/DetailNavBar";
import DetailSwiper from "./childComps/DetailSwiper";
import DetailBaseInfo from "./childComps/DetailBaseInfo";
import DetailShopInfo from "./childComps/DetailShopInfo";
import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
import DetailParamInfo from './childComps/DetailParamInfo'
import DetailCommentInfo from './childComps/DetailCommentInfo'
import DetailBottomBar from './childComps/DetailBottomBar'

import Scroll from "components/common/scroll/Scroll";
import GoodsList from 'components/content/goods/GoodsList'
import BackTop from 'components/content/backtop/backTop'

import { getDetail,getRecommend, Goods, Shop ,GoodsParam} from "network/detail";
import {debounce} from 'common/utils'
import {itemListenerMixin} from 'common/mixin'

export default {
  name: "Detail",
  mixins:[itemListenerMixin],
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo:{},
      commentInfo: {},
      recommends:[],
      offsetTopY:[],
      getOffsetTopY:null,
      isShowBackTop: false,
    };
  },
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailBottomBar,

    Scroll,
    GoodsList,
    BackTop
  },
  created() {
    //保存传入的iid
    this.iid = this.$route.params.iid;
    // 根据iid请求数据
    getDetail(this.iid).then(result => {
        const data = result.result;
        this.topImages = data.itemInfo.topImages;
        // 获取商品信息
        this.goods = new Goods(
          data.itemInfo,
          data.columns,
          data.shopInfo.services
        );
        // console.log(this.goods);
        //创建店铺信息的对象
        this.shop = new Shop(data.shopInfo);
        //保存商品的详情数据
        this.detailInfo = data.detailInfo;
        //获取参数信息
        this.paramInfo = new GoodsParam(data.itemParams.info,data.itemParams.rule)
        //获取评论信息
        if (data.rate.cRate!==0) {
            this.commentInfo = data.rate.list[0];
        }
      }).catch(err => {
        console.log(err);
      });
      //请求推荐数据
      getRecommend().then((result) => {
        this.recommends = result.data.list
      }).catch((err) => {
        console.log(err);
      });

      this.getOffsetTopY = debounce(()=>{
        console.log("getOffsetTopY方法执行了");
        this.offsetTopY = []
        this.offsetTopY.push(0)
        this.offsetTopY.push(this.$refs.params.$el.offsetTop-44)
        this.offsetTopY.push(this.$refs.comment.$el.offsetTop-44)
        this.offsetTopY.push(this.$refs.recommend.$el.offsetTop-44)
      },100)
  },
  methods: {
    imageLoad(message){
      console.log(message);
      console.log("detail中的refresh方法执行了");
      this.$refs.scroll.refresh()
      this.getOffsetTopY()
      // this.offsetTopY = []
      // this.offsetTopY.push(0)
      // this.offsetTopY.push(this.$refs.params.$el.offsetTop-44)
      // this.offsetTopY.push(this.$refs.comment.$el.offsetTop-44)
      // this.offsetTopY.push(this.$refs.recommend.$el.offsetTop-44)
    },
    titleClick(index){
      this.$refs.scroll.scrollTo(0,-this.offsetTopY[index],500)
    },
    contentScroll(position) {
      for (let i = this.offsetTopY.length-1; i>=0; i--) {
        if( -position.y >= this.offsetTopY[i] ){
          this.$refs.detailNavbar.currentIndex = i
          break
        }
      }
      // 2.决定backTop是否显示
      this.isShowBackTop = (-position.y) > 1000
    },
    backTop() {
        this.$refs.scroll.scrollTo(0, 0,2500)
    },
    addToCart(){
      const product = {}
      product.image = this.topImages[0]
      product.title = this.goods.title
      product.desc = this.goods.desc
      product.nowPrice = this.goods.nowPrice
      product.iid = this.iid
      this.$store.dispatch({
        type:'cart/addCart',
        product:product
      }).then( result => {
        this.$toast({message:result,duration:2000})
      })
    },
  },
  mounted() {
    console.log("Detail的mounted方法");
    this.itemImgListener("Detail激活混入对象的监听")
  },
 
  activated() {
    console.log("Detail的actived方法执行了");
  },
  beforeDestroy() {
      console.log("Detail的beforeDestroy方法执行了");
      this.$bus.$off('itemImageLoad',this.itemImgListener("Detail取消混入对象的监听"))
  },
  
};
</script>

<style scoped>
#detail {
  position: relative;
  height: 100vh;
}
.detail-navbar {
  background-color: #fff;
  /* 使用了第一种方法需要加相对定位和z-index,第二种绝对定位就不需要 */
  /* position: relative; */
  /* z-index: 9; */
}
.content {
  /* 第一种方法，计算高度 */
  /* position: relative; */
  overflow: hidden;
  height: calc(100% - 44px - 58px);
  /* 第二种方法：定位 */
  /* overflow: hidden;
  position: absolute;
  top: 44px;
  left: 0;
  right: 0;
  bottom: 0; */
}
</style>
