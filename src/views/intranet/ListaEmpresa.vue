<template>
  <div>
    <h1 class="title is-clearfix">Lista de empresas</h1>
    <div class="is-clearfix">
      <b-field
        position="is-right"
        :addons="true"
        grouped
        v-if="!$route.meta.situacao"
      >
        <b-input
          placeholder="Procurar..."
          v-model="text"
          @input="buscar()"
          type="search"
          icon="magnify"
        >
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
        class="table is-fullwidth"
      >
        <template slot-scope="props">
          <b-table-column field="e.nome" label="Nome" sortable>
            {{ props.row.nome }}
          </b-table-column>
          <b-table-column field="e.cpfcnpj" label="CPF/CNPJ" sortable>
            {{ props.row.cpfcnpj | formatCpfCnpj }}
          </b-table-column>
          <b-table-column
            field="e.classificacao"
            label="Classificação"
            centered
            sortable
          >
            <span
              class="tag is-medium"
              :class="rating(props.row.classificacao)"
            >
              {{ props.row.classificacao }}
            </span>
          </b-table-column>
          <b-table-column field="en.cidade" label="Localização" sortable>
            {{ props.row.localizacao }}
          </b-table-column>
          <b-table-column field="e.idSituacao" label="Situação" sortable>
            {{ props.row.situacao | capitalize }}
          </b-table-column>
          <b-table-column label="Ações" numeric>
            <router-link
              :to="{ name: 'cadastro-empresa', params: { id: props.row.id } }"
              class="icon"
              title="Editar"
            >
              <b-icon icon="pencil" size="is-medium"></b-icon>
            </router-link>
          </b-table-column>
        </template>
        <template slot="empty">
          <section class="section" v-show="!loading">
            <div class="content has-text-grey has-text-centered">
              <p>
                <b-icon icon="emoticon-sad" size="is-large"> </b-icon>
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
  mixins: [GlobalFilters],
  data() {
    return {
      data: [],
      total: 0,
      loading: false,
      sortField: 'e.nome',
      sortOrder: 'asc',
      defaultSortOrder: 'asc',
      page: 1,
      perPage: 20,
      text: '',
    };
  },

  methods: {
    /**
     * Calcula a cor de fundo do número da classificação.
     */
    rating(value) {
      const number = parseFloat(value);
      if (number < 2) {
        return 'is-danger';
      } else if (number >= 2 && number < 4) {
        return 'is-warning';
      } else if (number >= 4) {
        return 'is-success';
      }
    },

    buscar: _.debounce(function () {
      this.getList();
    }, 1500),

    onPageChange(page) {
      this.page = page;
      this.getList();
    },

    onSort(field, order) {
      this.sortField = field;
      this.sortOrder = order;
      this.getList();
    },

    getList() {
      this.loading = true;

      if (this.$route.meta.situacao) {
        this.text = this.$route.meta.situacao;
      }

      this.axios
        .get(
          `/empresa/getList/page=${this.page}&perPage=${this.perPage}&text=${this.text}` +
            `&sortField=${this.sortField}&sortOrder=${this.sortOrder}`
        )
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
        .catch((response) => {
          this.data = [];
          this.total = 0;
          this.loading = false;
          this.$toast.open({
            message: response.data.message
              ? response.data.message
              : 'Falha ao carregar dados, tente novamente.',
            type: 'is-warning',
            position: 'is-top',
            duration: 5000,
          });
        });
    },
  },

  mounted() {
    this.getList();
  },
};
</script>
