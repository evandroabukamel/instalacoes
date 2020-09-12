<template>
  <div class="modal-card">
    <section class="modal-card-body">
      <!-- FormEndereco -->
      <form-endereco
        name="enderecoFoto"
        size="is-medium"
        :readonly="true"
        v-model="newEndereco"
      >
      </form-endereco>
      <!-- Mapa -->
      <here-maps
        ref="fotoMap"
        v-if="markers.length > 0"
        :value="markers"
        :show-buscar-posiicao-button="false"
      >
      </here-maps>
    </section>
  </div>
</template>

<script>
import FormEndereco from '../../../components/FormEndereco.vue';
import HereMaps from '../../../components/HereMaps.vue';

export default {
  name: 'modal-foto-endereco',
  components: { FormEndereco, HereMaps },
  data() {
    return {
      newEndereco: {},
      markers: [],
    };
  },
  props: {
    endereco: Object,
  },

  mounted() {
    if (
      typeof this.endereco === 'object' &&
      Object.keys(this.endereco).length > 0
    ) {
      this.newEndereco = this.endereco;
      let marker = {
        position: {
          lat: this.endereco.posicao.latitude,
          lng: this.endereco.posicao.longitude,
        },
        draggable: false,
      };
      // Salva os dados do marcador num array
      this.markers.push(marker);
    } else {
      this.newEndereco.logradouro = 'Foto salva sem endereço.';
    }
  },
};
</script>
