<template>
  <div>
    <!-- EDIÇÃO -->
    <div v-if="!readonly">
      <here-autocomplete
        name="here-autocomplete"
        :minlength="5"
        @selected="carregaDadosEndereco"
        placeholder="Buscar endereço (Logradouro, Nº, Cidade)"
        :size="size"
      ></here-autocomplete>
      <input-text
        type="text"
        name="logradouro"
        v-model="endereco.logradouro"
        v-on:input="updateValue(endereco)"
        v-on:get-name="propagName($event)"
        placeholder="Logradouro, Rua, Avenida, Rodovia ..."
        :size="size"
        :error="error.logradouro"
        :has-error="Boolean(error.logradouro)"
      ></input-text>
      <b-field>
        <div class="columns">
          <div class="column is-6-desktop is-12-mobile">
            <input-text
              type="number"
              name="numero"
              v-model="endereco.numero"
              v-on:input="updateValue(endereco)"
              v-on:get-name="propagName($event)"
              placeholder="Número"
              :min="0"
              :size="size"
              expanded
              :error="error.numero"
              :has-error="Boolean(error.numero)"
            ></input-text>
          </div>
          <div class="column is-6-desktop is-12-mobile">
            <input-text
              type="text"
              name="complemento"
              v-model="endereco.complemento"
              v-on:input="updateValue(endereco)"
              v-on:get-name="propagName($event)"
              placeholder="Compl. (opcional)"
              maxlength="48"
              :has-counter="false"
              expanded
              :size="size"
            ></input-text>
          </div>
        </div>
      </b-field>
      <input-text
        type="text"
        name="bairro"
        v-model="endereco.bairro"
        v-on:input="updateValue(endereco)"
        v-on:get-name="propagName($event)"
        placeholder="Bairro"
        :size="size"
        :error="error.bairro"
        :has-error="Boolean(error.bairro)"
      ></input-text>
      <input-text
        type="text"
        name="cidade"
        v-model="endereco.cidade"
        v-on:input="updateValue(endereco)"
        v-on:get-name="propagName($event)"
        placeholder="Cidade"
        :size="size"
        :error="error.cidade"
        :has-error="Boolean(error.cidade)"
      ></input-text>
      <b-field>
        <div class="columns">
          <div class="column is-6-desktop is-12-mobile">
            <select-ajax
              name="estado"
              v-model="endereco.estado"
              v-on:change="updateValue(endereco)"
              v-on:get-name="propagName($event)"
              placeholder="Estado"
              :size="size"
              expanded
              :error="error.estado"
              :has-error="Boolean(error.estado)"
            >
              <option
                v-for="estado in estadosBrasil"
                :value="estado.value"
                :key="estado.value"
                :disabled="estado.disabled"
                :selected="estado.value == endereco.estado"
              >
                {{ estado.text }}
              </option>
            </select-ajax>
          </div>
          <div class="column is-6-desktop is-12-mobile">
            <input-text
              type="tel"
              name="cep"
              v-model="endereco.cep"
              v-on:input="updateValue(endereco)"
              v-on:get-name="propagName($event)"
              mask="#####-###"
              :masked="true"
              placeholder="CEP"
              :size="size"
              expanded
              :error="error.cep"
              :has-error="Boolean(error.cep)"
            ></input-text>
          </div>
        </div>
      </b-field>
      <span
        class="help is-danger"
        v-if="Boolean(error.posicao)"
        v-text="error.posicao"
      ></span>
    </div>
    <!-- CONSULTA -->
    <div v-else>
      <input-text
        type="textarea"
        name="enderecoLinha1"
        v-if="endereco.cidade && endereco.estado"
        :disabled.sync="readonly"
        :size="size"
        rows="4"
        :value="
          `${endereco.logradouro}, ${endereco.numero} ${endereco.complemento}\n` +
          `${endereco.bairro}, ${endereco.cidade} - ${endereco.estado}`
        "
      >
      </input-text>
      <input-text
        v-else
        disabled
        :size="size"
        value="Endereço não informado"
      ></input-text>
    </div>
  </div>
