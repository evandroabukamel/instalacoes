<template>
  <b-table
    :data="data"
    :loading="loading"
    checkable
    :checked-rows.sync="checkedRows"
    @check="onCheck"
    :custom-is-checked="
      (a, b) => {
        return a.id === b.id;
      }
    "
    paginated
    :total="total"
    :per-page="perPage"
    :default-sort-direction="defaultSortOrder"
    :default-sort="[sortField, sortOrder]"
    :mobile-cards="true"
    class="table is-fullwidth"
  >
    <template slot-scope="props">
      <b-table-column field="id" label="#" numeric sortable>
        {{ props.row.id }}
      </b-table-column>
      <b-table-column field="beneficiario" label="Beneficiário" sortable>
        {{ props.row.beneficiario }}
      </b-table-column>
      <b-table-column field="placaVeiculo" label="Veículo" sortable>
        {{ props.row.placaVeiculo }}
      </b-table-column>
      <b-table-column field="nome" label="Cliente" sortable>
        {{ props.row.cliente }}
      </b-table-column>
      <b-table-column field="nome" label="Técnico" sortable>
        {{ props.row.tecnico }}
      </b-table-column>
      <b-table-column field="descricao" label="Serviço" sortable>
        {{ props.row.tipoServico }}
      </b-table-column>
      <b-table-column
        field="dataAgendamento"
        label="Data/Hora agendamento"
        sortable
      >
        {{ props.row.dataAgendamento | date }} às
        {{ props.row.horaAgendamento | time }}
      </b-table-column>
      <b-table-column field="cidade" label="Localização" sortable>
        {{ props.row.localizacao }}
      </b-table-column>
      <b-table-column label="Valor total" v-if="tipo == 'receita'">
        {{ props.row.valorTotalVenda | formatMoney }}
      </b-table-column>
      <b-table-column label="Valor total" v-if="tipo == 'pagamento'">
        {{ props.row.valorTotalCusto | formatMoney }}
      </b-table-column>
    </template>
    <template slot="bottom-left">
      <b>Total</b>: {{ valorTotal | formatMoney }}
    </template>
    <template slot="empty">
      <section class="section" v-show="!loading">
        <div class="content has-text-grey has-text-centered">
          <p>
            <b-icon icon="emoticon-neutral" size="is-large"> </b-icon>
          </p>
          <p v-show="!Boolean(this.idObjeto)">
            Selecione o cliente ou o técnico.
          </p>
          <p v-show="Boolean(this.idObjeto > 0)">
            Nenhuma ordem de serviço concluída para lançar.
          </p>
        </div>
      </section>
    </template>
  </b-table>
</template>

<script>
import GlobalFilters from '../../../components/GlobalFilters.js';
import 'moment/locale/pt-br.js';
let moment = require('moment');
moment.locale('pt-br');

export default {
  mixins: [GlobalFilters],
  data() {
    return {
      data: [],
      checkedRows: [],
      total: 0,
      loading: false,
      sortField: 'id',
      sortOrder: 'desc',
      defaultSortOrder: 'desc',
      page: 1,
      perPage: 20,
    };
  },

  props: {
    tipo: {
      type: String,
      default: '',
    },
    classe: {
      type: String,
      default: '',
    },
    situacao: {
      type: String,
      default: '',
    },
    idLancamento: {
      type: Number,
      default: 0,
    },
    idObjeto: {
      type: Number,
      default: 0,
    },
    agendamentos: {
      type: Array,
      default: () => [],
    },
  },

  computed: {
    valorTotal() {
      let total = 0.0;
      let vm = this;
      _.forEach(this.checkedRows, function (obj) {
        if (vm.tipo == 'receita' && obj.valorTotalVenda) {
          total += obj.valorTotalVenda;
        } else if (vm.tipo == 'pagamento' && obj.valorTotalCusto) {
          total += obj.valorTotalCusto;
        }
      });
      return total;
    },
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
    onCheck(checkedList, row) {
      this.$emit('update:agendamentos', checkedList);
    },

    reset() {
      this.data = [];
    },

    getValorTotal() {
      let total = 0.0;
      let vm = this;
      _.forEach(this.checkedRows, function (obj) {
        if (vm.tipo == 'receita' && obj.valorTotalVenda) {
          total += obj.valorTotalVenda;
        } else if (vm.tipo == 'pagamento' && obj.valorTotalCusto) {
          total += obj.valorTotalCusto;
        }
      });
      return total;
    },

    getList() {
      if (this.idObjeto > 0 && this.situacao == 'A') {
        this.loading = true;
        this.axios
          .get(
            `/lancamento/getAgendamentosConcluidosList/page=${this.page}&perPage=${this.perPage}` +
              `&classe=${this.classe}&idObjeto=${this.idObjeto}&idLancamento=${this.idLancamento}&tipo=${this.tipo}`
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
      } else {
        this.data = [];
      }
    },
  },

  mounted() {
    this.getList();
  },

  watch: {
    idObjeto(val, oldVal) {
      if (this.situacao == 'A') {
        if (val > 0 && val != oldVal) {
          this.getList();
        }
      } else {
        this.data = this.agendamentos;
      }
    },

    agendamentos(val) {
      this.checkedRows = val;
      if (this.situacao == 'F' || this.situacao == 'C') {
        this.data = this.agendamentos;
      }
    },
  },
};
</script>
