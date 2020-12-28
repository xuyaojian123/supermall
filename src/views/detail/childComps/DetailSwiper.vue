<template>
  <swiper class="detail-swiper" :interval='2000'>
    <swiper-item v-for="(item, index) in topImages" :key="index">
      <img :src="item" alt="网络卡顿" @load="imgLoad"/>
    </swiper-item>
  </swiper>
</template>

<script>
import { Swiper, SwiperItem } from "components/common/swiper";

export default {
  name: "DetailSwiper",
  data() {
    return {};
  },
  props: {
    topImages: {
      type: Array,
      default: () => []
    }
  },
  components: {
    Swiper,
    SwiperItem
  },
  methods: {
    imgLoad(){
      this.$emit('imageLoad',"DetailSwiper传递imageLoad事件")
    }
  },
  mounted() {}
};
</script>

<style scoped>
.detail-swiper {
  height: 300px;
  overflow: hidden;
}

</style>
