<template>
  <form enctype="multipart/form-data" novalidate>
    <div class="card">
      <div class="card-image">
        <div v-show="showVideo">
          <video ref="video" width="640" height="480"></video>
          <div
            class="is-fullwidth has-text-centered is-marginless is-paddingless"
          >
            <button
              type="button"
              class="button is-white is-large"
              id="btn-snap"
              @click="snap"
            >
              <b-icon icon="camera" size="is-medium"></b-icon>
            </button>
          </div>
        </div>
        <div v-show="showCanvas">
          <canvas
            ref="canvas"
            width="640"
            height="480"
            class="is-4by3"
            style="width: 100%"
          ></canvas>
          <b-field position="is-centered" grouped v-show="!isLoading">
            <p class="control">
              <button
                type="button"
                class="btn-canvas button is-danger is-medium"
                @click="descartar"
              >
                <b-icon icon="delete" size="is-medium"></b-icon>
                <span>Descartar</span>
              </button>
            </p>
            <p class="control">
              <button
                type="button"
                class="btn-canvas button is-success is-medium"
                @click="enviar"
              >
                <b-icon icon="send" size="is-medium"></b-icon>
                <span>Enviar</span>
              </button>
            </p>
          </b-field>
        </div>
        <b-loading :active.sync="isLoading" :can-cancel="false"></b-loading>
      </div>
    </div>
  </form>
</template>

<script>
import Endereco from '../../../core/Endereco.js';
import { mapActions } from 'vuex';

let CancelToken = Vue.axios.CancelToken; // Cancel token para o GET do fetchData
let cancel; // Variável que recebe o método para cancelar o fetchData

