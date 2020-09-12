import mutations from './mutations.js';
import actions from './actions.js';
import camelcaseKeys from 'camelcase-keys';

let jwtDecode = require('jwt-decode');

const auth = {
  state: {
    isLoggedIn: !!localStorage.getItem('gts-token'),
    pending: false,
    dadosUsuario: localStorage.getItem('gts-token')
      ? camelcaseKeys(jwtDecode(localStorage.getItem('gts-token')), {
          deep: true,
        })['dadosUsuario']
      : {},
  },
  getters: {
    isLoggedIn: (state) => {
      return state.isLoggedIn;
    },
    isLoading: (state) => {
      return state.pending;
    },
    dadosUsuario: (state) => {
      return state.dadosUsuario;
    },
    isUsuarioMatrizFilial(state) {
      return (
        Boolean(state.dadosUsuario) &&
        state.dadosUsuario.classe === 'tbmatrizfilial'
      );
    },
    isUsuarioTecnico(state) {
      return (
        Boolean(state.dadosUsuario) && state.dadosUsuario.classe === 'tbtecnico'
      );
    },
    isUsuarioEmpresa(state) {
      return (
        Boolean(state.dadosUsuario) && state.dadosUsuario.classe === 'tbempresa'
      );
    },
    isUsuarioCliente(state) {
      return (
        Boolean(state.dadosUsuario) && state.dadosUsuario.classe === 'tbcliente'
      );
    },
  },
  mutations,
  actions,
};

export default auth;
