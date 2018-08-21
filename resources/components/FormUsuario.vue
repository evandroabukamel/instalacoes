<template>
	<div>
		<div :class="outterClass">
			<div :class="columnClass">
				<!-- Usuário -->
				<h2 class="subtitle"><span v-html="'Dados de acesso'"></span></h2>
				<input-text type="text" name="nomeUsuario"
					v-model="usuario.nome"
					v-on:input="updateValue(usuario)"
					v-on:get-name="propagName($event)"
					placeholder="Nome"
					:size="size"
					:error="error.nome"
					:has-error="Boolean(error.nome)"></input-text>
				<input-text type="text" name="usuario"
					v-model="usuario.usuario"
					v-on:input="updateValue(usuario)"
					v-on:get-name="propagName($event)"
					placeholder="Usuário"
					:size="size"
					:error="error.usuario"
					:has-error="Boolean(error.usuario)"></input-text>
				<b-field v-if="showPasswordField">
					<input-text type="password" name="senha"
						v-model="usuario.senha"
						v-on:input="updateValue(usuario)"
						v-on:get-name="propagName($event)"
						placeholder="Senha"
						:password-reveal="true"
						:size="size"
						:error="error.senha"
						:has-error="Boolean(error.senha)"></input-text>
				</b-field>
				<input-text type="email" name="email"
					v-model="usuario.email"
					v-on:input="updateValue(usuario)"
					v-on:get-name="propagName($event)"
					placeholder="E-mail principal"
					maxlength="254"
					:size="size"
					:error="error.email"
					:has-error="Boolean(error.email)"></input-text>
				<input-text type="tel" name="telefone"
					v-model="usuario.telefone"
					v-on:input="updateValue(usuario)"
					v-on:get-name="propagName($event)"
					:mask="['(##) ####-####', '(##) #####-####']"
					:masked="false"
					placeholder="Celular principal"
					:size="size"
					:error="error.telefone"
					:has-error="Boolean(error.telefone)"></input-text>
				<div class="content"><!-- SPACE --></div>
				<div class="content"><!-- SPACE --></div>
			</div>
			<div :class="columnClass">
				<h2 class="subtitle"><span>Dias de acesso</span></h2>
				<b-field expanded>
					<b-table :bordered="true" :mobile-cards="true" class="table is-fullwidth"
						:data="diasSemana || []">
						<template slot-scope="props">
							<b-table-column
								v-for="(dia, index) in usuario.diasAcesso"
								v-bind:key="index"
								:label="props.row[index].abreviacao" 
								:custom-key="props.row[index].value" centered>
								<b-field position="is-centered">
									<b-checkbox type="is-primary" name="diasAcesso[]"
										v-model="usuario.diasAcesso[props.row[index].value]"></b-checkbox>
								</b-field>
							</b-table-column>
						</template>
					</b-table>
					<div class="content"><!-- SPACE --></div>
				</b-field>
				<h2 class="subtitle"><span v-html="'Hor&aacute;rios de acesso'"></span></h2>
				<b-field grouped>
					<date-time-picker placeholder="Horário inicial"
						name="horarioInicial"
						v-model="usuario.horarioInicial"
						:config="horaConfig"
						size="is-medium"
						expanded
						v-on:input="updateValue(usuario)"
						v-on:get-name="propagName($event)"
						:error="error.horarioInicial"
						:has-error="Boolean(error.horarioInicial)">
					</date-time-picker>
					<date-time-picker placeholder="Horário final"
						name="horarioFinal"
						v-model="usuario.horarioFinal"
						:config="horaConfig"
						size="is-medium"
						expanded
						v-on:input="updateValue(usuario)"
						v-on:get-name="propagName($event)"
						:error="error.horarioFinal"
						:has-error="Boolean(error.horarioFinal)">
					</date-time-picker>
					<span class="help is-danger" v-if="Boolean(error.horario)" v-text="error.horario"></span>
				</b-field>
				<div class="content" v-if="showInputContatos"></div>
				<div class="field" v-if="showInputContatos">
					<!-- Contatos -->
					<h2 class="subtitle">Contatos</h2>
					<input-contato name="contato" v-on:add="form.addContato($event)"></input-contato>
					<lista-contato v-model="usuario.contatos"></lista-contato>
				</div>
				<div class="content"><!-- SPACE --></div>
			</div>
		</div>
	</div>
</template>

<script>
import BaseInput from './BaseInput.js';
import Usuario from '../core/Usuario.js';
import InputContato from './InputContato.vue';
import ListaContato from './ListaContato.vue';
import DateTimePicker from './DateTimePicker.vue';
import DiasSemana from  '../core/DiasSemana.js';

export default {
	name: 'form-usuario',
	mixins: [ BaseInput ],
	components: { InputContato, ListaContato, DateTimePicker },
	data() {
		return {
			usuario: new Usuario({
				id: null,
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
			showPasswordField: true
		}
	},
	props: {
		error: {
			type: Object|Array,
			default: () => {
				return {}
			}
		},
		// Desativa as classes columns e column para que não dê problema nas telas de cadastrar em public.
		outterClass: {
			type: String, 
			default: 'columns'
		},
		columnClass: {
			type: String, 
			default: 'column is-half-desktop'
		},
		// Os campos de contato só aparecem se for cadastro de usuário de MatrizFilial.
		showInputContatos: {
			type: Boolean,
			default: false
		}
	},
	computed: {
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
		}
	},
	methods: {
		propagName(name) {
			// Emit the number value through the input event
			this.$emit('changed', name);
		}
	},
	
	mounted() {
		// Força a atualização do objeto usuario para o componente pai
		// Somente se o pai passar um valor preenchido para o filho.
		if (this.value && Object.keys(this.value).length > 0) {
			this.usuario = this.value;
			this.updateValue(this.value);
		}
	},
	
	watch: {
		value: function(val) {
			this.usuario = val;
			if (!this.readonly) {
				this.updateValue(this.usuario);
			}
		}
	}
}
</script>