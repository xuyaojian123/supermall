<template>
  <scroll class="cart-list">
      <cart-list-item
        v-for="item in cartList"
        :key="item.iid"
        :item-info="item"
      ></cart-list-item>
  </scroll>
</template>

<script>
import Scroll from "components/common/scroll/Scroll";
import CartListItem from "./CartListItem";

export default {
  name: "CartList",
  components: {
    Scroll,
    CartListItem
  },
  props: {
    cartList: {
      type: Array,
      default() {
        return [];
      }
    }
  }
};
</script>

<style scoped>
.cart-list{
    height: calc(100vh - 49px - 44px - 44px);
    overflow: hidden;
}
</style>
