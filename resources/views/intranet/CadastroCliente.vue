<template>
	<div class="columns is-centered">
		<div class="column">
			<h1 class="title is-clearfix">Cadastro de cliente</h1>
			<b-message :closable="false">
				<form name="cadastroClienteForm" method="post" action="#" autocomplete="off"
					@keydown="form.errors.clear($event.target.name)"
					@change="form.errors.clear($event.target.name)">
					<div class="columns">
						<div class="column is-half-desktop">
							<h2 class="subtitle"><span v-html="'Dados do cliente'"></span></h2>
							<input-text name="nome" v-model="form.nome" placeholder="Nome" 
								size="is-medium"
								:has-error="form.errors.has('nome')"
								:error="form.errors.get('nome')"></input-text>
							<input-text name="cpfcnpj" v-model="form.cpfcnpj" 
								type="tel"
								size="is-medium"
								placeholder="CPF / CNPJ"
								:mask="['###.###.###-##', '##.###.###/####-##']"
								:has-error="form.errors.has('cpfcnpj')"
								:error="form.errors.get('cpfcnpj')"></input-text>
							<select-ajax name="idTipoPagamento" v-model="form.idTipoPagamento" 
								size="is-medium"
								placeholder="Tipo de pagamento"
								api-route="/tipoPagamento/listar"
								control-type="is-primary"
								:has-error="form.errors.has('idTipoPagamento')"
								:error="form.errors.get('idTipoPagamento')"
								v-on:errorSelectAjax="form.setSelectError('idTipoPagamento', $event)">
							</select-ajax>
						</div>
						<div class="column is-half-desktop">
							<!-- Contatos -->
							<h2 class="subtitle">Contatos</h2>
							<input-contato name="contato" v-on:add="form.addContato($event)"
								size="is-medium"
								:has-error="form.errors.has('contatos')"
								:error="form.errors.get('contatos')"></input-contato>
							<lista-contato v-model="form.contatos"></lista-contato>
						</div>
					</div>
					<!-- FormUsuario -->
					<!-- Só mostra o form-usuario se for um registro diferente do usuário logado -->
					<form-usuario ref="formUsuario" name="usuario"
						v-if="showFormUsuario"
						size="is-medium"
						v-model="form.usuario"
						@changed="form.errors.clear($event, 'usuario')"
						:has-error="form.errors.has('usuario')"
						:error="form.errors.get('usuario')"></form-usuario>
					<div class="columns">
						<div class="column is-half-desktop">
							<!-- Localização -->
							<h2 class="subtitle"><span v-html="'Localiza&ccedil;&atilde;o'"></span></h2>
							<!-- FormEndereco -->
							<form-endereco ref="formEndereco" name="endereco"
								size="is-medium"
								v-model="form.endereco"
								@changed="form.errors.clear($event, 'endereco')"
								:has-error="form.errors.has('endereco')"
								:error="form.errors.get('endereco')"></form-endereco>
						</div>
						<div class="column is-half-desktop">
							<!-- Mapa -->
							<here-maps ref="hereMap"
								@clickBuscarPosicao="buscarEnderecoPosicao"
								@markerPositioned="atualizaEnderecoPosicao($event)"></here-maps>
							<div></div>
						</div>
					</div>
					<!-- Botões -->
					<div class="field has-addons has-addons-right">
						<div class="control">
							<button type="button" class="button is-primary is-medium"
								:class="{ 'is-loading': form.isLoading }"
								@click="onSubmit"
								@dblclick.prevent>
								Salvar
							</button>
						</div>
					</div>
				</form>
			</b-message>
		</div>
	</div>
</template>

<script>
import InputContato from '../../components/InputContato.vue';
import ListaContato from '../../components/ListaContato.vue';
import Endereco from '../../core/Endereco.js';
import FormEndereco from '../../components/FormEndereco.vue';
import FormUsuario from '../../components/FormUsuario.vue';
import HereMaps from '../../components/HereMaps.vue';

