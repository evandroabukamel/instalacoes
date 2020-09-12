<template>
  <b-field :addons="true" grouped>
    <b-field expanded :type="error ? 'is-danger' : ''" :message="error">
      <b-field expanded grouped group-multiline>
        <div class="control is-expanded is-clearfix">
          <b-field expanded>
            <input
              type="text"
              class="input is-flex"
              autocomplete="off"
              :name="`${name}-descricao`"
              v-model="custo.descricao"
              placeholder="Descrição"
              :class="[classes, size]"
            />
          </b-field>
        </div>
        <div class="control is-expanded" style="width: 30% !important">
          <money
            class="input"
            :name="`${name}-valor`"
            v-model="custo.valor"
            v-bind="moneyOptions"
            :class="[classes, size]"
          ></money>
        </div>
        <div class="control">
          <button
            type="button"
            class="button is-primary"
            title="Adicionar"
            :class="[classes, size]"
            @click="add"
            :disabled="!isValid"
          >
            <b-icon icon="plus" :size="size"></b-icon>
          </button>
        </div>
      </b-field>
    </b-field>
  </b-field>
</template>

<script>
import BaseInput from './BaseInput.js';
import Custo from '../core/Custo.js';
import { Money } from 'v-money';

export default {
  name: 'input-custo',
  mixins: [BaseInput],
  components: { Money },
  data() {
    return {
      custo: new Custo({
        id: null,
        descricao: '',
        valor: 0,
      }),
    };
  },
  computed: {
    isValid() {
      return this.custo.descricao.length >= 2 && this.custo.valor != 0;
    },
    moneyOptions() {
      return {
        decimal: ',',
        thousands: '.',
        prefix: 'R$ ',
        suffix: '',
        precision: 2,
        masked: false,
      };
    },
  },
  methods: {
    add() {
      this.$emit('add', this.custo.data());
      this.custo.clear();
    },
  },
};
</script>

<style>
.field.has-addons .control.is-expanded {
  flex-grow: 1;
  flex-shrink: 1 !important;
}
</style>
