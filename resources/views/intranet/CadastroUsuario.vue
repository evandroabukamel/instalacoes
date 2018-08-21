<template>
	<div class="columns is-centered">
		<div class="column">
			<h1 class="title is-clearfix" 
				v-html="$route.path == '/meu-usuario' ? 'Meu usu&aacute;rio' : 'Cadastro de usu&aacute;rio'"></h1>
			<b-message :closable="false">
				<form name="dadosAcessoForm" method="post" action="#" autocomplete="off"
					@keydown="form.errors.clear($event.target.name)"
					@change="form.errors.clear($event.target.name)">
					<div class="columns">
						<div class="column is-half-desktop">
							<h2 class="subtitle"><span v-html="'Dados do usu&aacute;rio'"></span></h2>
							<input-autocomplete 
								v-if="showAutocompleteMatrizFilial && $route.name == 'cadastro-usuario'"
								ref="autocompleteMatrizFilial"
								name="idMatrizFilial"
								size="is-medium"
								:init-value="form.nomeObjeto || null"
								:url="urlAutocompleteMatrizFilial"
								param=""
								field="nomeFantasia"
								subtitle="cnpj"
								field-label="Nome"
								subtitle-label="CNPJ"
								placeholder="Buscar matriz/filial"
								:min="3"
								@selected="setMatrizFilial"
								:error="form.errors.get('matrizFilial')"></input-autocomplete>
							<input-text type="text" name="nome" size="is-medium"
								v-model="form.nome"
								placeholder="Nome"
								:error="form.errors.get('nome')"
								:has-error="form.errors.has('nome')"></input-text>
							<input-text type="text" name="usuario" size="is-medium"
								v-model="form.usuario"
								placeholder="Usuário"
								:error="form.errors.get('usuario')"
								:has-error="form.errors.has('usuario')"></input-text>
							<b-field v-if="!form.id">
								<input-text type="password" name="senha" size="is-medium"
									v-model="form.senha"
									placeholder="Senha"
									:password-reveal="true"
									:error="form.errors.get('senha')"
									:has-error="form.errors.has('senha')"></input-text>
							</b-field>
							<input-text type="email" name="email" size="is-medium"
								v-model="form.email"
								placeholder="E-mail principal"
								:error="form.errors.get('email')"
								:has-error="form.errors.has('email')"></input-text>
							<input-text type="tel" name="telefone" size="is-medium"
								v-model="form.telefone"
								:mask="['(##) ####-####', '(##) #####-####']"
								:masked="false"
								placeholder="Celular principal"
								:error="form.errors.get('telefone')"
								:has-error="form.errors.has('telefone')"></input-text>
							<select-ajax name="idSituacao" v-model="form.idSituacao" size="is-medium"
								v-if="form.id > 0 && showSelectSituacao"
								placeholder="Situação"
								api-route="/usuario/listarSituacoes"
								control-type="is-primary"
								:has-error="form.errors.has('idSituacao')"
								:error="form.errors.get('idSituacao')"
								v-on:errorSelectAjax="form.setSelectError('idSituacao', $event)">
							</select-ajax>
							<div class="field" v-if="form.id > 0 && !showSelectSituacao">
								<label class="label" v-html="'Situa&ccedil;&atilde;o'"></label>
								<h2 class="subtitle">{{ form.situacaoDescricao }}</h2>
							</div>
						</div>
						<div class="column is-half-desktop">
							<div class="field">
								<h2 class="subtitle"><span>Dias de acesso</span></h2>
								<b-table :bordered="true" :mobile-cards="true"
									:data="diasSemana || []">
									<template slot-scope="props">
										<b-table-column
											v-for="(dia, index) in form.diasAcesso"
											v-bind:key="index"
											:label="props.row[index].abreviacao" 
											:custom-key="props.row[index].value" centered>
											<b-field v-if="hideLowerPermissions"
												position="is-centered">
												<b-checkbox type="is-primary" name="diasAcesso[]"
													v-model="form.diasAcesso[props.row[index].value]"></b-checkbox>
											</b-field>
											<span v-else class="icon">
												<b-icon icon="checkbox-marked-outline" v-if="form.diasAcesso[props.row[index].value]"></b-icon>
												<b-icon icon="checkbox-blank-outline" v-else></b-icon>
											</span>
										</b-table-column>
									</template>
								</b-table>
							</div>
							<div class="field">
								<h2 class="subtitle"><span v-html="'Hor&aacute;rios de acesso'"></span></h2>
								<b-field grouped>
									<date-time-picker placeholder="Horário inicial"
										name="horarioInicial"
										v-if="hideLowerPermissions"
										v-model="form.horarioInicial"
										:config="horaConfig"
										size="is-medium"
										expanded
										:error="form.errors.get('horarioInicial')"
										:has-error="form.errors.has('horarioInicial')">
									</date-time-picker>
									<b-field v-else="hideLowerPermissions" expanded
										label="Horário inicial">
										<span>{{ form.horarioInicial }}</span>
									</b-field>
									<date-time-picker placeholder="Horário final"
										name="horarioFinal"
										v-if="hideLowerPermissions"
										v-model="form.horarioFinal"
										:config="horaConfig"
										size="is-medium"
										expanded
										:error="form.errors.get('horarioFinal')"
										:has-error="form.errors.has('horarioFinal')">
									</date-time-picker>
									<b-field v-else="hideLowerPermissions" expanded
										label="Horário final">
										<span>{{ form.horarioFinal }}</span>
									</b-field>
								</b-field>
								<span class="help is-danger" v-if="form.errors.has('horario')" 
									v-text="form.errors.get('horario')"></span>
							</div>
							<div class="content"><!-- SPACE --></div>
							<div class="field" v-if="showAutocompleteMatrizFilial">
								<!-- Contatos -->
								<h2 class="subtitle">Contatos</h2>
								<input-contato name="contato" 
									size="is-medium"
									v-on:add="form.addContato($event)"></input-contato>
								<lista-contato v-model="form.contatos"></lista-contato>
							</div>
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
import DateTimePicker from '../../components/DateTimePicker.vue';
import InputContato from '../../components/InputContato.vue';
import ListaContato from '../../components/ListaContato.vue';
import InputAutocomplete from '../../components/InputAutocomplete.vue';
import { mapGetters } from 'vuex';
import DiasSemana from  '../../core/DiasSemana.js';

