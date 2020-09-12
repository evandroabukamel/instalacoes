<template>
  <b-dropdown class="is-pulled-right is-right">
    <button
      class="button is-primary is-medium button-round-medium"
      slot="trigger"
      title="Alterar situação"
    >
      <b-icon icon="pencil" size="is-big"></b-icon>
    </button>
    <b-dropdown-item v-if="showIniciar" @click="emit('iniciarConsultoria')">
      Iniciar consultoria
    </b-dropdown-item>
    <b-dropdown-item v-if="showFinalizar" @click="emit('finalizarConsultoria')">
      Finalizar consultoria
    </b-dropdown-item>
    <b-dropdown-item v-if="showConcluir" @click="emit('concluirConsultoria')">
      Concluir consultoria
    </b-dropdown-item>
    <hr class="dropdown-divider" />
    <b-dropdown-item v-if="showCancelar" @click="emit('cancelarConsultoria')">
      Cancelar consultoria
    </b-dropdown-item>
  </b-dropdown>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      isActive: false,
    };
  },

  props: {
    idConsultoria: Number,
    situacaoAtual: Number,
  },

  computed: {
    ...mapGetters(['situacaoConsultoria']),

    showIniciar() {
      return _.includes(
        [this.situacaoConsultoria.ABERTO, this.situacaoConsultoria.AGENDADO],
        this.situacaoAtual
      );
    },
    showFinalizar() {
      return _.includes(
        [this.situacaoConsultoria.EM_ANDAMENTO],
        this.situacaoAtual
      );
    },
    showConcluir() {
      return _.includes(
        [this.situacaoConsultoria.REALIZADO],
        this.situacaoAtual
      );
    },
    showCancelar() {
      return true;
    },
  },

  methods: {
    emit(val) {
      this.$emit(val);
    },
  },
};
</script>
