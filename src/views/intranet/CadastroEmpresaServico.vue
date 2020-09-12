<template>
  <div class="columns is-centered">
    <div class="column">
      <h1 class="title is-clearfix">
        <span v-html="'Cadastro de servi&ccedil;o'"></span>
      </h1>
      <b-message :closable="false">
        <form
          name="cadastroEmpresaServicoForm"
          method="post"
          action="#"
          @keydown="form.errors.clear($event.target.name)"
          @change="form.errors.clear($event.target.name)"
        >
          <div class="columns">
            <div class="column is-half-desktop">
              <input-autocomplete
                ref="autocompleteEmpresa"
                label="Empresa"
                placeholder="Buscar empresa"
                name="empresa"
                size="is-medium"
                :url="urlAutocompleteEmpresa"
                param=""
                :init-value="form.empresa ? form.empresa.nome : null"
                field="nome"
                subtitle="cpfcnpj"
                field-label="Nome"
                subtitle-label="CPF/CNPJ"
                :minlength="2"
                @selected="setEmpresa"
                :error="form.errors.get('empresa')"
              >
              </input-autocomplete>
            </div>
          </div>
          <div class="columns">
            <div class="column is-half-desktop">
              <select-ajax
                name="tipoServico"
                v-model="form.tipoServico.id"
                size="is-medium"
                placeholder="Tipo de serviço"
                api-route="/tipoServico/listar"
                control-type="is-primary"
                :has-error="form.errors.has('tipoServico')"
                :error="form.errors.get('tipoServico')"
                v-on:errorSelectAjax="
                  form.setSelectError('tipoServico', $event)
                "
              >
              </select-ajax>
            </div>
            <div class="column is-half-desktop">
              <select-ajax
                name="situacao"
                v-model="form.situacao"
                size="is-medium"
                v-if="form.id > 0"
                placeholder="Situação"
                control-type="is-primary"
                :has-error="form.errors.has('situacao')"
                :error="form.errors.get('situacao')"
                v-on:errorSelectAjax="form.setSelectError('situacao', $event)"
              >
                <option value="A">Ativo</option>
                <option value="I">Inativo</option>
                <option value="E" v-html="'Exclu&iacute;do'"></option>
              </select-ajax>
            </div>
          </div>
          <div class="columns">
            <div class="column is-half-desktop">
              <input-text
                name="valorCusto"
                v-model="form.valorCusto"
                size="is-medium"
                placeholder="Valor de Custo"
                :is-money="true"
                :has-error="form.errors.has('valorCusto')"
                :error="form.errors.get('valorCusto')"
              ></input-text>
            </div>
            <div class="column is-half-desktop">
              <input-text
                name="valorVenda"
                v-model="form.valorVenda"
                size="is-medium"
                placeholder="Valor de Venda"
                :is-money="true"
                :has-error="form.errors.has('valorVenda')"
                :error="form.errors.get('valorVenda')"
              ></input-text>
            </div>
          </div>
          <div class="columns">
            <div class="column is-half-desktop">
              <date-time-picker
                placeholder="Tempo previsto"
                size="is-medium"
                name="tempoPrevisto"
                v-model="form.tempoPrevisto"
                :config="tempoPrevistoConfig"
                :has-error="form.errors.has('tempoPrevisto')"
                :error="form.errors.get('tempoPrevisto')"
              >
              </date-time-picker>
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
import DateTimePicker from '../../components/DateTimePicker.vue';
import InputAutocomplete from '../../components/InputAutocomplete.vue';

export default {
  components: { DateTimePicker, InputAutocomplete },
  data() {
    return {
      form: new Form({
        id: null,
        situacao: null,
        tipoServico: { id: null, descricao: null },
        valorCusto: 0.0,
        valorVenda: 0.0,
        tempoPrevisto: '',
        empresa: {},
      }),
    };
  },

  computed: {
    tempoPrevistoConfig() {
      return {
        wrap: true,
        dateFormat: 'H:i:S',
        altInput: true,
        altFormat: 'H:i',
        noCalendar: true,
        enableTime: true,
        time_24hr: true,
      };
    },

    urlAutocompleteEmpresa() {
      return '/empresa/findLike';
    },
  },

  methods: {
    setEmpresa(obj) {
      // Atribui o id da empresa de um obj recebido
      if (obj && parseInt(obj.id) > 0) {
        this.form.empresa = obj;
      }
    },

    onSubmit() {
      this.form
        .post('/empresaServico/salvar')
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
            this.$router.push('/lista-empresa-servico');
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

        // Obtém o objeto empresa
        this.setEmpresa(response.data.empresa);
      }
    },
  },

  beforeRouteEnter(to, from, next) {
    let id;

    // Obtem o ID vindo nos parâmetros da route
    if (to.params.id) {
      id = to.params.id;
    } else if (typeof to.meta.id === 'function') {
      id = to.meta.id();
    }

    if (id) {
      Vue.axios
        .get('/empresaServico/findId/' + id)
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
    } else {
      next((vm) => {
        vm.form.reset();
      });
    }
  },

  // Quando a route muda e este componente já está renderizado, a lógica é diferente
  beforeRouteUpdate(to, from, next) {
    this.form.reset();
    let id;

    // Obtem o ID vindo nos parâmetros da route
    if (to.params.id) {
      id = to.params.id;
    } else if (typeof to.meta.id === 'function') {
      id = to.meta.id();
    }

    if (id) {
      this.axios
        .get('/empresaServico/findId/' + id)
        .then((response) => {
          this.setFormData(response, null);
          next();
        })
        .catch((error) => {
          this.setFormData(null, error);
          next();
        });
    } else {
      next();
    }
  },
};
</script>
