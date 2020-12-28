import { debounce } from "./utils";

export const itemListenerMixin = {
  methods: {
    itemImgListener(message) {
      console.log(message);
      // console.log(this.$refs.scroll.refresh);
      const refreshItemImage = debounce(this.$refs.scroll.refresh, 50);
      this.$bus.$on("itemImageLoad", () => {
        console.log("混入监听GoodsListItem的itemImageLoad");
        refreshItemImage();
      });
    }
  },
};
