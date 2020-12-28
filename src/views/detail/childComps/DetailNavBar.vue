<template>
  <div>
    <nav-bar>
      <template v-slot:left>
        <div class="back" @click="bcakClick">
          <img  src="~assets/img/common/back.svg" alt="">
        </div>
      </template>

      <template v-slot:center>
        <div class="title">
           <div v-for="(item, index) in titles" :key="index" 
           class="title-item"
           :class="{active:index === currentIndex}"
           @click="titleClick(index)"> {{item}} </div>
        </div>
      </template>
    </nav-bar>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";



export default {
  name: "DetailNavBar",
  data() {
    return {
      titles:['商品','参数','评论','推荐'],
      currentIndex: 0,
    };
  },
  components: {
    NavBar
  },
  methods: {
    titleClick(index){
      this.currentIndex = index
      this.$emit('titleClick',index)
    },
    bcakClick(){
      this.$router.back()
    }
  },
  mounted() {}
};
</script>

<style scoped>
.title{
  display: flex;
  font-size: 15px;
}

.title-item{
  flex: 1;
}

.active{
  color: var(--color-high-text);
}

/* .back{
  position: relative;
  width: 60px;
  height: 44px;
} */

.back img{
  /* position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%); */
  width: 22px;
  height: 22px;
  margin-top: 11px;
}
</style>
