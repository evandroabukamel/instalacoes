<template>
  <div>
    <h1 class="title is-clearfix">Lista de agendamentos / ordens de serviço</h1>
    <div class="is-clearfix">
      <b-field position="is-right" :addons="true" grouped>
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
        :row-class="
          (row, index) =>
            dateIsToday(row.dataAgendamento)
              ? 'agendamento-hoje'
              : row.idSituacao == situacaoAgendamento.AGUARDANDO_CONFIRMACAO
              ? 'agendamento-aguardando-confirmacao'
              : ''
        "
      >
        <template slot-scope="props">
          <b-table-column field="a.id" label="#" numeric sortable>
            {{ props.row.id }}
          </b-table-column>
          <b-table-column field="a.beneficiario" label="Beneficiário" sortable>
            {{ props.row.beneficiario }}
          </b-table-column>
          <b-table-column field="a.placaVeiculo" label="Veículo" sortable>
            {{ props.row.placaVeiculo }}
          </b-table-column>
          <b-table-column
            field="c.nome"
            label="Cliente"
            sortable
            v-if="isUsuarioMatrizFilial"
          >
            {{ props.row.cliente }}
          </b-table-column>
          <b-table-column
            field="e.nome"
            label="Empresa"
            sortable
            v-if="isUsuarioMatrizFilial"
          >
            {{ props.row.empresa }}
          </b-table-column>
          <b-table-column
            field="t.nome"
            label="Técnico"
            sortable
            v-if="isUsuarioMatrizFilial || isUsuarioEmpresa"
          >
            {{ props.row.tecnico }}
          </b-table-column>
          <b-table-column field="ts.descricao" label="Serviço" sortable>
            {{ props.row.tipoServico }}
          </b-table-column>
          <b-table-column
            field="a.dataAgendamento"
            label="Data/Hora Agendamento"
            sortable
          >
            {{ props.row.dataAgendamento | date }} às
            {{ props.row.horaAgendamento | time }}
          </b-table-column>
          <b-table-column field="en.cidade" label="Localização" sortable>
            {{ props.row.localizacao }}
          </b-table-column>
          <b-table-column field="a.idSituacao" label="Situação" sortable>
            {{ props.row.situacao | capitalize }}
          </b-table-column>
          <b-table-column label="Ações" numeric>
            <router-link
              :to="{
                name: 'cadastro-agendamento',
                params: { id: props.row.id },
              }"
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
import { mapGetters } from 'vuex';
import GlobalFilters from '../../components/GlobalFilters.js';
import 'moment/locale/pt-br.js';
let moment = require('moment');
moment.locale('pt-br');

export default {
  mixins: [GlobalFilters],
  data() {
    return {
      data: [],
      total: 0,
      loading: false,
      sortField: 'a.id',
      sortOrder: 'desc',
      defaultSortOrder: 'desc',
      page: 1,
      perPage: 20,
      text: '',
    };
  },
  computed: {
    ...mapGetters([
      'isUsuarioMatrizFilial',
      'isUsuarioEmpresa',
      'situacaoAgendamento',
    ]),
  },

  filters: {
    date(str) {
      try {
        if (moment(str).isValid()) {
          return moment(str).format('ddd, D MMMM, YYYY');
        } else {
          return str;
        }
      } catch (Exception) {
        return str;
      }
    },
    time(str) {
      try {
        if (str.length == 8) {
          return str.substr(0, 5);
        } else {
          return moment(str).format('HH:mm');
        }
      } catch (Exception) {
        return str;
      }
    },
  },

  methods: {
    buscar: _.debounce(function () {
      this.getList();
    }, 1500),

    dateIsToday(date) {
      return moment().isSame(date, 'day');
    },

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
      this.axios
        .get(
          `/agendamento/getList/page=${this.page}&perPage=${this.perPage}&text=${this.text}` +
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

<style lang="scss">
@import '../../styles/colors.sass';

tr.agendamento-hoje {
  background-color: lighten(desaturate($success, 10%), 25%) !important;
}
tr.agendamento-aguardando-confirmacao {
  background-color: lighten($warning, 15%) !important;
}
</style>
