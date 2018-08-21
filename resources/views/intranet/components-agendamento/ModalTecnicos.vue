<template>
	<form>
		<div class="modal-card">
			<header class="modal-card-head">
				<p class="modal-card-title">{{ title }}</p>
				<button type="button" class="delete" 
					aria-label="close" @click="clickCancel"></button>
			</header>
			<section class="modal-card-body">
				<div class="columns">
					<div class="column is-7-desktop">
						<date-time-picker placeholder="Data do agendamento"
							v-if="dataAgendamentoConfig !== undefined"
							name="dataAgendamento"
							v-model="dataAgendamento"
							:config="dataAgendamentoConfig"
							size="is-medium">
						</date-time-picker>
					</div>
					<div class="column is-5-desktop">
						<date-time-picker placeholder="Horário do agendamento"
							name="horaAgendamento"
							v-model="horaAgendamento"
							:config="horaAgendamentoConfig"
							size="is-medium">
						</date-time-picker>
					</div>
				</div>
				<transition name="fade" v-show="!Boolean(isLoadingAgenda)">
					<lory v-if="items != null" class="js_rewind" ref="loryTecnicos"
						:options="{ enableMouseEvents: true, infinite: 1, rewind: true }">
						<item v-for="(item, index1) in items" :key="index1">
							<div class="tile is-ancestor">
								<div class="tile is-parent is-vertical">
									<h2 class="subtitle">{{ item.nome }}</h2>
									<div v-for="(agenda, index2) in item.agendas" :key="index2"
										class="tile is-child is-horizontal">
										<div class="notification is-success is-narrow">
											<p>{{ agenda.horarioInicial | horaMinuto }}</p>
											<div v-if="agendamentosBetween(item.agendamentos, agenda.horarioInicial, agenda.horarioFinal).size > 0 || true">
												<div v-for="(os, index3) in agendamentosBetween(item.agendamentos, agenda.horarioInicial, agenda.horarioFinal)" :key="index3" 
													class="notification is-danger is-narrow">
													{{ os.horaAgendamento | horaMinuto }} a 
													{{ horaFinalAgendamento(os) | horaMinuto }} | 
													{{ os.tipoServico.descricao }}
												</div>
											</div>
											<p v-else>-- Livre --</p>
											<p>{{ agenda.horarioFinal | horaMinuto }}</p>
										</div>
									</div>
									<div v-show="!item.agendas || item.agendas.length == 0" 
										class="clearfix columns is-centered">
										<div class="column is-narrow">
											<h2 class="subtitle">Sem agenda para este dia</h2>
										</div>
									</div>
								</div>
							</div>
						</item>
						<prev slot="actions"></prev>
						<next slot="actions"></next>
					</lory>
				</transition>
				<div v-show="Boolean(isLoadingAgenda)">
					<div class="clearfix columns is-centered" v-show="isLoadingAgenda">
						<div class="column is-narrow">
							<span class="sr-only">Carregando agenda dos técnicos...</span>
						</div>
					</div>
				</div>
			</section>
			<footer class="modal-card-foot">
				<button class="button is-medium" type="button" @click="clickCancel">Voltar</button>
				<button class="button is-primary is-medium" type="button" @click="clickOk">Agendar</button>
			</footer>
		</div>
	</form>
</template>

<script>
import GlobalFilters from '../../../components/GlobalFilters.js';
import DateTimePicker from '../../../components/DateTimePicker.vue';
import { Lory, Item, Prev, Next } from 'vue-lory';
import 'moment/locale/pt-br.js';
let moment = require('moment');
moment.locale('pt-br');

let CancelToken = Vue.axios.CancelToken; // Cancel token para o GET do fetchData
let cancel; // Variável que recebe o método para cancelar o fetchData

