<template>
	<b-field ref="field" :label-for="name" :label="Boolean(childValue) || isMoney ? labelText : null"
		:type="Boolean(error) ? 'is-danger' : fieldType" :message="error" :expanded="expanded">
		<the-mask v-if="mask" ref="masked"
			:type="type" 
			class="input" 
			autocomplete="off"
			:id="name"
			:name="name"
			v-model="childValue"
			v-on:input="onInput()"
			:mask="mask"
			:masked="masked"
			:placeholder="placeholder"
			:disabled="disabled"
			:class="[{'is-danger': hasError}, fieldType, classes, size]">
		</the-mask>
		<money v-else-if="isMoney" ref="numeric"
			class="input" 
			autocomplete="off"
			:id="name"
			:name="name"
			v-model="childValue"
			v-on:input="onInput()"
			v-bind="moneyOptions"
			:placeholder="placeholder"
			:read-only="readonly"
			:disabled="disabled"
			:class="[{'is-danger': hasError}, fieldType, classes, size]">
		</money>
		<b-input v-else ref="input"
			:id="name"		
			autocomplete="off"
			:type="type" 
			:icon="icon"
			:icon-pack="iconPack"
			:name="name"
			v-model.lazy="childValue"
			v-on:input="onInput()"
			:placeholder="placeholder"
			:password-reveal="passwordReveal"
			:required="required"
			:disabled="disabled"
			:minlength="minlength"
			:maxlength="maxlength"
			:readonly="readonly"
			:has-counter="hasCounter"
			:min="min"
			:max="max"
			:rows="rows"
			:cols="cols"
			:size="size">
		</b-input>
	</b-field>
</template>

<script>
import BaseInput from './BaseInput.js';
import {TheMask} from 'vue-the-mask';
import {Money} from 'v-money';

export default {
	name: 'input-text',
	mixins: [ BaseInput ],
	components: { TheMask, Money },
	props: {
		// VueTheMask
		mask: null,
		masked: null,
		// Money
		money: {
			type: Object,
			default: () => {}
        },
		// VueNumeric
		isMoney: {
			type: Boolean,
			default: false
		},
		separator: {
			type: String,
			default: '.'
		},
		minus: {
			type: Boolean,
			default: false
		},
		currency: {
			type: String,
			default: 'R$'
		},
		precision: {
			type: Number,
			default: 2
		},
		passwordReveal: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			childValue: this.value
		}
	},
	computed: {
		labelText() {
			return this.label ? this.label : this.placeholder;
		},
		moneyOptions() {
			return Object.assign({}, this.money, {
				decimal: ',',
				thousands: '.',
				prefix: 'R$ ',
				suffix: '',
				precision: 2,
				masked: false
			});
		}
	},
	methods: {
		onInput() {
			if (!this.readonly) {
				//this.childValue = event;
				this.updateValue(this.childValue);
				this.getName(this.name);
			}
		}
	},
	watch: {
		/**
		 * Observa mudanças no value vindas de fora e atualiza o childValue
		 * que transmite o valor para o vue-the-mask.
		 */
		value(val) {
			if (!this.readonly)
				this.childValue = val;
		},

		/**
		 * Observa o parâmetro error para quando a mensagem de erro for limpada,
		 * o elemento continua focado para continuar a digitação.
		 */
		error(val, oldVal) {
			if (!Boolean(val) && val != oldVal) {
				this.$nextTick(() => {
					const input = this.mask ? this.$refs.masked.$el
						: this.isMoney ? this.$refs.numeric
						: this.$refs.input.$el.querySelector('input');
					input.focus();
				});
			}
		}
	},

	mounted() {
		// Sync parent model with initValue Props
		if (this.disabled || this.readonly) {
			this.childValue = this.value;
		}
    }
}
</script>
