<template>
	<div class="columns is-centered">
		<div class="column">
			<!-- TÍTULO -->
			<h1 class="title is-clearfix">
				<div class="columns">
					<div class="column is-half is-left">
						<span class="title is-size-3-desktop is-size-4-mobile">
							{{ `Consultoria #${form.id || ''}` }}
						</span>
					</div>
					<div class="column is-half is-right" v-if="form.id > 0 && form.situacao.id > 0">
						<b-field grouped group-multiline position="is-right">
							<div class="control">
								<span class="title is-size-3-desktop is-size-5-mobile">
									{{ form.situacao.descricao }}
								</span>
							</div>
							<div class="control">
								<dropdown-consultoria-acoes 
									:situacao-atual="form.situacao.id"
									@iniciarConsultoria="onIniciarConsultoria"
									@finalizarConsultoria="onFinalizarConsultoria"
									@concluirConsultoria="onConcluirConsultoria"
									@cancelarConsultoria="onCancelarConsultoria">
								</dropdown-consultoria-acoes>
							</div>
						</b-field>
					</div>
				</div>
			</h1>
			<!-- TABS -->
			<div>
				<div class="tabs is-boxed">
					<ul>
						<li :class="{'is-active': activeTab == 1}">
							<a @click="activeTab = 1">
								<b-icon icon="account"></b-icon>
								<span>Cliente</span>
							</a>
						</li>
						<li :class="{'is-active': activeTab == 2}">
							<a @click="activeTab = 2">
								<b-icon icon="calendar-today"></b-icon>
								<span>Consultoria</span>
							</a>
						</li>
						<li :class="{'is-active': activeTab == 3}"
							v-if="form.id > 0 && !(isSituacaoAberto || isSituacaoAgendado)">
							<a @click="activeTab = 3">
								<b-icon icon="wechat"></b-icon>
								<span>Atendimentos</span>
							</a>
						</li>
						<li :class="{'is-active': activeTab == 4}">
							<a @click="activeTab = 4">
								<b-icon icon="currency-usd"></b-icon>
								<span>Custos</span>
							</a>
						</li>
						<li :class="{'is-active': activeTab == 5}"
							v-if="form.id > 0">
							<a @click="activeTab = 5">
								<b-icon icon="message-bulleted"></b-icon>
								<span>Obserações</span>
							</a>
						</li>
					</ul>
				</div>
			</div>
			<b-message :closable="false">
				<form name="cadastroConsultoriaForm" method="post" action="#"
					@keydown="form.errors.clear($event.target.name)"
					@change="form.errors.clear($event.target.name)">
					<!-- TAB DADOS SOLICITANTE -->
					<div v-show="activeTab == 1">
						<div class="columns">
							<div class="column is-half-desktop">
								<input-autocomplete name="cliente"
									ref="autocompleteCliente"
									size="is-medium"
									:disabled="!isSituacaoAberto"
									:url="urlAutocompleteCliente"
									:init-value="form.cliente ? form.cliente.nome : null"
									field="nome"
									subtitle="cpfcnpj"
									field-label="Nome"
									subtitle-label="CPF/CNPJ"
									placeholder="Cliente"
									:minlength="2"
									@selected="setCliente"
									:error="form.errors.get('cliente')"></input-autocomplete>
								<!-- Localização -->
								<h2 class="subtitle"><span v-html="'Localiza&ccedil;&atilde;o'"></span></h2>
								<!-- FormEndereco -->
								<form-endereco name="endereco"
									:readonly="(isSituacaoCancelado || isSituacaoConcluido)"
									size="is-medium"
									v-model="form.endereco"
									@changed="form.errors.clear($event, 'endereco')"
									:has-error="form.errors.has('endereco')"
									:error="form.errors.get('endereco')"></form-endereco>
							</div>
						</div>
					</div>
					<!-- TAB DADOS AGENDAMENTO -->
					<div v-show="activeTab == 2">
						<div class="columns">
							<div class="column is-half-desktop">
								<select-ajax name="tipoConsultoria" ref="selectTipoConsultoria"
									v-model="form.tipoConsultoria.id" size="is-medium"
									placeholder="Tipo de consultoria"
									api-route="/tipoConsultoria/listar"
									control-type="is-primary"
									:disabled="!isSituacaoAberto"
									:has-error="form.errors.has('tipoConsultoria')"
									:error="form.errors.get('tipoConsultoria')"
									v-on:errorSelectAjax="form.setSelectError('tipoConsultoria', $event)">
									<option v-if="!isSituacaoAberto && form.tipoConsultoria.id" 
										:value="form.tipoConsultoria.id">
										{{ form.tipoConsultoria.descricao }}
									</option>
								</select-ajax>
								<div class="content"><!-- SPACE --></div>
								<date-time-picker placeholder="Data inicial"
									v-if="!(isSituacaoCancelado || isSituacaoConcluido)"
									name="dataInicial"
									v-model="form.dataInicial"
									:config="datePickerConfig"
									size="is-medium"
									:has-error="form.errors.has('dataInicial')"
									:error="form.errors.get('dataInicial')">
								</date-time-picker>
								<b-field v-else label="Data inicial">
									<span class="subtitle">{{ form.dataInicial|date }}</span>
								</b-field>
								<date-time-picker placeholder="Data final"
									v-if="!(isSituacaoCancelado || isSituacaoConcluido)"
									name="dataFinal"
									v-model="form.dataFinal"
									:config="datePickerConfig"
									size="is-medium"
									:has-error="form.errors.has('dataFinal')"
									:error="form.errors.get('dataFinal')">
								</date-time-picker>
								<b-field v-else label="Data final">
									<span class="subtitle">{{ form.dataFinal|date }}</span>
								</b-field>
								<date-time-picker placeholder="Data da entrega do documento"
									v-if="!(isSituacaoCancelado || isSituacaoConcluido)"
									name="dataEntregaDocumento"
									v-model="form.dataEntregaDocumento"
									:config="datePickerConfig"
									size="is-medium"
									:has-error="form.errors.has('dataEntregaDocumento')"
									:error="form.errors.get('dataEntregaDocumento')">
								</date-time-picker>
								<b-field v-else label="Data da entrega do documento">
									<span class="subtitle">{{ form.dataEntregaDocumento|date }}</span>
								</b-field>
							</div>
						</div>
					</div>
					<!-- TAB CONSULTORIA HORÁRIOS -->
					<div v-show="activeTab == 3"
						v-if="!(isSituacaoAberto || isSituacaoAgendado)">
						<div class="columns">
							<div class="column">
								<input-consultoria-horario name="inputConsultoriaHorario"
									v-if="!(isSituacaoConcluido || isSituacaoCancelado)"
									size="is-medium"
									v-on:add="addConsultoriaHorario($event)">
								</input-consultoria-horario>
								<lista-consultoria-horario name="listaConsultoriaHorario"
									v-model="form.consultoriaHorarios"
									:show-remove-button="!(isSituacaoConcluido || isSituacaoCancelado)">
								</lista-consultoria-horario>
							</div>
						</div>
					</div>
					<!-- TAB CUSTOS -->
					<div v-show="activeTab == 4">
						<div class="columns">
							<div class="column is-half-desktop">
								<input-text name="valor" v-model="form.valor" 
									:disabled="(isSituacaoConcluido || isSituacaoCancelado)"
									size="is-medium"
									placeholder="Valor"
									:is-money="true"
									:has-error="form.errors.has('valor')"
									:error="form.errors.get('valor')"></input-text>
							</div>
							<div class="column is-half-desktop">
								<label class="label">Custos adicionais</label>
								<input-custo name="custoAdicional" 
									v-if="!(isSituacaoConcluido || isSituacaoCancelado)"
									v-on:add="addCustoAdicional($event)"
									size="is-medium"
									:has-error="form.errors.has('custoAdicional')"
									:error="form.errors.get('custoAdicional')"></input-custo>
								<lista-custo v-model="form.custosAdicionais"
									:show-remove-button="!(isSituacaoConcluido || isSituacaoCancelado)">
								</lista-custo>
							</div>
						</div>
					</div>
					<!-- TAB OBSERVAÇÕES -->
					<div v-show="activeTab == 5">
						<div class="columns" v-if="!(isSituacaoCancelado || isSituacaoConcluido)">
							<div class="column is-fullwidth">
								<!-- Observacoes -->
								<h2 class="subtitle">Nova observação</h2>
								<input-text name="novaObservacao" type="textarea" 
									maxlength="65536" :has-counter="true"
									v-model.lazy="novaObservacao"
									placeholder="" label=""
									:has-error="form.errors.has('novaObservacao')"
									:error="form.errors.get('novaObservacao')"></input-text>
								<b-field grouped position="is-right">
									<button type="button" title="Enviar" :disabled="!novaObservacao"
										class="button is-medium button-round-medium is-success"
										:class="{ 'is-loading': form.isLoading }"
										@click="sendObservacao(null)">
										<b-icon icon="send"></b-icon>
									</button>
								</b-field>
							</div>
						</div>
						<div class="columns">
							<div class="column is-fullwidth">
								<b-field v-for="(obs, indexObs) in observacoes" :key="indexObs"
									class="observacao-message" grouped
									:position="isCurrentUser(obs.usuarioId) ? 'is-right' : 'is-left'">
									<article :class="['message', 'control', getMessageColor(obs.usuarioClasse)]">
										<div class="message-header">
											<p>
												{{ `${obs.usuarioNome} escreveu ${$options.filters.timeAgo(obs.dataHoraCadastro)}:` }}
											</p>
											<p v-html="'&nbsp;'"></p>
											<!-- <button type="button" 
												v-if="isCurrentUser(obs.usuarioId)"
												:class="[getMessageColor(obs.usuarioClasse), 'button', 'button-round-small']">
												<b-icon icon="pencil" type="is-white" size="is-small"></b-icon>
											</button> -->
											<button type="button" class="delete" aria-label="delete"
												v-if="isCurrentUser(obs.usuarioId)"
												@click="deleteObservacao(obs.id)"></button>
										</div>
										<div class="message-body">
											{{ obs.texto }}
										</div>
									</article>
								</b-field>
							</div>
						</div>
					</div>
					<!-- Botões -->
					<div class="content"><!-- SPACE --></div>
					<div class="content"><!-- SPACE --></div>
					<div class="field has-addons has-addons-right"
						v-show="activeTab != 5">
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
import GlobalFilters from '../../components/GlobalFilters.js';
import DropdownConsultoriaAcoes from './components-consultoria/DropdownConsultoriaAcoes.vue';
import InputConsultoriaHorario from './components-consultoria/InputConsultoriaHorario.vue';
import ListaConsultoriaHorario from './components-consultoria/ListaConsultoriaHorario.vue';
import InputAutocomplete from '../../components/InputAutocomplete.vue';
import InputContato from '../../components/InputContato.vue';
import ListaContato from '../../components/ListaContato.vue';
import InputCusto from '../../components/InputCusto.vue';
import ListaCusto from '../../components/ListaCusto.vue';
import Endereco from '../../core/Endereco.js';
import FormEndereco from '../../components/FormEndereco.vue';
import HereMaps from '../../components/HereMaps.vue';
import DateTimePicker from '../../components/DateTimePicker.vue';
import 'moment/locale/pt-br.js';
import { mapGetters, mapActions } from 'vuex';

