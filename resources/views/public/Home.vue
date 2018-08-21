<template>
	<div class="hero">
		<h1 class="title">Home page</h1>
		<b-message>
			<span v-html="'Esta &eacute; a Home page'"></span>
		</b-message>
	</div>
</template>

<script>
export default {
	name: 'home',
	created() {
		this.$router.push('/login');
	}
}
</script>