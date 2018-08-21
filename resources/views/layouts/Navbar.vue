<template>
	<nav class="navbar is-white is-fixed-top has-shadow" role="navigation" aria-label="main navigation"
		:class="{ slideInDown: show, slideOutDown: !show }">
		<div class="navbar-brand">
			<!-- This "nav-burger" hamburger menu is only visible on mobile -->
			<!-- You need JavaScript to toggle the "is-active" class on "nav-menu" -->
			<div class="navbar-burger burger is-pulled-left is-marginless" 
				data-target="navMenu" :class="{'is-active': isMobileMenuActive}"
				@click="toggleMobileMenu">
				<span></span>
				<span></span>
				<span></span>
			</div>
			<router-link to="/" class="navbar-item" exact>
				<img src="../../../static/assets/images/logo.png" alt="GTS Soluções">
			</router-link>
		</div>
		<!-- This "nav-menu" is shown on mobile -->
		<div id="navMenu" class="navbar-menu" :class="{'is-active': isMobileMenuActive}">
			<!-- MENUS PÚBLICOS -->
			<div v-if="!isLoggedIn" class="navbar-end">
				<router-link to="/" class="navbar-item is-tab" v-on:click.native="closeMobileMenu" exact>
					Home
				</router-link>
				<router-link to="/cadastrar" class="navbar-item is-tab" v-on:click.native="closeMobileMenu">
					Cadastrar
				</router-link>
				<router-link to="/login" class="navbar-item is-tab" v-on:click.native="closeMobileMenu">
					Entrar
				</router-link>
				<div class="navbar-item">
					<span style="width:2rem"></span>
				</div>
			</div>
			<!-- MENUS INTRANET -->
			<div v-else-if="isMobileMenuActive" class="navbar-end">
				<!-- CABEÇALHO -->
				<div class="navbar-item" style="padding: 1em;">
					<h2 class="subtitle">
						<span v-html="'Olá, '"></span><span>{{ dadosUsuario.nome | firstName }}</span>
					</h2>
					<div class="field">
						<div class="control is-clearfix">
							<a @click="logout" class="button is-outlined is-pulled-right is-medium" :disabled="isLoading">
								<b-icon icon="arrow-left"></b-icon>
								<span v-show="!isLoading">Sair</span>
								<span v-show="isLoading">Saindo</span>
							</a>
						</div>
					</div>
				</div>
				<!-- LISTA DE MENUS -->
				<div v-for="(category, index1) in menuitems" v-bind:key="index1" 
					class="navbar-dropdown is-boxed">
					<div class="navbar-item is-subitem" v-html="category.title" v-if="checkItemMeta(category.meta)"></div>
					<ul class="navbar-dropbdown" v-if="checkItemMeta(category.meta)">
						<li v-for="(item, index2) in category.items" v-bind:key="index2">
							<div v-if="checkItemMeta(item.meta)">
								<!-- MENU SEM CHILDREN -->
								<router-link v-if="item.path" class="navbar-item"
									:to="item.name ? { name: item.name, params: item.params } : item.path" 
									v-html="item.title" 
									@click="closeSubmenu(true)"></router-link>
								<!-- MENU COM CHILDREN -->
								<a v-else @click="toggleSubmenu($event)" class="navbar-item menu-list"
									:id="`navbar-submenu-${index1}-${index2}`">
									{{ item.title }}</a>
								<!-- CHILDREN -->
								<expanding v-if="item.children">
									<ul v-show="submenuActive == `navbar-submenu-${index1}-${index2}`">
										<li v-for="(child, index3) in item.children" v-bind:key="index3">
											<router-link v-if="checkItemMeta(child.meta)"
												class="navbar-item"
												v-on:click.native="closeMobileMenu"
												:to="child.name ? { name: child.name, params: child.params } : child.path" 
												v-html="child.title"></router-link>
										</li>
									</ul>
								</expanding>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</nav>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Expanding from 'vue-bulma-expanding';
import GlobalFilters from '../../components/GlobalFilters.js';

export default {
	name: 'navbar',
	mixins: [ GlobalFilters ],
	components: { Expanding },
	props: {
		show: Boolean
	},
	data() {
		return {
			isMobileMenuActive: false,
			submenuActive: null
		}
	},
	computed: {
		...mapGetters([
			'dadosUsuario',
			'isLoggedIn',
			'isLoading',
			'menuitems',
			'sidebar'
		])
	},
	methods: {
		...mapActions([
			'toggleSidebar'
		]),
		toggleMobileMenu() {
			this.isMobileMenuActive = !this.isMobileMenuActive;
			//this.toggleSidebar(!this.sidebar.opened);
		},
		closeMobileMenu() {
			this.isMobileMenuActive = false;
		},

		toggleSubmenu(event) {
			if (this.submenuActive != event.target.id) {
				this.submenuActive = event.target.id;
			} else {
				this.submenuActive = null;
			}
		},

		closeSubmenu(closeMobileMenu = false) {
			this.submenuActive = null;
			if (closeMobileMenu) {
				this.closeMobileMenu();
			}
		},

		// Check se as Roles do usuário possui alguma role peritida para mostrar o item do menu
		checkShowTo(showTo) {
			let vm = this;
			return _.some(showTo, function(role) { return _.includes(vm.dadosUsuario.roles, role) } );
		},

		// Checa se o item do menu é permitido ser exibido
		checkItemMeta(meta) {
			return (meta && this.checkShowTo(meta.showTo)) != (meta == undefined || meta.showTo == undefined);
		},

		logout() {
			this.$store.dispatch('logout');
		}
	}
}
</script>


<style lang="scss" scoped>
@import '../../styles/main.sass';

.navbar .navbar-dropdown .is-subitem {
    text-transform: uppercase;
    color: #7a7a7a;
}

li a.navbar-item.menu-list + ul {
	margin: 0 10px 0 30px;
}

ul.collapse.in {
	height: auto !important;
}

li ul {
	border-left: 1px solid #bfbfbf;
	padding: 0;

	li a {
		padding-left: 16px;
	}
}

.flip-list-move {
	transition: transform .3s;
}

</style>