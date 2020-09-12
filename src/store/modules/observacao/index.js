import { Toast } from 'buefy';

const observacao = {
  actions: {
    // Chama o método /observacao/salvar da API para cadastrar ou alterar uma observação.
    salvarObservacao({ commit }, data) {
      return new Promise((resolve, reject) => {
        Vue.axios
          .post('/observacao/salvar', data)
          .then((response) => {
            if (response.data) {
              Toast.open({
                message: response.data.message
                  ? response.data.message
                  : 'Observação salva com sucesso.',
                type: 'is-success',
                position: 'is-top',
                duration: 5000,
              });
              resolve(response.data);
            }
          })
          .catch((error) => {
            if (error.response && error.response.data) {
              Toast.open({
                message: error.response.data.message
                  ? error.response.data.message
                  : 'Erro ao salvar observação.',
                type: 'is-warning',
                position: 'is-top',
                duration: 5000,
              });
              reject(error.response.data);
            }
          });
      });
    },

    // Chama o método /observacao/excluir da API para excluir uma observação.
    excluirObservacao({ commit }, data) {
      return new Promise((resolve, reject) => {
        Vue.axios
          .post('/observacao/excluir', data)
          .then((response) => {
            if (response.data) {
              Toast.open({
                message: response.data.message
                  ? response.data.message
                  : 'Observação excluída com sucesso.',
                type: 'is-success',
                position: 'is-top',
                duration: 5000,
              });
              resolve(response.data);
            }
          })
          .catch((error) => {
            if (error.response && error.response.data) {
              Toast.open({
                message: error.response.data.message
                  ? error.response.data.message
                  : 'Erro ao excluir observação.',
                type: 'is-warning',
                position: 'is-top',
                duration: 5000,
              });
              reject(error.response.data);
            }
          });
      });
    },
  },
};

export default observacao;
