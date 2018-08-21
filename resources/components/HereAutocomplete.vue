<template>
	<b-field ref="field" :label-for="name" :label="Boolean(typeText) ? labelText : null"
		:type="Boolean(error || localError) ? 'is-danger' : fieldType" 
		:message="[error, localError]" :expanded="expanded">
		<b-autocomplete ref="autocomplete"
			:id="name"
			:name="name"
			v-model.lazy="typeText"
			:data="data"
			field="Address.Label"
			:placeholder="placeholder"
			:max-results="maxResults"
			:keep-first="false"
			:loading="isLoading"
			:icon="disabled || readonly ? '' : 'magnify'"
			:icon-pack="iconPack"
			:has-counter="false"
			:size="size"
			@input="input"
			@select="select"
			@blur="blur"
			autocomplete="off">
			<template slot-scope="props">
				<div class="media">
					<div class="media-content">
						<span class="title is-6" v-if="Boolean(props.option)">
							{{ props.option.Address.Label }}
						</span>
					</div>
				</div>
			</template>
		</b-autocomplete>
	</b-field>
</template>

<script>
import { mapGetters } from 'vuex';
import BaseInput from './BaseInput.js';
import GlobalFilters from './GlobalFilters.js';

  /*! Copyright (c) 2016 Naufal Rabbani (http://github.com/BosNaufal)
  * Licensed Under MIT (http://opensource.org/licenses/MIT)
  *
  * Vue 2 Autocomplete @ Version 0.0.1
  */
export default {
	name: 'here-autocomplete',
	mixins: [ BaseInput, GlobalFilters ],
	props: {
		maxResults: {
			type: Number,
			default: 10
		}
	},

    data() {
		return {
			typeText: '',
			selected: null,
			data: [],
			isLoading: false,
			localError: null,
			url: 'https://geocoder.cit.api.here.com/6.2/geocode.json',
			param: 'searchtext',
			customParams: null
    	}
    },

	computed: {
		...mapGetters([
			'here'
		]),

		labelText() {
			return this.label ? this.label : this.placeholder;
		}
	},

	watch: {
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
					this.getData(this.typeText);
				});
			}
		}, 1500),

		select(option) {
			if (Boolean(option) && !this.readonly && !this.disabled) {
				this.selected = option;
				this.data = [];
				this.$emit('selected', option);
				this.getName(this.name);
			}
		},

		blur(event) {
			if (!this.selected && this.data.length == 0) {
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
					
					let params = "";
					if (this.customParams) {
							Object.keys(this.customParams).forEach((key) => {
							params += `&${key}=${this.customParams[key]}`
						});
					}
					
					let vm = this;
					let ajax = new XMLHttpRequest();
					ajax.open('GET', `${this.url}?${this.param}=${val}${params}`, true);
					ajax.send();

					ajax.addEventListener('loadend', function (data) {
						let json = JSON.parse(data.currentTarget.responseText);

						if (json.Response.View.length > 0) {
							json.Response.View[0].Result.forEach((item) => vm.data.push(item.Location));
						}
						else {
							vm.localError = 'Endereço não encontrado.';
						}
						vm.isLoading = false;
					});
				}
			}, 0
		)
    },

    created() {
		// Inicializa os parâmetros da Here
		this.customParams = { 'app_id': this.here.Id, 'app_code': this.here.Code, 'gen': 8 };
	},
	
	mounted() {
		this.data = [];
		// Sync parent model with empty
		if (!this.disabled && !this.readonly) {
			this.typeText = '';
			const input = this.$refs.autocomplete.$el.querySelector('input');
			input.blur();
		}
    }
}
</script>