<template>
	<div>
		<h1 class="title is-clearfix">Lista de usuários</h1>
		<div class="is-clearfix">
			<b-field position="is-right" :addons="true" grouped>
				<b-input placeholder="Procurar..."
					v-model="text" 
					@input="buscar()"
					type="search"
					icon="magnify">
				</b-input>
			</b-field>
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
					<b-table-column field="u.nome" label="Nome" sortable>
						{{ props.row.nome }}
					</b-table-column>
					<b-table-column field="u.email" label="E-mail" sortable>
						{{ props.row.email }}
					</b-table-column>
					<b-table-column field="u.telefone" label="Telefone" sortable>
						{{ props.row.telefone | formatTelefone }}
					</b-table-column>
					<b-table-column field="u.idSituacao" label="Situação" sortable>
						{{ props.row.situacao | capitalize }}
					</b-table-column>
					<b-table-column label="Ações" numeric>
						<router-link :to="{ name: 'cadastro-usuario', params: {id: props.row.id} }"
							class="icon" title="Editar">
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
import GlobalFilters from '../../components/GlobalFilters.js';

export default {
	mixins: [ GlobalFilters ],
	data() {
		return {
			data: [],
			total: 0,
			loading: false,
			sortField: 'u.nome',
			sortOrder: 'asc',
			defaultSortOrder: 'asc',
			page: 1,
			perPage: 20,
			text: ''
		}
	},

	methods: {
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

			this.axios.get(`/usuario/getList/page=${this.page}&perPage=${this.perPage}&text=${this.text}`
				+ `&sortField=${this.sortField}&sortOrder=${this.sortOrder}`)
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