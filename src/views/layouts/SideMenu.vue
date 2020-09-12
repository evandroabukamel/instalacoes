<template>
  <aside
    class="menu app-sidebar animated"
    :class="{ slideInLeft: show, slideOutLeft: !show }"
  >
    <div class="app-sidebar-inner">
      <!-- CABEÇALHO -->
      <div class="header is-marginless">
        <h2 class="subtitle">
          <span v-html="'Olá, '"></span
          ><span>{{ dadosUsuario.nome | firstName }}</span>
        </h2>
        <div class="field">
          <div class="control is-clearfix">
            <a
              @click="logout"
              class="button is-outlined is-pulled-right is-medium"
              :disabled="isLoading"
            >
              <b-icon icon="arrow-left"></b-icon>
              <span v-show="!isLoading">Sair</span>
              <span v-show="isLoading">Saindo</span>
            </a>
          </div>
        </div>
      </div>
      <!-- LISTA DE MENUS -->
      <div
        v-for="(category, index1) in menuitems"
        v-bind:key="index1"
        class="is-marginless is-paddingless"
      >
        <div
          class="menu-label"
          v-html="category.title"
          v-if="checkItemMeta(category.meta)"
        ></div>
        <ul class="menu-list" v-if="checkItemMeta(category.meta)">
          <li v-for="(item, index2) in category.items" v-bind:key="index2">
            <div v-if="checkItemMeta(item.meta)">
              <!-- MENU SEM CHILDREN -->
              <router-link
                v-if="item.path"
                :to="
                  item.name
                    ? { name: item.name, params: item.params }
                    : item.path
                "
                v-html="item.title"
                @click="closeSubmenu"
              ></router-link>
              <!-- MENU COM CHILDREN -->
              <a
                v-else
                @click="toggleSubmenu($event)"
                :id="`submenu-${index1}-${index2}`"
              >
                {{ item.title }}</a
              >
              <!-- CHILDREN -->
              <expanding v-if="item.children">
                <ul v-show="submenuActive == `submenu-${index1}-${index2}`">
                  <li
                    v-for="(child, index3) in item.children"
                    v-bind:key="index3"
                  >
                    <router-link
                      :to="
                        child.name
                          ? { name: child.name, params: child.params }
                          : child.path
                      "
                      v-if="checkItemMeta(child.meta)"
                      v-html="child.title"
                    ></router-link>
                  </li>
                </ul>
              </expanding>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </aside>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Expanding from 'vue-bulma-expanding';
import GlobalFilters from '../../components/GlobalFilters.js';

export default {
  name: 'side-menu',
  mixins: [GlobalFilters],
  components: { Expanding },
  data() {
    return {
      isReady: false,
      submenuActive: null,
    };
  },
  props: {
    show: Boolean,
  },
  computed: {
    ...mapGetters([
      'dadosUsuario',
      'isLoggedIn',
      'isLoading',
      'menuitems',
      'sidebar',
    ]),
  },
  methods: {
    toggleSubmenu(event) {
      if (this.submenuActive != event.target.id) {
        this.submenuActive = event.target.id;
      } else {
        this.submenuActive = null;
      }
    },

    closeSubmenu() {
      this.submenuActive = null;
    },

    // Check se as Roles do usuário possui alguma role peritida para mostrar o item do menu
    checkShowTo(showTo) {
      let vm = this;
      return _.some(showTo, function (role) {
        return _.includes(vm.dadosUsuario.roles, role);
      });
    },

    // Checa se o item do menu é permitido ser exibido
    checkItemMeta(meta) {
      return (
        (meta && this.checkShowTo(meta.showTo)) !=
        (meta == undefined || meta.showTo == undefined)
      );
    },

    logout() {
      this.$store.dispatch('logout');
    },
  },
  mounted() {
    let route = this.$route;
    if (route.title) {
      this.isReady = true;
    }
  },
};
</script>

<style lang="scss">
@import '../../styles/main.sass';

.flip-list-move {
  transition: transform 0.3s;
}

.app-sidebar {
  position: fixed;
  top: 54px;
  left: 0;
  bottom: 0;
  width: 240px;
  min-width: 45px;
  max-height: 100vh;
  height: calc(100% - 54px);
  z-index: 100 - 1;
  background-color: #f5f5f5;
  box-shadow: 0 2px 3px rgba(17, 17, 17, 0.1), 0 0 0 1px rgba(17, 17, 17, 0.1);
  overflow-y: auto;
  overflow-x: hidden;

  .app-sidebar-inner {
    padding: 20px 0 50px 0;
  }

  @include mobile() {
    transform: translate3d(-240px, 0, 0);
  }

  .header {
    padding: 0 1em;
  }

  .icon {
    vertical-align: baseline;

    &.is-angle {
      position: absolute;
      right: 10px;
      transition: transform 0.377s ease;
    }
  }

  .menu-label {
    padding-left: 20px;
    padding-top: 1em;
  }

  .menu-list {
    li a {
      &[aria-expanded='true'] {
        .is-angle {
          transform: rotate(180deg);
        }
      }
      padding-left: 30px;

      &:hover {
        background-color: lighten(desaturate($primary, 40%), 40%);
      }
    }

    li a + ul {
      margin: 0 10px 0 30px;
    }

    li ul {
      border-left: 1px solid #bfbfbf;
      padding: 0;

      li a {
        padding-left: 16px;
      }
    }
  }
}
</style>
