<template>
	<b-field :label-for="name" :label="Boolean(childValue) ? labelText : null"
		:type="error ? 'is-danger' : fieldType" :message="error" :expanded="expanded">
		<b-field expanded>
			<flat-pickr autocomplete="off"
				:id="name"
				:name="name"
				v-on:input="onInput()"
				v-model="childValue"
				:placeholder="placeholder"
				:class="[{'is-danger': hasError}, size, 'input'].join(' ')"
				:config="configs">
			</flat-pickr>
		</b-field>
	</b-field>
</template>

<script>
import BaseInput from './BaseInput.js';
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import {Portuguese} from 'flatpickr/dist/l10n/pt.js';

export default {
	name: 'date-time-picker',
	components: { flatPickr },
	mixins: [ BaseInput ],
	data() {
		return {
			childValue: this.value
		}
	},
	props: {
		config: {}
	},
	computed: {
		labelText() {
			return this.label ? this.label : this.placeholder;
		},
		configs() {
			return  Object.assign({}, this.config, { locale: Portuguese });
		}
	},
	methods: {
		onInput() {
			this.updateValue(this.childValue);
			this.getName(this.name);
		}
	},
	watch: {
		/**
		 * Observa mudanças no value vindas de fora e atualiza o childValue
		 * que transmite o valor para o flat-pickr.
		 */
		value(val) {
			this.childValue = val;
		}
	}
}
</script>

<style>
.fade-enter-active, .fade-leave-active {
	transition: opacity .5s
}
.fade-enter, .fade-leave-to {
	opacity: 0
}
</style>
