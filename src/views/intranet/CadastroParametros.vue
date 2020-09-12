<template>
  <div class="columns is-centered">
    <div class="column">
      <h1 class="title is-clearfix" v-html="'Par&acirc;metros do sistema'"></h1>
      <b-message :closable="false">
        <form
          name="cadastroParametrosForm"
          method="post"
          action="#"
          @keydown="form.errors.clear($event.target.name)"
          @change="form.errors.clear($event.target.name)"
        >
          <div class="columns">
            <div class="column is-half-desktop">
              <input-text
                type="number"
                name="diasAntecedenciaAgendamentoSemEnvio"
                v-model="form.diasAntecedenciaAgendamentoSemEnvio"
                size="is-medium"
                placeholder="Dias de antecedência para agendamento sem envio"
                :has-error="
                  form.errors.has('diasAntecedenciaAgendamentoSemEnvio')
                "
                :error="form.errors.get('diasAntecedenciaAgendamentoSemEnvio')"
              ></input-text>
            </div>
            <div class="column is-half-desktop">
              <select-ajax
                name="tipoAntecedenciaAgendamentoSemEnvio"
                v-model="form.tipoAntecedenciaAgendamentoSemEnvio"
                size="is-medium"
                placeholder="Tipo de antecedência para agendamento sem envio"
                control-type="is-primary"
                :has-error="
                  form.errors.has('tipoAntecedenciaAgendamentoSemEnvio')
                "
                :error="form.errors.get('tipoAntecedenciaAgendamentoSemEnvio')"
                v-on:errorSelectAjax="
                  form.setSelectError(
                    'tipoAntecedenciaAgendamentoSemEnvio',
                    $event
                  )
                "
              >
                <option
                  value=""
                  disabled
                  v-html="
                    'Tipo de anteced&ecirc;ncia para agendamento sem envio'
                  "
                ></option>
                <option value="DIAS_CORRIDOS">Dias corridos</option>
                <option
                  value="DIAS_UTEIS"
                  v-html="'Dias &uacute;teis'"
                ></option>
              </select-ajax>
            </div>
          </div>
          <div class="columns">
            <div class="column is-half-desktop">
              <input-text
                type="number"
                name="diasAntecedenciaAgendamentoComEnvio"
                v-model="form.diasAntecedenciaAgendamentoComEnvio"
                size="is-medium"
                placeholder="Dias de antecedência para agendamento com envio"
                :has-error="
                  form.errors.has('diasAntecedenciaAgendamentoComEnvio')
                "
                :error="form.errors.get('diasAntecedenciaAgendamentoComEnvio')"
              ></input-text>
            </div>
            <div class="column is-half-desktop">
              <select-ajax
                name="tipoAntecedenciaAgendamentoComEnvio"
                v-model="form.tipoAntecedenciaAgendamentoComEnvio"
                size="is-medium"
                placeholder="Tipo de antecedência para agendamento com envio"
                control-type="is-primary"
                :has-error="
                  form.errors.has('tipoAntecedenciaAgendamentoComEnvio')
                "
                :error="form.errors.get('tipoAntecedenciaAgendamentoComEnvio')"
                v-on:errorSelectAjax="
                  form.setSelectError(
                    'tipoAntecedenciaAgendamentoComEnvio',
                    $event
                  )
                "
              >
                <option
                  value=""
                  disabled
                  v-html="
                    'Tipo de anteced&ecirc;ncia para agendamento com envio'
                  "
                ></option>
                <option value="DIAS_CORRIDOS">Dias corridos</option>
                <option
                  value="DIAS_UTEIS"
                  v-html="'Dias &uacute;teis'"
                ></option>
              </select-ajax>
            </div>
          </div>
          <div class="columns">
            <div class="column is-half-desktop">
              <input-text
                type="number"
                name="raioKmBuscaEmpresa"
                v-model="form.raioKmBuscaEmpresa"
                size="is-medium"
                placeholder="Raio (Km) para busca de empresas"
                :has-error="form.errors.has('raioKmBuscaEmpresa')"
                :error="form.errors.get('raioKmBuscaEmpresa')"
              ></input-text>
            </div>
          </div>
          <!-- Botões -->
          <div class="field has-addons has-addons-right">
            <div class="control">
              <button
                type="button"
                class="button is-primary is-medium"
                :class="{ 'is-loading': form.isLoading }"
                @click="onSubmit"
                @dblclick.prevent
              >
                Salvar
              </button>
            </div>
          </div>
        </form>
      </b-message>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: new Form({
        id: null,
        diasAntecedenciaAgendamentoSemEnvio: null,
        tipoAntecedenciaAgendamentoSemEnvio: null,
        diasAntecedenciaAgendamentoComEnvio: null,
        tipoAntecedenciaAgendamentoComEnvio: null,
        raioKmBuscaEmpresa: null,
      }),
    };
  },

  methods: {
    onSubmit() {
      this.form
        .post('/parametros/salvar')
        .then((response) => {
          if (response.message) {
            this.$toast.open({
              message: response.message
                ? response.message
                : 'Cadastro salvo com sucesso.',
              type: 'is-success',
              position: 'is-top',
              duration: 5000,
            });
            this.$router.push('/intranet');
          }
        })
        .catch((error) => {
          if (error.message) {
            this.$toast.open({
              message: error.message
                ? error.message
                : 'Erro ao salvar cadastro.',
              type: 'is-warning',
              position: 'is-top',
              duration: 7000,
            });
          }
        });
    },

    setFormData(response, error) {
      if (error) {
        if (error.response.data.message) {
          this.$toast.open({
            message: error.response.data.message
              ? error.response.data.message
              : 'Erro ao consultar cadastro.',
            type: 'is-warning',
            position: 'is-top',
            duration: 5000,
          });
        }
      } else {
        this.form.reset();
        for (let field in this.form.data()) {
          this.form[field] = response.data[field];
        }
      }
    },
  },

  beforeRouteEnter(to, from, next) {
    Vue.axios
      .get('/parametros/buscar')
      .then((response) => {
        next((vm) => {
          vm.setFormData(response, null);
        });
      })
      .catch((error) => {
        next((vm) => {
          vm.setFormData(null, error);
        });
      });
  },

  // Quando a route muda e este componente já está renderizado, a lógica é diferente
  beforeRouteUpdate(to, from, next) {
    this.form.reset();

    this.axios
      .get('/parametros/buscar')
      .then((response) => {
        this.setFormData(response, null);
        next();
      })
      .catch((error) => {
        this.setFormData(null, error);
        next();
      });
  },
};
</script>
