const here = {
  state: {
    keys: {
      Id: 'zVi00Nd4LtT2Cl1f37jL',
      Code: 'c2Wcn4ZOo9AeG30LOk7KEw',
    },
  },
  getters: {
    here: (state) => {
      return state.keys;
    },
  },
  actions: {
    reverseGeocode({ state }, pos) {
      let url =
        `https://reverse.geocoder.cit.api.here.com/6.2/reversegeocode.json?` +
        `app_id=${state.keys.Id}&app_code=${state.keys.Code}&mode=retrieveAddresses` +
        `&prox=${pos.latitude},${pos.longitude}`;

      return new Promise((resolve, reject) => {
        // Inicializa e executa a requisição ajax ao webservice
        // Não funcionou com axios após fazer login
        let ajax = new XMLHttpRequest();
        let error = '';
        ajax.open('GET', url, true);
        ajax.send();
        ajax.addEventListener('loadend', function (data) {
          let json = JSON.parse(data.currentTarget.responseText);
          if (json.Response.View.length > 0) {
            error = '';
            if (json.Response.View[0].Result.length > 0) {
              resolve(json.Response.View[0].Result[0].Location);
            } else {
              resolve(null);
            }
          } else {
            error = 'Endereço não encontrado.';
            reject(error);
          }
        });
        ajax.addEventListener('error', function (error) {
          error =
            'Erro ao buscar localização, tente melhorar o endereço buscado.';
          reject(error);
        });
      });
    },
  },
};

export default here;
