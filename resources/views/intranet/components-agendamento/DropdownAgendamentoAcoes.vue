<template>
	<b-dropdown class="is-pulled-right is-right">
		<button class="button is-primary is-medium button-round-medium" 
			slot="trigger" title="Alterar situação">
			<b-icon icon="pencil" size="is-big"></b-icon>
		</button>
		<b-dropdown-item v-if="showConfirmarAgendamento" @click="emit('confirmarAgendamento')">
			Confirmar agendamento
		</b-dropdown-item>
		<b-dropdown-item v-if="showCancelarAgendamento" @click="emit('cancelarAgendamento')">
			Cancelar agendamento
		</b-dropdown-item>
		<b-dropdown-item v-if="showIniciarServico" @click="emit('iniciarOrdemServico')">
			Iniciar ordem de serviço
		</b-dropdown-item>
		<b-dropdown-item v-if="showFinalizarServico" @click="emit('finalizarOrdemServico')">
			Finalizar ordem de serviço
		</b-dropdown-item>
		<b-dropdown-item v-if="showConcluir" @click="emit('concluirOrdemServico')">
			Concluir
		</b-dropdown-item>
		<hr class="dropdown-divider">
		<!-- <b-dropdown-item v-if="showReagendar" @click="emit('reagendar')">
			Reagendar
		</b-dropdown-item> -->
		<b-dropdown-item v-if="showCancelarServico" @click="emit('cancelarOrdemServico')">
			Cancelar ordem de serviço
		</b-dropdown-item>
	</b-dropdown>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	data() {
		return {
			isActive: false
		}
	},

	props: {
		idAgendamento: Number,
		situacaoAtual: Number
	},

	computed: {
		...mapGetters([
			'dadosUsuario',
			'situacaoAgendamento'
		]),

		showConfirmarAgendamento() {
			return _.includes([
				this.situacaoAgendamento.AGUARDANDO_CONFIRMACAO], this.situacaoAtual)
				&& (_.includes(this.dadosUsuario.roles, 'ROLE_TECNICO')
				|| _.includes(this.dadosUsuario.roles, 'ROLE_EMPRESA')
				|| _.includes(this.dadosUsuario.roles, 'ROLE_MATRIZFILIAL'))
		},
		showCancelarAgendamento() {
			return _.includes([
				this.situacaoAgendamento.AGENDADO,
				this.situacaoAgendamento.AGUARDANDO_CONFIRMACAO,
				this.situacaoAgendamento.REMARCADO], this.situacaoAtual)
		},
		showIniciarServico() {
			return _.includes([
				this.situacaoAgendamento.AGENDADO], this.situacaoAtual)
				&& (_.includes(this.dadosUsuario.roles, 'ROLE_TECNICO')
				|| _.includes(this.dadosUsuario.roles, 'ROLE_EMPRESA')
				|| _.includes(this.dadosUsuario.roles, 'ROLE_MATRIZFILIAL'))
		},
		showFinalizarServico() {
			return _.includes([
				this.situacaoAgendamento.EM_ATENDIMENTO], this.situacaoAtual)
				&& (_.includes(this.dadosUsuario.roles, 'ROLE_TECNICO')
				|| _.includes(this.dadosUsuario.roles, 'ROLE_EMPRESA')
				|| _.includes(this.dadosUsuario.roles, 'ROLE_MATRIZFILIAL'))
		},
		showConcluir() {
			return _.includes([
				this.situacaoAgendamento.REALIZADO,
				this.situacaoAgendamento.AGENDADO], this.situacaoAtual)
				&& _.includes(this.dadosUsuario.roles, 'ROLE_MATRIZFILIAL')
		},
		showReagendar() {
			return _.includes([
				this.situacaoAgendamento.AGENDADO,
				this.situacaoAgendamento.AGUARDANDO_CONFIRMACAO], this.situacaoAtual)
		},
		showCancelarServico() {
			return (_.includes(this.dadosUsuario.roles, 'ROLE_MATRIZFILIAL'))
				|| (_.includes(this.dadosUsuario.roles, 'ROLE_CLIENTE')
					&& _.includes([
						this.situacaoAgendamento.ABERTO,
						this.situacaoAgendamento.AGUARDANDO_CONFIRMACAO], this.situacaoAtual))
		}
	},

	methods: {
		emit(val) {
			this.$emit(val);
		}
	}
}

</script>