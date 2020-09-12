import Vue from 'vue';
import Vuex from 'vuex';
import app from './modules/app.js';
import auth from './modules/auth/index.js';
import here from './modules/here/index.js';
import observacao from './modules/observacao/index.js';
import menu from './modules/sidemenu/index.js';
import situacoes from './modules/situacoes/index.js';
import * as actions from './actions.js';
import * as getters from './getters.js';

Vue.use(Vuex);

const store = new Vuex.Store({
  namespaced: false,
  actions,
  getters,
  modules: {
    app,
    auth,
    here,
    menu,
    observacao,
    situacoes,
  },
});

export default store;
