import * as types from '../../mutation-types.js';
let jwtDecode = require('jwt-decode');
import camelcaseKeys from 'camelcase-keys';

let mutations = {
	[types.LOGIN](state) {
		state.pending = true;
		state.dadosUsuario = null;
	},
	[types.LOGIN_SUCCESS](state, payload) {
		state.pending = false;
		state.isLoggedIn = true;
		localStorage.setItem('gts-token', payload);
		state.dadosUsuario = camelcaseKeys(jwtDecode(payload), {deep: true})['dadosUsuario'];
	},
	[types.LOGOUT](state) {
		state.pending = false;
		state.isLoggedIn = false;
		state.dadosUsuario = null;
	}
};

export default mutations;