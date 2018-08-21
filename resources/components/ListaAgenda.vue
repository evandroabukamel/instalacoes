<template>
	<div class="content week">
		<div class="columns is-multiline is-marginless">
			<div v-for="(dia, index1) in diasSemana" v-bind:key="index1" class="column has-text-centered is-paddingless">
				<div class="label is-marginless">{{ dia[0] }}</div>
				<div>
					<div v-for="(agenda, index2) in agendaDia(index1)" v-bind:key="index2" class="box-agenda box">
						<button type="button" class="delete is-medium is-pulled-left" @click="delAgenda(agenda)"></button>
						<div class="horario" v-if="agenda.diaSemana == index1">
							{{ agenda.horarioInicial | horaMinuto }}<br>
							a {{ agenda.horarioFinal | horaMinuto }}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import Agenda from '../core/Agenda.js';
import GlobalFilters from './GlobalFilters.js';

export default {
	name: 'lista-agenda',
	mixins: [ GlobalFilters ],
	props: {
		value: {
			type: Array|Object,
			default: []
		}
	},
	data() {
		return {
			agendas: this.value,
			diasSemana: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
		}
	},
	methods: {
		delAgenda(agenda) {
			let index = _.indexOf(this.agendas, agenda);
			this.agendas.splice(index, 1);
		},

		agendaDia(dia) {
			return _.filter(this.agendas, (o) => o.diaSemana == dia);
		}
	},
	watch: {
		value (val) {
			this.agendas = val;
		}
	}
}
</script>

<style lang="scss">
.week {
	overflow-x: visible;
	overflow-y: none;

	.column {
		border: 1px solid #cfcfcf;

		.label {
			padding: 10px;
			background-color: #fff;
			border-bottom: 1px solid #cfcfcf;
		}

		.box-agenda {
			padding: 0;
			margin: 0;
			width: 100%;
			height: 3em;
			color: #fcfcfc;
			background-color: hsl(141, 71%, 48%);
			position: inherit;
			margin-bottom: 10px;

			.horario {
				text-align: right;
				padding-right: 6px;
			}
		}
	}
}
</style>
