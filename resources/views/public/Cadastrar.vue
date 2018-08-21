<template>
	<div class="section" id="cadastrar">
		<div class="columns is-centered">
			<div class="container column is-one-third-desktop is-clearfix">
				<h1 class="title is-clearfix"><strong>Sou cliente</strong></h1>
				<ul class="is-clearfix">
					<li v-html="'&mdash; Solicite instala&ccedil;&atilde;o e manuten&ccedil;&atilde;o de rastreadores automotivos;'"></li>
					<li v-html="'&mdash; Voc&ecirc; pode ter o seu estoque de equipamentos ou pode usar o nosso estoque;'"></li>
					<li v-html="'&mdash; N&oacute;s escolheremos quem ir&aacute; atender sua solicita&ccedil;&atilde;o;'"></li>
					<li v-html="'&mdash; Aconpanhe os andamentos da suas solicita&ccedil;&otilde;es;'"></li>
					<li v-html="'&mdash; V&aacute;rias formas de pagamento.'"></li>
				</ul>
				<div class="section field is-clearfix">
					<p class="control">
						<router-link to="/cadastrar-cliente" class="button is-medium is-success">
							<span>Cadastre-se cliente</span>
						</router-link>
					</p>
				</div>
			</div>
			<div class="is-hidden-mobile" style="width:0; margin:0 1em; border:#c0c0c0 solid 1px;"></div>
			<div class="is-hidden-desktop" style="height:0; margin:1em 0; border:#c0c0c0 solid 1px;"></div>
			<div class="container column is-one-third-desktop is-clearfix">
				<h1 class="title is-clearfix"><strong>Sou especializado</strong></h1>
				<ul class="is-clearfix">
					<li v-html="'&mdash; Voc&ecirc; pode ser uma empresa ou um profissional liberal;'"></li>
					<li v-html="'&mdash; Receba solicita&ccedil;&otilde;es de instala&ccedil;&atilde;o e manuten&ccedil;&atilde;o de rastreadores automotivos;'"></li>
					<li v-html="'&mdash; Mantenha o andamento da solicita&ccedil;&otilde;es atualizado;'"></li>
					<li v-html="'&mdash; Receba o pagamento mensalmente direto na sua conta.'"></li>
				</ul>
				<div class="section field is-clearfix">
					<p class="control">
						<router-link to="/cadastrar-empresa" class="button is-medium is-primary">
							<span>Cadastre-se especializado</span>
						</router-link>
					</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'cadastrar',
	data() {
		return {}
	},
}
</script>

<style>
#cadastrar ul li {
	line-height: 2;
}
</style>