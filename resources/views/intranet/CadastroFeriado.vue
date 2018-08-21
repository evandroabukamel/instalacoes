<template>
	<div class="columns is-centered">
		<div class="column">
			<h1 class="title is-clearfix" v-html="'Cadastro de feriados e folgas'"></h1>
			<b-message :closable="false">
				<form name="cadastroTecnicoForm" method="post" action="#"
					@submit.prevent="onSubmit"
					@keydown="form.errors.clear($event.target.name)"
					@change="form.errors.clear($event.target.name)">
					<div class="columns">
						<div class="column is-full">
							<b-message :closable="false" type="is-info" has-icon>
								Use essa tela para cadastrar os dias que você não poderá atender.
							</b-message>
							<date-time-picker placeholder="Data inicial e final"
								name="dataInicial"
								v-model="form.dateRange"
								:config="dataConfig"
								size="is-medium"
								:has-error="form.errors.has('dataInicial')"
								:error="form.errors.get('dataInicial')">
							</date-time-picker>
						</div>
					</div>
					<!-- Botões -->
					<div class="field has-addons has-addons-right">
						<div class="control">
							<button type="button" class="button is-primary is-medium"
								:class="{ 'is-loading': form.isLoading }"
								@click="onSubmit"
								@dblclick.prevent>
								Salvar
							</button>
						</div>
					</div>
				</form>
			</b-message>
			<hr>
			<div class="is-clearfix">
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
						<b-table-column field="f.dataInicial" label="Data inicial" sortable>
							{{ props.row.dataInicial | date }}
						</b-table-column>
						<b-table-column field="f.dataFinal" label="Data final" sortable>
							{{ props.row.dataFinal | date }}
						</b-table-column>
						<b-table-column label="Ações" numeric>
							<p v-if="!isDatePast(props.row.dataFinal)">
								<router-link :to="{ name: 'cadastro-feriado', params: {id: props.row.id} }"
									class="icon" title="Editar">
									<b-icon icon="pencil" size="is-medium"></b-icon>
								</router-link>
								<a href="#" class="icon" title="Remover" 
									@click.prevent="removerFeriado(props.row.id)">
									<b-icon icon="delete" type="is-danger" size="is-medium"></b-icon>
								</a>
							</p>
							<p v-else><b-icon icon="minus" type="is-dark" size="is-medium"></b-icon></p>
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
	</div>
</template>

<script>
import DateTimePicker from '../../components/DateTimePicker.vue';
import { mapGetters } from 'vuex';
import 'moment/locale/pt-br.js';
let moment = require('moment');
moment.locale('pt-br');

export default {
	components: { DateTimePicker },
	data() {
		return {
			form: new Form({
				id: null,
				tecnico: {},
				dataInicial: '',
				dataFinal: '',
				dateRange: ''
			}),
			data: [],
			total: 0,
			loading: false,
			sortField: 'f.dataInicial',
			sortOrder: 'desc',
			defaultSortOrder: 'desc',
			page: 1,
			perPage: 20
		}
	},

	computed: {
		...mapGetters([
			'dadosUsuario'
		]),

		dataConfig() {
			// Define a função externamente para poder acessar o Vue pelo this
			const onChange = (selectedDates, dateStr, instance) => {
				const dateArr = selectedDates.map(date => instance.formatDate(date, "Y-m-d"));
				this.form.dataInicial = dateArr[0];
				this.form.dataFinal = dateArr[1];
			};
			const disableDates = this.form.id > 0
				? null
				: { from: '1970-01-01', to: moment().subtract(1, 'days').format('YYYY-MM-DD') };
			let config = {
				wrap: true,
				mode: 'range',
				dateFormat: 'Y-m-d', 
				altInput: true,
				altFormat: 'l, j F, Y',
				onChange: onChange,
				disable: [ disableDates ]
			}
			return config;
		},
	},

	methods: {
		isDatePast(date) {
			return moment().diff(date) >= 0;
		},

		removerFeriado(id) {
			this.axios.post('/feriado/remover', { id: id })
			.then((response) => {
				if (response.data.message) {
					this.$toast.open({
						message: response.data.message ? response.data.message :  'Feriado removido com sucesso.',
						type: 'is-success',
						position: 'is-top',
						duration: 5000
					});
				}
				this.$router.push('/cadastro-feriado');
				this.getList();
			})
			.catch((error) => {
				if (error.response.data.message){
					this.$toast.open({
						message: error.response.data.message ? error.response.data.message :  'Erro ao salvar cadastro.',
						type: 'is-warning',
						position: 'is-top',
						duration: 7000
					});
				}
			});
		},

		urlBuilder (page) {
			return { name: this.$route.name, params: { page: page-1 } } // Changing page in location query
		},
		
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
			this.axios.get(`/feriado/getList/page=${this.page}&perPage=${this.perPage}`
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
		},

		onSubmit() {
            this.form.post('/feriado/salvar')
			.then(response => {
				if (response.message) {
					this.$toast.open({
						message: response.message ? response.message :  'Feriado salvo com sucesso.',
						type: 'is-success',
						position: 'is-top',
						duration: 5000
					});
					this.page = 1;
					this.getList();
				}
			})
            .catch(error => {
				if (error.message){
					this.$toast.open({
						message: error.message ? error.message :  'Erro ao salvar cadastro.',
						type: 'is-warning',
						position: 'is-top',
						duration: 7000
					});
				}
			});
		},

		setFormData(response, error) {
			if (error) {
				if (error.response.data.message){
					this.$toast.open({
						message: error.response.data.message ? error.response.data.message :  'Erro ao consultar cadastro.',
						type: 'is-warning',
						position: 'is-top',
						duration: 5000
					});
				}
			}
			else {
				this.form.reset();
				for (let field in this.form.data()) {
					this.form[field] = response.data[field];
				}
				this.form.dateRange = `${this.form.dataInicial} até ${this.form.dataFinal}`;
			}
		}
	},

	filters: {
		date(str) {
			try {
				return moment(str).format('ddd, D MMMM, YYYY')
			}
			catch (Exception) {
				return str;
			}
		}
	},

	created() {
		// fetch the data when the view is created and the data is
		// already being observed
		this.getList();
	},

	beforeRouteEnter (to, from, next) {
		let id;

		// Obtem o ID vindo nos parâmetros da route
		if (to.params.id) {
			id = to.params.id;
		}
		
		if (id) {
			Vue.axios.get('/feriado/findId/' + id)
			.then(response => {
				next(vm => {
					vm.setFormData(response, null); 
				});
			})
			.catch(error => {
				next(vm => {
					vm.setFormData(null, error); 
				});
			});
		} else {
			next(vm => {
				vm.form.reset(); 
			});
		}
	},

	// Quando a route muda e este componente já está renderizado, a lógica é diferente
	beforeRouteUpdate (to, from, next) {
		this.form.reset();
		let id;

		// Obtem o ID vindo nos parâmetros da route
		if (to.params.id) {
			id = to.params.id;
		}
				
		if (id) {
			this.axios.get('/feriado/findId/' + id)
			.then(response => {
				this.setFormData(response, null);
				next();
			})
			.catch(error => {
				this.setFormData(null, error);
				next();
			});
		} else {
			next();
		}
	}
}
</script>