<template>
  <b-table
    :bordered="false"
    :striped="true"
    :mobile-cards="true"
    class="table is-fullwidth"
    :data="consultoriaHorarios || []"
  >
    <template slot-scope="props">
      <b-table-column label="Data">
        {{ props.row.data | date }}
      </b-table-column>
      <b-table-column label="Início">
        {{ props.row.horaInicial | horaMinuto }}
      </b-table-column>
      <b-table-column label="Fim">
        {{ props.row.horaFinal | horaMinuto }}
      </b-table-column>
      <b-table-column label="Tempo">
        {{ timeDiff(props.row.horaInicial, props.row.horaFinal) }}
      </b-table-column>
      <b-table-column label="Conversado com">
        {{ props.row.conversadoCom }}
      </b-table-column>
      <b-table-column label="Meio">
        {{ props.row.meioComunicacao.descricao }}
      </b-table-column>
      <b-table-column label="" :visible="showRemoveButton" :width="50">
        <button
          type="button"
          class="delete"
          title="Remover"
          v-if="showRemoveButton"
          @click="delRow(props.index)"
        ></button>
      </b-table-column>
    </template>
    <template slot="footer">
      <th>Total</th>
      <td></td>
      <td></td>
      <td class="is-auto">
        <strong>{{ total | time }}</strong>
      </td>
      <td></td>
      <td></td>
      <th v-show="showRemoveButton"></th>
    </template>
  </b-table>
</template>

<script>
import GlobalFilters from '../../../components/GlobalFilters.js';
import 'moment/locale/pt-br.js';
let moment = require('moment');
moment.locale('pt-br');

export default {
  name: 'lista-consultoria-horario',
  mixins: [GlobalFilters],
  props: {
    value: {
      type: Array | Object,
      default: [],
    },
    showRemoveButton: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      consultoriaHorarios: this.value,
      listaMeiosComunicacao: [],
    };
  },
  computed: {
    total() {
      let soma = moment('00:00:00', 'HH:mm:ss');
      _.forEach(this.consultoriaHorarios, function (consultoriaHorario) {
        let start = moment(consultoriaHorario.horaInicial, 'HH:mm:ss');
        let end = moment(consultoriaHorario.horaFinal, 'HH:mm:ss');
        soma.add(end.diff(start, 'minutes'), 'minutes');
      });
      return soma;
    },
  },
  methods: {
    timeDiff(horaInicial, horaFinal) {
      let soma = moment('00:00:00', 'HH:mm:ss');
      let start = moment(horaInicial, 'HH:mm:ss');
      let end = moment(horaFinal, 'HH:mm:ss');
      return soma.add(end.diff(start, 'minutes'), 'minutes').format('HH:mm');
    },
    delRow(index) {
      this.consultoriaHorarios.splice(index, 1);
    },
  },
  watch: {
    value(val) {
      this.consultoriaHorarios = val;
    },
  },
  filters: {
    date(str) {
      try {
        return moment(str).format('ddd, D MMMM, YYYY');
      } catch (Exception) {
        return str;
      }
    },
    time(str) {
      try {
        return moment(str).format('HH:mm');
      } catch (Exception) {
        return str;
      }
    },
  },
};
</script>