let moment = require('moment-business-days');
moment.updateLocale('pt-br', {
	workingWeekdays: [1,2,3,4,5]
});

export default {
	mixins: [ GlobalFilters ],
	components: {
		DateTimePicker, InputAutocomplete, HereMaps, FormEndereco, InputCusto, ListaCusto, 
		DropdownConsultoriaAcoes, InputConsultoriaHorario, ListaConsultoriaHorario
	},
	data() {
		return {
			form: new Form({
				id: null,
				situacao: {id: null, descricao: null},
				tipoConsultoria: {id: null, descricao: null},
				cliente: null,
				valor: 0.0,
				dataEntregaDocumento: '',
				dataInicial: '',
				dataFinal: '',
				dataHoraCadastro: '',
				dataHoraConclusao: '',
				custosAdicionais: [],
				consultoriaHorarios: [],
				endereco: {}
			}),
			activeTab: 1,
			custos: [],
			novaObservacao: '',
			observacoes: []
		}
	},

	computed: {
		...mapGetters([
			'dadosUsuario',
			'situacaoConsultoria'
		]),

		datePickerConfig() {
			return {
				wrap: true,
				dateFormat: 'Y-m-d', 
				altInput: true,
				altFormat: 'l, j F, Y'
			}
		},

		isSituacaoAberto() {
			return this.situacaoConsultoria.ABERTO == this.form.situacao.id || this.form.situacao.id == null;
		},

		isSituacaoAgendado() {
			return this.situacaoConsultoria.AGENDADO == this.form.situacao.id;
		},

		isSituacaoEmAndamento() {
			return this.situacaoConsultoria.EM_ANDAMENTO == this.form.situacao.id;
		},

		isSituacaoRealizado() {
			return this.situacaoConsultoria.REALIZADO == this.form.situacao.id;
		},

		isSituacaoConcluido() {
			return this.situacaoConsultoria.CONCLUIDO == this.form.situacao.id;
		},

		isSituacaoCancelado() {
			return this.situacaoConsultoria.CANCELADO == this.form.situacao.id;
		},

		urlAutocompleteCliente() {
			return '/cliente/findLike';
		}
	},

	methods: {
		...mapActions([
			'salvarObservacao',
			'excluirObservacao'
		]),

		addCustoAdicional(custo) {
			this.form.custosAdicionais.push(custo);
			this.form.errors.clear('custoAdicional');
		},

		addConsultoriaHorario(consultoriaHorario) {
			this.form.consultoriaHorarios.push(consultoriaHorario);
			this.form.errors.clear('consultoriaHorario');
		},

		/**
		 * Obtém a cor da mensagem-observação de acordo com a classe do usuário.
		 */
		getMessageColor(usuarioClasse) {
			return usuarioClasse == 'tbmatrizfilial' ? 'is-dark'
				: usuarioClasse == 'tbcliente' ? 'is-blue'
				: usuarioClasse == 'tbempresa' ? 'is-green'
				: usuarioClasse == 'tbtecnico' ? 'is-turquoise'
				: 'is-light';
		},

		/**
		 * Verifica se o usuarioId passado como parâmetro é igual ao id do usuário logado.
		 */
		isCurrentUser(usuarioId) {
			return this.dadosUsuario && this.dadosUsuario.id == usuarioId;
		},
	
		// Define o objeto do cliente recebido ou selecionado
		setCliente(obj) {
			if (obj && obj.id > 0) {
				this.form.cliente = obj;
			}
		},

		
		onIniciarConsultoria() {
			this.$dialog.confirm({
				message: 'Deseja iniciar a consultoria?',
				cancelText: 'Não',
				confirmText: 'Sim',
				type: 'is-primary',
				onConfirm: () => {
					this.form.isLoading = true;
					this.axios.post('/consultoria/iniciarConsultoria', {
						id: this.form.id
					})
					.then(response => {
						this.form.isLoading = false;
						if (response.data) {
							this.$toast.open({
								message: response.data.message ? response.data.message : 'Consultoria iniciada com sucesso.',
								type: 'is-success',
								position: 'is-top',
								duration: 5000
							});
							this.form.situacao = response.data.situacao;
						}
					})
					.catch(error => {
						this.form.isLoading = false;
						if (error.response && error.response.data) {
							this.$toast.open({
								message: error.response.data.message ? error.response.data.message : 'Erro ao iniciar consultoria.',
								type: 'is-warning',
								position: 'is-top',
								duration: 5000
							});
						}
					});
				}
			})
		},

		onFinalizarConsultoria() {
			this.$dialog.confirm({
				message: 'Deseja finalizar a consultoria?',
				cancelText: 'Não',
				confirmText: 'Sim',
				type: 'is-primary',
				onConfirm: () => {
					this.form.isLoading = true;
					this.axios.post('/consultoria/finalizarConsultoria', {
						id: this.form.id
					})
					.then(response => {
						this.form.isLoading = false;
						if (response.data) {
							this.$toast.open({
								message: response.data.message ? response.data.message : 'Consultoria finalizada com sucesso.',
								type: 'is-success',
								position: 'is-top',
								duration: 5000
							});
							this.form.situacao = response.data.situacao;
						}
					})
					.catch(error => {
						this.form.isLoading = false;
						if (error.response && error.response.data) {
							this.$toast.open({
								message: error.response.data.message ? error.response.data.message : 'Erro ao finalizar consultoria.',
								type: 'is-warning',
								position: 'is-top',
								duration: 5000
							});
						}
					});
				}
			})
		},

		onConcluirConsultoria() {
			this.$dialog.confirm({
				message: 'Deseja concluir a consultoria?',
				cancelText: 'Não',
				confirmText: 'Sim',
				type: 'is-primary',
				onConfirm: () => {
					this.form.isLoading = true;
					this.axios.post('/consultoria/concluir', {
						id: this.form.id
					})
					.then(response => {
						this.form.isLoading = false;
						if (response.data) {
							this.$toast.open({
								message: response.data.message ? response.data.message : 'Consultoria concluída com sucesso.',
								type: 'is-success',
								position: 'is-top',
								duration: 5000
							});
							this.$router.push('/lista-consultoria');
						}
					})
					.catch(error => {
						this.form.isLoading = false;
						if (error.response && error.response.data) {
							this.$toast.open({
								message: error.response.data.message ? error.response.data.message : 'Erro ao concluir consultoria.',
								type: 'is-warning',
								position: 'is-top',
								duration: 5000
							});
						}
					});
				}
			})
		},

		onCancelarConsultoria() {
			this.$dialog.confirm({
				message: 'Deseja cancelar o consultoria?',
				cancelText: 'Não',
				confirmText: 'Sim',
				type: 'is-primary',
				onConfirm: () => {
					this.form.isLoading = true;
					this.axios.post('/consultoria/cancelar', {
						id: this.form.id
					})
					.then(response => {
						this.form.isLoading = false;
						if (response.data) {
							this.$toast.open({
								message: response.data.message ? response.data.message : 'Consultoria cancelada com sucesso.',
								type: 'is-success',
								position: 'is-top',
								duration: 5000
							});
							this.$router.push('/lista-consultoria');
						}
					})
					.catch(error => {
						this.form.isLoading = false;
						if (error.response && error.response.data) {
							this.$toast.open({
								message: error.response.data.message ? error.response.data.message : 'Erro ao cancelar consultoria.',
								type: 'is-warning',
								position: 'is-top',
								duration: 5000
							});
						}
					});
				}
			})
		},

		sendObservacao(idObservacao = null) {
			this.form.isLoading = true;
			this.salvarObservacao({
				id: idObservacao,
				idConsultoria: this.form.id,
				texto: this.novaObservacao
			})
			.then(data => {
				this.form.isLoading = false;
				if (data) {
					this.novaObservacao = '';
					this.observacoes.unshift(data.observacao);
				}
			})
			.catch(error => {
				this.form.isLoading = false;
			});
		},

		deleteObservacao(idObservacao = null) {
			this.$dialog.confirm({
				message: 'Deseja excluir essa observação?',
				cancelText: 'Não',
				confirmText: 'Sim',
				type: 'is-danger',
				onConfirm: () => {
					this.form.isLoading = true;
					this.excluirObservacao({
						id: idObservacao,
						idConsultoria: this.form.id
					})
					.then(data => {
						this.form.isLoading = false;
						let i = _.findIndex(this.observacoes, function(o) { return o.id == idObservacao; });
						if (i >= 0) {
							this.observacoes.splice(i, 1);
						}
					})
					.catch(error => {
						this.form.isLoading = false;
					})
				}
			});
		},

		onSubmit() {
			this.form.post('/consultoria/salvar')
			.then(response => {
				if (response.message) {
					this.$toast.open({
						message: response.message ? response.message : 'Cadastro salvo com sucesso.',
						type: 'is-success',
						position: 'is-top',
						duration: 5000
					});
					this.$router.push('/lista-consultoria');
				}
			})
			.catch(error => {
				if (error.message) {
					this.$toast.open({
						message: error.message ? error.message : 'Erro ao salvar cadastro.',
						type: 'is-warning',
						position: 'is-top',
						duration: 10000
					});
				}
			});
		},

		setFormData(response, error) {
			if (error) {
				if (error.response.data){
					this.$toast.open({
						message: error.response.data.message ? error.response.data.message : 'Erro ao consultar cadastro.',
						type: 'is-warning',
						position: 'is-top',
						duration: 5000
					});
				}
			}
			else {
				this.activeTab = 0;
				this.form.reset();

				this.form.situacao = response.data.situacao;

				// Preenche os campos do this.form
				for (let field in _.omit(this.form.data(), 
					[ 'situacao','endereco','cliente'])) {
					// Corrige dados de id, descricao que ficam null
					if (field == 'tipoConsultoria' && !response.data[field]) 
						this.form.tipoConsultoria = {id: null, descricao: null};
					else
						this.form[field] = response.data[field];
				}

				// Formata os objeto endereco
				this.form.endereco = this.form.loadEndereco(response.data['endereco']);
				// Recebe as observações
				this.observacoes = response.data.observacoes;
				
				// Coloca nos inputs autocomplete os devidos objetos
				this.setCliente(response.data.cliente);

				this.activeTab = 1;
			}
		}
	},

	filters: {
		date(str) {
			try {
				if (moment(str).isValid())
					return moment(str).format('ddd, D MMMM, YYYY');
				else 
					return str;
			}
			catch (Exception) {
				return str;
			}
		},
		time(str) {
			try {
				if (str.length == 8)
					return str.substr(0,5);
				else
					return moment(str).format('HH:mm');
			}
			catch (Exception) {
				return str;
			}
		},
		timeAgo(str) {
			try {
				return moment(str).calendar(moment());
			}
			catch (Exception) {
				return str;
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
			Vue.axios.get('/consultoria/findId/' + id)
			.then(response => {
				next(vm => { vm.setFormData(response, null) } );
			})
			.catch(error => {
				next(vm => { vm.setFormData(null, error) } );
			});
		} else {
			next(vm => { 
				vm.activeTab = 1;
				vm.form.reset();
			});
		}
	},

	// Quando a route muda e este componente já está renderizado, a lógica é diferente
	beforeRouteUpdate (to, from, next) {
		this.activeTab = 1;
		this.form.reset();

		let id;
		// Obtem o ID vindo nos parâmetros da route
		if (to.params.id) {
			id = to.params.id;
		} else if (typeof(to.meta.id) == 'function') {
			id = to.meta.id();
		}
		
		if (id) {
			this.axios.get('/consultoria/findId/' + id)
			.then(response => {
				this.setFormData(response, null);
				next();
			})
			.catch(error => {
				this.setFormData(null, error);
				next();
			});
		} else {
			// Recarrega os select-ajax após uma consulta
			this.$refs.selectTipoConsultoria.loadList();
			next();
		}
	}
}
</script>

<style type="scss" scoped>
.title {
	word-break: break-word !important;
}
</style>