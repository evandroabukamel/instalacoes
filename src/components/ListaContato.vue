<template>
  <b-table
    :bordered="false"
    :striped="true"
    :mobile-cards="true"
    class="table is-fullwidth"
    :data="contatos || []"
  >
    <template slot-scope="props">
      <b-table-column label="Tipo">
        {{ props.row.tipoText || tipoText(props.row.tipo) }}
      </b-table-column>
      <b-table-column label="Contato" v-if="props.row.tipo == 'telefone'">
        {{ props.row.telefone | formatTelefone }}
      </b-table-column>
      <b-table-column label="Contato" v-else-if="props.row.tipo == 'email'">
        <p class="breakline">{{ props.row.email }}</p>
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
  </b-table>
</template>

<script>
import GlobalFilters from './GlobalFilters.js';

export default {
  name: 'lista-contato',
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
      contatos: this.value,
    };
  },
  methods: {
    delRow(index) {
      this.contatos.splice(index, 1);
    },
    tipoText(tipo) {
      return tipo == 'telefone' ? 'Telefone' : tipo == 'email' ? 'E-mail' : '';
    },
  },
  watch: {
    value(val) {
      this.contatos = val;
    },
  },
};
</script>