export default {
	name: 'modal-tecnicos',
	mixins: [ GlobalFilters ],
	components: { DateTimePicker, Lory, Item, Prev, Next },
	data () {
		return {
			dataAgendamento: null,
			horaAgendamento: '',
			tecnicos: null,
			forcarCadastro: false,
			isLoadingAgenda: false
		}
	},

	props: {
		idAgendamento: null,
		dataPreferida: null,
		horaPreferida: null,
		datePickerConfig: null,
		valorServico: null
	},

	computed: {
		title() {
			return this.valorServico ? `Técnicos da ${this.valorServico.empresa.nome}` : '';
		},

		items() {
			return this.tecnicos;
		},
		
		dataAgendamentoConfig() {
			return this.datePickerConfig;
		},

		horaAgendamentoConfig() {
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
	},

	methods: {
		/**
		 * Retorna a lista de agendamento cuja horaAgendamento esteja dentro das horas start e end.
		 */
		agendamentosBetween(agendamentos, start, end) {
			let format = 'hh:mm:ss',
				beforeTime = moment(start, format),
				afterTime = moment(end, format);
			return _.filter(agendamentos, function(o) {
				let time = moment(o.horaAgendamento, format);
				return o != null ? time.isBetween(beforeTime, afterTime, null, []) : false
			});
		},
	
		selectedTecnico() {
			if (this.tecnicos != null) {
				let index = this.$refs.loryTecnicos.slider.returnIndex();
				return this.tecnicos[index];
			}
			return null;
		},
		
		horaFinalAgendamento(os) {
			return moment(os.horaAgendamento, 'hh:mm:ss').add(moment.duration(os.tempoPrevisto)).format('hh:mm:ss');
		},

		clickOk() {
			if (this.valorServico) {
				this.axios.post('/agendamento/agendar', {
					id: this.idAgendamento,
					dataAgendamento: this.dataAgendamento,
					horaAgendamento: this.horaAgendamento,
					idTecnico: this.selectedTecnico().id || null,
					idValorServico: this.valorServico.id,
					forcarCadastro: this.forcarCadastro
				})
				.then(response => {
					this.isLoadingAgenda = false;
					this.forcarCadastro = false;

					if (response.data) {
						this.$toast.open({
							message: response.data.message ? response.data.message : 'Técnico escolhido com sucesso.',
							type: 'is-success',
							position: 'is-top',
							duration: 5000
						});
					}
					this.$emit('selected');
					this.$parent.close();
				})
				.catch(error => {
					this.isLoadingAgenda = false;
					if (error.response && error.response.data) {
						this.$toast.open({
							message: error.response.data.message ? error.response.data.message : 'Erro ao agendar o serviço.',
							type: 'is-warning',
							position: 'is-top',
							duration: 5000
						});

						// Força o agendamento em caso de agenda cheia ou horário e data ocupados
						this.$dialog.confirm({
							message: 'Deseja realizar o agendamento apesar da data e horário indisponíveis?',
							cancelText: 'Não',
							confirmText: 'Sim',
							type: 'is-warning',
							onConfirm: () => {
								this.forcarCadastro = true;
								this.clickOk();
								this.forcarCadastro = false;
							}, 
							onCancel: () => {
								this.forcarCadastro = false;
							}
						});
					}
				});
			} else {
				this.$toast.open({
					message: 'Necessário escolher a empresa ou aguardar o carregamento.',
					type: 'is-warning',
					position: 'is-top',
					duration: 5000
				});
			}
		},

		clickCancel() {
			this.$parent.close();
		},

		fetchData() {
			if (this.valorServico) {
				this.tecnicos = null;
				this.isLoadingAgenda = true;
				this.axios.get(`/tecnico/getTecnicosAgendaDia/${this.valorServico.empresa.id}/${this.dataAgendamento}`, 
				{
					cancelToken: new CancelToken(function executor(c) {
						// An executor function receives a cancel function as a parameter
						cancel = c;
					})
				})
				.then(response => {
					this.isLoadingAgenda = false;
					this.tecnicos = response.data;
				})
				.catch(error => {
					this.isLoadingAgenda = false;
					if (error.response && error.response.data) {
						this.$toast.open({
							message: error.response.data.message ? error.response.data.message :  'Erro ao obter lista de técnicos.',
							type: 'is-warning',
							position: 'is-top',
							duration: 5000
						});
					}
				});
			}
		}
	},

	watch: {
		dataAgendamento: function(newVal) {
			if (newVal != null) {
				// cancel the last request
				if (typeof(cancel) == 'function' && this.isLoadingAgenda) {
					cancel();
				}
				this.fetchData();
			}
		}
	},

	mounted() {
		this.horaAgendamento = this.horaPreferida;

		// Verifica se a dataPreferida é inferior a última data desabilitada do calendário
		// Pois o agendamento deve respeitar o limite de datas dos parâmetros
		if (moment(this.dataPreferida).isSameOrBefore(this.datePickerConfig.disable[0].to, 'day') || !this.dataPreferida) {
			this.dataAgendamento = moment(this.datePickerConfig.disable[0].to).add(1, 'days').format('YYYY-MM-DD');
		}
		else {
			this.dataAgendamento = this.dataPreferida;
		}

		this.fetchData();
	}
}
</script>

<style lang="scss" scoped>
.slider {
	.frame li {
		height: auto;
		padding: 1em;
	}
	&.js_rewind {
		.frame li {
			color: #000;
			background: whitesmoke;
			padding: 1em;
		}
	}
}

.notification {
	padding: 0;
}
.notification:not(:last-child) {
	margin-bottom: 0 !important;
}

.modal-card-foot {
	justify-content: flex-end;
}
</style>