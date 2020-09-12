<template>
  <div class="content">
    <b-field grouped position="is-right" v-if="showBuscarPosiicaoButton">
      <button
        type="button"
        class="button is-outlined is-medium"
        @click="$emit('clickBuscarPosicao')"
      >
        <b-icon icon="map-marker-plus"></b-icon>
        <span v-html="'Buscar posi&ccedil;&atilde;o'"></span>
      </button>
    </b-field>
    <div class="field" v-if="hasError">
      <span class="help is-danger" v-if="hasError" v-text="error"></span>
    </div>
    <div
      id="map"
      ref="map"
      v-on:input="updateValue(markers)"
      class="is-expanded"
      style="height: 400px; border: 1px solid #363636"
    ></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

// Faz require das pastas das ícones do mapa dependendo do ambiente
const mapIcons = require.context(
  '../../static/assets/images/map-icons',
  true,
  /\.png$/
);

export default {
  name: 'here-maps',
  data() {
    return {
      map: null,
      defaultLayers: null,
      behavior: null,
      current: null,
      markers: [],
      hasError: false,
      error: '',
    };
  },

  props: {
    value: {
      type: Array,
      default: () => [],
    },
    showBuscarPosiicaoButton: {
      type: Boolean,
      default: true,
    },
  },

  computed: {
    ...mapGetters(['here']),
  },

  methods: {
    // Instead of updating the value directly, this
    // method is used to format and place constraints
    // on the input's value
    updateValue(value) {
      // Emit the number value through the input event
      this.$emit('input', value);
    },

    addUniqueMarker(data, options) {
      this.clearMarkers();
      this.addMarker(data, options);
      if (options.position) {
        this.centerMap(options.position, null, 15);
      }
    },

    clearMarkers() {
      if (this.map) {
        this.map.removeObjects(this.markers);
        this.markers = [];
        // this.updateValue(this.markers);
      }
    },

    centerMap(position, address, zoom) {
      if (this.map) {
        if (position) {
          this.map.setCenter(position, true);
          this.map.setZoom(zoom, true);
        } else if (address) {
          this.searchPositionForAddress(address)
            .then((response) => {
              this.map.setCenter(response, true);
              this.map.setZoom(zoom, true);
            })
            .catch((error) => {
              this.hasError = true;
              this.error =
                'Erro ao buscar endereço, tente melhorar o endereço buscado.';
            });
        }
      }
    },

    searchPositionForAddress(address) {
      let url =
        `https://geocoder.cit.api.here.com/6.2/geocode.json?` +
        `searchtext=${address}&app_id=${this.here.Id}&app_code=${this.here.Code}&gen=8`;

      return new Promise((resolve, reject) => {
        // Inicializa e executa a requisição ajax ao webservice
        // Não funcionou com axios após fazer login
        let ajax = new XMLHttpRequest();
        ajax.open('GET', url, true);
        ajax.send();
        ajax.addEventListener('loadend', function (data) {
          let json = JSON.parse(data.currentTarget.responseText);
          if (json.Response.View.length > 0) {
            this.hasError = false;
            this.error = '';
            resolve(
              json.Response.View[0].Result[0].Location.NavigationPosition[0]
            );
          } else {
            this.hasError = true;
            this.error = 'Endereço não encontrado.';
            reject(this.error);
          }
        });
        ajax.addEventListener('error', function (error) {
          this.hasError = true;
          this.error =
            'Erro ao buscar localização, tente melhorar o endereço buscado.';
          reject(this.error);
        });
      });
    },

    addMarker(data, options) {
      if (this.map) {
        let marker = {};

        if (options.position) {
          // Position deve ter os atributos lat e lng
          marker = new H.map.Marker(options.position);
          // Set marker icon
          if (options.icon) {
            marker.setIcon(new H.map.Icon(options.icon));
          }

          // Ensure that the marker can receive drag events
          marker.draggable = options.draggable;

          // Set useful data to the marker
          marker.setData(data);

          // Adiciona o marker ao mapa
          this.map.addObject(marker);
          // Adiciona o marker à lista de markers do componente
          this.markers.push(marker);
          // this.updateValue(this.markers);
          this.$emit('markerPositioned', marker.getPosition());
        }
      }
    },

    /**
     * Carrega a imagem do ícone do mapa.
     * @param {string} path - Caminho do arquivo no formato 'pasta/nome' sem extensão, que deve ser .png.
     */
    getMarkerIcon(path) {
      return `${mapIcons('./' + path + '.png', true)}`;
    },
  },

  mounted() {
    try {
      // Create a Platform object (one per application):
      let platform = new H.service.Platform({
        app_id: this.here.Id,
        app_code: this.here.Code,
        useCIT: true,
        useHTTPS: true,
      });

      // Obtain the default map types from the platform object:
      this.defaultLayers = platform.createDefaultLayers();

      // Initial map position
      let point = new H.geo.Point(-15.7, -47.8); // Brasilia
      // Instantiate (and display) a map object:
      this.map = new H.Map(this.$refs.map, this.defaultLayers.normal.map, {
        zoom: 5,
        center: point,
      });

      // Habilita o sistema de eventos do mapa
      let mapEvents = new H.mapevents.MapEvents(this.map);

      // Create the default UI components
      let ui = H.ui.UI.createDefault(this.map, this.defaultLayers);

      // Instantiate the default behavior, providing the mapEvents object:
      this.behavior = new H.mapevents.Behavior(mapEvents);

      // disable the default draggability of the underlying map when starting to
      // drag a marker object:
      this.$refs.map.style.cursor = 'default';
      let vm = this;
      this.map.addEventListener(
        'dragstart',
        function (ev) {
          let target = ev.target;
          if (target instanceof H.map.Marker) {
            vm.behavior.disable();
          }
        },
        false
      );

      // re-enable the default draggability of the underlying map when dragging has completed
      this.map.addEventListener(
        'dragend',
        function (ev) {
          let target = ev.target;
          if (target instanceof mapsjs.map.Marker) {
            vm.behavior.enable();
            vm.$emit('markerPositioned', target.getPosition());
          }
        },
        false
      );

      // Listen to the drag event and move the position of the marker as necessary
      this.map.addEventListener(
        'drag',
        function (ev) {
          let target = ev.target;
          let pointer = ev.currentPointer;
          if (target instanceof mapsjs.map.Marker) {
            target.setPosition(
              vm.map.screenToGeo(pointer.viewportX, pointer.viewportY)
            );
          }
        },
        false
      );

      // Recebe os markers antes marcados e os marca novamente
      if (this.value != [] && this.value.length > 0) {
        this.addUniqueMarker(null, this.value[0]);
        for (let i = 1; i < this.value.length; i++) {
          this.addMarker(null, this.value[i]);
        }
        // this.map.addObjects(this.value);
        // this.markers = this.value;
        if (this.markers[0]) {
          this.centerMap(this.markers[0].getPosition(), null, 15);
        }
      }
    } catch (ex) {
      this.hasError = true;
      this.error =
        'Não foi possível carregar o mapa. Tente recarregar a página.';
    }
  },
};
</script>

<style>
@import url('https://js.api.here.com/v3/3.0/mapsjs-ui.css');
</style>
