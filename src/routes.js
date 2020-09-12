import Vue from 'vue';
import VueRouter from 'vue-router';
import store from './store/index.js';
import menuModule from './store/modules/sidemenu/index.js';

const redirectNotLogged = function (to, from, next) {
  if (store.getters.isLoggedIn) {
    next('/intranet');
  } else {
    next();
  }
};

Vue.use(VueRouter);

let routes = [
  {
    path: '/',
    component: () => import('./views/public/Home.vue'),
    beforeEnter: redirectNotLogged,
  },
  {
    path: '/login',
    component: () => import('./views/public/Login.vue'),
    beforeEnter: redirectNotLogged,
  },
  {
    path: '/esqueci-minha-senha',
    component: () => import('./views/public/EsqueciMinhaSenha.vue'),
    beforeEnter: redirectNotLogged,
  },
  {
    path: '/cadastrar',
    component: () => import('./views/public/Cadastrar.vue'),
    beforeEnter: redirectNotLogged,
  },
  {
    path: '/cadastrar-cliente',
    component: () => import('./views/public/CadastrarCliente.vue'),
    beforeEnter: redirectNotLogged,
  },
  {
    path: '/cadastrar-empresa',
    component: () => import('./views/public/CadastrarEmpresa.vue'),
    beforeEnter: redirectNotLogged,
  },
  ...generateRoutesFromSidemenu(menuModule.state.categories),
  {
    path: '*',
    redirect: '/intranet',
  },
];

// Gera a lista de menus para cada categoria
function generateRoutesFromSidemenu(categories = [], routes = []) {
  for (let c = 0; c < categories.length; c++) {
    generateItemsRoutes(categories[c].items, routes);
  }
  return routes;
}
// Gera os itens de menu e submenu
function generateItemsRoutes(menu = [], routes = []) {
  for (let i = 0, l = menu.length; i < l; i++) {
    let item = menu[i];

    // Se o item possui path, o adiciona nas routes
    if (item.path) {
      routes.push(item);
    }

    // Se o item possui children, chama essa função para os children
    if (item.children) {
      generateItemsRoutes(item.children, routes);
    }
  }
  return routes;
}

const router = new VueRouter({
  routes,
  history: false,
  linkActiveClass: 'is-active',
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  },
});

export default router;
