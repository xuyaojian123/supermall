export default {
  namespaced: true,
  state: {
    cartList: []
  },
  getters: {
    cartList(state) {
      return state.cartList;
    },
    cartCount(state, getters) {
      return getters.cartList.length;
    }
  },
  mutations: {
    addProductCounter(state, payload) {
      payload.element.count++;
    },
    addToCart(state, payload) {
      state.cartList.push(payload.product);
    }
  },
  actions: {
    addCart({ state, commit }, payload) {
      return new Promise((resolve, reject) => {
        const product = payload.product;
        let flag = 1;
        state.cartList.forEach(element => {
          if (element.iid == product.iid) {
            commit({
              type: "addProductCounter",
              element
            });
            resolve('当前的商品数量+1')
            flag = 0;
          }
        });
        if (flag) {
          product.count = 1;
          product.checked = true;
          commit({
            type: "addToCart",
            product
          });
          resolve('添加了新的商品')
        }
      });
    }
  }
};
