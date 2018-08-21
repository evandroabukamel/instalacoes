<template>
	<div>
		<nprogress-container></nprogress-container>
		<navbar :show="true"></navbar>
		<side-menu v-if="isLoggedIn" :show="sidebar.opened && !sidebar.hidden && !device.isMobile"></side-menu>
		<section :class="[ 'app-main', {'side-menu-margin': isLoggedIn} ]">
			<div class="container is-fluid is-marginless app-content">
				<router-view></router-view>
			</div>
		</section>
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import NprogressContainer from 'vue-nprogress/src/NprogressContainer.vue';
import Navbar from './views/layouts/Navbar.vue';
import SideMenu from './views/layouts/SideMenu.vue';

export default {
	components: { Navbar, SideMenu, NprogressContainer },
	computed: {
		...mapGetters([
			'isLoggedIn',
			'sidebar',
			'device'
		])
	},

	methods: {
		...mapActions([
			'toggleDevice',
			'toggleSidebar'
		])
	},

	beforeMount () {
		const { body } = document;
		const WIDTH = 768;
		const RATIO = 3;
		const handler = () => {
			if (!document.hidden) {
				let rect = body.getBoundingClientRect();
				let isMobile = rect.width - RATIO < WIDTH;
				this.toggleDevice(isMobile ? 'mobile' : 'other');
				this.toggleSidebar(!isMobile);
			}
		};
		document.addEventListener('visibilitychange', handler);
		window.addEventListener('DOMContentLoaded', handler);
		window.addEventListener('resize', handler);
	}
}
</script>

<style lang="scss">
@import './styles/main.sass';
@import './styles/print.scss';
@import '~animate.css/animate.min.css';

.animated {
	animation-duration: .377s;
}

.app-main {
	transform: translate3d(0, 0, 0);
}

.side-menu-margin {
	margin-left: 240px;
	
	@include mobile() {
		margin-left: 0;
	}
}

.app-content {
	padding: 20px;
}

.nprogress-container {
	position: fixed !important;
	top: 0;
	left: 0;
	width: 100%;
	height: 3rem;
	z-index: 120;
	pointer-events: none;
}

#nprogress {
	$color: $primary;
	.bar {
		background: $color !important;
	}
	.peg {
		box-shadow: 0 0 10px $color, 0 0 5px $color !important;
	}
	.spinner-icon {
		border-top-color: $color !important;
		border-left-color: $color !important;
	}
}
</style>
