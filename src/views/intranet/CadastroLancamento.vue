<template>
  <div class="columns is-centered">
    <div class="column">
      <!-- TÍTULO -->
      <h1 class="title is-clearfix">
        {{ `Cadastro de lançamento #${form.id || ''}` }}
      </h1>
      <!-- TABS -->
      <div>
        <div class="tabs is-boxed">
          <ul>
            <li :class="{ 'is-active': activeTab == 1 }">
              <a @click="activeTab = 1">
                <b-icon icon="currency-usd"></b-icon>
                <span>Lançamento</span>
              </a>
            </li>
            <li :class="{ 'is-active': activeTab == 2 }" v-show="form.tipo">
              <a @click="activeTab = 2">
                <b-icon icon="wrench"></b-icon>
                <span>Ordens de serviço</span>
              </a>
            </li>
            <li
              :class="{ 'is-active': activeTab == 3 }"
              v-if="form.tipo == 'receita'"
            >
              <a @click="activeTab = 3">
                <b-icon icon="file-document"></b-icon>
                <span>Consultorias</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <b-message :closable="false">
        <form
          name="cadastroEmpresaServicoForm"
          method="post"
          action="#"
          @keydown="form.errors.clear($event.target.name)"
          @change="form.errors.clear($event.target.name)"
        >
          <div v-show="activeTab == 1">
            <div class="columns">
              <div class="column is-half-desktop">
                <b-field label="Tipo de lançamento" expanded>
                  <b-field
                    position="is-left"
                    type="is-danger"
                    :message="form.errors.get('tipo')"
                    group-multiline
                  >
                    <b-field expanded>
                      <b-radio-button
                        v-model="form.tipo"
                        :native-value="'receita'"
                        :disabled="form.id > 0"
                        type="is-primary"
                        size="is-medium"
                      >
                        <b-icon icon="download"></b-icon>
                        <span>Receita</span>
                      </b-radio-button>
                      <b-radio-button
                        v-model="form.tipo"
                        :native-value="'pagamento'"
                        :disabled="form.id > 0"
                        type="is-primary"
                        size="is-medium"
                      >
                        <b-icon icon="upload"></b-icon>
                        <span>Pagamento</span>
                      </b-radio-button>
                    </b-field>
                  </b-field>
                </b-field>
              </div>
              <div class="column is-half-desktop">
                <input-autocomplete
                  name="tecnico"
                  v-show="form.tipo == 'pagamento'"
                  ref="autocompleteTecnico"
                  size="is-medium"
                  label="Técnico"
                  :disabled="form.id > 0"
                  :url="urlAutocompleteTecnico"
                  :init-value="form.tecnico ? form.tecnico.nome : null"
                  field="nome"
                  subtitle="cpf"
                  field-label="Nome"
                  subtitle-label="CPF"
                  placeholder="Técnico"
                  :minlength="2"
                  @selected="setTecnico"
                  :error="form.errors.get('tecnico')"
                >
                </input-autocomplete>
                <input-autocomplete
                  name="cliente"
                  v-show="form.tipo == 'receita'"
                  ref="autocompleteCliente"
                  size="is-medium"
                  :disabled="form.id > 0"
                  :url="urlAutocompleteCliente"
                  :init-value="form.cliente ? form.cliente.nome : null"
                  field="nome"
                  subtitle="cpfcnpj"
                  field-label="Nome"
                  subtitle-label="CPF/CNPJ"
                  placeholder="Cliente"
                  :minlength="2"
                  @selected="setCliente"
                  :error="form.errors.get('cliente')"
                >
                </input-autocomplete>
              </div>
            </div>
            <div class="columns">
              <div class="column is-3-desktop">
                <input-text
                  name="valor"
                  v-model="form.valor"
                  :disabled="form.situacao != 'A'"
                  size="is-medium"
                  :placeholder="`Valor ${
                    form.tipo == 'receita'
                      ? 'recebido'
                      : form.tipo == 'pagamento'
                      ? 'pago'
                      : ''
                  }`"
                  :is-money="true"
                  :has-error="form.errors.has('valor')"
                  :error="form.errors.get('valor')"
                ></input-text>
              </div>
              <div class="column is-3-desktop">
                <input-text
                  name="valorCalculado"
                  :value="valorCalculado()"
                  :disabled="true"
                  size="is-medium"
                  placeholder="Valor calculado"
                  :is-money="true"
                ></input-text>
              </div>
              <div class="column is-half-desktop">
                <select-ajax
                  v-model="form.situacao"
                  name="situacao"
                  placeholder="Situação"
                  :disabled="true"
                  size="is-medium"
                  :has-error="form.errors.has('situacao')"
                  :error="form.errors.get('situacao')"
                >
                  <option value="A">Aberto</option>
                  <option value="F">Fechado</option>
                  <option value="C">Cancelado</option>
                </select-ajax>
              </div>
            </div>
            <div class="columns">
              <div class="column is-half-desktop">
                <date-time-picker
                  placeholder="Data da emissão"
                  v-if="form.situacao == 'A'"
                  name="dataEmissao"
                  v-model="form.dataEmissao"
                  :config="datePickerConfig"
                  size="is-medium"
                  :has-error="form.errors.has('dataEmissao')"
                  :error="form.errors.get('dataEmissao')"
                >
                </date-time-picker>
                <b-field v-else label="Data da emissão">
                  <span class="subtitle">{{ form.dataEmissao | date }}</span>
                </b-field>
              </div>
              <div class="column is-half-desktop">
                <date-time-picker
                  placeholder="Data do pagamento"
                  v-if="form.situacao == 'A'"
                  name="dataPagamento"
                  v-model="form.dataPagamento"
                  :config="datePickerConfig"
                  size="is-medium"
                  :has-error="form.errors.has('dataPagamento')"
                  :error="form.errors.get('dataPagamento')"
                >
                </date-time-picker>
                <b-field v-else label="Data do pagamento">
                  <span class="subtitle">{{ form.dataPagamento | date }}</span>
                </b-field>
              </div>
            </div>
            <h2 class="subtitle">Notas fiscais</h2>
            <div class="columns">
              <div
                class="column is-half-desktop"
                v-show="form.tipo == 'pagamento'"
              >
                <input-text
                  name="numeroNfEmpresa"
                  v-model="form.numeroNfEmpresa"
                  size="is-medium"
                  type="tel"
                  :placeholder="'Número NF do técnico'"
                  :maxlength="48"
                  :disabled="form.situacao != 'A'"
                  :has-error="form.errors.has('numeroNfEmpresa')"
                  :error="form.errors.get('numeroNfEmpresa')"
                ></input-text>
              </div>
              <div
                class="column is-half-desktop"
                v-show="form.tipo == 'receita'"
              >
                <input-text
                  name="numeroNfMatrizfilial"
                  v-model="form.numeroNfMatrizfilial"
                  size="is-medium"
                  type="tel"
                  :placeholder="`Número NF da GTS`"
                  :maxlength="48"
                  :disabled="form.situacao != 'A'"
                  :has-error="form.errors.has('numeroNfMatrizfilial')"
                  :error="form.errors.get('numeroNfMatrizfilial')"
                ></input-text>
              </div>
            </div>
          </div>
          <div v-show="activeTab == 2">
            <div class="columns">
              <div class="column">
                <b-field>
                  <span class="subtitle">Ordens de serviço concluídas</span>
                </b-field>
                <b-field>
                  <tabela-agendamentos
                    ref="tabelaAgendamentos"
                    :idLancamento="form.id || 0"
                    :situacao="form.situacao"
                    :tipo="form.tipo"
                    :idObjeto.sync="idObjeto"
                    :classe.sync="classe"
                    :agendamentos.sync="form.agendamentos"
                  >
                  </tabela-agendamentos>
                </b-field>
              </div>
            </div>
          </div>
          <div v-show="activeTab == 3">
            <div class="columns">
              <div class="column">
                <b-field>
                  <span class="subtitle">Consultorias concluídas</span>
                </b-field>
                <b-field>
                  <tabela-consultorias
                    ref="tabelaConsultorias"
                    :idLancamento="form.id || 0"
                    :situacao="form.situacao"
                    :tipo="form.tipo"
                    :idObjeto.sync="idObjeto"
                    :classe.sync="classe"
                    :consultorias.sync="form.consultorias"
                  >
                  </tabela-consultorias>
                </b-field>
              </div>
            </div>
          </div>
          <!-- Botões -->
          <div class="field has-addons has-addons-right is-grouped">
            <div class="control" v-if="form.situacao != 'C'">
              <button
                type="button"
                class="button is-danger is-medium"
                :class="{ 'is-loading': form.isLoading }"
                @click="onDelete"
                @dblclick.prevent
              >
                Excluir
              </button>
            </div>
            <div class="control" v-if="form.situacao == 'A'">
              <button
                type="button"
                class="button is-black is-medium"
                :class="{ 'is-loading': form.isLoading }"
                @click="onSubmitClose"
                @dblclick.prevent
              >
                Salvar e Fechar
              </button>
            </div>
            <div class="control" v-if="form.situacao != 'C'">
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
import TabelaAgendamentos from './components-lancamento/TabelaAgendamentos.vue';
import TabelaConsultorias from './components-lancamento/TabelaConsultorias.vue';
import 'moment/locale/pt-br.js';
let moment = require('moment');
moment.locale('pt-br');

export default {
  components: {
    DateTimePicker,
    InputAutocomplete,
    TabelaAgendamentos,
    TabelaConsultorias,
  },
  data() {
    return {
      form: new Form({
        id: null,
        situacao: 'A',
        tipo: '',
        valor: 0.0,
        dataEmissao: '',
        dataPagamento: '',
        cliente: null,
        tecnico: null,
        numeroNfEmpresa: '',
        numeroNfMatrizfilial: '',
        agendamentos: [],
        consultorias: [],
      }),
      activeTab: 1,
    };
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
  },

  computed: {
    datePickerConfig() {
      return {
        wrap: true,
        dateFormat: 'Y-m-d',
        altInput: true,
        altFormat: 'l, j F, Y',
      };
    },

    idObjeto() {
      if (this.form.cliente && this.form.cliente.id > 0) {
        return this.form.cliente.id;
      } else if (this.form.tecnico && this.form.tecnico.id > 0) {
        return this.form.tecnico.id;
      }
      return 0;
    },

    classe() {
      if (this.form.cliente && this.form.cliente.id > 0) {
        return 'Tbcliente';
      } else if (this.form.tecnico && this.form.tecnico.id > 0) {
        return 'Tbtecnico';
      }
      return '';
    },

    urlAutocompleteCliente() {
      return '/cliente/findLike';
    },

    urlAutocompleteTecnico() {
      return '/tecnico/findLike';
    },
  },

  methods: {
    // Define o objeto do cliente recebido ou selecionado
    setCliente(obj) {
      if (obj && obj.id > 0) {
        this.form.cliente = obj;
        this.form.tecnico = null;
      } else {
        this.form.cliente = null;
      }
    },

    // Define o objeto do técnico recebido ou selecionado
    setTecnico(obj) {
      if (obj && obj.id > 0) {
        this.form.tecnico = obj;
        this.form.cliente = null;
      } else {
        this.form.tecnico = null;
      }
    },

    valorCalculado() {
      let total = 0;
      if (this.$refs.tabelaAgendamentos && this.$refs.tabelaConsultorias) {
        total += this.$refs.tabelaAgendamentos.getValorTotal();
        total += this.$refs.tabelaConsultorias.getValorTotal();
      }
      return total;
    },

    onDelete() {
      this.$dialog.confirm({
        message: 'Tem certeza que quer excluir esse lançamento?',
        cancelText: 'Não',
        confirmText: 'Sim',
        type: 'is-danger',
        onConfirm: () => {
          this.form
            .post('/lancamento/cancelar')
            .then((response) => {
              if (response.message) {
                this.$toast.open({
                  message: response.message
                    ? response.message
                    : 'Cadastro excluído com sucesso.',
                  type: 'is-success',
                  position: 'is-top',
                  duration: 5000,
                });
                this.$router.push('/lista-lancamento');
              }
            })
            .catch((error) => {
              if (error.message) {
                this.$toast.open({
                  message: error.message
                    ? error.message
                    : 'Erro ao excluir cadastro.',
                  type: 'is-warning',
                  position: 'is-top',
                  duration: 10000,
                });
              }
            });
        },
      });
    },

    onSubmitClose() {
      this.$dialog.confirm({
        message: 'Deseja fechar esse lançamento?',
        cancelText: 'Não',
        confirmText: 'Sim',
        type: 'is-black',
        onConfirm: () => {
          // Muda a situacao do registro antes de enviar
          this.form.situacao = 'F';
          this.onSubmit();
          this.form.situacao = 'A';
        },
        onCancel: () => {
          this.form.situacao = 'A';
        },
      });
    },

    onSubmit() {
      this.form
        .post('/lancamento/salvar')
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
            this.$router.push('/lista-lancamento');
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
              duration: 10000,
            });
          }
        });
    },

    setFormData(response, error) {
      if (error) {
        if (error.response.data) {
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
        this.activeTab = 0;
        this.form.reset();

        // Altera a situacao primeira por causa de alguns campos que tem exibição condicional
        this.form.situacao = response.data.situacao;

        // Preenche os campos do this.form
        for (let field in _.omit(this.form.data(), [
          'cliente',
          'tecnico',
          'agendamentos',
          'consultorias',
        ])) {
          // Corrige dados de id, descricao que ficam null
          this.form[field] = response.data[field];
        }

        // Coloca nos inputs autocomplete os devidos objetos
        this.setCliente(response.data.cliente);
        this.setTecnico(response.data.tecnico);

        // Primeiro carrega as tabelas
        if (this.$refs.tabelaAgendamentos) {
          this.$refs.tabelaAgendamentos.getList();
        }
        if (this.$refs.tabelaConsultorias) {
          this.$refs.tabelaConsultorias.getList();
        }

        // Em seguida passa as listas de itens já salvos
        this.$nextTick(() => {
          this.form.agendamentos = response.data.agendamentos;
          this.form.consultorias = response.data.consultorias;
        });

        this.activeTab = 1;
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
        .get('/lancamento/findId/' + id)
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
        vm.activeTab = 1;
        vm.form.reset();
        vm.$refs.tabelaAgendamentos.reset();
        vm.$refs.tabelaConsultorias.reset();
      });
    }
  },

  // Quando a route muda e este componente já está renderizado, a lógica é diferente
  beforeRouteUpdate(to, from, next) {
    this.activeTab = 1;
    this.form.reset();
    this.$refs.tabelaAgendamentos.reset();
    this.$refs.tabelaConsultorias.reset();

    let id;
    // Obtem o ID vindo nos parâmetros da route
    if (to.params.id) {
      id = to.params.id;
    } else if (typeof to.meta.id === 'function') {
      id = to.meta.id();
    }

    if (id) {
      this.axios
        .get('/lancamento/findId/' + id)
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
