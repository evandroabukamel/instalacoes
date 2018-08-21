<template>
	<b-field ref="field" :label-for="name" :label="Boolean(typeText) ? labelText : null"
		:type="Boolean(error || localError) ? 'is-danger' : fieldType" 
		:message="[error, localError]" :expanded="expanded">
		<b-autocomplete ref="autocomplete"
			:id="name"
			:name="name"
			v-model.lazy="typeText"
			:data="data"
			:placeholder="placeholder"
			:field="field"
			:max-results="maxResults"
			:keep-first="true"
			:loading="isLoading"
			:icon="disabled || readonly ? '' : 'magnify'"
			:icon-pack="iconPack"
			:required="required"
			:minlength="minlength"
			:maxlength="maxlength"
			:readonly="readonly"
			:disabled="disabled"
			:has-counter="false"
			:min="min"
			:max="max"
			:size="size"
			@input="input"
			@select="select"
			@blur="blur"
			autocomplete="off">
			<template slot-scope="props">
				<div class="media">
					<div class="media-content">
						<span class="title is-6">
							<span v-if="subtitle">{{ fieldLabel | upperCase }}: </span>
							{{ props.option[field] }}
						</span>	
						<span class="subtitle is-6" v-if="subtitle">
							<br>{{ subtitleLabel | upperCase }}: {{ props.option[subtitle] }}
						</span>
					</div>
				</div>
			</template>
		</b-autocomplete>
	</b-field>
</template>

<script>
import BaseInput from './BaseInput.js';
import GlobalFilters from './GlobalFilters.js';

export default {
	name: 'input-autocomplete',
	mixins: [ BaseInput, GlobalFilters ],
	props: {
		// Intial Value
		initValue: {
			type: String,
			default: ''
		},
		// Anchor of list
		field: {
			type: String,
			required: true
		},
		// Subtitle of list
		subtitle: String,

		fieldLabel: String,
		subtitleLabel: String,

		maxResults: {
			type: Number,
			default: 50
		},

		// ajax URL will be fetched
		url: {
			type: String,
			required: true
		},

		// query param
		param: {
			type: String,
			default: ''
		},

		// Custom Params
		customParams: Object
	},

    data() {
		return {
			typeText: this.initValue,
			selected: null,
			data: [],
			isLoading: false,
			localError: null
    	}
    },
	
	computed: {
		labelText() {
			return this.label ? this.label : this.placeholder;
		}
	},

	watch: {
		initValue(val) {
			this.typeText = val;
			this.data = [];
		},
		
		/**
		 * Observa o parâmetro error para quando a mensagem de erro for limpada,
		 * o elemento continua focado para continuar a digitação.
		 */
		error(val, oldVal) {
			if (!Boolean(val) && val != oldVal) {
				this.$nextTick(() => {
					const input = this.$refs.autocomplete.$el.querySelector('input');
					input.focus();
				});
			}
		}
	},

    methods: {
		// At text typing
		input: _.debounce(function() {
			if (!this.readonly && !this.disabled) {
				this.$nextTick(() => {
					// Get The Data preventing from get requested again on select
					if (this.typeText 
					&& !(this.selected && this.typeText == this.selected[this.field])
					&& !(this.initValue == this.typeText)) {
						this.getData(this.typeText);
					}
				});
			}
		}, 1000),

		select(option) {
			if (!this.readonly && !this.disabled) {
				this.selected = option;
				this.data = [];
				this.$emit('selected', option);
				this.getName(this.name);
			}
		},

		blur(event) {
			if (this.typeText != this.initValue && !this.selected && this.data.length == 0) {
				this.typeText = '';
				this.localError = null;
			}
		},

		/**
		 * Usa o lodash para aguardar um tempo antes das requisições serem executadas.
		 */
		getData: _.debounce(
			function(val) {
				this.localError = null;
				this.data = [];

				if (this.minlength && val.length < this.minlength) return;

				if (this.url != null && val.length > 0) {
					this.isLoading = true;
					
					Vue.axios.get(`${this.url}/${val}`)
					.then(response => {
						response.data.forEach((item) => this.data.push(item))
						this.isLoading = false;
						if (!response.data || response.data.length == 0) {
							this.localError = 'Nada foi encontrado.';
						}
					})
					.catch(error => {
						if (error.response.data && error.response.data.message) {
							this.localError = error.response.data.message;
						} else {
							this.localError = 'Ocorreu um erro ao tentar fazer a busca.';	
						}
						this.isLoading = false;
						this.showList = false;
					});
				}
			}, 0
		)
    },

    mounted() {
		this.data = [];
		// Sync parent model with initValue Props
		if (!this.disabled && !this.readonly) {
			this.typeText = '';
			const input = this.$refs.autocomplete.$el.querySelector('input');
			input.blur();
		}
    }
}
</script>