export default {
	components: { DateTimePicker, InputAutocomplete, InputContato, ListaContato },
	data() {
		return {
			form: new Form({
				id: null,
				idSituacao: null,
				situacaoDescricao: null,
				classe: null,
				idObjeto: null,
				nomeObjeto: null,
				nome: '',
				usuario: '',
				senha: '',
				email: '',
				telefone: '',
				diasAcesso: [ true, true, true, true, true, true, true ],
				horarioInicial: '00:00:00',
				horarioFinal: '23:59:59',
				contatos: []
			}),
			diasSemana: DiasSemana,
			showAutocompleteMatrizFilial: true,
			showSelectSituacao: true
		}
	},

	computed: {
		...mapGetters([
			'dadosUsuario'
		]),
		horaConfig() {
			return {
				wrap: true,
				dateFormat: 'H:i:S', 
				altInput: true,
				altFormat: 'H:i',
				noCalendar: true, 
				enableTime: true, 
				time_24hr: true
			}
		},
		hideLowerPermissions() {
			return !_.includes(this.dadosUsuario.roles, 'ROLE_TECNICO');
		},

		urlAutocompleteMatrizFilial() {
			return '/matrizfilial/findLike';
		}
	},

	methods: {
		setMatrizFilial(obj) {
			// Atribui o id da empresa de um obj recebido
			if (obj && parseInt(obj.id) > 0 && this.form.classe == 'tbmatrizfilial') {
				this.form.idObjeto = obj.id;
				this.form.nomeObjeto = obj.nomeFantasia;

				// Coloca o nome da empresa no campo de autocomplete caso ele esteja vazio
				if (this.form.classe == 'tbmatrizfilial' && this.$route.name == 'cadastro-usuario') {
					this.showAutocompleteMatrizFilial = true;
				}
			}
		},

		onSubmit() {
            this.form.post('/usuario/salvar')
			.then(response => {
				if (response.message) {
					this.$toast.open({
						message: response.message ? response.message :  'Cadastro salvo com sucesso.',
						type: 'is-success',
						position: 'is-top',
						duration: 5000
					});
					if (this.$route.path == '/meu-usuario') {
						this.$router.push('/intranet');
					} else {
						this.$router.push('/lista-usuario');
					}
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
				if (error.message){
					this.$toast.open({
						message: error.message ? error.message :  'Erro ao consultar cadastro.',
						type: 'is-warning',
						position: 'is-top',
						duration: 5000
					});
				}
			}
			else {
				this.form.reset();
				for (let field in _.omit(this.form.data(), ['contatos'])) {
					this.form[field] = response.data[field];
				}
				
				// Controla a exibição do select de Situação
				this.showSelectSituacao = !(!_.includes(this.dadosUsuario.roles, 'ROLE_MATRIZFILIAL') && response.data.idSituacao == 17)

				// Formata os objetos contato
				this.form.contatos = this.form.loadContatos(response.data['contatos']);

				// Obtém o objeto matrizfilial
				if (response.data.classe == 'tbmatrizfilial') {
					this.setMatrizFilial({
						id: response.data.idObjeto,
						nomeFantasia: response.data.nomeObjeto,
					});
				}
			}
		}
	},

	beforeRouteEnter (to, from, next) {
		let id;
		// Obtem o ID vindo nos parâmetros da route
		if (to.params.id) {
			id = to.params.id;
		} else if (to.meta && typeof(to.meta.id) == 'function') {
			id = to.meta.id();
		}
		
		if (id) {
			Vue.axios.get('/usuario/findId/' + id)
			.then(response => {
				next(vm => {
					vm.showAutocompleteMatrizFilial = false;
					vm.setFormData(response, null);
				 } );
			})
			.catch(error => {
				next(vm => {
					vm.showAutocompleteMatrizFilial = false;
					vm.setFormData(null, error);
				});
			});
		} else {
			next(vm => { 
				vm.form.reset();
				if (vm.$route.path == '/cadastro-usuario') {
					vm.form.classe = 'tbmatrizfilial';
				}
				vm.showAutocompleteMatrizFilial = true;
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
		} else if (to.meta && typeof(to.meta.id) == 'function') {
			id = to.meta.id();
		}
		
		if (id) {
			this.axios.get('/usuario/findId/' + id)
			.then(response => {
				this.showAutocompleteMatrizFilial = false;
				this.setFormData(response, null);
				next();
			})
			.catch(error => {
				this.showAutocompleteMatrizFilial = false;
				this.setFormData(null, error);
				next();
			});
		} else {
			if (this.$route.path == '/cadastro-usuario') {
				this.form.classe = 'tbmatrizfilial';
			}
			this.showAutocompleteMatrizFilial = true;
			next();
		}
	}
}
</script>