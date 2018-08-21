<template>
	<div>
		<nav class="panel">
			<p class="panel-heading">
				Empresas encontradas
			</p>
			<div class="panel-block" v-if="false">
				<p class="control has-icons-left">
					<input class="input" type="text" placeholder="buscar">
					<span class="icon is-left">
						<b-icon icon="magnify"></b-icon>
					</span>
				</p>
			</div>
			<transition-group name="fade" tag="div">
				<div v-for="(item, index) in list" v-bind:key="index" id="lista-empresas-panel">
					<a class="panel-block is-block" @click="show(index)" 
						:class="{'is-active': index == activeIndex}">
						<span class="panel-icon is-inline-flex">
							<strong class="subtitle">{{ index+1 }}</strong>
						</span>
						<strong class="is-inline">{{ item.empresa.nome || '' }}</strong>
						<span class="is-block is-pulled-right">
							<star-rating :inline="true" :star-size="20" 
								:read-only="true" :show-rating="true" 
								:rating="item.empresa.classificacao">
							</star-rating>
						</span>
					</a>
					<expanding>
						<div class="panel-block" v-show="activeIndex == index">
							<div class="content">
								Endereço <b-field :label="item.empresa.endereco | enderecoStr"></b-field>
								Valor <b-field :label="item.valorVenda | formatMoney"></b-field>
								Tempo previsto <b-field :label="item.tempoPrevisto | horaMinuto"></b-field>
								<button class="button is-primary is-outlined is-fullwidth is-medium"
									type="button"
									@click="select(item)">
									Ver técnicos
								</button>
							</div>
						</div>
					</expanding>
				</div>
			</transition-group>
		</nav>
	</div>
</template>

<script>
import GlobalFilters from '../../../components/GlobalFilters.js';
import Expanding from 'vue-bulma-expanding';
import StarRating from 'vue-star-rating';

export default {
	name: 'lista-empresas',
	mixins: [ GlobalFilters ],
	components: { Expanding, StarRating },
	data() {
		return {
			activeIndex: null,
			valorServicoSelected: null
		}
	},

	props: {
		list: {
			type: Array,
			default: []
		}
	},

	methods: {
		select(valorServico) {
			this.valorServicoSelected = valorServico;
			this.$emit('selected', valorServico);
		},

		show(i) {
			if (this.activeIndex != i)
				this.activeIndex = i;
			else
				this.activeIndex = null;
		}
	}
}

</script>

<style lang="scss">
#lista-empresas-panel {
	max-height: 400px;
	overflow-y: auto;
}

.panel {
	background-color: #ffffff;
}

a.panel-block {
	text-decoration: none !important;
}

.panel-block .content {
	width: 100% !important;
}
</style>