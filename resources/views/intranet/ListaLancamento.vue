<template>
	<div>
		<h1 class="title is-clearfix">Lista de lançamentos</h1>
		<div class="is-clearfix">
			<div class="not-print">
				<b-field position="is-right" :addons="true" grouped>
					<b-select name="classe" v-model="tipo"
						@input="getList()"
						placeholder="Tipo de lançamento">
						<option value="" disabled>Tipo de lançamento</option>
						<option value="receita">Receita</option>
						<option value="pagamento">Pagamento</option>
						<option value="todos">Todos</option>
					</b-select>
					<b-input placeholder="Procurar..."
						v-model="text" 
						@input="buscar()"
						type="search"
						icon="magnify">
					</b-input>
				</b-field>
			</div>
			<b-table
				:data="data"
				:loading="loading"
				paginated
				backend-pagination
				:total="total"
				:per-page="perPage"
				@page-change="onPageChange"
				backend-sorting
				:default-sort-direction="defaultSortOrder"
				:default-sort="[sortField, sortOrder]"
				@sort="onSort"
				:mobile-cards="true" 
				class="table is-fullwidth">
				<template slot-scope="props">
					<b-table-column field="l.id" label="#" numeric sortable>
						{{ props.row.id }}
					</b-table-column>
					<b-table-column field="c.nome" label="Cliente" sortable :visible="Boolean(props.row.cliente)">
						{{ props.row.cliente || '' }}
					</b-table-column>
					<b-table-column field="t.nome" label="Técnico" sortable :visible="Boolean(props.row.tecnico)">
						{{ props.row.tecnico || '' }}
					</b-table-column>
					<b-table-column label="Tipo">
						<b-tag v-if="props.row.cliente" type="is-success">
							Receita
						</b-tag> 
						<b-tag v-else type="is-danger">
							Pagamento
						</b-tag>
					</b-table-column>
					<b-table-column field="l.valor" label="Valor" sortable>
						{{ props.row.valor|formatMoney }}
					</b-table-column>
					<b-table-column field="l.dataEmissao" label="Data emissão" sortable>
						{{ props.row.dataEmissao|date }}
					</b-table-column>
					<b-table-column field="l.dataPagamento" label="Data pagamento" sortable>
						{{ props.row.dataPagamento|date }}
					</b-table-column>
					<b-table-column field="l.situacao" label="Situação" sortable>
						<b-tag :type="typeSituacao(props.row.situacao)">
							{{ props.row.situacaoDescricao }}
						</b-tag>
					</b-table-column>
					<b-table-column label="Ações" numeric>
						<router-link :to="{ name: 'cadastro-lancamento', params: {id: props.row.id} }"
							class="icon not-print" title="Editar">
							<b-icon icon="pencil" size="is-medium"></b-icon>
						</router-link>
					</b-table-column>
				</template>
				<template slot="empty">
					<section class="section" v-show="!loading">
						<div class="content has-text-grey has-text-centered">
							<p>
								<b-icon
									icon="emoticon-sad"
									size="is-large">
								</b-icon>
							</p>
							<p>Nada foi encontrado.</p>
						</div>
					</section>
				</template>
			</b-table>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import GlobalFilters from '../../components/GlobalFilters.js';
import 'moment/locale/pt-br.js';
let moment = require('moment');
moment.locale('pt-br');

export default {
	mixins: [ GlobalFilters ],
	data() {
		return {
			data: [],
			total: 0,
			loading: false,
			sortField: 'l.dataEmissao',
			sortOrder: 'desc',
			defaultSortOrder: 'desc',
			page: 1,
			perPage: 20,
			tipo: '',
			text: ''
		}
	},

	filters: {
		date(str) {
			try {
				if (moment(str).isValid())
					return moment(str).format('ddd, D MMMM, YYYY');
				else 
					return str;
			}
			catch (Exception) {
				return str;
			}
		},
		time(str) {
			try {
				if (str.length == 8)
					return str.substr(0,5);
				else
					return moment(str).format('HH:mm');
			}
			catch (Exception) {
				return str;
			}
		}
	},

	methods: {
		typeSituacao(situacao) {
			return situacao == 'A' ? 'is-primary'
				: situacao == 'F' ? 'is-black'
				: situacao == 'C' ? 'is-light' : 'is-white';
		},

		buscar: _.debounce(function() {
			this.getList();
		}, 1500),

		onPageChange(page) {
			this.page = page
			this.getList();
		},

		onSort(field, order) {
			this.sortField = field;
			this.sortOrder = order;
			this.getList();
		},
			
		getList() {
			this.loading = true;
			this.axios.get(`/lancamento/getList/tipo=${this.tipo}&page=${this.page}&perPage=${this.perPage}`
				+ `&text=${this.text}&sortField=${this.sortField}&sortOrder=${this.sortOrder}`)
			.then(({ data }) => {
				this.data = [];
				let currentTotal = data.totalResults;
				if (data.totalResults / this.perPage > 1000) {
					currentTotal = this.perPage * 1000;
				}
				this.total = currentTotal;
				data.results.forEach((item) => this.data.push(item));
				this.loading = false;
			})
			.catch(response => {
				this.data = [];
				this.total = 0;
				this.loading = false;
				this.$toast.open({
					message: response.data.message ? response.data.message : 'Falha ao carregar dados, tente novamente.',
					type: 'is-warning',
					position: 'is-top',
					duration: 5000
				});
			});
		}
	},
	
	mounted() {
		this.getList();
	}
}
</script>