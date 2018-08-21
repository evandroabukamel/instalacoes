<template>
	<b-field :label-for="name" :label="Boolean(childValue) ? labelText : null"
		:type="error ? 'is-danger' : fieldType" :message="error" 
		:addons="apiRoute && !disabled">
		<b-field expanded :type="error ? 'is-danger' : fieldType">
			<b-select :id="name"
				:name="name"
				expanded
				v-model="childValue"
				v-on:input="onChange"
				:size="size"
				:loading="isLoading"
				:disabled="disabled"
				:placeholder="placeholder"
				:multiple="multiple">
				<!-- options vindas de alguma fonte de dados -->
				<option v-for="option in options"
					:value="option.value"
					:key="option.value"
					:disabled="option.disabled"
					:selected="option.value == childValue">
					{{ option.text }}
				</option>
				<!-- options adicionadas manualmente -->
				<slot v-if="!Boolean(apiRoute)"></slot>
			</b-select>
			<p class="control" v-if="apiRoute && !disabled">
				<button type="button" class="button" @click="loadList" title="Recarregar lista"
					:class="[ error ? 'is-danger' : controlType, classes, size]">
					<b-icon icon="refresh" :size="size"></b-icon>
				</button>
			</p>
		</b-field>
	</b-field>
</template>

<script>
import BaseInput from './BaseInput.js';
import GlobalFilters from './GlobalFilters.js';

export default {
	name: 'select-ajax',
	mixins: [ BaseInput, GlobalFilters ],
	props: {
		apiRoute: {
			type: String
		},
		params: {
			type: String|Number,
			default: ''
		},
		multiple: {
		},
		pkField: {
			type: String,
			default: 'id'
		},
		textField: {
			type: String,
			default: 'descricao'	
		},
		changed: Function
	},

	data() {
		return {
			childValue: this.value,
			isLoading: false,
			options: []
		}
	},

	computed: {
		// Se label não for passado, utiliza-se o placeholder como lavel
		labelText() {
			return this.label ? this.label : this.placeholder;
		}
	},

	watch: {
		// Ao alterar params, executa o método loadList
		params(val, oldVal) {
			if (val != oldVal)
				this.loadList();
		},

		/**
		 * Observa mudanças no value vindas de fora e atualiza o childValue
		 * que transmite o valor para o vue-the-mask.
		 */
		value(val) {
			if (!this.readonly)
				this.childValue = val;
		}
	},

	methods: {
		onChange(event) {
			if (!this.readonly && !this.disabled) {
				this.changed ? this.changed() : null;
				this.childValue = event;
				this.updateValue(event);
				this.getName(this.name);
			}
		},

		loadList() {
			if (this.apiRoute && !this.isLoading) {
				// Inicializa os options com um valor null e disabled
				this.options = [];
			}
		
			if (this.apiRoute && ((this.params == '') != (!!this.params)) && !this.isLoading) {
				this.isLoading = true;

				// Busca os itens do webservice
				this.axios.get(this.apiRoute + (this.params || ''))
					.then(response => {
						this.$emit('errorSelectAjax', ''); // Limpa a mensagem de erro
						for(let i in response.data) {
							this.options.push({ value: response.data[i][this.pkField], text: response.data[i][this.textField] });
						}
						this.isLoading = false;
						this.updateValue('');
						this.updateValue(this.value);
					})
					.catch(error => {
						this.isLoading = false;
						if (error.response) {
							if (error.response.data.message) {
								this.$emit('errorSelectAjax', error.response.data.message);
							}
						}
						else{
							this.$emit('errorSelectAjax', 'Não foi possível carregar este campo. Tente recarregar.');
						}
					});
			}
		}
	},

	mounted() {
		if (!this.disabled) {
			this.loadList();
		}
	}
}
</script>
