<template>
	<div class="columns is-centered">
		<div class="column">
			<h1 class="title is-clearfix">Cadastro de estoque</h1>
			<b-message :closable="false">
				<form name="cadastroEstoqueForm" method="post" action="#"
					@submit.prevent="onSubmit"
					@keydown="form.errors.clear($event.target.name)"
					@change="form.errors.clear($event.target.name)">
					<div class="columns">
						<div class="column is-half-desktop">
							<select-ajax name="classe" v-model="form.classe" 
								size="is-medium"
								placeholder="Tipo de item"
								control-type="is-primary"
								:has-error="form.errors.has('classe')"
								:error="form.errors.get('classe')"
								v-on:errorSelectAjax="form.setSelectError('classe', $event)">
								<option value="" disabled>Tipo de Item</option>
								<option value="chip">Chip</option>
								<option value="equipamento">Equipamento</option>
							</select-ajax>
							<input-autocomplete
								v-if="isUsuarioMatrizFilial"
								ref="autocompleteCliente"
								label="Cliente"
								placeholder="Buscar cliente"
								name="cliente"
								size="is-medium"
								:url="urlAutocompleteCliente"
								param=""
								:init-value="form.cliente ? form.cliente.nome : null"
								field="nome"
								subtitle="cpf"
								field-label="Nome"
								subtitle-label="CPF/CNPJ"
								:minlength="2"
								@selected="setCliente">
							</input-autocomplete>
						</div>
						<div class="column is-half-desktop">
							<select-ajax name="idSituacao" v-model="form.idSituacao" 
								size="is-medium"
								v-if="form.id > 0"
								placeholder="Situação"
								api-route="/estoque/listarSituacoes"
								control-type="is-primary"
								:has-error="form.errors.has('idSituacao')"
								:error="form.errors.get('idSituacao')"
								v-on:errorSelectAjax="form.setSelectError('idSituacao', $event)">
							</select-ajax>
							<input-autocomplete
								v-if="isUsuarioMatrizFilial"
								ref="autocompleteTecnico"
								label="Técnico"
								placeholder="Buscar técnico"
								name="tecnico"
								size="is-medium"
								:url="urlAutocompleteTecnico"
								param=""
								:init-value="form.tecnico ? form.tecnico.nome : null"
								field="nome"
								subtitle="cpf"
								field-label="Nome"
								subtitle-label="CPF"
								:minlength="2"
								@selected="setTecnico">
							</input-autocomplete>
						</div>
					</div>
					<div class="columns" v-show="Boolean(form.classe) && !Boolean(form.cliente)">
						<div class="column is-half-desktop">
							<input-text name="valorCusto" v-model="form.valorCusto" 
								size="is-medium"
								placeholder="Valor de custo"
								:is-money="true"
								:has-error="form.errors.has('valorCusto')"
								:error="form.errors.get('valorCusto')"></input-text>
						</div>
						<div class="column is-half-desktop">
							<input-text name="valorVenda" v-model="form.valorVenda" 
								size="is-medium"
								placeholder="Valor de venda"
								:is-money="true"
								:has-error="form.errors.has('valorVenda')"
								:error="form.errors.get('valorVenda')"></input-text>
						</div>
					</div>
					<div class="columns" v-if="form.classe == 'chip'">
						<div class="column is-half-desktop">
							<input-text name="imei" v-model="form.imei" 
								type="tel"
								size="is-medium"
								placeholder="IMEI"
								:mask="'######-##-######-#'"
								:masked="false"
								:has-error="form.errors.has('imei')"
								:error="form.errors.get('imei')"></input-text>
							<input-text name="iccid" v-model="form.iccid" 
								type="tel"
								size="is-medium"
								placeholder="ICCID"
								:mask="'#### #### #### #### ## #'"
								:masked="false"
								:has-error="form.errors.has('iccid')"
								:error="form.errors.get('iccid')"></input-text>
						</div>
						<div class="column is-half-desktop">
							<input-text name="telefone" v-model="form.telefone" 
								type="tel"
								size="is-medium"
								placeholder="Telefone"
								:mask="['# ## ####-####', '# ## #####-####']"
								:masked="false"
								:has-error="form.errors.has('telefone')"
								:error="form.errors.get('telefone')"></input-text>
							<select-ajax name="operadora" v-model="form.operadora.id" 
								size="is-medium"
								ref="selectOperadora"
								placeholder="Operadora"
								api-route="/operadora/listar"
								control-type="is-primary"
								:has-error="form.errors.has('operadora')"
								:error="form.errors.get('operadora')"
								v-on:errorSelectAjax="form.setSelectError('operadora', $event)">
							</select-ajax>
						</div>
					</div>
					<div class="columns" v-if="form.classe == 'equipamento'">
						<div class="column is-half-desktop">
							<input-text name="numero" v-model="form.numero" 
								type="tel"
								size="is-medium"
								placeholder="Número"
								:has-error="form.errors.has('numero')"
								:error="form.errors.get('numero')"></input-text>
							<input-text name="imei" v-model="form.imei" 
								type="tel"
								size="is-medium"
								placeholder="IMEI"
								:mask="'######-##-######-#'"
								:masked="false"
								:has-error="form.errors.has('imei')"
								:error="form.errors.get('imei')"></input-text>
						</div>
						<div class="column is-half-desktop">
							<select-ajax name="marcaEquipamento" v-model="form.marcaEquipamento.id" 
								size="is-medium"
								placeholder="Marca do equipamento"
								api-route="/marcaModeloEquipamento/listarMarca"
								control-type="is-primary"
								:changed="marcaEquipamentoChanged"
								:has-error="form.errors.has('marcaEquipamento')"
								:error="form.errors.get('marcaEquipamento')"
								v-on:errorSelectAjax="form.setSelectError('marcaEquipamento', $event)">
							</select-ajax>
							<select-ajax name="modeloEquipamento" v-model="form.modeloEquipamento.id" 
								size="is-medium"
								placeholder="Modelo do equipamento"
								:api-route="'/marcaModeloEquipamento/listarModelo/'"
								:params="idMarcaEquipamento"
								control-type="is-primary"
								:has-error="form.errors.has('modeloEquipamento')"
								:error="form.errors.get('modeloEquipamento')"
								v-on:errorSelectAjax="form.setSelectError('modeloEquipamento', $event)">
							</select-ajax>
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
import InputAutocomplete from '../../components/InputAutocomplete.vue';
import { mapGetters } from 'vuex';