export default {
  name: 'modal-tirar-foto',
  data() {
    return {
      showVideo: true,
      showCanvas: false,
      isLoading: false,
      mediaStream: null,
      endereco: {},
    };
  },

  props: {
    idAgendamento: null,
  },

  computed: {},

  methods: {
    ...mapActions(['reverseGeocode']),

    snap() {
      // Elements for taking the snapshot
      let canvas = this.$refs.canvas;
      let context = canvas.getContext('2d');
      let video = this.$refs.video;

      // Trigger photo take
      context.drawImage(video, 0, 0, 640, 480);
      video.pause();
      this.showVideo = false;
      this.showCanvas = true;
    },

    replayVideo() {
      let video = this.$refs.video;
      video.play();
      this.showCanvas = false;
      this.showVideo = true;
    },

    descartar() {
      this.replayVideo();
    },

    enviar() {
      this.isLoading = true;
      this.sendImage();
    },

    sendImage() {
      let canvas = this.$refs.canvas;

      let vm = this;
      let image = canvas.toDataURL('image/png');

      // send the form to the server using ajax
      vm.upload(image)
        .then((response) => {
          if (response) {
            vm.$toast.open({
              message: response.message
                ? response.message
                : 'Foto salva com sucesso.',
              type: 'is-success',
              position: 'is-top',
              duration: 5000,
            });
          }

          vm.$emit('sent', { id: response.idFoto, endereco: vm.endereco });
          vm.replayVideo();
        })
        .catch((error) => {
          if (error) {
            vm.$toast.open({
              message: error.message ? error.message : 'Erro ao salvar foto.',
              type: 'is-danger',
              position: 'is-top',
              duration: 5000,
            });
          }
          vm.replayVideo();
        });
    },

    upload(image) {
      return new Promise((resolve, reject) => {
        this.axios
          .post('/agendamento/enviarFoto', {
            id: this.idAgendamento,
            image: image,
            type: 'image/png',
            width: 640,
            height: 480,
            endereco: this.endereco,
          })
          .then((response) => {
            this.isLoading = false;
            resolve(response.data);
          })
          .catch((error) => {
            this.isLoading = false;
            reject(error.response.data);
          });
      });
    },

    clickCancel() {
      this.stopVideo();
      this.$parent.close();
    },

    stopVideo() {
      let video = this.$refs.video;
      let tracks = this.mediaStream.getTracks();

      video.pause();
      tracks.forEach(function (track) {
        track.stop();
        track.enabled = false;
      });
      video.src = null;
    },

    /**
     * Busca o endereço a partir da posição obtida pelo browser.
     * s
     * @param object ${pos} Objecto contendo latitude e latitude
     */
    geolocationSuccess(pos) {
      let vm = this;
      this.endereco = new Endereco({
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
      });

      // Salva a posição obtida no objeto endereco
      var crd = pos.coords;
      this.endereco.posicao = {
        latitude: crd.latitude,
        longitude: crd.longitude,
      };

      // Faz a consulta na API da Here e obtém o endereço da posição
      this.reverseGeocode(crd)
        .then((result) => {
          // Se o endereço for encontrado salva seus campos no objeto endereco
          if (typeof result === 'object' && Object.keys(result).length > 0) {
            vm.endereco.logradouro = result.Address.Street || '';
            vm.endereco.numero = result.Address.HouseNumber || '';
            vm.endereco.bairro = result.Address.District || '';
            vm.endereco.cidade = result.Address.City || '';
            vm.endereco.estado = result.Address.State || null;
            vm.endereco.cep = result.Address.PostalCode || '';
            let additionalData = result.Address.AdditionalData || [];
            for (let data in additionalData) {
              if (data.key == 'CountryName') {
                vm.endereco.pais = data.value;
                break;
              }
            }

            vm.$toast.open({
              message: 'Endereço da foto encontrado.',
              type: 'is-success',
              position: 'is-top',
              duration: 5000,
            });
          }
        })
        .catch((error) => {
          if (Boolean(error) && typeof error === 'string') {
            vm.$toast.open({
              message: error,
              type: 'is-danger',
              position: 'is-top',
              duration: 5000,
            });
          }
        });
    },

    geolocationError(err) {
      this.$toast.open({
        message: `Erro ao obter sua geolocalização.\nErro ${err.code}: ${err.message}`,
        type: 'is-danger',
        position: 'is-top',
        duration: 5000,
      });
    },
  },

  mounted() {
    this.$toast.open({
      message: 'É necessário permitir a geolocalização do seu navegador.',
      type: 'is-info',
      position: 'is-top',
      duration: 5000,
    });

    // Verifica se o browser suporta geolocation
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (success) => this.geolocationSuccess(success),
        (error) => this.geolocationError(error),
        {
          enableHighAccuracy: true,
          timeout: 60000,
          maximumAge: 0,
        }
      );
    } else {
      this.$toast.open({
        message: 'É necessário permitir a geolocalização do seu navegador.',
        type: 'is-warning',
        position: 'is-top',
        duration: 5000,
      });
    }

    // Grab elements, create settings, etc.
    let video = this.$refs.video;
    let vm = this;
    // Get access to the camera!
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // Not adding `{ audio: true }` since we only want video now
      navigator.mediaDevices
        .getUserMedia({
          video: { width: 800, height: 600, facingMode: 'environment' },
        })
        .then(function (stream) {
          vm.mediaStream = stream;
          video.src = window.URL.createObjectURL(stream);
          video.play();
        });
    } else if (navigator.getUserMedia) {
      // Standard
      navigator.getUserMedia(
        { video: { width: 800, height: 600, facingMode: 'environment' } },
        function (stream) {
          vm.mediaStream = stream;
          video.src = stream;
          video.play();
        },
        errBack
      );
    } else if (navigator.webkitGetUserMedia) {
      // WebKit-prefixed
      navigator.webkitGetUserMedia(
        { video: { width: 800, height: 600, facingMode: 'environment' } },
        function (stream) {
          vm.mediaStream = stream;
          video.src = window.webkitURL.createObjectURL(stream);
          video.play();
        },
        errBack
      );
    } else if (navigator.mozGetUserMedia) {
      // Mozilla-prefixed
      navigator.mozGetUserMedia(
        { video: { width: 800, height: 600, facingMode: 'environment' } },
        function (stream) {
          vm.mediaStream = stream;
          video.src = window.URL.createObjectURL(stream);
          video.play();
        },
        errBack
      );
    }
  },

  beforeDestroy() {
    this.stopVideo();
  },
};
</script>

<style lang="scss" scoped>
#btn-snap {
  --height: 1.5rem;
  border-radius: calc(1.5 * var(--height));
  position: relative;
  margin-top: -100px;
  z-index: 40;
}

.btn-canvas {
  position: relative;
  margin-top: -80px;
  z-index: 40;
}
</style>