</template>

<script>
import BaseInput from './BaseInput.js';
import GlobalFilters from './GlobalFilters.js';
import Endereco from '../core/Endereco.js';
import SelectAjax from './SelectAjax.vue';
import { TheMask } from 'vue-the-mask';
import HereAutocomplete from './HereAutocomplete.vue';

export default {
  name: 'form-endereco',
  mixins: [BaseInput, GlobalFilters],
  components: { TheMask, SelectAjax, HereAutocomplete },
  props: {
    readonly: {
      type: Boolean,
      default: false,
    },
    error: {
      type: Object | Array,
      default: () => {
        return {};
      },
    },
  },

  data() {
    return {
      endereco: new Endereco({
        id: null,
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: null,
        pais: '',
        cep: '',
        posicao: {},
      }),
      estadosBrasil: [
        { value: null, text: 'Estado', disabled: true },
        { value: 'AC', text: 'Acre' },
        { value: 'AL', text: 'Alagoas' },
        { value: 'AP', text: 'Amapá' },
        { value: 'AM', text: 'Amazonas' },
        { value: 'BA', text: 'Bahia' },
        { value: 'CE', text: 'Ceará' },
        { value: 'DF', text: 'Distrito Federal' },
        { value: 'ES', text: 'Espírito Santo' },
        { value: 'GO', text: 'Goiás' },
        { value: 'MA', text: 'Maranhão' },
        { value: 'MT', text: 'Mato Grosso' },
        { value: 'MS', text: 'Mato Grosso do Sul' },
        { value: 'MG', text: 'Minas Gerais' },
        { value: 'PA', text: 'Pará' },
        { value: 'PB', text: 'Paraíba' },
        { value: 'PR', text: 'Paraná' },
        { value: 'PE', text: 'Pernambuco' },
        { value: 'PI', text: 'Piauí' },
        { value: 'RJ', text: 'Rio de Janeiro' },
        { value: 'RN', text: 'Rio Grande do Norte' },
        { value: 'RS', text: 'Rio Grande do Sul' },
        { value: 'RO', text: 'Rondônia' },
        { value: 'RR', text: 'Roraima' },
        { value: 'SC', text: 'Santa Catarina' },
        { value: 'SP', text: 'São Paulo' },
        { value: 'SE', text: 'Sergipe' },
        { value: 'TO', text: 'Tocantins' },
      ],
    };
  },

  methods: {
    carregaDadosEndereco(result) {
      this.endereco.logradouro = result.Address.Street || '';
      this.endereco.numero = result.Address.HouseNumber || '';
      this.endereco.bairro = result.Address.District || '';
      this.endereco.cidade = result.Address.City || '';
      this.endereco.estado = result.Address.State || null;
      this.endereco.cep = result.Address.PostalCode || '';
      this.endereco.posicao = {};
      if (result.NavigationPosition[0]) {
        this.endereco.posicao.latitude = result.NavigationPosition[0].Latitude;
        this.endereco.posicao.longitude =
          result.NavigationPosition[0].Longitude;
      }
      let additionalData = result.Address.AdditionalData || [];
      for (let data in additionalData) {
        if (data.key == 'CountryName') {
          this.endereco.pais = data.value;
          break;
        }
      }

      this.updateValue(this.endereco);
      this.$emit('changed', null);
    },

    propagName(event) {
      // Emit the number value through the input event
      this.$emit('changed', event);
    },
  },

  mounted() {
    // Força a atualização do objeto endereço para o componente pai
    // Somente se o pai passar um valor preenchido para o filho.
    if (Object.keys(this.value).length > 0) {
      this.endereco = this.value;
      this.updateValue(this.value);
    }
  },

  watch: {
    value: function (val) {
      this.endereco = val;
      if (!this.readonly) {
        this.updateValue(this.endereco);
      }
    },
  },
};
</script>
