import * as types from '../../mutation-types.js';
import router from '../../../routes.js';

const actions = {
	// Chama o método /login/ da API para efetuar login e baixar os dados do usuário
	login({ commit }, data) {
		//localStorage.setItem('dadosUsuario', '');
		commit(types.LOGIN); // show spinner
		return new Promise((resolve, reject) => {
			Vue.axios.post('/login/', {
				usuario: data.usuario,
				senha: data.senha
			})
			.then((response) => {
				if (response.data.token) {
					let token = response.data.token;
					//let dadosUsuario = response.data.usuario;
					Vue.axios.defaults.headers.get['X-AUTH-TOKEN'] = token;
					Vue.axios.defaults.headers.post['X-AUTH-TOKEN'] = token;
					//localStorage.setItem('dadosUsuario', JSON.stringify(dadosUsuario));
					commit(types.LOGIN_SUCCESS, token);
					//resolve(response);
					router.push('/intranet');
				}
			})
			.catch((error) => {
				//localStorage.removeItem('dadosUsuario');
				localStorage.removeItem('gts-token');
				delete Vue.axios.defaults.headers.get['X-AUTH-TOKEN'];
				delete Vue.axios.defaults.headers.post['X-AUTH-TOKEN'];
				if (error.response)
					reject(error.response.data);
			})
		})
	},

	// Efetua logoff chamando o método /logout/ da API e limpando o objeto dadosUsuario
	logout({ commit }) {
		commit(types.LOGIN); // show spinner
		// Limpa todos os dados armazenados
		delete Vue.axios.defaults.headers.get['X-AUTH-TOKEN'];
		delete Vue.axios.defaults.headers.post['X-AUTH-TOKEN'];
		//localStorage.removeItem('dadosUsuario');
		localStorage.removeItem('gts-token');
		localStorage.clear();
		commit(types.LOGOUT);
		router.push('/login')
	},

	// Chama o método /usuario/lembrarSenha da API para lembrar recuperação de senha
	rememberPassword({ commit }, data) {
		return new Promise((resolve, reject) => {
			Vue.axios.post('/usuario/lembrarSenha', {
				usuario: data.usuario,
				email: data.email
			})
			.then((response) => {
				resolve(response.data);
			})
			.catch((error) => {
				reject(error.response.data);
			})
		})
	},

	// Chama o método /usuario/alterarSenha da API para alterar a senha do usuário no servidor e no localStorage
	changePassword({ commit, state }, form) {
		let novaSenha = form.novaSenha;
		return new Promise((resolve, reject) => {
			form.post('/usuario/alterarSenha')
			.then((data) => {
				if (data.token) {
					let token = data.token;
					commit(types.LOGIN_SUCCESS, token);
					Vue.axios.defaults.headers.get['X-AUTH-TOKEN'] = token;
					Vue.axios.defaults.headers.post['X-AUTH-TOKEN'] = token;
				}
				resolve(data);
			})
			.catch((error) => {
				reject(error);
			})
		})
	}
};

export default actions;