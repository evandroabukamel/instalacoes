<template>
  <div>
    <h1 class="title is-clearfix">Lista de estoque</h1>
    <div class="is-clearfix">
      <b-field position="is-right" :addons="true" grouped group-multiline>
        <b-select
          name="classe"
          v-model="classe"
          @input="getList()"
          placeholder="Tipo de item"
        >
          <option value="" disabled>Tipo de Item</option>
          <option value="chip">Chip</option>
          <option value="equipamento">Equipamento</option>
        </b-select>
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
          <b-table-column field="t.nome" label="Técnico" sortable>
            <span v-if="Boolean(props.row.tecnico)">
              {{ props.row.tecnico }}
            </span>
          </b-table-column>
          <b-table-column field="c.nome" label="Cliente" sortable>
            <span v-if="Boolean(props.row.cliente)">
              {{ props.row.cliente }}
            </span>
          </b-table-column>
          <b-table-column
            field="e.imei"
            label="IMEI"
            sortable
            :visible="classe == 'equipamento' || classe == 'chip'"
          >
            <span v-if="Boolean(props.row.imei)">
              {{ props.row.imei | formatImei }}
            </span>
          </b-table-column>
          <b-table-column
            field="e.iccid"
            label="ICCID"
            sortable
            :visible="classe == 'chip'"
          >
            <span v-if="Boolean(props.row.iccid)">
              {{ props.row.iccid | formatIccid }}
            </span>
          </b-table-column>
          <b-table-column
            field="e.telefone"
            label="Telefone"
            sortable
            :visible="classe == 'chip'"
          >
            {{ props.row.telefone }}
          </b-table-column>
          <b-table-column
            field="e.operadora"
            label="Operadora"
            sortable
            :visible="classe == 'chip'"
          >
            {{ props.row.operadora }}
          </b-table-column>
          <b-table-column
            field="e.numero"
            label="Número"
            sortable
            :visible="classe == 'equipamento'"
          >
            {{ props.row.numero }}
          </b-table-column>
          <b-table-column
            field="mar.descricao"
            label="Marca equipamento"
            sortable
            :visible="classe == 'equipamento'"
          >
            {{ props.row.marcaEquipamento }}
          </b-table-column>
          <b-table-column
            field="mod.descricao"
            label="Modelo equipamento"
            sortable
            :visible="classe == 'equipamento'"
          >
            {{ props.row.modeloEquipamento }}
          </b-table-column>
          <b-table-column field="e.idSituacao" label="Situação" sortable>
            {{ props.row.situacao | capitalize }}
          </b-table-column>
          <b-table-column label="Ações" numeric>
            <router-link
              :to="{ name: 'cadastro-estoque', params: { id: props.row.id } }"
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
              <p v-show="classe">
                <b-icon icon="emoticon-sad" size="is-large"> </b-icon>
              </p>
              <p v-show="classe">Nada foi encontrado.</p>
              <p v-show="!classe">
                <b-icon icon="information-outline" size="is-large"> </b-icon>
              </p>
              <p v-show="!classe">Selecione o tipo de item.</p>
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
      sortField: 'e.imei',
      sortOrder: 'asc',
      defaultSortOrder: 'asc',
      page: 1,
      perPage: 20,
      text: '',
      classe: '',
    };
  },

  methods: {
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
      // Só executa a busca se a classe for selecionada
      if (this.classe) {
        this.loading = true;
        this.axios
          .get(
            `/estoque/getList/classe=${this.classe}&page=${this.page}&perPage=${this.perPage}` +
              `&text=${this.text}&sortField=${this.sortField}&sortOrder=${this.sortOrder}`
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
      }
    },
  },

  mounted() {
    this.getList();
  },
};
</script>
