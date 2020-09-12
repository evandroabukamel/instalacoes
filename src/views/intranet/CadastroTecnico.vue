<template>
  <div class="columns is-centered">
    <div class="column">
      <!-- TÍTULO -->
      <h1 class="title is-clearfix" v-html="'Cadastro de t&eacute;cnico'"></h1>
      <!-- TABS -->
      <div>
        <div class="tabs is-boxed">
          <ul>
            <li :class="{ 'is-active': activeTab == 1 }">
              <a @click="activeTab = 1">
                <b-icon icon="worker"></b-icon>
                <span>Técnico</span>
              </a>
            </li>
            <li :class="{ 'is-active': activeTab == 2 }" v-if="form.autonomo">
              <a @click="activeTab = 2">
                <b-icon icon="store"></b-icon>
                <span>Empresa</span>
              </a>
            </li>
            <li :class="{ 'is-active': activeTab == 3 }" v-if="showFormUsuario">
              <a @click="activeTab = 3">
                <b-icon icon="account-key"></b-icon>
                <span>Usuário</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <b-message :closable="false">
        <form
          name="cadastroTecnicoForm"
          method="post"
          action="#"
          autocomplete="off"
          @keydown="form.errors.clear($event.target.name)"
          @change="form.errors.clear($event.target.name)"
        >
          <div v-show="activeTab == 1">
            <div class="columns">
              <div class="column is-half-desktop">
                <h2 class="subtitle">
                  <span v-html="'Dados do t&eacute;cnico'"></span>
                </h2>
                <input-autocomplete
                  v-if="
                    showAutocompleteEmpresa && !(form.id > 0 && form.autonomo)
                  "
                  v-show="!form.autonomo"
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
                  subtitle-label="CNPJ"
                  :minlength="2"
                  @selected="setEmpresa"
                  :error="form.errors.get('empresa')"
                >
                </input-autocomplete>
                <b-field v-if="isUsuarioMatrizFilial">
                  <b-checkbox
                    v-model="form.autonomo"
                    @input="onAutonomoChanged"
                  >
                    Técnico autônomo (cadastrar empresa)
                  </b-checkbox>
                </b-field>
                <input-text
                  name="nome"
                  v-model="form.nome"
                  placeholder="Nome"
                  size="is-medium"
                  :has-error="form.errors.has('nome')"
                  :error="form.errors.get('nome')"
                ></input-text>
                <input-text
                  name="cpf"
                  v-model="form.cpf"
                  type="tel"
                  placeholder="CPF"
                  size="is-medium"
                  :mask="['###.###.###-##']"
                  :has-error="form.errors.has('cpf')"
                  :error="form.errors.get('cpf')"
                ></input-text>
                <select-ajax
                  name="idSituacao"
                  v-model="form.idSituacao"
                  v-if="form.id > 0 && showSelectSituacao"
                  placeholder="Situação"
                  size="is-medium"
                  api-route="/tecnico/listarSituacoes"
                  control-type="is-primary"
                  :has-error="form.errors.has('idSituacao')"
                  :error="form.errors.get('idSituacao')"
                  v-on:errorSelectAjax="
                    form.setSelectError('idSituacao', $event)
                  "
                >
                </select-ajax>
                <div class="field" v-if="form.id && !showSelectSituacao">
                  <label
                    class="label"
                    v-html="'Situa&ccedil;&atilde;o'"
                  ></label>
                  <h2 class="subtitle">{{ form.situacaoDescricao }}</h2>
                </div>
                <input-text
                  name="raioAtendimento"
                  v-model="form.raioAtendimento"
                  size="is-medium"
                  type="number"
                  :min="0"
                  placeholder="Raio de atendimento (km)"
                  :has-error="form.errors.has('raioAtendimento')"
                  :error="form.errors.get('raioAtendimento')"
                ></input-text>
                <b-field
                  v-if="
                    !form.autonomo &&
                    (isUsuarioMatrizFilial || isUsuarioEmpresa)
                  "
                >
                  <b-checkbox v-model="form.atendeFora">
                    Técnico atende remotamente (cadastrar endereço)
                  </b-checkbox>
                </b-field>
              </div>
              <div class="column is-half-desktop">
                <!-- Agenda -->
                <h2 class="subtitle">Agenda semanal</h2>
                <input-agenda
                  name="agenda"
                  v-on:add="addAgenda($event)"
                  size="is-medium"
                  :has-error="form.errors.has('agendas')"
                  :error="form.errors.get('agendas')"
                ></input-agenda>
                <lista-agenda v-model="form.agendas"></lista-agenda>
                <!-- Contatos -->
                <h2 class="subtitle">Contatos</h2>
                <input-contato
                  name="contato"
                  v-on:add="form.addContato($event)"
                  size="is-medium"
                  :has-error="form.errors.has('contatos')"
                  :error="form.errors.get('contatos')"
                ></input-contato>
                <div></div>
                <lista-contato v-model="form.contatos"></lista-contato>
              </div>
            </div>
            <div class="columns" v-show="form.atendeFora">
              <div class="column is-half-desktop">
                <!-- Localização -->
                <h2 class="subtitle">
                  <span v-html="'Localiza&ccedil;&atilde;o'"></span>
                </h2>
                <!-- FormEndereco -->
                <form-endereco
                  ref="formEndereco"
                  name="endereco"
                  size="is-medium"
                  v-model="form.endereco"
                  @changed="form.errors.clear($event, 'endereco')"
                  :has-error="form.errors.has('endereco')"
                  :error="form.errors.get('endereco')"
                ></form-endereco>
              </div>
              <div class="column is-half-desktop">
                <!-- Mapa -->
                <here-maps
                  ref="hereMap"
                  v-if="activeTab == 1 && form.atendeFora"
                  :value="markerTecnico"
                  @clickBuscarPosicao="buscarEnderecoPosicao"
                  @markerPositioned="
                    atualizaEnderecoPosicao($event, form.endereco)
                  "
                ></here-maps>
                <div></div>
              </div>
            </div>
          </div>
          <!-- DADOS EMPRESA -->
          <div v-show="activeTab == 2" v-if="form.autonomo">
            <div class="columns">
              <div class="column is-half-desktop">
                <h2 class="subtitle">
                  <span v-html="'Dados da empresa'"></span>
                </h2>
                <input-text
                  name="empresaNome"
                  v-model="form.empresa.nome"
                  placeholder="Nome ou razão social"
                  size="is-medium"
                  :has-error="form.errors.has('empresaNome')"
                  :error="form.errors.get('empresaNome')"
                ></input-text>
                <input-text
                  name="empresaCpfcnpj"
                  v-model="form.empresa.cpfcnpj"
                  type="tel"
                  size="is-medium"
                  placeholder="CPF/CNPJ"
                  :mask="['###.###.###-##', '##.###.###/####-##']"
                  :has-error="form.errors.has('empresaCpfcnpj')"
                  :error="form.errors.get('empresaCpfcnpj')"
                ></input-text>
                <select-ajax
                  v-if="form.empresa.id > 0 && showSelectSituacao"
                  name="empresaIdSituacao"
                  v-model="form.empresa.idSituacao"
                  size="is-medium"
                  placeholder="Situação"
                  api-route="/empresa/listarSituacoes"
                  control-type="is-primary"
                  :has-error="form.errors.has('empresaIdSituacao')"
                  :error="form.errors.get('empresaIdSituacao')"
                  v-on:errorSelectAjax="
                    form.setSelectError('empresaIdSituacao', $event)
                  "
                >
                </select-ajax>
                <div
                  class="field"
                  v-if="form.empresa.id > 0 && !showSelectSituacao"
                >
                  <label
                    class="label"
                    v-html="'Situa&ccedil;&atilde;o'"
                  ></label>
                  <h2 class="subtitle">{{ form.empresa.situacaoDescricao }}</h2>
                </div>
              </div>
              <div class="column is-half-desktop">
                <!-- Dados bancários -->
                <h2 class="subtitle">
                  <span v-html="'Conta banc&aacute;ria'"></span>
                </h2>
                <!-- FormUsuario -->
                <select-ajax
                  name="idBanco"
                  v-model="form.empresa.idBanco"
                  placeholder="Banco"
                  size="is-medium"
                  api-route="/bancoGeral/listar"
                  control-type="is-primary"
                  :has-error="form.errors.has('idBanco')"
                  :error="form.errors.get('idBanco')"
                  v-on:errorSelectAjax="form.setSelectError('idBanco', $event)"
                >
                </select-ajax>
                <input-text
                  name="titularConta"
                  v-model="form.empresa.titularConta"
                  placeholder="Nome completo do titular"
                  size="is-medium"
                  :has-error="form.errors.has('titularConta')"
                  :error="form.errors.get('titularConta')"
                ></input-text>
                <input-text
                  name="cpfTitular"
                  v-model="form.empresa.cpfTitular"
                  type="tel"
                  placeholder="CPF / CNPJ do titular"
                  size="is-medium"
                  :mask="['###.###.###-##', '##.###.###/####-##']"
                  :has-error="form.errors.has('cpfTitular')"
                  :error="form.errors.get('cpfTitular')"
                ></input-text>
                <input-text
                  name="agencia"
                  v-model="form.empresa.agencia"
                  type="tel"
                  placeholder="Agência"
                  size="is-medium"
                  :mask="['####', '####-#', '####-##']"
                  :masked="true"
                  :has-error="form.errors.has('agencia')"
                  :error="form.errors.get('agencia')"
                ></input-text>
                <input-text
                  name="conta"
                  v-model="form.empresa.conta"
                  type="tel"
                  placeholder="Conta"
                  size="is-medium"
                  :mask="[
                    '#####-#',
                    '######-#',
                    '#######-#',
                    '########-#',
                    '#########-#',
                    '##########-#',
                    '###########-#',
                  ]"
                  :masked="true"
                  :has-error="form.errors.has('conta')"
                  :error="form.errors.get('conta')"
                ></input-text>
              </div>
            </div>
          </div>
          <!-- DADOS USUÁRIO -->
          <div v-show="activeTab == 3">
            <!-- Só mostra o form-usuário se for um registro diferente do usuário logado -->
            <form-usuario
              ref="formUsuario"
              name="usuario"
              v-if="showFormUsuario"
              size="is-medium"
              v-model="form.usuario"
              @changed="form.errors.clear($event, 'usuario')"
              :has-error="form.errors.has('usuario')"
              :error="form.errors.get('usuario')"
            >
            </form-usuario>
          </div>
          <!-- Botões -->
          <div class="content"><!-- SPACE --></div>
          <div class="content"><!-- SPACE --></div>
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
import Endereco from '../../core/Endereco.js';
import FormEndereco from '../../components/FormEndereco.vue';
import FormUsuario from '../../components/FormUsuario.vue';
import HereMaps from '../../components/HereMaps.vue';
import InputAgenda from '../../components/InputAgenda.vue';
import InputAutocomplete from '../../components/InputAutocomplete.vue';
import InputContato from '../../components/InputContato.vue';
import ListaAgenda from '../../components/ListaAgenda.vue';
import ListaContato from '../../components/ListaContato.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
  components: {
    InputAutocomplete,
    InputContato,
    ListaContato,
    InputAgenda,
    ListaAgenda,
    HereMaps,
    FormEndereco,
    FormUsuario,
  },
  data() {
    return {
      form: new Form({
        id: null,
        idSituacao: null,
        situacaoDescricao: null,
        autonomo: false,
        atendeFora: false,
        empresa: null,
        nome: '',
        cpf: '',
        raioAtendimento: null,
        agendas: [],
        contatos: [],
        endereco: {},
        usuario: null,
      }),
      activeTab: 1,
      showAutocompleteEmpresa: true,
      showFormUsuario: this.$route.name == 'cadastro-tecnico',
      showSelectSituacao: true,
      markerTecnico: [],
    };
  },

  computed: {
    ...mapGetters([
      'dadosUsuario',
      'situacaoTecnico',
      'isUsuarioMatrizFilial',
      'isUsuarioTecnico',
      'isUsuarioEmpresa',
    ]),

    urlAutocompleteEmpresa() {
      return '/empresa/findLike';
    },
  },

  methods: {
    /**
     * Oculta o select de situação se o role não for ROLE_MATRIZFILIAL e a situação for PENDENTE.
     */
    /* showSelectSituacao() {
			return !(!_.includes(this.dadosUsuario.roles, 'ROLE_MATRIZFILIAL') && this.form.idSituacao == 21);
		}, */

    setEmpresa(obj) {
      // Atribui o id da empresa de um obj recebido
      if (obj && parseInt(obj.id) > 0) {
        this.form.empresa = obj;
      }
    },

    onAutonomoChanged(value) {
      if (value) {
        this.form.atendeFora = true;
        // Condição para prevenir esta ação no momento de setFormData
        if (
          this.form.empresa == null ||
          Object.keys(this.form.empresa).length < 4
        ) {
          this.form.empresa = {
            id: null,
            idSituacao: null,
            situacaoDescricao: null,
            nome: '',
            cpfcnpj: '',
            idBanco: null,
            titularConta: '',
            cpfTitular: '',
            conta: '',
            agencia: '',
          };
        }
      } else {
        this.form.empresa = null;
        this.form.atendeFora = false;
      }
    },

    addAgenda(agenda) {
      // Variável flag para erros de conflito de horários
      let error = false;
      // Separa as agenda do mesmo dia da agenda a ser adicionada e ordena pelo horario inicial
      let agendasDia = _.sortBy(
        _.filter(this.form.agendas, (o) => o.diaSemana === agenda.diaSemana),
        [(o) => o.horarioInicial]
      );
      // Verifica se a lista está vazia
      if (agendasDia.length > 0) {
        // Verifica se o novo horário já existe na agenda
        for (let i = 0; i < agendasDia.length; i++) {
          if (
            agenda.diaSemana === agendasDia[i].diaSemana &&
            ((agenda.horarioInicial >= agendasDia[i].horarioInicial &&
              agenda.horarioInicial <= agendasDia[i].horarioFinal) ||
              (agenda.horarioFinal >= agendasDia[i].horarioInicial &&
                agenda.horarioFinal <= agendasDia[i].horarioFinal))
          ) {
            error = true;
            break;
          } else {
            error = false;
          }
        }

        // Se houve erro, mostra a mensagem
        if (error) {
          this.form.errors.add(
            'agendas',
            'Conflito de horários, parte desse horário já está na agenda.'
          );
        } else {
          // Senão, adiciona o horário
          this.form.agendas.push(agenda);
          this.form.errors.clear('agendas');
        }
      } else {
        // Adiciona o primeiro horário, com a lista vazia
        this.form.agendas.push(agenda);
        this.form.errors.clear('agendas');
      }

      // Reordena a lista da agenda do dia da semana
      this.form.agendas = _.sortBy(this.form.agendas, [
        'diaSemana',
        'horarioInicial',
      ]);
    },

    buscarEnderecoPosicao() {
      this.form.errors.clear('posicao', 'endereco');

      let position = null;

      // Busca a posição para o endereço
      if (this.form.endereco.toMapString() != '') {
        this.$refs.hereMap
          .searchPositionForAddress(this.form.endereco.toMapString())
          .then((response) => {
            let marker = {
              position: {
                lat: response.Latitude,
                lng: response.Longitude,
              },
              draggable: true,
            };
            // adiciona o marcador
            this.$refs.hereMap.addUniqueMarker(null, marker);
            this.markerTecnico = [];
            this.markerTecnico.push(marker);
            this.$emit('change', 'posicao', 'endereco');
          })
          .catch((response) => {});
      }
    },

    atualizaEnderecoPosicao(posicao, endereco) {
      this.form.errors.clear('posicao', 'endereco');
      endereco.posicao = { latitude: posicao.lat, longitude: posicao.lng };
    },

    onSubmit() {
      this.form
        .post('/tecnico/salvar')
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
            this.$router.push('/lista-tecnico');
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
        for (let field in _.omit(this.form.data(), [
          'contatos',
          'endereco',
          'empresa',
          'usuario',
        ])) {
          this.form[field] = response.data[field];
        }

        // Controla a exibição do select de Situação
        this.showSelectSituacao = !(
          !_.includes(this.dadosUsuario.roles, 'ROLE_MATRIZFILIAL') &&
          response.data.idSituacao == this.situacaoTecnico.PENDENTE
        );

        // Obtém os objetos contatos
        this.form.contatos = this.form.loadContatos(response.data.contatos);
        // Obtém o objeto endereco
        this.form.endereco = this.form.loadEndereco(response.data.endereco);
        // Formata os objeto usuario
        if (this.showFormUsuario) {
          this.form.usuario = this.form.loadUsuario(response.data.usuario);
          this.$refs.formUsuario.showPasswordField = false;
        }

        // Obtém o objeto empresa
        this.setEmpresa(response.data.empresa);

        // Marca o ponto do endereço no mapa
        if (response.data.endereco && response.data.endereco.posicao) {
          let marker = {
            position: {
              lat: response.data.endereco.posicao.latitude,
              lng: response.data.endereco.posicao.longitude,
            },
            draggable: true,
          };

          // Adiciona o marcador
          this.markerTecnico = [];
          this.markerTecnico.push(marker);
          if (this.$refs.hereMap) {
            this.$refs.hereMap.addUniqueMarker(null, marker);
          }
        }
      }
    },
  },

  created() {
    // Verifica a necessidade de exibir o campos de buscar empresa
    if (this.isUsuarioEmpresa) {
      this.form.empresa = { id: this.dadosUsuario.idObjeto };
      if (this.form.empresa.id > 0) this.showAutocompleteEmpresa = false;
    } else if (this.isUsuarioTecnico) {
      this.showAutocompleteEmpresa = false;
      delete this.form.empresa;
    }
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
        .get('/tecnico/findId/' + id)
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
        if (vm.form.empresa) {
          vm.form.empresa = vm.isUsuarioEmpresa
            ? { id: vm.dadosUsuario.idObjeto }
            : null;
          if (vm.form.empresa.id > 0) vm.showAutocompleteEmpresa = false;
        }
        vm.$refs.hereMap.clearMarkers();
      });
    }
  },

  // Quando a route muda e este componente já está renderizado, a lógica é diferente
  beforeRouteUpdate(to, from, next) {
    this.form.reset();
    this.$refs.hereMap.clearMarkers();
    let id;

    // Obtem o ID vindo nos parâmetros da route
    if (to.params.id) {
      id = to.params.id;
    } else if (typeof to.meta.id === 'function') {
      id = to.meta.id();
    }

    if (id) {
      this.axios
        .get('/tecnico/findId/' + id)
        .then((response) => {
          this.setFormData(response, null);
          next();
        })
        .catch((error) => {
          this.setFormData(null, error);
          next();
        });
    } else {
      if (this.form.empresa) {
        this.form.empresa = this.isUsuarioEmpresa
          ? { id: this.dadosUsuario.idObjeto }
          : null;
        if (this.form.empresa.id > 0) this.showAutocompleteEmpresa = false;
      }
      next();
    }
  },
};
</script>
