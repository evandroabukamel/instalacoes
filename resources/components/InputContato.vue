<template>
	<b-field :addons="true" grouped>
		<b-field expanded :type="error ? 'is-danger' : ''" :message="error">
			<b-field expanded grouped group-multiline>
				<div class="control">
					<button :class="[classes, size, {'is-primary': contato.tipo == 'telefone'}]"
						@click="changeTipo('telefone')"
						type="button" class="button">
						<b-icon icon="phone" :size="size"></b-icon>
					</button>
				</div>
				<div class="control">
					<button :class="[classes, size, {'is-primary': contato.tipo == 'email'}]"
						@click="changeTipo('email')"
						type="button" class="button">
						<b-icon icon="at" :size="size"></b-icon>
					</button>
				</div>
				<div class="control is-expanded is-clearfix">
					<b-field v-if="contato.tipo == 'email'">
						<input type="email" class="input is-flex" autocomplete="off"
							:name="name"
							v-model="contato.email"
							placeholder="seu-email@exemplo.com"
							:class="[classes, size]">
					</b-field>
					<b-field v-else-if="contato.tipo == 'telefone'">
						<the-mask type="tel" class="input is-flex" autocomplete="off"
							:name="name"
							v-model="contato.telefone"
							:mask="['(##) ####-####', '(##) #####-####']"
							:masked="false"
							placeholder="(XX) XXXX-XXXX"
							:class="[classes, size]"></the-mask>
					</b-field>
				</div>
				<div class="control">
					<button type="button" class="button is-primary" title="Adicionar"
						:class="[classes, size]" @click="add" :disabled="!isValid">
						<b-icon icon="plus" :size="size"></b-icon>
					</button>
				</div>
			</b-field>
		</b-field>
	</b-field>
</template>

<script>
import BaseInput from './BaseInput.js';
import Contato from '../core/Contato.js';
import {TheMask} from 'vue-the-mask';

export default {
	name: 'input-contato',
	mixins: [ BaseInput ],
	components: { TheMask },
	data() {
		return {
			contato: new Contato({
				id: null,
				email: '',
				telefone: '',
				tipo: 'telefone'
			})
		}
	},
	computed: {
		isValid() {
			if (this.contato.tipo == 'telefone') {
				return this.contato.telefone.length >= 10;
			}
			else if (this.contato.tipo == 'email') {
				return this.validateEmail(this.contato.email);
			}
			else return false;
		}
	},
	methods: {
		changeTipo(value) {
			this.contato.email = this.contato.telefone = '';
			this.contato.tipo = value;
		},

		add() {
			this.$emit('add', this.contato.data());
			this.contato.clear();
		}
	}
}
</script>

<style>
.field.has-addons .control.is-expanded {
    flex-grow: 1;
    flex-shrink: 1 !important;
}

</style>