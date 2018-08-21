<template>
	<div class="columns is-centered">
		<div class="column">
			<h1 class="title is-clearfix">Cadastro de matriz/filial</h1>
			<b-message :closable="false">
				<form name="cadastroMatrizFilialForm" method="post" action="#" autocomplete="off"
					@keydown="form.errors.clear($event.target.name)"
					@change="form.errors.clear($event.target.name)">
					<div class="columns">
						<div class="column is-half-desktop">
							<h2 class="subtitle"><span v-html="'Dados da matriz/filial'"></span></h2>
							<input-text name="nomeFantasia" v-model="form.nomeFantasia" 
								placeholder="Nome fantasia" size="is-medium"
								:has-error="form.errors.has('nomeFantasia')"
								:error="form.errors.get('nomeFantasia')"></input-text>
							<input-text name="razaoSocial" v-model="form.razaoSocial" 
								placeholder="Razão social" size="is-medium"
								:has-error="form.errors.has('razaoSocial')"
								:error="form.errors.get('razaoSocial')"></input-text>
							<input-text name="cnpj" v-model="form.cnpj" 
								type="tel"
								placeholder="CNPJ" size="is-medium"
								:mask="'##.###.###/####-##'"
								:has-error="form.errors.has('cnpj')"
								:error="form.errors.get('cnpj')"></input-text>
							<input-text name="inscricaoMunicipal" v-model="form.inscricaoMunicipal" 
								placeholder="Inscrição municipal" size="is-medium"
								:has-error="form.errors.has('inscricaoMunicipal')"
								:error="form.errors.get('inscricaoMunicipal')"></input-text>
							<input-text name="email" v-model="form.email" 
								placeholder="E-mail principal" size="is-medium"
								:has-error="form.errors.has('email')"
								:error="form.errors.get('email')"></input-text>
							<input-text name="website" v-model="form.website" 
								placeholder="Website" size="is-medium"
								:has-error="form.errors.has('website')"
								:error="form.errors.get('website')"></input-text>
							<input-text name="responsavel" v-model="form.responsavel" 
								placeholder="Responsável" size="is-medium"
								:has-error="form.errors.has('responsavel')"
								:error="form.errors.get('responsavel')"></input-text>
						</div>
						<div class="column is-half-desktop">
							<!-- Contatos -->
							<h2 class="subtitle">Contatos</h2>
							<input-contato name="contato" v-on:add="form.addContato($event)"
								size="is-medium"
								:has-error="form.errors.has('contatos')"
								:error="form.errors.get('contatos')"></input-contato>
							<div></div>
							<lista-contato v-model="form.contatos"></lista-contato>
						</div>
					</div>
					<!-- Só mostra o form-usuário se for um registro diferente do usuário logado -->
					<!-- FormUsuario -->
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
				nomeFantasia: '',
				razaoSocial: '',
				cnpj: '',
				inscricaoMunicipal: '',
				email: '',
				website: '',
				responsavel: '',
				endereco: {},
				contatos: [],
				usuario:null
			}),
			showFormUsuario: false
		}
	},

	methods: {
		buscarEnderecoPosicao() {
			this.form.errors.clear('posicao', 'endereco');

			let position = null;

			// busca a posição para o endereço
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
				// Nada é feito
			});
		},

		atualizaEnderecoPosicao(posicao) {
			this.form.errors.clear('posicao', 'endereco');
			this.form.endereco.posicao = { latitude: posicao.lat, longitude: posicao.lng };
		},

		onSubmit() {
            this.form.post('/matrizfilial/salvar')
			.then(response => {
				//console.log(response);
				if (response.message) {
					this.$toast.open({
						message: response.message ? response.message :  'Cadastro salvo com sucesso.',
						type: 'is-success',
						position: 'is-top',
						duration: 5000
					});
					this.$router.push('/lista-matriz-filial');
				}
			})
            .catch(error => {
				//console.log(error);
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
				for (let field in _.omit(this.form.data(), ['contatos','endereco'])) {
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
			Vue.axios.get('/matrizfilial/findId/' + id)
			.then(response => {
				next(vm => {
					vm.showFormUsuario = false;
					vm.setFormData(response, null);
				});
			})
			.catch(error => {
				next(vm => {
					vm.showFormUsuario = false;
					vm.setFormData(null, error); 
				});
			});
		} else {
			next(vm => {
				vm.showFormUsuario = true;
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
			this.axios.get('/matrizfilial/findId/' + id)
			.then(response => {
				this.showFormUsuario = false;
				this.setFormData(response, null);
				next();
			})
			.catch(error => {
				this.showFormUsuario = false;
				this.setFormData(null, error);
				next();
			});
		} else {
			this.showFormUsuario = true;
			next();
		}
	}
}
</script>