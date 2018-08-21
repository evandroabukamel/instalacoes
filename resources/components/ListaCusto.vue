<template>
	<b-table :bordered="false" :striped="true" :mobile-cards="true" class="table is-fullwidth"
		:data="custos || []">
		<template slot-scope="props">
			<b-table-column label="Descrição">
				{{ props.row.descricao }}
			</b-table-column>
			<b-table-column label="Valor" :numeric="true">
				{{ props.row.valor | formatMoney }}
			</b-table-column>
			<b-table-column label="" :visible="showRemoveButton" :width="50">
				<button type="button" class="delete" title="Remover"
					v-if="showRemoveButton"
					@click="delRow(props.index)">
				</button>
			</b-table-column>
		</template>
		<template slot="footer">
			<th>Subtotal</th>
			<td class="is-auto has-text-right">
				<strong>{{ subtotal | formatMoney }}</strong>
			</td>
			<th v-show="showRemoveButton"></th>
		</template>
	</b-table>
</template>

<script>
import GlobalFilters from './GlobalFilters.js';

export default {
	name: 'lista-custo',
	mixins: [ GlobalFilters ],
	props: {
		value: {
			type: Array|Object,
			default: []
		},
		showRemoveButton: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			custos: this.value
		}
	},
	computed: {
		subtotal() {
			let soma = 0;
			_.forEach(this.custos, function(custo) {
				if (custo.valor) {
					soma += custo.valor;
				}
			});
			return soma;
		}
	},
	methods: {
		delRow(index) {
			this.custos.splice(index, 1);
		}
	},
	watch: {
		value (val) {
			this.custos = val;
		}
	}
}
</script>