import agendamento from './agendamento.js';
import consultoria from './consultoria.js';
import empresa from './empresa.js';
import tecnico from './tecnico.js';

const situacoes = {
  state: {
    agendamento,
    consultoria,
    empresa,
    tecnico,
  },
  getters: {
    situacaoAgendamento: (state) => {
      return state.agendamento;
    },
    situacaoConsultoria: (state) => {
      return state.consultoria;
    },
    situacaoEmpresa: (state) => {
      return state.empresa;
    },
    situacaoTecnico: (state) => {
      return state.tecnico;
    },
  },
};

export default situacoes;
