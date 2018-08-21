import * as types from '../../mutation-types';
import store from '../../index.js';
import router from '../../../routes.js';
import lazyLoading from './lazyLoading.js';

// Função para verificar se o usuário está logado
const redirectLogged = function(to, from, next) {
	if (!store.getters.isLoggedIn) {
		next('/login');
	} else {
		next();
	}
}

// Verifica se o usuário possui as roles_CLIENTE e ROLE_ADMIN
const checkRoleCliente = function() {
	return _.includes(store.getters.dadosUsuario.roles, 'ROLE_CLIENTE') ||
			_.includes(store.getters.dadosUsuario.roles, 'ROLE_ADMIN');
}

// Verifica se o usuário possui as ROLE_EMPRESA e ROLE_ADMIN
const checkRoleEmpresa = function() {
	return _.includes(store.getters.dadosUsuario.roles, 'ROLE_EMPRESA') ||
			_.includes(store.getters.dadosUsuario.roles, 'ROLE_ADMIN');
}

// Verifica se o usuário possui as ROLE_MATRIZFILIAL e ROLE_ADMIN
const checkRoleMatrizFilial = function() {
	return _.includes(store.getters.dadosUsuario.roles, 'ROLE_MATRIZFILIAL') ||
			_.includes(store.getters.dadosUsuario.roles, 'ROLE_ADMIN');
}

// Verifica se o usuário possui as ROLE_TECNICO e ROLE_ADMIN
const checkRoleTecnico = function() {
	return _.includes(store.getters.dadosUsuario.roles, 'ROLE_TECNICO') ||
			_.includes(store.getters.dadosUsuario.roles, 'ROLE_ADMIN');
}

// Redireciona o usuário para /intranet caso sua ROLE não seja ROLE_ADMIN ou ROLE_CLIENTE.
const redirectCliente = function(to, from, next) {
	if (store.getters.dadosUsuario) {
		if (checkRoleCliente()) {
			next();
		} else {
			next('/intranet');
		}
	} else {
		next('/logout');
	}
}

// Redireciona o usuário para /intranet caso sua ROLE não seja ROLE_ADMIN ou ROLEEMPRESA.
const redirectEmpresa = function(to, from, next) {
	if (store.getters.dadosUsuario) {
		if (checkRoleEmpresa()) {
			next();
		} else {
			next('/intranet');
		}
	} else {
		next('/logout');
	}
}

// Redireciona o usuário para /intranet caso sua ROLE não seja ROLE_ADMIN ou ROLE_MATRIZFILIAL.
const redirectMatrizFilial = function(to, from, next) {
	if (store.getters.dadosUsuario) {
		if (checkRoleMatrizFilial()) {
			next();
		} else {
			next('/intranet');
		}
	} else {
		next('/logout');
	}
}

// Redireciona o usuário para /intranet caso sua ROLE não seja ROLE_ADMIN ou ROLE_TECNICO.
const redirectTecnico = function(to, from, next) {
	if (store.getters.dadosUsuario) {
		if (checkRoleTecnico()) {
			next();
		} else {
			next('/intranet');
		}
	} else {
		next('/logout');
	}
}

// Redireciona o usuário para /intranet caso sua ROLE não seja ROLE_ADMIN, ROLE_CLIENTE ou ROLE_MATRIZFILIAL.
const redirectMatrizFilialCliente = function(to, from, next) {
	if (store.getters.dadosUsuario) {
		if (checkRoleMatrizFilial() || checkRoleCliente()) {
			next();
		} else {
			next('/intranet');
		}
	} else {
		next('/logout');
	}
}

// Redireciona o usuário para /intranet caso sua ROLE não seja ROLE_ADMIN, ROLE_EMPRESA ou ROLE_MATRIZFILIAL.
const redirectMatrizFilialEmpresa = function(to, from, next) {
	if (store.getters.dadosUsuario) {
		if (checkRoleMatrizFilial() || checkRoleEmpresa()) {
			next();
		} else {
			next('/intranet');
		}
	} else {
		next('/logout');
	}
}