export default {
	components: { InputAutocomplete },
	data() {
		return {
			form: new Form({
				id: null,
				idSituacao: null,
				classe: '',
				valorCusto: 0,
				valorVenda: 0,
				cliente: null,
				tecnico: null,
				/* chip */
				imei: null,
				iccid: null,
				telefone: null,
				operadora: {id: null, descricao: null},
				/* equipamento */
				numero: null,
				marcaEquipamento: {id: null, descricao: null},
				modeloEquipamento: {id: null, descricao: null}
			})
		}
	},

	computed: {
		...mapGetters([
			'dadosUsuario',
			'isUsuarioMatrizFilial'
		]),

		idMarcaEquipamento() {
			return this.form.marcaEquipamento.id || '';
		},
		urlAutocompleteCliente() {
			return '/cliente/findLike';
		},
		urlAutocompleteTecnico() {
			return '/tecnico/findLike';
		}
	},

	methods: {
		marcaEquipamentoChanged() {
			this.form.modeloEquipamento = {id: null, descricao: null};
		},

		setCliente(obj) {
			// Atribui o id do cliente de um obj recebido
			if (obj && parseInt(obj.id) > 0) {
				this.form.cliente = obj;
			}
		},

		setTecnico(obj) {
			// Atribui o id do técnico de um obj recebido
			if (obj && parseInt(obj.id) > 0) {
				this.form.tecnico = obj;
			}
		},
		
		onSubmit() {
            this.form.post('/estoque/salvar')
			.then(response => {
				if (response.message) {
					this.$toast.open({
						message: response.message ? response.message :  'Cadastro salvo com sucesso.',
						type: 'is-success',
						position: 'is-top',
						duration: 5000
					});
					this.$router.push('/lista-estoque');
				}
			})
            .catch(error => {
				if (error.message) {
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
				for (let field in this.form.data()) {
					this.form[field] = response.data[field];
				}

				if (this.form.operadora == null) this.form.operadora = {id: null, descricao: null};
				if (this.form.marcaEquipamento == null) this.form.marcaEquipamento = {id: null, descricao: null};
				if (this.form.modeloEquipamento == null) this.form.modeloEquipamento = {id: null, descricao: null};	
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
			Vue.axios.get('/estoque/findId/' + id)
			.then(response => {
				next(vm => {
					vm.setFormData(response, null); 
				} );
			})
			.catch(error => {
				next(vm => {
					vm.setFormData(null, error); 
				} );
			});
		} else {
			next(vm => {
				vm.form.reset();
				if (vm.dadosUsuario.classe == 'tbcliente') {
					vm.form.cliente = {
						id: vm.dadosUsuario.idObjeto
					};
				}
			});
		}
	},

	// Quando a route muda e este componente já está renderizado, a lógica é diferente
	beforeRouteUpdate (to, from, next) {
		this.form.reset();
		let id;

		// Obtem o ID vindo nos parâmetros da route
		if (to.params.id) {
			id = to.params.id;
		} else if (typeof(to.meta.id) == 'function') {
			id = to.meta.id();
		}
		
		if (id) {
			this.axios.get('/estoque/findId/' + id)
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
			if (this.dadosUsuario.classe == 'tbcliente') {
				this.form.cliente = {
					id: this.dadosUsuario.idObjeto
				};
			}
		}
	}
}
</script>
