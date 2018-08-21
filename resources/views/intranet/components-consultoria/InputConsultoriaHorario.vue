<template>
	<b-field grouped group-multiline :type="error ? 'is-danger' : ''" :message="error">
		<p class="control">
			<select-ajax name="idMeioComunicacao"
				v-model="meioComunicacao.id" 
				:size="size"
				placeholder="Meio de comunicação"
				api-route="/meioComunicacao/listar"
				control-type="is-primary">
			</select-ajax>
		</p>
		<p class="control">
			<input-text name="conversadoCom" 
				v-model="conversadoCom"
				:size="size"
				placeholder="Conversado com">
			</input-text>
		</p>
		<p class="control">
			<date-time-picker name="data"
				v-model="data"
				placeholder="Data"
				:size="size"
				:config="datePickerConfig">
			</date-time-picker>
		</p>
		<p class="control shrink">
			<b-field grouped>
				<p class="control shrink">
					<date-time-picker name="horaInicial"
						v-model="horaInicial"
						placeholder="Horário inicial"
						:size="size"
						:config="timePickerConfig">
					</date-time-picker>
				</p>
				<p class="control shrink">
					<date-time-picker autocomplete="off"
						name="horaFinal"
						v-model="horaFinal"
						placeholder="Horário final"
						:size="size"
						:config="timePickerConfig">
					</date-time-picker>
				</p>
				<div class="control">
					<button type="button" class="button is-primary" title="Adicionar"
						:class="[classes, size]" @click="add" :disabled="!isValid">
						<b-icon icon="plus" :size="size"></b-icon>
					</button>
				</div>
			</b-field>
		</p>
	</b-field>
</template>

<script>
import BaseInput from '../../../components/BaseInput.js';
import DateTimePicker from '../../../components/DateTimePicker.vue';

export default {
	name: 'input-consultoria-horario',
	mixins: [ BaseInput ],
	components: { DateTimePicker },
	data() {
		return {
			idConsultoria: null,
			meioComunicacao: { id: null, descricao: null },
			conversadoCom: '',
			data: '',
			horaInicial: '',
			horaFinal: ''
		}
	},
	computed: {
		isValid() {
			return (/^\d{2,}:(?:[0-5]\d):(?:[0-5]\d)$/).test(this.horaInicial) &&
				(/^\d{2,}:(?:[0-5]\d):(?:[0-5]\d)$/).test(this.horaFinal) &&
				parseInt(this.horaInicial) < 24 &&
				parseInt(this.horaFinal) < 24 &&
				this.horaInicial < this.horaFinal
				&& this.data
				&& this.conversadoCom
				&& this.meioComunicacao.id;
		},		
		datePickerConfig() {
			return {
				wrap: true,
				dateFormat: 'Y-m-d', 
				altInput: true,
				altFormat: 'l, j F, Y'
			}
		},
		timePickerConfig() {
			return {
				wrap: true,
				dateFormat: 'H:i:S', 
				altInput: true,
				altFormat: 'H:i',
				noCalendar: true, 
				enableTime: true, 
				enableSeconds: false,
				time_24hr: true
			}
		}
	},
	methods: {
		add() {
			let data = {};
			let fields = Object.keys(this._data);
			for (let field in fields) {
				data[fields[field]] = this[fields[field]];
			}
			this.$emit('add', data);
			this.$nextTick(function () {
				this.clear();
			});
		},
		clear() {
			this.idConsultoria = null;
			this.meioComunicacao = { id: null, descricao: null };
			this.conversadoCom = '';
			this.data = '';
			this.horaInicial = '';
			this.horaFinal = '';
		}
	}
}
</script>

<style scoped>
.shrink {
    flex-grow: 1;
    flex-shrink: 1 !important;
}
</style>