/**
 * categories: São os menu-label;
 * categories.items: São os menu-list, com os itens do menu de uma categoria;
 * categories.items.children: São os submenu de um item;
 * item.name e item.params: São os nomes e os parâmetros padrões de rotas que necessitam ou não de parâmetro.
 */
// Define as rotas da intranet para o sidemenu
const state = {
	categories: [
		{
			title: 'Geral',
			meta: {
				showTo: ['ROLE_USUARIO'],
			},
			items: [
				{
					title: 'Principal',
					path: '/intranet',
					component: lazyLoading('intranet/Intranet'),
					beforeEnter: redirectLogged
				},
				{
					title: 'Meu cadastro',
					path: '/dados-cliente',
					component: lazyLoading('intranet/CadastroCliente'),
					meta: { 
						id: () => { return store.getters.dadosUsuario.idObjeto },
						showTo: ['ROLE_CLIENTE']
					},
					beforeEnter: redirectCliente
				},
				{
					title: 'Meu cadastro',
					path: '/dados-empresa',
					component: lazyLoading('intranet/CadastroEmpresa'),
					meta: { 
						id: () => { return store.getters.dadosUsuario.idObjeto },
						showTo: ['ROLE_EMPRESA']
					},
					beforeEnter: redirectEmpresa
				},
				{
					title: 'Meu cadastro',
					path: '/dados-matriz-filial',
					component: lazyLoading('intranet/CadastroMatrizFilial'),
					props: true,
					meta: { 
						id: () => { return store.getters.dadosUsuario.idObjeto },
						showTo: ['ROLE_ADMIN', 'ROLE_MATRIZFILIAL']
					},
					beforeEnter: redirectMatrizFilial
				},
				{
					title: 'Meu cadastro',
					path: '/dados-tecnico',
					component: lazyLoading('intranet/CadastroTecnico'),
					meta: { 
						id: () => { return store.getters.dadosUsuario.idObjeto },
						showTo: ['ROLE_TECNICO']
					},
					beforeEnter: redirectTecnico
				},
				{
					title: 'Meu usuário',
					path: '/meu-usuario',
					component: lazyLoading('intranet/CadastroUsuario'),
					meta: { 
						id: () => { return store.getters.dadosUsuario.id }
					},
					beforeEnter: redirectLogged
				},
				{
					title: 'Alterar senha',
					path: '/alterar-senha',
					component: lazyLoading('intranet/AlterarSenha'),
					beforeEnter: redirectLogged
				},
			]
		},
		{
			title: 'Gerência',
			meta: {
				showTo: ['ROLE_ADMIN', 'ROLE_MATRIZFILIAL']
			},
			items: [
				{
					title: 'Cadastros pendentes',
					meta: {
						showTo: ['ROLE_ADMIN', 'ROLE_MATRIZFILIAL']
					},
					children: [
						{
							title: 'Empresas',
							path: '/lista-empresas-pendentes',
							component: lazyLoading('intranet/ListaEmpresa'),
							meta: { 
								situacao: 'pendente',
								showTo: ['ROLE_ADMIN', 'ROLE_MATRIZFILIAL']
							},
							beforeEnter: redirectMatrizFilial
						},
						{
							title: 'Técnicos',
							path: '/lista-tecnicos-pendentes',
							component: lazyLoading('intranet/ListaTecnico'),
							meta: { 
								situacao: 'pendente',
								showTo: ['ROLE_ADMIN', 'ROLE_MATRIZFILIAL']
							},
							beforeEnter: redirectMatrizFilial
						}
					]
				},
				{
					title: 'Lançamentos',
					meta: {
						showTo: ['ROLE_ADMIN', 'ROLE_MATRIZFILIAL']
					},
					children: [
						{
							title: 'Cadastrar',
							name: 'cadastro-lancamento',
							path: '/cadastro-lancamento/:id(\\s*|\\d+)?',
							props: true,
							params: { id: null },
							component: lazyLoading('intranet/CadastroLancamento'),
							beforeEnter: redirectMatrizFilial
						},
						{
							title: 'Listar',
							name: 'lista-lancamento',
							path: '/lista-lancamento/:page?',
							props: true,
							component: lazyLoading('intranet/ListaLancamento'),
							beforeEnter: redirectMatrizFilial
						},
					]
				},
				{
					title: 'Parâmetros',
					meta: {
						showTo: ['ROLE_ADMIN', 'ROLE_MATRIZFILIAL']
					},
					path: '/parametros',
					name: 'parametros',
					component: lazyLoading('intranet/CadastroParametros'),
					beforeEnter: redirectMatrizFilial
				}
			]
		},
		{
			title: 'Cadastros',
			meta: {
				showTo: ['ROLE_USUARIO'],
			},
			items: [
				{
					title: 'Ordens de serviço',
					children: [
						{
							title: 'Cadastrar',
							meta: {
								showTo: ['ROLE_ADMIN', 'ROLE_MATRIZFILIAL', 'ROLE_CLIENTE']
							},
							name: 'cadastro-agendamento',
							path: '/cadastro-agendamento/:id(\\s*|\\d+)?',
							props: true,
							params: { id: null },
							component: lazyLoading('intranet/CadastroAgendamento'),
							beforeEnter: redirectLogged
						},
						{
							title: 'Listar',
							name: 'lista-agendamento',
							path: '/lista-agendamento',
							props: false,
							component: lazyLoading('intranet/ListaAgendamento'),
							beforeEnter: redirectLogged
						},
					]
				},
				{
					title: 'Consultorias',
					meta: {
						showTo: ['ROLE_ADMIN', 'ROLE_MATRIZFILIAL']
					},
					children: [
						{
							title: 'Cadastrar',
							name: 'cadastro-consultoria',
							path: '/cadastro-consultoria/:id(\\s*|\\d+)?',
							props: true,
							params: { id: null },
							component: lazyLoading('intranet/CadastroConsultoria'),
							beforeEnter: redirectMatrizFilial
						},
						{
							title: 'Listar',
							name: 'lista-consultoria',
							path: '/lista-consultoria/:page?',
							props: true,
							component: lazyLoading('intranet/ListaConsultoria'),
							beforeEnter: redirectMatrizFilial
						},
					]
				},
				{
					title: 'Clientes',
					meta: {
						showTo: ['ROLE_ADMIN', 'ROLE_MATRIZFILIAL']
					},
					children: [
						{
							title: 'Cadastrar',
							name: 'cadastro-cliente',
							path: '/cadastro-cliente/:id(\\s*|\\d+)?',
							props: true,
							params: { id: null },
							component: lazyLoading('intranet/CadastroCliente'),
							beforeEnter: redirectMatrizFilial
						},
						{
							title: 'Listar',
							name: 'lista-cliente',
							path: '/lista-cliente/:page?',
							props: true,
							component: lazyLoading('intranet/ListaCliente'),
							beforeEnter: redirectMatrizFilial
						},
					]
				},
				{
					title: 'Empresas',
					meta: {
						showTo: ['ROLE_ADMIN', 'ROLE_MATRIZFILIAL']
					},
					children: [
						{
							title: 'Cadastrar',
							name: 'cadastro-empresa',
							path: '/cadastro-empresa/:id(\\s*|\\d+)?',
							props: true,
							params: { id: null },
							component: lazyLoading('intranet/CadastroEmpresa'),
							beforeEnter: redirectMatrizFilial
						},
						{
							title: 'Listar',
							name: 'lista-empresa',
							path: '/lista-empresa/:page?',
							props: true,
							component: lazyLoading('intranet/ListaEmpresa'),
							beforeEnter: redirectMatrizFilial
						}
					]
				},
				{
					title: 'Estoque',
					meta: {
						showTo: ['ROLE_ADMIN', 'ROLE_MATRIZFILIAL', 'ROLE_CLIENTE']
					},
					children: [
						{
							title: 'Cadastrar',
							name: 'cadastro-estoque',
							path: '/cadastro-estoque/:id(\\s*|\\d+)?',
							props: true,
							params: { id: null },
							component: lazyLoading('intranet/CadastroEstoque'),
							beforeEnter: redirectMatrizFilialCliente
						},
						{
							title: 'Listar',
							name: 'lista-estoque',
							path: '/lista-estoque/:classe?/:page?',
							props: true,
							params: {
								classe: null
							},
							component: lazyLoading('intranet/ListaEstoque'),
							beforeEnter: redirectMatrizFilialCliente
						},
					]
				},
				{
					title: 'Serviços das empresas',
					meta: {
						showTo: ['ROLE_ADMIN', 'ROLE_MATRIZFILIAL']
					},
					children: [
						{
							title: 'Cadastrar',
							name: 'cadastro-empresa-servico',
							path: '/cadastro-empresa-servico/:id(\\s*|\\d+)?',
							props: true,
							params: { id: null },
							component: lazyLoading('intranet/CadastroEmpresaServico'),
							beforeEnter: redirectMatrizFilial
						},
						{
							title: 'Listar',
							name: 'lista-empresa-servico',
							path: '/lista-empresa-servico/:page?',
							props: true,
							component: lazyLoading('intranet/ListaEmpresaServico'),
							beforeEnter: redirectMatrizFilial
						}
					]
				},
				{
					title: 'Matriz / Filiais',
					meta: {
						showTo: ['ROLE_ADMIN', 'ROLE_MATRIZFILIAL']
					},
					children: [
						{
							title: 'Cadastrar',
							name: 'cadastro-matriz-filial',
							path: '/cadastro-matriz-filial/:id(\\s*|\\d+)?',
							props: true,
							params: { id: null },
							component: lazyLoading('intranet/CadastroMatrizFilial'),
							beforeEnter: redirectMatrizFilial
						},
						{
							title: 'Listar',
							name: 'lista-matriz-filial',
							path: '/lista-matriz-filial/:page?',
							props: true,
							component: lazyLoading('intranet/ListaMatrizFilial'),
							beforeEnter: redirectMatrizFilial
						}
					]
				},
				{
					title: 'Técnicos',
					meta: {
						showTo: ['ROLE_ADMIN', 'ROLE_MATRIZFILIAL', 'ROLE_EMPRESA']
					},
					children: [
						{
							title: 'Cadastrar',
							name: 'cadastro-tecnico',
							path: '/cadastro-tecnico/:id(\\s*|\\d+)?',
							props: true,
							params: { id: null },
							component: lazyLoading('intranet/CadastroTecnico'),
							beforeEnter: redirectMatrizFilialEmpresa
						},
						{
							title: 'Listar',
							name: 'lista-tecnico',
							path: '/lista-tecnico/:page?',
							props: true,
							component: lazyLoading('intranet/ListaTecnico'),
							beforeEnter: redirectMatrizFilialEmpresa
						}
					]
				},
				{
					title: 'Feriados e folgas',
					name: 'cadastro-feriado',
					path: '/cadastro-feriado/:id(\\s*|\\d+)?',
					props: true,
					params: { id: null },
					component: lazyLoading('intranet/CadastroFeriado'),
					meta: {
						showTo: ['ROLE_TECNICO']
					},
					beforeEnter: redirectTecnico
				},
				{
					title: 'Usuários',
					meta: {
						showTo: ['ROLE_ADMIN', 'ROLE_MATRIZFILIAL']
					},
					children: [
						{
							title: 'Cadastrar',
							name: 'cadastro-usuario',
							path: '/cadastro-usuario/:id(\\s*|\\d+)?',
							props: true,
							params: { id: null },
							component: lazyLoading('intranet/CadastroUsuario'),
							beforeEnter: redirectMatrizFilial
						},
						{
							title: 'Listar',
							name: 'lista-usuario',
							path: '/lista-usuario/:page?',
							props: true,
							component: lazyLoading('intranet/ListaUsuario'),
							beforeEnter: redirectMatrizFilial
						}
					]
				}
			]
		},
	]
}

export default {
	state
}
