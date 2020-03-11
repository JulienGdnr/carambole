import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    questions: [],
    email: ""
  },
  mutations: {
    SET(state, payload) {
      for (let i in payload) {
        state[i] = payload[i];
      }
    },
    EDIT(state, payload) {
      for (let i in payload) {
        state[i] = [...state[i].map(e => (e.id == payload.id ? payload : e))];
      }
    }
  }
});