export default {
	components: { InputContato, ListaContato, HereMaps, FormEndereco, FormUsuario },
	data() {
		return {
			form: new Form({
				id: null,
				nome: '',
				cpfcnpj: '',
				idTipoPagamento: null,
				contatos: [],
				endereco: {},
				usuario: null
			}),
			showFormUsuario: this.$route.name == 'cadastro-cliente'
		}
	},
	
	methods: {
		buscarEnderecoPosicao() {
			this.form.errors.clear('posicao', 'endereco');

			let position = null;

			// busca a posição para o endereço
			if (this.form.endereco.toMapString() != '') {
				this.$refs.hereMap.searchPositionForAddress(this.form.endereco.toMapString())
				.then(response => {
					// adiciona o marcador
					this.$refs.hereMap.addUniqueMarker(null, {
						position: {
							lat: response.Latitude,
							lng: response.Longitude
						},
						draggable: true
					})
				})
				.catch(response => {
				});
			}
		},

		atualizaEnderecoPosicao(posicao) {
			this.form.errors.clear('posicao', 'endereco');
			this.form.endereco.posicao = { latitude: posicao.lat, longitude: posicao.lng };
		},

		onSubmit() {
            this.form.post('/cliente/salvar')
			.then(response => {
				if (response.message) {
					this.$toast.open({
						message: response.message ? response.message :  'Cadastro salvo com sucesso.',
						type: 'is-success',
						position: 'is-top',
						duration: 5000
					});
					this.$router.push('/lista-cliente');
				}
			})
            .catch(error => {
				if (error.message){
					this.$toast.open({
						message: error.message ? error.message :  'Erro ao salvar cadastro.',
						type: 'is-warning',
						position: 'is-top',
						duration: 7000
					});
				}
			});
		},

		setFormData(response, error) {
			if (error) {
				if (error.response.data.message){
					this.$toast.open({
						message: error.response.data.message ? error.response.data.message :  'Erro ao consultar cadastro.',
						type: 'is-warning',
						position: 'is-top',
						duration: 5000
					});
				}
			}
			else {
				this.form.reset();
				for (let field in _.omit(this.form.data(), ['contatos','endereco', 'usuario'])) {
					this.form[field] = response.data[field];
				}
				// Formata os objetos contato
				this.form.contatos = this.form.loadContatos(response.data['contatos']);
				// Formata os objeto endereco
				this.form.endereco = this.form.loadEndereco(response.data['endereco']);
				// Marca o ponto do endereço no mapa
				if (response.data.endereco && response.data.endereco.posicao) {
					// adiciona o marcador
					this.$refs.hereMap.addUniqueMarker(null, {
						position: {
							lat: response.data.endereco.posicao.latitude,
							lng: response.data.endereco.posicao.longitude
						},
						draggable: true
					})
				}
				// Formata os objeto usuario
				if (this.showFormUsuario) {
					this.form.usuario = this.form.loadUsuario(response.data['usuario']);
					this.$refs.formUsuario.showPasswordField = false;
				}
			}
		}
	},
	
	beforeRouteEnter (to, from, next) {
		let id;
		// Obtem o ID vindo nos parâmetros da route
		if (to.params.id) {
			id = to.params.id;
		} else if (typeof(to.meta.id) == 'function') {
			id = to.meta.id();
		}
		
		if (id) {
			Vue.axios.get('/cliente/findId/' + id)
			.then(response => {
				next(vm => { vm.setFormData(response, null) } );
			})
			.catch(error => {
				next(vm => { vm.setFormData(null, error) } );
			});
		} else {
			next(vm => {
				vm.form.reset(); 
				vm.$refs.hereMap.clearMarkers(); 
			});
		}
	},

	// Quando a route muda e este componente já está renderizado, a lógica é diferente
	beforeRouteUpdate (to, from, next) {
		this.form.reset();
		this.$refs.hereMap.clearMarkers();
		let id;
		// Obtem o ID vindo nos parâmetros da route
		if (to.params.id) {
			id = to.params.id;
		} else if (typeof(to.meta.id) == 'function') {
			id = to.meta.id();
		}
		
		if (id) {
			this.axios.get('/cliente/findId/' + id)
			.then(response => {
				this.setFormData(response, null);
				next();
			})
			.catch(error => {
				this.setFormData(null, error);
				next();
			});
		} else {
			next();
		}
	}
}
</script>