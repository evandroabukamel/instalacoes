<template>
  <b-field
    grouped
    group-multiline
    :type="error ? 'is-danger' : ''"
    :message="error"
  >
    <div class="control">
      <b-tooltip
        label="Adicione quantos horários quiser em cada dia, por exemplo,
				de 08:00 a 12:00 e de 13:00 a 18:00, deixando o intervalo para almoço."
        position="is-right"
        size="is-medium"
        :always="true"
        :active="showTooltipAgenda"
        multilined
      >
        <button
          type="button"
          class="button is-medium is-outlined"
          @click="showTooltipAgenda = !showTooltipAgenda"
        >
          <b-icon icon="help-circle-outline"></b-icon>
        </button>
      </b-tooltip>
    </div>
    <b-select v-model="agenda.diaSemana" :size="size" :class="[classes]">
      <!-- options vindas de alguma fonte de dados -->
      <option
        v-for="(option, index) in diasSemana"
        v-bind:key="index"
        :value="index"
        :selected="index == agenda.diaSemana"
      >
        {{ option }}
      </option>
    </b-select>
    <p class="control shrink">
      <b-field grouped>
        <p class="control shrink">
          <flat-pickr
            autocomplete="off"
            name="horarioInicial"
            v-model="agenda.horarioInicial"
            placeholder="Horário inicial"
            :class="`${size} input`"
            :config="timePickerConfig"
          >
          </flat-pickr>
        </p>
        <p class="control shrink">
          <flat-pickr
            autocomplete="off"
            name="horarioFinal"
            v-model="agenda.horarioFinal"
            placeholder="Horário final"
            :class="`${size} input`"
            :config="timePickerConfig"
          >
          </flat-pickr>
        </p>
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
    </p>
  </b-field>
</template>

<script>
import BaseInput from './BaseInput.js';
import Agenda from '../core/Agenda.js';
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import { Portuguese } from 'flatpickr/dist/l10n/pt.js';

export default {
  name: 'input-agenda',
  mixins: [BaseInput],
  components: { flatPickr },
  data() {
    return {
      agenda: new Agenda({
        id: null,
        diaSemana: 0,
        horarioInicial: '',
        horarioFinal: '',
      }),
      diasSemana: [
        'Domingo',
        'Segunda',
        'Terça',
        'Quarta',
        'Quinta',
        'Sexta',
        'Sábado',
      ],
      showTooltipAgenda: false,
    };
  },
  computed: {
    isValid() {
      return (
        /^\d{2,}:(?:[0-5]\d):(?:[0-5]\d)$/.test(this.agenda.horarioInicial) &&
        /^\d{2,}:(?:[0-5]\d):(?:[0-5]\d)$/.test(this.agenda.horarioFinal) &&
        parseInt(this.agenda.horarioInicial) < 24 &&
        parseInt(this.agenda.horarioFinal) < 24 &&
        this.agenda.horarioInicial < this.agenda.horarioFinal
      );
    },
    timePickerConfig() {
      return {
        wrap: true,
        dateFormat: 'H:i:S',
        altInput: true,
        altFormat: 'H:i',
        noCalendar: true,
        enableTime: true,
        enableSeconds: false,
        time_24hr: true,
      };
    },
  },
  methods: {
    add() {
      this.$emit('add', this.agenda.data());
      this.agenda.diaSemana = (this.agenda.diaSemana + 1) % 7;
    },
  },
};
</script>

<style scoped>
.shrink {
  flex-grow: 1;
  flex-shrink: 1 !important;
}
</style>
