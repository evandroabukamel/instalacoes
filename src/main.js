/* eslint-disable import/first */
// Importa classes base do sistema
import Vue from 'vue';
import axios from 'axios';
import { sync } from 'vuex-router-sync';
import VueAxios from 'vue-axios';
import Vuex from 'vuex';
import Buefy from 'buefy';
import { Toast } from 'buefy';
import 'buefy/lib/buefy.css';
import * as types from './store/mutation-types.js';
import _ from 'lodash';
import NProgress from 'vue-nprogress';
import camelcaseKeys from 'camelcase-keys';

Vue.config.productionTip = false;

Vue.use(VueAxios, axios);
Vue.use(NProgress, { http: false });
Vue.use(Buefy);

import App from './App.vue';
import router from './routes.js';
import store from './store/index.js';
import Form from './core/Form.js';

sync(store, router);
const { state } = store;

// Torna as bibliotecas acessíveis globalmente
window.Vue = Vue;
window.Vuex = Vuex;
window._ = _;
window.Form = Form;

// Importa componentes que serão globais
import InputText from './components/InputText.vue';
import SelectAjax from './components/SelectAjax.vue';

// Registra componentes de forma global
Vue.component('InputText', InputText);
Vue.component('SelectAjax', SelectAjax);

// Inicializa o Vue-NProgress, barra de carregamento da página
const nprogress = new NProgress();

// Configurações padrão do axios
axios.defaults.baseURL = process.env.API_URL;
axios.defaults.headers.get['Content-Type'] = 'application/json';
axios.defaults.headers.post['Content-Type'] = 'application/json';
if (localStorage.getItem('gts-token')) {
  axios.defaults.headers.get['X-AUTH-TOKEN'] = localStorage.getItem(
    'gts-token'
  );
  axios.defaults.headers.post['X-AUTH-TOKEN'] = localStorage.getItem(
    'gts-token'
  );
}

// Intercepta as requests do axios
axios.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    nprogress.start();
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Intercepta as response do axios
axios.interceptors.response.use(
  (response) => {
    // Do something with response data
    nprogress.done();
    // Converte os dados da response para camelCase
    return camelcaseKeys(response, { deep: true });
  },
  (error) => {
    try {
      // Converte os dados da response para camelCase
      error.response.data = camelcaseKeys(error.response.data, { deep: true });
      /* let originalRequest = error.config;
		if (error.response.status === 401 && !originalRequest._retry) { // if the error is 401 and hasent already been retried
			originalRequest._retry = true; // now it can be retried
			return axios.post('/users/token', null).then((data) => {
				store.dispatch('authfalse');
				store.dispatch('authtruth', data.data);
				originalRequest.headers['Authorization'] = 'Bearer ' + store.state.token; // new header new token
				return axios(originalRequest); // retry the request that errored out
			}).catch((error) => {
				for (let i = 0; i < error.response.data.errors.length; i++) {
					if (error.response.data.errors[i] === 'TOKEN-EXPIRED') {
						auth.logout();
						return;
					}
				}
			})
		}
		if (error.response.status === 404 && !originalRequest._retry) {
			originalRequest._retry = true;
			window.location.href = '/';
			return;
		} */
      nprogress.done();

      // Trata os códigos de erro
      if (error.response.status === 401) {
        if (store.getters.isLoggedIn) {
          Toast.open({
            message: error.response.data.message
              ? error.response.data.message
              : 'Necessário fazer login.',
            type: 'is-warning',
            position: 'is-top',
            duration: 5000,
          });
          store.dispatch('logout');
        }
      } else if (error.response.status === 500) {
        Toast.open({
          message: error.response.data.message
            ? error.response.data.message
            : 'Ocorreu algum erro imprevisto no servidor.',
          type: 'is-danger',
          position: 'is-top',
          duration: 7500,
        });
      }

      // Do something with response error
      return Promise.reject(error);
    } catch (ex) {
      // Trata o erro do tipo ERR_CONNECTION_TIMED_OUT
      nprogress.done();
      return Promise.reject(error);
    }
  }
);

// Oculta o sidebar sempre que navegar a uma tela no modo mobile
router.beforeEach((route, redirect, next) => {
  nprogress.done();
  if (state.app.device.isMobile && state.app.sidebar.opened) {
    store.commit(types.TOGGLE_SIDEBAR, false);
  }
  next();
});

Vue.config.errorHandler = function (err, vm, info) {
  // handle error
  // `info` is a Vue-specific error info, e.g. which lifecycle hook
  // the error was found in. Only available in 2.2.0+
  console.log(err);
  console.log(vm);
  console.log(info);
};
Vue.config.warnHandler = function (msg, vm, trace) {
  // `trace` is the component hierarchy trace
  console.log(msg);
  console.log(vm);
  console.log(trace);
};

// Inicializa o Vue
new Vue({
  el: '#app',
  store,
  router,
  nprogress,
  components: { App },
  template: '<App/>',
});
